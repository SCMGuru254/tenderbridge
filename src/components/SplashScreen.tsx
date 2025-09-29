import { useEffect, useState } from 'react';
import appLogo from '@/assets/app-icon.png';

interface SplashScreenProps {
  onFinish?: () => void;
  minDuration?: number;
}

export const SplashScreen = ({ onFinish, minDuration = 2000 }: SplashScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onFinish?.();
    }, minDuration);

    return () => clearTimeout(timer);
  }, [minDuration, onFinish]);

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center bg-white transition-all duration-500 ${
        !isVisible ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="text-center">
        <img 
          src={appLogo} 
          alt="SupplyChain KE" 
          className="w-24 h-24 mx-auto mb-6 animate-fade-in" 
          style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 0.5s ease-in-out' }}
        />
        <h1 className="text-xl font-bold text-gray-900 mb-2 animate-fade-in-up delay-300">
          SupplyChain KE
        </h1>
        <p className="text-sm text-gray-600 animate-fade-in-up delay-500">
          Your Professional Supply Chain Network
        </p>
        <div className="mt-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>
    </div>
  );
};