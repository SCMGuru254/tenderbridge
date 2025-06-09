import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";

const onboardingSteps = [
  {
    id: 1,
    title: "Discover Jobs",
    description: "Find the perfect job opportunities tailored to your skills and experience.",
  },
  {
    id: 2,
    title: "Company Insights",
    description: "Explore detailed company profiles and reviews to make informed career decisions.",
  },
  {
    id: 3,
    title: "Interview Prep",
    description: "Prepare for interviews with confidence using our comprehensive resources and tips.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const stepVariants = {
  hidden: { x: "100%", opacity: 0 },
  visible: {
    x: "0%",
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
  exit: {
    x: "-100%",
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
};

export const OnboardingAnimation = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(true);
      setCurrentStep((prevStep) => (prevStep % onboardingSteps.length) + 1);
    }, 5000);

    return () => clearTimeout(timer);
  }, [currentStep]);

  const currentOnboardingStep = onboardingSteps.find((step) => step.id === currentStep);

  if (!currentOnboardingStep) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative h-48 overflow-hidden rounded-md bg-muted p-6">
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={currentOnboardingStep.id}
            className="text-center"
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <h3 className="text-lg font-semibold">{currentOnboardingStep.title}</h3>
            <p className="text-sm text-muted-foreground">{currentOnboardingStep.description}</p>
          </motion.div>
        </AnimatePresence>
      </motion.div>
      <div className="absolute bottom-2 right-2">
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </div>
    </div>
  );
};
