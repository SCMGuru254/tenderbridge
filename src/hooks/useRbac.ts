import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';

type Permission = 'create' | 'read' | 'update' | 'delete' | 'manage';
type Resource = 'jobs' | 'companies' | 'reviews' | 'courses' | 'discussions' | 'users';

interface RolePermissions {
  [key: string]: {
    [K in Resource]?: Permission[];
  };
}

const ROLE_PERMISSIONS: RolePermissions = {
  admin: {
    jobs: ['create', 'read', 'update', 'delete', 'manage'],
    companies: ['create', 'read', 'update', 'delete', 'manage'],
    reviews: ['read', 'update', 'delete', 'manage'],
    courses: ['create', 'read', 'update', 'delete', 'manage'],
    discussions: ['create', 'read', 'update', 'delete', 'manage'],
    users: ['read', 'update', 'delete', 'manage']
  },
  moderator: {
    reviews: ['read', 'update', 'delete'],
    discussions: ['read', 'update', 'delete'],
    users: ['read']
  },
  employer: {
    jobs: ['create', 'read', 'update', 'delete'],
    companies: ['read', 'update'],
    reviews: ['read']
  },
  job_seeker: {
    jobs: ['read'],
    companies: ['read'],
    reviews: ['create', 'read'],
    discussions: ['create', 'read']
  },
  instructor: {
    courses: ['create', 'read', 'update'],
    discussions: ['create', 'read']
  }
};

interface UseRbacResult {
  hasPermission: (resource: Resource, permission: Permission) => boolean;
  isLoading: boolean;
  error: Error | null;
  userRoles: string[];
}

export const useRbac = (): UseRbacResult => {
  const { user } = useAuth();
  const { roles, isLoading, error } = useProfile(user?.id, { includeRoles: true });
  const [userRoles, setUserRoles] = useState<string[]>([]);

  useEffect(() => {
    if (roles) {
      setUserRoles(roles.map(r => r.role));
    }
  }, [roles]);

  const hasPermission = (resource: Resource, permission: Permission): boolean => {
    // If loading or error, deny access
    if (isLoading || error) return false;

    // If no roles, deny access
    if (!userRoles.length) return false;

    // Check if any of the user's roles have the required permission
    return userRoles.some(role => {
      const rolePerms = ROLE_PERMISSIONS[role];
      if (!rolePerms) return false;

      const resourcePerms = rolePerms[resource];
      if (!resourcePerms) return false;

      return resourcePerms.includes(permission);
    });
  };

  return {
    hasPermission,
    isLoading,
    error,
    userRoles
  };
};