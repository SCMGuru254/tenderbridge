import { useAuth } from '@/contexts/AuthContextFull';

export const useUser = () => {
  const { user, loading } = useAuth();
  
  return { user, loading };
};
