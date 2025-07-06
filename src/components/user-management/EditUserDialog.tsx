
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

interface EditUserDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingUser: User | null;
  userForm: UserForm;
  onFormChange: (form: UserForm) => void;
  onSave: () => void;
}

export function EditUserDialog({ 
  isOpen, 
  onOpenChange, 
  editingUser, 
  userForm, 
  onFormChange, 
  onSave 
}: EditUserDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              value={userForm.email}
              onChange={(e) => onFormChange({ ...userForm, email: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium">First Name</label>
            <Input
              value={userForm.first_name}
              onChange={(e) => onFormChange({ ...userForm, first_name: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Last Name</label>
            <Input
              value={userForm.last_name}
              onChange={(e) => onFormChange({ ...userForm, last_name: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Phone</label>
            <Input
              value={userForm.phone}
              onChange={(e) => onFormChange({ ...userForm, phone: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Role</label>
            <select
              value={userForm.role}
              onChange={(e) => onFormChange({ ...userForm, role: e.target.value as "admin" | "user" })}
              className="w-full p-2 border rounded-md"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={onSave}>
              Update User
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
