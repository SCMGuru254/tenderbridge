import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Save, Globe, Phone, CreditCard, Link2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface SettingRow {
  id: string;
  setting_key: string;
  setting_value: Record<string, unknown>;
  setting_type: string;
  description: string;
  is_public: boolean;
}

export const PlatformSettingsManager = () => {
  const [settings, setSettings] = useState<SettingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('platform_settings')
        .select('*')
        .order('setting_type');

      if (error) throw error;
      setSettings((data as SettingRow[]) || []);
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key: string, value: Record<string, unknown>) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('platform_settings')
        .update({ 
          setting_value: value,
          updated_at: new Date().toISOString()
        })
        .eq('setting_key', key);

      if (error) throw error;
      
      setSettings(prev => 
        prev.map(s => s.setting_key === key ? { ...s, setting_value: value } : s)
      );
      toast.success('Settings saved!');
    } catch (error) {
      console.error('Error updating setting:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const getSetting = (key: string): SettingRow | undefined => {
    return settings.find(s => s.setting_key === key);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Platform Settings</h2>
          <p className="text-muted-foreground">Manage your platform configuration</p>
        </div>
      </div>

      <Tabs defaultValue="social" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="social" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Social
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Contact
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Payments
          </TabsTrigger>
          <TabsTrigger value="site" className="flex items-center gap-2">
            <Link2 className="h-4 w-4" />
            Site Info
          </TabsTrigger>
        </TabsList>

        {/* Social Links Tab */}
        <TabsContent value="social">
          <SocialLinksEditor 
            setting={getSetting('social_links')} 
            onSave={updateSetting}
            saving={saving}
          />
        </TabsContent>

        {/* Contact Info Tab */}
        <TabsContent value="contact">
          <ContactInfoEditor 
            setting={getSetting('contact_info')} 
            onSave={updateSetting}
            saving={saving}
          />
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments">
          <div className="grid gap-6">
            <MpesaSettingsEditor 
              setting={getSetting('mpesa_details')} 
              onSave={updateSetting}
              saving={saving}
            />
            <PaystackSettingsEditor 
              setting={getSetting('paystack_config')} 
              onSave={updateSetting}
              saving={saving}
            />
          </div>
        </TabsContent>

        {/* Site Info Tab */}
        <TabsContent value="site">
          <SiteInfoEditor 
            setting={getSetting('site_info')} 
            onSave={updateSetting}
            saving={saving}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Social Links Editor
const SocialLinksEditor = ({ 
  setting, 
  onSave, 
  saving 
}: { 
  setting?: SettingRow; 
  onSave: (key: string, value: Record<string, unknown>) => Promise<void>;
  saving: boolean;
}) => {
  const [values, setValues] = useState(setting?.setting_value as Record<string, string> || {});

  const handleSave = () => {
    onSave('social_links', values);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Social Media Links</CardTitle>
        <CardDescription>Configure your social media profile URLs</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {['twitter', 'linkedin', 'facebook', 'instagram', 'youtube', 'tiktok'].map((platform) => (
          <div key={platform} className="space-y-2">
            <Label htmlFor={platform} className="capitalize">{platform}</Label>
            <Input
              id={platform}
              placeholder={`https://${platform}.com/yourprofile`}
              value={values[platform] || ''}
              onChange={(e) => setValues({ ...values, [platform]: e.target.value })}
            />
          </div>
        ))}
        <Button onClick={handleSave} disabled={saving} className="w-full">
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save Social Links
        </Button>
      </CardContent>
    </Card>
  );
};

// Contact Info Editor
const ContactInfoEditor = ({ 
  setting, 
  onSave, 
  saving 
}: { 
  setting?: SettingRow; 
  onSave: (key: string, value: Record<string, unknown>) => Promise<void>;
  saving: boolean;
}) => {
  const [values, setValues] = useState(setting?.setting_value as Record<string, string> || {});

  const handleSave = () => {
    onSave('contact_info', values);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
        <CardDescription>Platform contact details shown to users</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Support Email</Label>
          <Input
            id="email"
            type="email"
            value={values.email || ''}
            onChange={(e) => setValues({ ...values, email: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            value={values.phone || ''}
            onChange={(e) => setValues({ ...values, phone: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="whatsapp">WhatsApp Number</Label>
          <Input
            id="whatsapp"
            placeholder="+254..."
            value={values.whatsapp || ''}
            onChange={(e) => setValues({ ...values, whatsapp: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Textarea
            id="address"
            value={values.address || ''}
            onChange={(e) => setValues({ ...values, address: e.target.value })}
          />
        </div>
        <Button onClick={handleSave} disabled={saving} className="w-full">
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save Contact Info
        </Button>
      </CardContent>
    </Card>
  );
};

// M-Pesa Settings Editor
const MpesaSettingsEditor = ({ 
  setting, 
  onSave, 
  saving 
}: { 
  setting?: SettingRow; 
  onSave: (key: string, value: Record<string, unknown>) => Promise<void>;
  saving: boolean;
}) => {
  const [values, setValues] = useState(setting?.setting_value as Record<string, string> || {});

  const handleSave = () => {
    onSave('mpesa_details', values);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Phone className="h-5 w-5 text-green-600" />
          M-Pesa Configuration
        </CardTitle>
        <CardDescription>Configure manual M-Pesa payment details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="paybill">Paybill Number</Label>
            <Input
              id="paybill"
              value={values.paybill || ''}
              onChange={(e) => setValues({ ...values, paybill: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="till_number">Till Number</Label>
            <Input
              id="till_number"
              value={values.till_number || ''}
              onChange={(e) => setValues({ ...values, till_number: e.target.value })}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="account_name">Account Name</Label>
          <Input
            id="account_name"
            value={values.account_name || ''}
            onChange={(e) => setValues({ ...values, account_name: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="instructions">Payment Instructions</Label>
          <Textarea
            id="instructions"
            rows={3}
            value={values.instructions || ''}
            onChange={(e) => setValues({ ...values, instructions: e.target.value })}
          />
        </div>
        <Button onClick={handleSave} disabled={saving} className="w-full">
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save M-Pesa Settings
        </Button>
      </CardContent>
    </Card>
  );
};

// Paystack Settings Editor
const PaystackSettingsEditor = ({ 
  setting, 
  onSave, 
  saving 
}: { 
  setting?: SettingRow; 
  onSave: (key: string, value: Record<string, unknown>) => Promise<void>;
  saving: boolean;
}) => {
  const [values, setValues] = useState(setting?.setting_value as Record<string, unknown> || {});

  const handleSave = () => {
    onSave('paystack_config', values);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-blue-600" />
          Paystack Configuration
        </CardTitle>
        <CardDescription>Configure Paystack for card payments (Free tier available)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label>Enable Paystack</Label>
            <p className="text-sm text-muted-foreground">Allow card payments via Paystack</p>
          </div>
          <Switch
            checked={values.enabled as boolean || false}
            onCheckedChange={(checked) => setValues({ ...values, enabled: checked })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="public_key">Public Key</Label>
          <Input
            id="public_key"
            type="password"
            placeholder="pk_live_..."
            value={(values.public_key as string) || ''}
            onChange={(e) => setValues({ ...values, public_key: e.target.value })}
          />
          <p className="text-xs text-muted-foreground">
            Get your public key from your Paystack dashboard
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="w-full">
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save Paystack Settings
        </Button>
      </CardContent>
    </Card>
  );
};

// Site Info Editor
const SiteInfoEditor = ({ 
  setting, 
  onSave, 
  saving 
}: { 
  setting?: SettingRow; 
  onSave: (key: string, value: Record<string, unknown>) => Promise<void>;
  saving: boolean;
}) => {
  const [values, setValues] = useState(setting?.setting_value as Record<string, string> || {});

  const handleSave = () => {
    onSave('site_info', values);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Site Information</CardTitle>
        <CardDescription>General platform branding and information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Site Name</Label>
          <Input
            id="name"
            value={values.name || ''}
            onChange={(e) => setValues({ ...values, name: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tagline">Tagline</Label>
          <Input
            id="tagline"
            value={values.tagline || ''}
            onChange={(e) => setValues({ ...values, tagline: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="about">About Description</Label>
          <Textarea
            id="about"
            rows={4}
            value={values.about || ''}
            onChange={(e) => setValues({ ...values, about: e.target.value })}
          />
        </div>
        <Button onClick={handleSave} disabled={saving} className="w-full">
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save Site Info
        </Button>
      </CardContent>
    </Card>
  );
};
