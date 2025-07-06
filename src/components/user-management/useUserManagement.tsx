
import { useState } from "react";
import { useUserData } from "@/hooks/useUserData";
import { useUserActions } from "@/hooks/useUserActions";

export function useUserManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const { users, loading, fetchUsers } = useUserData();
  const userActions = useUserActions(fetchUsers);

  const filteredUsers = users.filter(user =>
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    users: filteredUsers,
    loading,
    searchTerm,
    setSearchTerm,
    fetchUsers,
    ...userActions
  };
}
