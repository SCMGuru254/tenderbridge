
import { useUser } from './useUser';

export const useAuth = () => {
  const { user, loading } = useUser();
  
  return {
    user,
    loading,
    isAuthenticated: !!user
  };
};
