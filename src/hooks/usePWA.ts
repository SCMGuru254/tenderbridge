import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const usePWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);

  useEffect(() => {
    // Check if PWA is already installed
    const checkIfInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches || 
          (window.navigator as any).standalone) {
        setIsInstalled(true);
      }
    };

    checkIfInstalled();

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
      
      // Show install prompt after 30 seconds if not dismissed
      setTimeout(() => {
        if (!isInstalled && isInstallable) {
          toast.info('Add SupplyChain_KE to your home screen for quick access!', {
            duration: 10000,
            action: {
              label: 'Install',
              onClick: () => promptInstall()
            }
          });
        }
      }, 30000);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      toast.success('SupplyChain_KE installed successfully!');
    };

    // Listen for online/offline events
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('You are back online!');
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.warning('You are currently offline. Some features may be limited.');
    };

    // Listen for service worker updates
    const handleServiceWorkerUpdate = () => {
      setIsUpdateAvailable(true);
      toast.info('A new version is available!', {
        duration: 0,
        action: {
          label: 'Update',
          onClick: () => window.location.reload()
        }
      });
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
          
          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  handleServiceWorkerUpdate();
                }
              });
            }
          });
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isInstallable, isInstalled]);

  const promptInstall = async () => {
    if (!deferredPrompt) {
      toast.error('Installation not available');
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      toast.success('Installing SupplyChain_KE...');
    } else {
      toast.info('Installation cancelled');
    }
    
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      toast.error('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      toast.error('Notifications are blocked. Please enable them in your browser settings.');
      return false;
    }

    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      toast.success('Notifications enabled!');
      
      // Subscribe to push notifications if service worker is available
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        try {
          const registration = await navigator.serviceWorker.ready;
          const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array('YOUR_VAPID_PUBLIC_KEY_HERE')
          });
          
          // Send subscription to server
          await fetch('/api/push-subscription', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(subscription)
          });
          
          console.log('Push subscription successful');
        } catch (error) {
          console.error('Push subscription failed:', error);
        }
      }
      
      return true;
    } else {
      toast.error('Notifications permission denied');
      return false;
    }
  };

  const shareContent = async (data: ShareData) => {
    if (navigator.share) {
      try {
        await navigator.share(data);
        return true;
      } catch (error) {
        console.error('Error sharing:', error);
        return false;
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      if (navigator.clipboard) {
        try {
          await navigator.clipboard.writeText(data.url || '');
          toast.success('Link copied to clipboard!');
          return true;
        } catch (error) {
          console.error('Error copying to clipboard:', error);
          return false;
        }
      }
      return false;
    }
  };

  const addToHomeScreen = () => {
    if (deferredPrompt) {
      promptInstall();
    } else {
      toast.info('Add this app to your home screen for easy access!');
    }
  };

  const checkConnectivity = async () => {
    try {
      const response = await fetch('/api/health', { 
        method: 'HEAD',
        cache: 'no-cache'
      });
      return response.ok;
    } catch {
      return false;
    }
  };

  return {
    isInstallable,
    isInstalled,
    isOnline,
    isUpdateAvailable,
    promptInstall,
    requestNotificationPermission,
    shareContent,
    addToHomeScreen,
    checkConnectivity
  };
};

// Utility function to convert VAPID key
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}