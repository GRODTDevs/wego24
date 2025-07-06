
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

interface UserForm {
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: "admin" | "user";
}

export function useUserManagement() {
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userForm, setUserForm] = useState<UserForm>({
    email: "",
    first_name: "",
    last_name: "",
    phone: "",
    role: "user"
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      console.log('Fetching users - Current user:', currentUser?.id, currentUser?.email);
      
      if (!currentUser) {
        console.log('No current user found');
        setUsers([]);
        return;
      }

      // First get all profiles with a left join to user_roles
      const { data: profilesWithRoles, error } = await supabase
        .from('profiles')
        .select(`
          *,
          user_roles!left (
            role
          )
        `);

      console.log('Profiles with roles data:', profilesWithRoles);
      console.log('Query error:', error);

      if (error) {
        console.error('Error fetching profiles with roles:', error);
        if (error.code === '42501' || error.message?.includes('permission')) {
          toast({
            title: "Access Denied",
            description: "You don't have admin permissions to view users.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to fetch users: " + error.message,
            variant: "destructive"
          });
        }
        setUsers([]);
        return;
      }

      // Transform the data to match our User interface
      const transformedUsers = profilesWithRoles?.map(profile => {
        // Get the role from the joined user_roles data
        const userRoleData = Array.isArray(profile.user_roles) 
          ? profile.user_roles[0] 
          : profile.user_roles;
        
        const role = userRoleData?.role || 'user';
        
        return {
          id: profile.id,
          email: profile.email || '',
          first_name: profile.first_name || '',
          last_name: profile.last_name || '',
          phone: profile.phone || '',
          role: role as "admin" | "user",
          created_at: profile.created_at,
          is_active: profile.is_active ?? true
        };
      }) || [];

      console.log('Transformed users:', transformedUsers);
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

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setUserForm({
      email: user.email || "",
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      phone: user.phone || "",
      role: user.role
    });
    setIsDialogOpen(true);
  };

  const handleSaveUser = async () => {
    if (!editingUser) return;

    try {
      console.log('Updating user:', editingUser.id, userForm);
      
      // Update profile information
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: userForm.first_name,
          last_name: userForm.last_name,
          phone: userForm.phone,
          email: userForm.email
        })
        .eq('id', editingUser.id);

      if (profileError) throw profileError;

      // Handle role change if necessary
      if (userForm.role !== editingUser.role) {
        // First, delete existing role
        const { error: deleteError } = await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', editingUser.id);

        if (deleteError) throw deleteError;

        // Then insert new role
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: editingUser.id,
            role: userForm.role
          });

        if (roleError) throw roleError;
      }

      toast({ title: "User updated successfully" });
      setIsDialogOpen(false);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive"
      });
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: !currentStatus })
        .eq('id', userId);

      if (error) throw error;

      toast({ 
        title: `User ${!currentStatus ? 'activated' : 'deactivated'} successfully` 
      });
      fetchUsers();
    } catch (error) {
      console.error('Error updating user status:', error);
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive"
      });
    }
  };

  const filteredUsers = users.filter(user =>
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (currentUser) {
      console.log('Current user changed, fetching users:', currentUser.email);
      fetchUsers();
    }
  }, [currentUser]);

  return {
    users: filteredUsers,
    loading,
    searchTerm,
    setSearchTerm,
    isDialogOpen,
    setIsDialogOpen,
    editingUser,
    userForm,
    setUserForm,
    handleEditUser,
    handleSaveUser,
    toggleUserStatus,
    fetchUsers
  };
}
