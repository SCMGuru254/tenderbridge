
import React from 'react';
import { motion } from 'framer-motion';

interface OnboardingStep {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface OnboardingAnimationProps {
  steps: OnboardingStep[];
  currentStep: number;
  onNext: () => void;
  onPrevious: () => void;
  onComplete: () => void;
}

const OnboardingAnimation: React.FC<OnboardingAnimationProps> = ({
  steps,
  currentStep,
  onNext,
  onPrevious,
  onComplete
}) => {
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.3 }}
        className="text-center"
      >
        <div className="mb-4 flex justify-center">
          {steps[currentStep]?.icon}
        </div>
        <h2 className="text-xl font-bold mb-2">
          {steps[currentStep]?.title}
        </h2>
        <p className="text-gray-600 mb-6">
          {steps[currentStep]?.description}
        </p>
      </motion.div>

      <div className="flex justify-between items-center">
        <button
          onClick={onPrevious}
          disabled={isFirstStep}
          className="px-4 py-2 text-gray-600 disabled:opacity-50"
        >
          Previous
        </button>
        
        <div className="flex space-x-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentStep ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        <button
          onClick={isLastStep ? onComplete : onNext}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {isLastStep ? 'Complete' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default OnboardingAnimation;
