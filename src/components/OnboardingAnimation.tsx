
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Briefcase, 
  Users, 
  TrendingUp, 
  MapPin, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle,
  Sparkles,
  Heart,
  Target
} from 'lucide-react';

interface OnboardingStep {
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  benefits: string[];
}

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
  const enhancedSteps: OnboardingStep[] = [
    {
      title: "Welcome to Your Future! 🚀",
      subtitle: "SupplyChain_KE",
      description: "Join Kenya's premier supply chain community where opportunities meet ambition",
      icon: <Sparkles className="w-16 h-16 text-blue-500" />,
      color: "from-blue-500 to-purple-600",
      benefits: ["✨ Exclusive job opportunities", "🎯 Career guidance", "💼 Industry connections"]
    },
    {
      title: "Discover Amazing Jobs 💼",
      subtitle: "Your Dream Role Awaits",
      description: "Access hundreds of verified supply chain positions from top companies across Kenya",
      icon: <Briefcase className="w-16 h-16 text-green-500" />,
      color: "from-green-500 to-emerald-600",
      benefits: ["📈 500+ active positions", "🏢 Top-tier companies", "💰 Competitive salaries"]
    },
    {
      title: "Connect & Grow 🌱",
      subtitle: "Build Your Network",
      description: "Join a thriving community of supply chain professionals and industry leaders",
      icon: <Users className="w-16 h-16 text-orange-500" />,
      color: "from-orange-500 to-red-500",
      benefits: ["🤝 Professional networking", "📚 Learning resources", "🎓 Skill development"]
    },
    {
      title: "Start Your Journey! 🎯",
      subtitle: "Success Starts Here",
      description: "Take the first step towards your dream career in supply chain management",
      icon: <Target className="w-16 h-16 text-purple-500" />,
      color: "from-purple-500 to-pink-600",
      benefits: ["🚀 Instant access", "📱 Mobile-friendly", "🎉 Free to join"]
    }
  ];

  const currentStepData = enhancedSteps[currentStep];
  const progress = ((currentStep + 1) / enhancedSteps.length) * 100;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.1 
      }
    },
    exit: { 
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: { 
      scale: 1, 
      rotate: 0,
      transition: { 
        type: "spring",
        stiffness: 200,
        damping: 15,
        delay: 0.2
      }
    }
  };

  const benefitVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: (i: number) => ({
      x: 0,
      opacity: 1,
      transition: {
        delay: 0.4 + (i * 0.1),
        type: "spring",
        stiffness: 100
      }
    })
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex flex-col">
      {/* Progress Bar */}
      <div className="w-full bg-white/50 backdrop-blur-sm border-b p-4">
        <div className="max-w-md mx-auto">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Step {currentStep + 1} of {enhancedSteps.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="text-center space-y-6"
            >
              {/* Icon */}
              <motion.div
                variants={iconVariants}
                className={`mx-auto w-24 h-24 rounded-full bg-gradient-to-r ${currentStepData.color} p-4 shadow-lg`}
              >
                <div className="w-full h-full flex items-center justify-center text-white">
                  {currentStepData.icon}
                </div>
              </motion.div>

              {/* Title */}
              <motion.div variants={itemVariants} className="space-y-2">
                <Badge variant="secondary" className="mb-2">
                  {currentStepData.subtitle}
                </Badge>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
                  {currentStepData.title}
                </h1>
              </motion.div>

              {/* Description */}
              <motion.p 
                variants={itemVariants}
                className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed px-2"
              >
                {currentStepData.description}
              </motion.p>

              {/* Benefits */}
              <motion.div variants={itemVariants} className="space-y-3">
                {currentStepData.benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    custom={index}
                    variants={benefitVariants}
                    className="flex items-center justify-center space-x-2 text-sm sm:text-base text-gray-700 dark:text-gray-300"
                  >
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>{benefit}</span>
                  </motion.div>
                ))}
              </motion.div>

              {/* Action Buttons */}
              <motion.div 
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-3 pt-6"
              >
                {currentStep > 0 && (
                  <Button
                    variant="outline"
                    onClick={onPrevious}
                    className="flex items-center gap-2 w-full sm:w-auto order-2 sm:order-1"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Previous
                  </Button>
                )}
                
                <Button
                  onClick={currentStep === enhancedSteps.length - 1 ? onComplete : onNext}
                  className={`flex items-center gap-2 w-full sm:flex-1 order-1 sm:order-2 bg-gradient-to-r ${currentStepData.color} hover:opacity-90 transition-opacity shadow-lg`}
                >
                  {currentStep === enhancedSteps.length - 1 ? (
                    <>
                      <Heart className="w-4 h-4" />
                      Get Started
                    </>
                  ) : (
                    <>
                      Continue
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </motion.div>

              {/* Skip Option */}
              <motion.div variants={itemVariants}>
                <button
                  onClick={onComplete}
                  className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  Skip introduction
                </button>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom decoration */}
      <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
    </div>
  );
};
