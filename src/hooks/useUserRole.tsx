
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useUserRole = () => {
  const { user } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) {
        console.log('No user in useUserRole');
        setUserRole(null);
        setLoading(false);
        return;
      }

      // Check session storage first to avoid database calls
      const cachedRole = sessionStorage.getItem(`user_role_${user.id}`);
      if (cachedRole) {
        console.log('Using cached role:', cachedRole);
        setUserRole(cachedRole);
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching role for user:', user.id, user.email);
        
        const { data, error } = await supabase
          .from('profiles')
          .select('roles')
          .eq('id', user.id)
          .single();

        console.log('Role fetch result:', data, error);

        if (error) {
          console.error('Error fetching user role:', error);
          setUserRole('user'); // Default to user role
          sessionStorage.setItem(`user_role_${user.id}`, 'user');
        } else {
          // Safely handle the roles JSON data
          let roles: string[] = ['user']; // Default
          try {
            if (data?.roles && Array.isArray(data.roles)) {
              roles = data.roles as string[];
            } else if (typeof data?.roles === 'string') {
              roles = JSON.parse(data.roles);
            }
          } catch (parseError) {
            console.warn('Error parsing roles:', parseError);
            roles = ['user'];
          }
          
          const isAdmin = roles.includes('admin');
          const primaryRole = isAdmin ? 'admin' : 'user';
          console.log('User roles:', roles, 'primary role:', primaryRole);
          
          setUserRole(primaryRole);
          // Cache the role in session storage
          sessionStorage.setItem(`user_role_${user.id}`, primaryRole);
        }
      } catch (err) {
        console.error('Error in fetchUserRole:', err);
        setUserRole('user');
        sessionStorage.setItem(`user_role_${user.id}`, 'user');
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [user]);

  // Clear cache when user changes
  useEffect(() => {
    if (!user) {
      // Clear all cached roles when user logs out
      const keys = Object.keys(sessionStorage);
      keys.forEach(key => {
        if (key.startsWith('user_role_')) {
          sessionStorage.removeItem(key);
        }
      });
    }
  }, [user]);

  const isAdmin = userRole === 'admin';
  console.log('isAdmin computed:', isAdmin, 'from role:', userRole);

  return { userRole, isAdmin, loading };
};
