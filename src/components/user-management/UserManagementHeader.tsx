
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function UserManagementHeader() {
  const { toast } = useToast();

  return (
    <CardHeader>
      <div className="flex justify-between items-center">
        <CardTitle>User Management</CardTitle>
        <Button 
          onClick={() => toast({ 
            title: "Feature coming soon", 
            description: "User creation will be available soon" 
          })} 
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add User
        </Button>
      </div>
    </CardHeader>
  );
}
