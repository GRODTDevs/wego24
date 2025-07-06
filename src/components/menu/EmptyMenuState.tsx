
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Package, Plus } from "lucide-react";

interface EmptyMenuStateProps {
  onAddItem: () => void;
}

export function EmptyMenuState({ onAddItem }: EmptyMenuStateProps) {
  return (
    <Card>
      <CardContent className="text-center py-8">
        <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold mb-2">No menu items yet</h3>
        <p className="text-gray-600 mb-4">Start by adding your first menu item</p>
        <Button onClick={onAddItem}>
          <Plus className="w-4 h-4 mr-2" />
          Add Menu Item
        </Button>
      </CardContent>
    </Card>
  );
}
