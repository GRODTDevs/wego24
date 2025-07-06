
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
      console.log('Fetching users as admin user:', currentUser?.id);
      
      // First, check if current user is admin
      const { data: userRoleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', currentUser?.id)
        .single();

      console.log('Current user role:', userRoleData?.role, 'Error:', roleError);

      if (roleError || userRoleData?.role !== 'admin') {
        console.error('User is not admin or role check failed:', roleError);
        toast({
          title: "Access Denied",
          description: "You don't have admin permissions to view users.",
          variant: "destructive"
        });
        setUsers([]);
        return;
      }

      // If user is admin, fetch all profiles
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select(`
          id,
          email,
          first_name,
          last_name,
          phone,
          created_at,
          is_active,
          user_roles!left (
            role
          )
        `);

      console.log('Fetched users data:', usersData, 'Error:', usersError);

      if (usersError) {
        console.error('Error fetching users:', usersError);
        throw usersError;
      }

      const transformedUsers = usersData?.map(user => ({
        id: user.id,
        email: user.email || '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone: user.phone || '',
        role: (user.user_roles as any)?.[0]?.role || 'user',
        created_at: user.created_at,
        is_active: user.is_active ?? true
      })) || [];

      console.log('Transformed users:', transformedUsers);
      setUsers(transformedUsers);
    } catch (error) {
      console.error('Error in fetchUsers:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users. Please check your admin permissions.",
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

      if (userForm.role !== editingUser.role) {
        const { error: deleteError } = await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', editingUser.id);

        if (deleteError) throw deleteError;

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
