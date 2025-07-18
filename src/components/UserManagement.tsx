
import { Card, CardContent } from "@/components/ui/card";
import { UserManagementHeader } from "./user-management/UserManagementHeader";
import { UserSearchBar } from "./user-management/UserSearchBar";
import { UserTable } from "./user-management/UserTable";
import { EditUserDialog } from "./user-management/EditUserDialog";
import { EmptyUserState } from "./user-management/EmptyUserState";
import { AdminSetup } from "./user-management/AdminSetup";
import { useUserManagement } from "./user-management/useUserManagement";
import { useUserRole } from "@/hooks/useUserRole";

export function UserManagement() {
  const { isAdmin, loading: roleLoading } = useUserRole();
  const {
    users,
    loading: usersLoading,
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

  // Show loading if role is still being determined
  if (roleLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show admin setup if user is not admin (no flicker since roleLoading is false)
  if (!isAdmin) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <h2 className="text-xl font-semibold">Admin Access Required</h2>
              <p className="text-gray-600">
                You need admin privileges to access user management. 
                If you should have admin access, use the form below to grant admin role to your account.
              </p>
            </div>
          </CardContent>
        </Card>
        <AdminSetup onUserUpdated={fetchUsers} />
      </div>
    );
  }

  // Show loading while fetching users (only after we know user is admin)
  if (usersLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
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
