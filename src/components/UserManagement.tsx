
import { Card, CardContent } from "@/components/ui/card";
import { UserManagementHeader } from "./user-management/UserManagementHeader";
import { UserSearchBar } from "./user-management/UserSearchBar";
import { UserTable } from "./user-management/UserTable";
import { EditUserDialog } from "./user-management/EditUserDialog";
import { EmptyUserState } from "./user-management/EmptyUserState";
import { useUserManagement } from "./user-management/useUserManagement";

export function UserManagement() {
  const {
    users,
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
  } = useUserManagement();

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <UserManagementHeader />
      <CardContent className="space-y-4">
        <UserSearchBar 
          searchTerm={searchTerm} 
          onSearchChange={setSearchTerm} 
        />

        {users.length === 0 ? (
          <EmptyUserState 
            searchTerm={searchTerm} 
            onRefresh={fetchUsers} 
          />
        ) : (
          <UserTable
            users={users}
            onEditUser={handleEditUser}
            onToggleUserStatus={toggleUserStatus}
          />
        )}

        <EditUserDialog
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          editingUser={editingUser}
          userForm={userForm}
          onFormChange={setUserForm}
          onSave={handleSaveUser}
        />
      </CardContent>
    </Card>
  );
}
