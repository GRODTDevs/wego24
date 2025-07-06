
import { Button } from "@/components/ui/button";

interface EmptyUserStateProps {
  searchTerm: string;
  onRefresh: () => void;
}

export function EmptyUserState({ searchTerm, onRefresh }: EmptyUserStateProps) {
  return (
    <div className="text-center py-8">
      <p className="text-gray-500">
        {searchTerm ? "No users found matching your search." : "No users found. This might be due to permissions or missing data."}
      </p>
      <Button 
        variant="outline" 
        onClick={onRefresh} 
        className="mt-4"
      >
        Refresh
      </Button>
    </div>
  );
}
