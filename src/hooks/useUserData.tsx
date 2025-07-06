
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  role: "admin" | "user";
  created_at: string;
  is_active?: boolean;
  roles?: string[];
}

export function useUserData() {
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      console.log('Fetching users - Current user:', currentUser?.id, currentUser?.email);
      
      if (!currentUser) {
        console.log('No current user found');
        setUsers([]);
        return;
      }

      // Get all profiles with their roles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('Profiles data:', profilesData);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        if (profilesError.code === '42501' || profilesError.message?.includes('permission')) {
          toast({
            title: "Access Denied",
            description: "You don't have admin permissions to view users.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to fetch users: " + profilesError.message,
            variant: "destructive"
          });
        }
        setUsers([]);
        return;
      }

      // Transform the data with role information from the JSON roles column
      const transformedUsers = profilesData?.map(profile => {
        const userRoles = profile.roles || ['user'];
        const isAdmin = userRoles.includes('admin');
        const primaryRole = isAdmin ? 'admin' : 'user';
        
        console.log(`User ${profile.email}: roles = ${JSON.stringify(userRoles)}, primary role = ${primaryRole}`);
        
        return {
          id: profile.id,
          email: profile.email || '',
          first_name: profile.first_name || '',
          last_name: profile.last_name || '',
          phone: profile.phone || '',
          role: primaryRole as "admin" | "user",
          created_at: profile.created_at,
          is_active: profile.is_active ?? true,
          roles: userRoles
        };
      }) || [];

      console.log('Final transformed users:', transformedUsers);
      
      setUsers(transformedUsers);
      
    } catch (error) {
      console.error('Error in fetchUsers:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users. Please check your permissions.",
        variant: "destructive"
      });
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      console.log('Current user changed, fetching users:', currentUser.email);
      fetchUsers();
    }
  }, [currentUser]);

  return {
    users,
    loading,
    fetchUsers
  };
}
