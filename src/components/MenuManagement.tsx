
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Package } from "lucide-react";
import { MenuItemForm } from "./menu/MenuItemForm";
import { MenuItemCard } from "./menu/MenuItemCard";
import { EmptyMenuState } from "./menu/EmptyMenuState";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  status: 'available' | 'unavailable' | 'out_of_stock';
  category_id: string;
  image_url: string;
  is_featured: boolean;
  preparation_time: number;
}

interface MenuCategory {
  id: string;
  name: string;
  description: string;
  display_order: number;
  is_active: boolean;
}

interface MenuManagementProps {
  businessId: string;
}

export function MenuManagement({ businessId }: MenuManagementProps) {
  const { user } = useAuth();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  useEffect(() => {
    if (businessId) {
      fetchMenuData();
    }
  }, [businessId]);

  const fetchMenuData = async () => {
    try {
      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from("menu_categories")
        .select("*")
        .eq("restaurant_id", businessId)
        .order("display_order");

      if (categoriesError) throw categoriesError;

      // Fetch menu items
      const { data: itemsData, error: itemsError } = await supabase
        .from("menu_items")
        .select("*")
        .eq("restaurant_id", businessId)
        .order("display_order");

      if (itemsError) throw itemsError;

      setCategories(categoriesData || []);
      setMenuItems(itemsData || []);
    } catch (error) {
      console.error("Error fetching menu data:", error);
      toast.error("Failed to load menu data");
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    setIsAddingItem(false);
    setEditingItem(null);
    fetchMenuData();
  };

  const handleCancel = () => {
    setIsAddingItem(false);
    setEditingItem(null);
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setIsAddingItem(true);
  };

  const handleDelete = async (itemId: string) => {
    if (!confirm("Are you sure you want to delete this menu item?")) return;

    try {
      const { error } = await supabase
        .from("menu_items")
        .delete()
        .eq("id", itemId);

      if (error) throw error;
      toast.success("Menu item deleted successfully");
      fetchMenuData();
    } catch (error) {
      console.error("Error deleting menu item:", error);
      toast.error("Failed to delete menu item");
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading menu...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5" />
          <h2 className="text-xl font-semibold">Menu Management</h2>
        </div>
        <Dialog open={isAddingItem} onOpenChange={(open) => {
          setIsAddingItem(open);
          if (!open) handleCancel();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Menu Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? "Edit Menu Item" : "Add New Menu Item"}
              </DialogTitle>
            </DialogHeader>
            <MenuItemForm
              businessId={businessId}
              categories={categories}
              editingItem={editingItem}
              onSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {menuItems.map((item) => (
          <MenuItemCard
            key={item.id}
            item={item}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {menuItems.length === 0 && (
        <EmptyMenuState onAddItem={() => setIsAddingItem(true)} />
      )}
    </div>
  );
}
