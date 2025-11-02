import { useEffect, useState } from 'react';
import appLogo from '@/assets/app-icon.png';

interface SplashScreenProps {
  onFinish?: () => void;
  minDuration?: number;
}

export const SplashScreen = ({ onFinish, minDuration = 1500 }: SplashScreenProps) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Always call onFinish immediately to prevent blocking
    const immediateFinish = setTimeout(() => {
      onFinish?.();
    }, 0);

    // Start fade out animation
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, Math.max(minDuration - 300, 500));

    // Cleanup
    return () => {
      clearTimeout(immediateFinish);
      clearTimeout(fadeTimer);
    };
  }, [minDuration, onFinish]);

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 transition-opacity duration-300 pointer-events-none ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ display: fadeOut ? 'none' : 'flex' }}
    >
      <div className="text-center">
        <img 
          src={appLogo} 
          alt="SupplyChain KE" 
          className="w-20 h-20 mx-auto mb-4 animate-pulse" 
          loading="eager"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
        <h1 className="text-xl font-bold text-gray-900 mb-1">
          SupplyChain KE
        </h1>
        <p className="text-sm text-gray-600">
          Your Professional Supply Chain Network
        </p>
      </div>
    </div>
  );
};