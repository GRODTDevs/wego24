
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
        }
      } catch (err) {
        console.error('Error in fetchUserRole:', err);
        setUserRole('user');
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [user]);

  const isAdmin = userRole === 'admin';
  console.log('isAdmin computed:', isAdmin, 'from role:', userRole);

  return { userRole, isAdmin, loading };
};
