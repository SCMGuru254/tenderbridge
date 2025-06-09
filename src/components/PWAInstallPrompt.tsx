import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";

export const PWAInstallPrompt = () => {
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    deferredPrompt.userChoice.then((choiceResult: { outcome: string; }) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the PWA installation');
      } else {
        console.log('User dismissed the PWA installation');
      }
      setDeferredPrompt(null);
      setIsInstallable(false);
    });
  };

  if (!isInstallable) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white p-4 shadow-md flex items-center justify-between">
      <p>Install our app for a better experience!</p>
      <Button onClick={handleInstallClick}>Install</Button>
    </div>
  );
};
