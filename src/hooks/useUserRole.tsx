
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
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        console.log('Role fetch result:', data, error);

        if (error) {
          console.error('Error fetching user role:', error);
          setUserRole('user'); // Default to user role
        } else {
          const role = data?.role || 'user';
          console.log('User role determined:', role);
          setUserRole(role);
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
