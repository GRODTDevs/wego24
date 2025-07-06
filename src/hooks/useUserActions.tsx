
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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

interface UserForm {
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: "admin" | "user";
}

export function useUserActions(onUserUpdated: () => Promise<void>) {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userForm, setUserForm] = useState<UserForm>({
    email: "",
    first_name: "",
    last_name: "",
    phone: "",
    role: "user"
  });

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
      
      // Prepare the roles array based on the selected role
      let newRoles = ['user']; // Everyone has user role by default
      if (userForm.role === 'admin') {
        newRoles.push('admin');
      }
      
      // Update profile information including roles
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: userForm.first_name,
          last_name: userForm.last_name,
          phone: userForm.phone,
          email: userForm.email,
          roles: newRoles
        })
        .eq('id', editingUser.id);

      if (profileError) {
        console.error('Profile update error:', profileError);
        throw profileError;
      }

      console.log('Updated user roles to:', newRoles);

      toast({ 
        title: "Success",
        description: "User updated successfully" 
      });
      
      setIsDialogOpen(false);
      setEditingUser(null);
      
      // Force refresh after a short delay
      setTimeout(async () => {
        await onUserUpdated();
      }, 500);
      
    } catch (error: any) {
      console.error('Error updating user:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update user",
        variant: "destructive"
      });
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      console.log('Toggling user status:', userId, currentStatus);
      
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: !currentStatus })
        .eq('id', userId);

      if (error) {
        console.error('Status update error:', error);
        throw error;
      }

      toast({ 
        title: "Success",
        description: `User ${!currentStatus ? 'activated' : 'deactivated'} successfully` 
      });
      
      // Add a delay and force refresh
      setTimeout(async () => {
        await onUserUpdated();
      }, 300);
      
    } catch (error: any) {
      console.error('Error updating user status:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update user status",
        variant: "destructive"
      });
    }
  };

  return {
    isDialogOpen,
    setIsDialogOpen,
    editingUser,
    userForm,
    setUserForm,
    handleEditUser,
    handleSaveUser,
    toggleUserStatus
  };
}
