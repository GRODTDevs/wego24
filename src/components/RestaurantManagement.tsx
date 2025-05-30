
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Edit2, Trash2, Plus, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Restaurant {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  cuisine: string;
  status: "active" | "inactive" | "pending";
  commission: number;
  totalOrders: number;
  revenue: number;
}

export function RestaurantManagement() {
  const { toast } = useToast();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([
    {
      id: "1",
      name: "Pizza Palace",
      email: "contact@pizzapalace.com",
      phone: "+1234567890",
      address: "123 Main St, City",
      cuisine: "Italian",
      status: "active",
      commission: 15,
      totalOrders: 245,
      revenue: 12500
    },
    {
      id: "2",
      name: "Burger House",
      email: "info@burgerhouse.com",
      phone: "+1234567891",
      address: "456 Oak Ave, City",
      cuisine: "American",
      status: "active",
      commission: 12,
      totalOrders: 189,
      revenue: 9800
    },
    {
      id: "3",
      name: "Sushi Zen",
      email: "hello@sushizen.com",
      phone: "+1234567892",
      address: "789 Pine St, City",
      cuisine: "Japanese",
      status: "pending",
      commission: 18,
      totalOrders: 0,
      revenue: 0
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null);
  const [restaurantForm, setRestaurantForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    cuisine: "",
    status: "pending" as "active" | "inactive" | "pending",
    commission: 15
  });

  const filteredRestaurants = restaurants.filter(restaurant =>
    restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddRestaurant = () => {
    setEditingRestaurant(null);
    setRestaurantForm({
      name: "",
      email: "",
      phone: "",
      address: "",
      cuisine: "",
      status: "pending",
      commission: 15
    });
    setIsDialogOpen(true);
  };

  const handleEditRestaurant = (restaurant: Restaurant) => {
    setEditingRestaurant(restaurant);
    setRestaurantForm({
      name: restaurant.name,
      email: restaurant.email,
      phone: restaurant.phone,
      address: restaurant.address,
      cuisine: restaurant.cuisine,
      status: restaurant.status,
      commission: restaurant.commission
    });
    setIsDialogOpen(true);
  };

  const handleSaveRestaurant = () => {
    if (editingRestaurant) {
      setRestaurants(restaurants.map(restaurant =>
        restaurant.id === editingRestaurant.id
          ? { ...restaurant, ...restaurantForm }
          : restaurant
      ));
      toast({ title: "Restaurant updated successfully" });
    } else {
      const newRestaurant: Restaurant = {
        id: Date.now().toString(),
        ...restaurantForm,
        totalOrders: 0,
        revenue: 0
      };
      setRestaurants([...restaurants, newRestaurant]);
      toast({ title: "Restaurant added successfully" });
    }
    setIsDialogOpen(false);
  };

  const handleDeleteRestaurant = (id: string) => {
    setRestaurants(restaurants.filter(restaurant => restaurant.id !== id));
    toast({ title: "Restaurant deleted successfully" });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "inactive": return "bg-gray-100 text-gray-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Restaurant Management</CardTitle>
          <Button onClick={handleAddRestaurant} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Restaurant
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search restaurants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Cuisine</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Commission (%)</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Revenue</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRestaurants.map((restaurant) => (
              <TableRow key={restaurant.id}>
                <TableCell className="font-medium">{restaurant.name}</TableCell>
                <TableCell>{restaurant.cuisine}</TableCell>
                <TableCell>{restaurant.email}</TableCell>
                <TableCell>{restaurant.phone}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(restaurant.status)}>
                    {restaurant.status}
                  </Badge>
                </TableCell>
                <TableCell>{restaurant.commission}%</TableCell>
                <TableCell>{restaurant.totalOrders}</TableCell>
                <TableCell>${restaurant.revenue.toLocaleString()}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditRestaurant(restaurant)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteRestaurant(restaurant.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingRestaurant ? "Edit Restaurant" : "Add New Restaurant"}
              </DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={restaurantForm.name}
                  onChange={(e) => setRestaurantForm({ ...restaurantForm, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Cuisine</label>
                <Input
                  value={restaurantForm.cuisine}
                  onChange={(e) => setRestaurantForm({ ...restaurantForm, cuisine: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={restaurantForm.email}
                  onChange={(e) => setRestaurantForm({ ...restaurantForm, email: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Phone</label>
                <Input
                  value={restaurantForm.phone}
                  onChange={(e) => setRestaurantForm({ ...restaurantForm, phone: e.target.value })}
                />
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium">Address</label>
                <Input
                  value={restaurantForm.address}
                  onChange={(e) => setRestaurantForm({ ...restaurantForm, address: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Status</label>
                <select
                  value={restaurantForm.status}
                  onChange={(e) => setRestaurantForm({ ...restaurantForm, status: e.target.value as "active" | "inactive" | "pending" })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="pending">Pending</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Commission (%)</label>
                <Input
                  type="number"
                  value={restaurantForm.commission}
                  onChange={(e) => setRestaurantForm({ ...restaurantForm, commission: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveRestaurant}>
                {editingRestaurant ? "Update" : "Add"} Restaurant
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
