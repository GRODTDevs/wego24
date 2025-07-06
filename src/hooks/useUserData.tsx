
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

      // Clear any existing cache and fetch fresh data
      const timestamp = Date.now();
      console.log('Fetch timestamp:', timestamp);

      // First get all profiles with no cache
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

      // Get all user roles with fresh query - no cache
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('*')
        .order('created_at', { ascending: false }); // Get most recent first

      console.log('Roles data:', rolesData);

      if (rolesError) {
        console.error('Error fetching roles:', rolesError);
      }

      // Create a map of user_id to role - taking the most recent role for each user
      const roleMap = new Map<string, string>();
      rolesData?.forEach(roleRecord => {
        // Only set if we haven't seen this user yet (since we ordered by created_at desc)
        if (!roleMap.has(roleRecord.user_id)) {
          roleMap.set(roleRecord.user_id, roleRecord.role);
        }
      });

      console.log('Role map:', Object.fromEntries(roleMap));

      // Combine the data with proper role assignment
      const transformedUsers = profilesData?.map(profile => {
        const userRole = roleMap.get(profile.id) || 'user';
        
        console.log(`User ${profile.email}: role from map = ${userRole}`);
        
        return {
          id: profile.id,
          email: profile.email || '',
          first_name: profile.first_name || '',
          last_name: profile.last_name || '',
          phone: profile.phone || '',
          role: userRole as "admin" | "user",
          created_at: profile.created_at,
          is_active: profile.is_active ?? true
        };
      }) || [];

      console.log('Final transformed users:', transformedUsers);
      
      // Set users directly without the setTimeout trick
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
