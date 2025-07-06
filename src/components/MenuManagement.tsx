
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "@/contexts/TranslationContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Package } from "lucide-react";

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
  const { t } = useTranslation();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category_id: "",
    image_url: "",
    preparation_time: "15",
    status: "available" as 'available' | 'unavailable' | 'out_of_stock',
    is_featured: false
  });

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

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category_id: "",
      image_url: "",
      preparation_time: "15",
      status: "available",
      is_featured: false
    });
    setEditingItem(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("You must be logged in");
      return;
    }

    try {
      const itemData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category_id: formData.category_id || null,
        image_url: formData.image_url || null,
        preparation_time: parseInt(formData.preparation_time),
        status: formData.status,
        is_featured: formData.is_featured,
        restaurant_id: businessId
      };

      if (editingItem) {
        const { error } = await supabase
          .from("menu_items")
          .update(itemData)
          .eq("id", editingItem.id);

        if (error) throw error;
        toast.success("Menu item updated successfully");
      } else {
        const { error } = await supabase
          .from("menu_items")
          .insert(itemData);

        if (error) throw error;
        toast.success("Menu item added successfully");
      }

      resetForm();
      setIsAddingItem(false);
      fetchMenuData();
    } catch (error) {
      console.error("Error saving menu item:", error);
      toast.error("Failed to save menu item");
    }
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

  const handleEdit = (item: MenuItem) => {
    setFormData({
      name: item.name,
      description: item.description || "",
      price: item.price.toString(),
      category_id: item.category_id || "",
      image_url: item.image_url || "",
      preparation_time: item.preparation_time?.toString() || "15",
      status: item.status,
      is_featured: item.is_featured
    });
    setEditingItem(item);
    setIsAddingItem(true);
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
          if (!open) resetForm();
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
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Item Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="price">Price (€) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category_id} onValueChange={(value) => setFormData({ ...formData, category_id: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value: 'available' | 'unavailable' | 'out_of_stock') => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="unavailable">Unavailable</SelectItem>
                      <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="prep_time">Preparation Time (minutes)</Label>
                  <Input
                    id="prep_time"
                    type="number"
                    value={formData.preparation_time}
                    onChange={(e) => setFormData({ ...formData, preparation_time: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="image_url">Image URL</Label>
                  <Input
                    id="image_url"
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                />
                <Label htmlFor="featured">Featured Item</Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsAddingItem(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingItem ? "Update Item" : "Add Item"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {menuItems.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{item.name}</h3>
                    <span className="text-lg font-bold text-green-600">€{item.price}</span>
                    {item.is_featured && (
                      <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                        Featured
                      </span>
                    )}
                    <span className={`text-xs px-2 py-1 rounded ${
                      item.status === 'available' ? 'bg-green-100 text-green-800' :
                      item.status === 'unavailable' ? 'bg-red-100 text-red-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {item.status.replace('_', ' ')}
                    </span>
                  </div>
                  {item.description && (
                    <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                  )}
                  <p className="text-gray-500 text-xs mt-1">
                    Prep time: {item.preparation_time || 15} minutes
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(item)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {menuItems.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No menu items yet</h3>
            <p className="text-gray-600 mb-4">Start by adding your first menu item</p>
            <Button onClick={() => setIsAddingItem(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Menu Item
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
