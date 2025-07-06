
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Edit, Trash2, GripVertical } from "lucide-react";

interface MenuCategory {
  id: string;
  name: string;
  description: string;
  display_order: number;
  sort_order: number;
  is_active: boolean;
}

interface CategoryManagerProps {
  businessId: string;
  categories: MenuCategory[];
  onCategoriesChange: () => void;
}

export function CategoryManager({ businessId, categories, onCategoriesChange }: CategoryManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    is_active: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const categoryData = {
        name: formData.name,
        description: formData.description,
        is_active: formData.is_active,
        restaurant_id: businessId,
        display_order: editingCategory?.display_order || categories.length,
        sort_order: editingCategory?.sort_order || categories.length
      };

      if (editingCategory) {
        const { error } = await supabase
          .from("menu_categories")
          .update(categoryData)
          .eq("id", editingCategory.id);

        if (error) throw error;
        toast.success("Category updated successfully");
      } else {
        const { error } = await supabase
          .from("menu_categories")
          .insert(categoryData);

        if (error) throw error;
        toast.success("Category created successfully");
      }

      handleClose();
      onCategoriesChange();
    } catch (error) {
      console.error("Error saving category:", error);
      toast.error("Failed to save category");
    }
  };

  const handleEdit = (category: MenuCategory) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
      is_active: category.is_active
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (categoryId: string) => {
    if (!confirm("Are you sure you want to delete this category? All items in this category will be uncategorized.")) return;

    try {
      const { error } = await supabase
        .from("menu_categories")
        .delete()
        .eq("id", categoryId);

      if (error) throw error;
      toast.success("Category deleted successfully");
      onCategoriesChange();
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category");
    }
  };

  const handleClose = () => {
    setIsDialogOpen(false);
    setEditingCategory(null);
    setFormData({ name: "", description: "", is_active: true });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Categories</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? "Edit Category" : "Add New Category"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Category Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingCategory ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-2">
        {categories.map((category) => (
          <div key={category.id} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <GripVertical className="w-4 h-4 text-gray-400" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{category.name}</span>
                  {!category.is_active && (
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      Inactive
                    </span>
                  )}
                </div>
                {category.description && (
                  <p className="text-sm text-gray-600">{category.description}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => handleEdit(category)}>
                <Edit className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleDelete(category.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
