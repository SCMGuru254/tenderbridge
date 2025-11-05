import { RoleManager } from '@/components/admin/RoleManager';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';

export const RoleManagementPage = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="container mx-auto py-8">
      <RoleManager />
    </div>
  );
};
