
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface UserSearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function UserSearchBar({ searchTerm, onSearchChange }: UserSearchBarProps) {
  return (
    <div className="flex items-center gap-2">
      <Search className="h-4 w-4 text-gray-500" />
      <Input
        placeholder="Search users..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="max-w-sm"
      />
    </div>
  );
}
