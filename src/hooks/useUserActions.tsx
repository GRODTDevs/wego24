
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

      if (profileError) {
        console.error('Profile update error:', profileError);
        throw profileError;
      }

      // Handle role change if necessary
      if (userForm.role !== editingUser.role) {
        console.log('Role change detected:', editingUser.role, '->', userForm.role);
        
        // Use upsert instead of delete/insert to handle duplicates gracefully
        const { error: upsertError } = await supabase
          .from('user_roles')
          .upsert({
            user_id: editingUser.id,
            role: userForm.role
          }, {
            onConflict: 'user_id,role'
          });

        if (upsertError) {
          console.error('Role upsert error:', upsertError);
          
          // If upsert fails, try the delete/insert approach
          const { error: deleteError } = await supabase
            .from('user_roles')
            .delete()
            .eq('user_id', editingUser.id);

          if (deleteError) {
            console.error('Role delete error:', deleteError);
            throw deleteError;
          }

          // Insert the new role
          const { error: insertError } = await supabase
            .from('user_roles')
            .insert({
              user_id: editingUser.id,
              role: userForm.role
            });

          if (insertError) {
            console.error('Role insert error:', insertError);
            throw insertError;
          }
        }

        console.log('Role updated successfully');
      }

      toast({ 
        title: "Success",
        description: "User updated successfully" 
      });
      
      setIsDialogOpen(false);
      setEditingUser(null);
      
      // Force a fresh fetch to ensure we get the latest data
      await onUserUpdated();
      
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
      
      // Force a fresh fetch
      await onUserUpdated();
      
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
