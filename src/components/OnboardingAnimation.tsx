
import React from 'react';

interface OnboardingAnimationProps {
  steps?: string[];
  currentStep?: number;
  onNext?: () => void;
  onPrevious?: () => void;
  onComplete?: () => void;
}

const OnboardingAnimation: React.FC<OnboardingAnimationProps> = ({
  steps = [],
  currentStep = 0,
  onNext,
  onPrevious,
  onComplete
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 flex items-center justify-center relative overflow-hidden">
      <div className="text-center text-white z-10">
        <h1 className="text-6xl font-bold mb-6 animate-fade-in">
          Welcome to SupplyChain_KE
        </h1>
        <p className="text-xl mb-8 opacity-90 animate-fade-in-delay">
          Your gateway to supply chain opportunities in Kenya
        </p>
        
        {/* Animated Icons */}
        <div className="flex justify-center space-x-8 mb-8">
          {['🚛', '📦', '🏭', '🌍'].map((icon, index) => (
            <div
              key={index}
              className="text-4xl animate-bounce"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {icon}
            </div>
          ))}
        </div>
      </div>
      
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>
    </div>
  );
};

export default OnboardingAnimation;
