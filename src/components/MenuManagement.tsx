import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Package, Search, Filter } from "lucide-react";
import { EnhancedMenuItemForm } from "./menu/EnhancedMenuItemForm";
import { EnhancedMenuItemCard } from "./menu/EnhancedMenuItemCard";
import { CategoryManager } from "./menu/CategoryManager";
import { BulkOperations } from "./menu/BulkOperations";
import { EmptyMenuState } from "./menu/EmptyMenuState";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  allergens: string[];
  dietary_info: string[];
  calories: number;
}

interface MenuCategory {
  id: string;
  name: string;
  description: string;
  display_order: number;
  sort_order: number;
  is_active: boolean;
}

interface MenuManagementProps {
  businessId: string;
}

export function MenuManagement({ businessId }: MenuManagementProps) {
  console.log('[MenuManagement] props:', { businessId });
  const { user } = useAuth();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

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

  const handleSelectionChange = (itemId: string, selected: boolean) => {
    if (selected) {
      setSelectedItems([...selectedItems, itemId]);
    } else {
      setSelectedItems(selectedItems.filter(id => id !== itemId));
    }
  };

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || item.category_id === filterCategory || 
                           (filterCategory === "uncategorized" && !item.category_id);
    const matchesStatus = filterStatus === "all" || item.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

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
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? "Edit Menu Item" : "Add New Menu Item"}
              </DialogTitle>
            </DialogHeader>
            <EnhancedMenuItemForm
              businessId={businessId}
              categories={categories}
              editingItem={editingItem}
              onSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="items" className="w-full">
        <TabsList>
          <TabsTrigger value="items">Menu Items</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="items" className="space-y-4">
          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search menu items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="uncategorized">Uncategorized</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="unavailable">Unavailable</SelectItem>
                <SelectItem value="out_of_stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bulk Operations */}
          <BulkOperations
            menuItems={filteredItems}
            categories={categories}
            selectedItems={selectedItems}
            onItemsUpdated={fetchMenuData}
            onSelectionChange={setSelectedItems}
          />

          {/* Menu Items Grid */}
          <div className="grid gap-4">
            {filteredItems.map((item) => (
              <EnhancedMenuItemCard
                key={item.id}
                item={item}
                isSelected={selectedItems.includes(item.id)}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onSelectionChange={handleSelectionChange}
              />
            ))}
          </div>

          {filteredItems.length === 0 && menuItems.length === 0 && (
            <EmptyMenuState onAddItem={() => setIsAddingItem(true)} />
          )}

          {filteredItems.length === 0 && menuItems.length > 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No items match your current filters.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="categories">
          <CategoryManager
            businessId={businessId}
            categories={categories}
            onCategoriesChange={fetchMenuData}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
