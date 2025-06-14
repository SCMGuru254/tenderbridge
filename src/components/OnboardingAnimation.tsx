
import { motion } from 'framer-motion';

interface OnboardingAnimationProps {
  steps: string[];
  currentStep: number;
  onNext: () => void;
  onPrevious: () => void;
  onComplete: () => void;
}

export const OnboardingAnimation = ({ 
  steps, 
  currentStep, 
  onNext, 
  onPrevious, 
  onComplete 
}: OnboardingAnimationProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="text-center"
      >
        <h2 className="text-2xl font-bold mb-4">{steps[currentStep]}</h2>
        <div className="flex gap-4 mt-8">
          {currentStep > 0 && (
            <button
              onClick={onPrevious}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Previous
            </button>
          )}
          <button
            onClick={currentStep === steps.length - 1 ? onComplete : onNext}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
