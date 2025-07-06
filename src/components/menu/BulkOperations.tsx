
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Settings, Trash2, Edit } from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
  status: 'available' | 'unavailable' | 'out_of_stock';
  is_featured: boolean;
  category_id: string;
}

interface MenuCategory {
  id: string;
  name: string;
}

interface BulkOperationsProps {
  menuItems: MenuItem[];
  categories: MenuCategory[];
  selectedItems: string[];
  onItemsUpdated: () => void;
  onSelectionChange: (selectedIds: string[]) => void;
}

export function BulkOperations({ 
  menuItems, 
  categories, 
  selectedItems, 
  onItemsUpdated, 
  onSelectionChange 
}: BulkOperationsProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [bulkOperation, setBulkOperation] = useState<string>("");
  const [bulkValue, setBulkValue] = useState<string>("");

  const handleBulkUpdate = async () => {
    if (selectedItems.length === 0) {
      toast.error("Please select items to update");
      return;
    }

    try {
      let updateData: any = {};

      switch (bulkOperation) {
        case 'status':
          updateData.status = bulkValue;
          break;
        case 'category':
          updateData.category_id = bulkValue === 'none' ? null : bulkValue;
          break;
        case 'featured':
          updateData.is_featured = bulkValue === 'true';
          break;
        default:
          toast.error("Please select an operation");
          return;
      }

      const { error } = await supabase
        .from("menu_items")
        .update(updateData)
        .in("id", selectedItems);

      if (error) throw error;

      toast.success(`Updated ${selectedItems.length} items successfully`);
      setIsDialogOpen(false);
      setBulkOperation("");
      setBulkValue("");
      onSelectionChange([]);
      onItemsUpdated();
    } catch (error) {
      console.error("Error updating items:", error);
      toast.error("Failed to update items");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) {
      toast.error("Please select items to delete");
      return;
    }

    if (!confirm(`Are you sure you want to delete ${selectedItems.length} selected items?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from("menu_items")
        .delete()
        .in("id", selectedItems);

      if (error) throw error;

      toast.success(`Deleted ${selectedItems.length} items successfully`);
      onSelectionChange([]);
      onItemsUpdated();
    } catch (error) {
      console.error("Error deleting items:", error);
      toast.error("Failed to delete items");
    }
  };

  const handleSelectAll = () => {
    if (selectedItems.length === menuItems.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(menuItems.map(item => item.id));
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Checkbox
        checked={selectedItems.length === menuItems.length && menuItems.length > 0}
        onCheckedChange={handleSelectAll}
      />
      <span className="text-sm text-gray-600">
        {selectedItems.length > 0 ? `${selectedItems.length} selected` : "Select all"}
      </span>

      {selectedItems.length > 0 && (
        <>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Bulk Edit
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Bulk Edit {selectedItems.length} Items</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Operation</label>
                  <Select value={bulkOperation} onValueChange={setBulkOperation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select operation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="status">Update Status</SelectItem>
                      <SelectItem value="category">Change Category</SelectItem>
                      <SelectItem value="featured">Set Featured</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {bulkOperation === 'status' && (
                  <div>
                    <label className="block text-sm font-medium mb-2">New Status</label>
                    <Select value={bulkValue} onValueChange={setBulkValue}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="unavailable">Unavailable</SelectItem>
                        <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {bulkOperation === 'category' && (
                  <div>
                    <label className="block text-sm font-medium mb-2">New Category</label>
                    <Select value={bulkValue} onValueChange={setBulkValue}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Category</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {bulkOperation === 'featured' && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Featured Status</label>
                    <Select value={bulkValue} onValueChange={setBulkValue}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select featured status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Featured</SelectItem>
                        <SelectItem value="false">Not Featured</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleBulkUpdate}>
                    Update Items
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Selected
          </Button>
        </>
      )}
    </div>
  );
}
