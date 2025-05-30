import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash, Image, Edit, Save, X } from "lucide-react";
import { formatCurrency } from "@/lib/currency";

interface MenuItem {
  id: string;
  title: string;
  description: string;
  price: number;
  image?: string;
}

export function MenuManagement() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      id: "1",
      title: "Breakfast Combo",
      description: "Eggs, bacon, toast & coffee",
      price: 7.99,
    },
    {
      id: "2", 
      title: "Classic Burger",
      description: "100% beef, cheese, lettuce, tomato, fries",
      price: 10.5
    },
    {
      id: "3",
      title: "Fresh Garden Salad", 
      description: "Seasonal greens, vinaigrette",
      price: 5.95
    }
  ]);

  const [newItem, setNewItem] = useState({
    title: "",
    description: "",
    price: "",
    image: ""
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState({
    title: "",
    description: "",
    price: "",
    image: ""
  });

  const handleAddItem = () => {
    if (!newItem.title || !newItem.description || !newItem.price) return;
    
    const item: MenuItem = {
      id: Date.now().toString(),
      title: newItem.title,
      description: newItem.description,
      price: parseFloat(newItem.price),
      image: newItem.image || undefined
    };
    
    setMenuItems([...menuItems, item]);
    setNewItem({ title: "", description: "", price: "", image: "" });
  };

  const handleRemoveItem = (id: string) => {
    setMenuItems(menuItems.filter(item => item.id !== id));
  };

  const handleEditItem = (item: MenuItem) => {
    setEditingId(item.id);
    setEditingItem({
      title: item.title,
      description: item.description,
      price: item.price.toString(),
      image: item.image || ""
    });
  };

  const handleSaveEdit = () => {
    if (!editingItem.title || !editingItem.description || !editingItem.price) return;
    
    setMenuItems(menuItems.map(item => 
      item.id === editingId 
        ? {
            ...item,
            title: editingItem.title,
            description: editingItem.description,
            price: parseFloat(editingItem.price),
            image: editingItem.image || undefined
          }
        : item
    ));
    
    setEditingId(null);
    setEditingItem({ title: "", description: "", price: "", image: "" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingItem({ title: "", description: "", price: "", image: "" });
  };

  return (
    <div className="space-y-6">
      {/* Add New Item Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-orange-600 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add New Menu Item
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={newItem.title}
                onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                placeholder="e.g. Margherita Pizza"
              />
            </div>
            <div>
              <Label htmlFor="price">Price (€)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={newItem.price}
                onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                placeholder="0.00"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={newItem.description}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              placeholder="Describe your dish..."
            />
          </div>
          <div>
            <Label htmlFor="image">Image URL (Optional)</Label>
            <Input
              id="image"
              value={newItem.image}
              onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <Button 
            onClick={handleAddItem}
            className="bg-gradient-to-r from-orange-400 to-red-400 text-white"
            disabled={!newItem.title || !newItem.description || !newItem.price}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Menu Item
          </Button>
        </CardContent>
      </Card>

      {/* Existing Menu Items */}
      <Card>
        <CardHeader>
          <CardTitle className="text-orange-600">Current Menu Items ({menuItems.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {menuItems.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No menu items yet. Add your first item above!</p>
          ) : (
            <div className="space-y-4">
              {menuItems.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                    {item.image ? (
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <Image className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  
                  {editingId === item.id ? (
                    <div className="flex-1 space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Input
                          value={editingItem.title}
                          onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                          placeholder="Title"
                          className="font-semibold"
                        />
                        <Input
                          type="number"
                          step="0.01"
                          value={editingItem.price}
                          onChange={(e) => setEditingItem({ ...editingItem, price: e.target.value })}
                          placeholder="Price"
                        />
                      </div>
                      <Textarea
                        value={editingItem.description}
                        onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                        placeholder="Description"
                        className="text-sm"
                      />
                      <Input
                        value={editingItem.image}
                        onChange={(e) => setEditingItem({ ...editingItem, image: e.target.value })}
                        placeholder="Image URL (optional)"
                        className="text-sm"
                      />
                    </div>
                  ) : (
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.description}</p>
                      <span className="text-orange-500 font-medium">{formatCurrency(item.price)}</span>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    {editingId === item.id ? (
                      <>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={handleSaveEdit}
                          className="text-green-500 hover:text-green-700"
                          disabled={!editingItem.title || !editingItem.description || !editingItem.price}
                        >
                          <Save className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={handleCancelEdit}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEditItem(item)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
