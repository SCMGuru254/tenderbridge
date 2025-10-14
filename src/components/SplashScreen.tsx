import { useEffect, useState } from 'react';
import appLogo from '@/assets/app-icon.png';

interface SplashScreenProps {
  onFinish?: () => void;
  minDuration?: number;
}

export const SplashScreen = ({ onFinish, minDuration = 2000 }: SplashScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Start fade out animation slightly before finishing
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, minDuration - 500);

    // Complete and unmount
    const finishTimer = setTimeout(() => {
      setIsVisible(false);
      onFinish?.();
    }, minDuration);

    // Failsafe: force unmount after max duration
    const failsafeTimer = setTimeout(() => {
      setIsVisible(false);
      onFinish?.();
    }, 5000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
      clearTimeout(failsafeTimer);
    };
  }, [minDuration, onFinish]);

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="text-center">
        <img 
          src={appLogo} 
          alt="SupplyChain KE" 
          className="w-24 h-24 mx-auto mb-6 animate-pulse" 
          onError={(e) => {
            // Fallback if image fails to load
            e.currentTarget.style.display = 'none';
          }}
        />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          SupplyChain KE
        </h1>
        <p className="text-sm text-gray-600 mb-8">
          Your Professional Supply Chain Network
        </p>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    </div>
  );
};