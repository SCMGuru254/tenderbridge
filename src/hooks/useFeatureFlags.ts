interface FeatureFlags {
  [key: string]: boolean;
}

export const useFeatureFlags = (): FeatureFlags => {
  return {
    enableAI: import.meta.env.VITE_ENABLE_AI_FEATURES === 'true',
    enableDocuments: import.meta.env.VITE_ENABLE_DOCUMENT_MANAGEMENT === 'true',
    enableMentorship: import.meta.env.VITE_ENABLE_MENTORSHIP === 'true',
    enableHRDirectory: import.meta.env.VITE_ENABLE_HR_DIRECTORY === 'true',
  };
};