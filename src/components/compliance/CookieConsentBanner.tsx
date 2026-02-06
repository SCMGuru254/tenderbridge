import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Cookie, Shield, X, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const CONSENT_KEY = 'cookie_consent_v1';

interface CookiePreferences {
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

export const CookieConsentBanner = () => {
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    functional: true,
    analytics: false,
    marketing: false
  });

  useEffect(() => {
    // Check if consent was already given
    const savedConsent = localStorage.getItem(CONSENT_KEY);
    if (!savedConsent) {
      // Delay showing banner for better UX
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, []);

  const saveConsent = async (prefs: CookiePreferences, acceptAll: boolean = false) => {
    const finalPrefs = acceptAll 
      ? { functional: true, analytics: true, marketing: true }
      : prefs;

    // Save to localStorage
    localStorage.setItem(CONSENT_KEY, JSON.stringify({
      ...finalPrefs,
      timestamp: new Date().toISOString()
    }));

    // Save to database for compliance records
    try {
      const sessionId = crypto.randomUUID();
      await supabase.from('cookie_consents').insert({
        user_id: user?.id || null,
        session_id: user ? null : sessionId,
        functional_consent: finalPrefs.functional,
        analytics_consent: finalPrefs.analytics,
        marketing_consent: finalPrefs.marketing
      });
    } catch (error) {
      console.error('Error saving cookie consent:', error);
    }

    setIsVisible(false);
  };

  const handleAcceptAll = () => {
    saveConsent(preferences, true);
  };

  const handleAcceptSelected = () => {
    saveConsent(preferences);
  };

  const handleRejectAll = () => {
    saveConsent({ functional: true, analytics: false, marketing: false });
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/80 backdrop-blur-lg border-t shadow-lg animate-in slide-in-from-bottom-5 duration-300">
      <div className="container mx-auto max-w-4xl">
        <div className="flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Cookie className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Cookie Preferences</h3>
                <p className="text-sm text-muted-foreground">
                  We use cookies to improve your experience. Some are essential, others help us understand how you use the site.
                </p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleRejectAll}
              className="flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Expandable Details */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
            className="self-start text-muted-foreground"
          >
            {showDetails ? (
              <>
                <ChevronUp className="mr-1 h-4 w-4" />
                Hide details
              </>
            ) : (
              <>
                <ChevronDown className="mr-1 h-4 w-4" />
                Customize preferences
              </>
            )}
          </Button>

          {showDetails && (
            <Card className="border-muted">
              <CardContent className="pt-4 space-y-4">
                {/* Functional - Always on */}
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="font-medium">Essential Cookies</Label>
                    <p className="text-xs text-muted-foreground">
                      Required for the site to function. Cannot be disabled.
                    </p>
                  </div>
                  <Switch checked={true} disabled />
                </div>

                {/* Analytics */}
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="font-medium">Analytics Cookies</Label>
                    <p className="text-xs text-muted-foreground">
                      Help us understand how visitors use our site.
                    </p>
                  </div>
                  <Switch 
                    checked={preferences.analytics}
                    onCheckedChange={(checked) => 
                      setPreferences({...preferences, analytics: checked})
                    }
                  />
                </div>

                {/* Marketing */}
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="font-medium">Marketing Cookies</Label>
                    <p className="text-xs text-muted-foreground">
                      Used to deliver personalized job recommendations.
                    </p>
                  </div>
                  <Switch 
                    checked={preferences.marketing}
                    onCheckedChange={(checked) => 
                      setPreferences({...preferences, marketing: checked})
                    }
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
            <Button variant="outline" onClick={handleRejectAll}>
              Reject All
            </Button>
            {showDetails && (
              <Button variant="outline" onClick={handleAcceptSelected}>
                Save Preferences
              </Button>
            )}
            <Button onClick={handleAcceptAll} className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Accept All
            </Button>
          </div>

          {/* Privacy Link */}
          <p className="text-xs text-center text-muted-foreground">
            Learn more in our{' '}
            <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>
            {' '}and{' '}
            <a href="/terms" className="text-primary hover:underline">Cookie Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
};