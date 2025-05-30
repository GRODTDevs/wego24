
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Edit2, Trash2, Plus, Search, Settings, Users, MapPin, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

interface Restaurant {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string;
  city: string;
  postal_code: string | null;
  country: string | null;
  cuisine_type: string | null;
  description: string | null;
  status: "pending" | "active" | "inactive" | "suspended";
  commission_rate: number | null;
  minimum_order_amount: number | null;
  delivery_fee: number | null;
  delivery_time_min: number | null;
  delivery_time_max: number | null;
  is_delivery_available: boolean | null;
  is_pickup_available: boolean | null;
  image_url: string | null;
  created_at: string;
}

interface RestaurantSettings {
  auto_accept_orders: boolean | null;
  max_orders_per_hour: number | null;
  advance_order_hours: number | null;
  tax_rate: number | null;
  service_charge: number | null;
  payment_methods: string[] | null;
  special_instructions: string | null;
}

export function RestaurantManagement() {
  const { toast } = useToast();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null);
  const [restaurantSettings, setRestaurantSettings] = useState<RestaurantSettings | null>(null);
  
  const [restaurantForm, setRestaurantForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postal_code: "",
    country: "Spain",
    cuisine_type: "",
    description: "",
    status: "pending" as "pending" | "active" | "inactive" | "suspended",
    commission_rate: 15,
    minimum_order_amount: 0,
    delivery_fee: 0,
    delivery_time_min: 30,
    delivery_time_max: 60,
    is_delivery_available: true,
    is_pickup_available: true
  });

  const [ownerForm, setOwnerForm] = useState({
    email: "",
    firstName: "",
    lastName: ""
  });

  const fetchRestaurants = async () => {
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRestaurants(data || []);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      toast({ 
        title: "Error", 
        description: "Failed to fetch restaurants",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRestaurantSettings = async (restaurantId: string) => {
    try {
      const { data, error } = await supabase
        .from('restaurant_settings')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setRestaurantSettings(data);
    } catch (error) {
      console.error('Error fetching restaurant settings:', error);
      toast({ 
        title: "Error", 
        description: "Failed to fetch restaurant settings",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  useEffect(() => {
    if (selectedRestaurantId) {
      fetchRestaurantSettings(selectedRestaurantId);
    }
  }, [selectedRestaurantId]);

  const filteredRestaurants = restaurants.filter(restaurant =>
    restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (restaurant.cuisine_type && restaurant.cuisine_type.toLowerCase().includes(searchTerm.toLowerCase())) ||
    restaurant.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddRestaurant = () => {
    setEditingRestaurant(null);
    setRestaurantForm({
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      postal_code: "",
      country: "Spain",
      cuisine_type: "",
      description: "",
      status: "pending",
      commission_rate: 15,
      minimum_order_amount: 0,
      delivery_fee: 0,
      delivery_time_min: 30,
      delivery_time_max: 60,
      is_delivery_available: true,
      is_pickup_available: true
    });
    setOwnerForm({
      email: "",
      firstName: "",
      lastName: ""
    });
    setIsDialogOpen(true);
  };

  const handleEditRestaurant = (restaurant: Restaurant) => {
    setEditingRestaurant(restaurant);
    setRestaurantForm({
      name: restaurant.name,
      email: restaurant.email,
      phone: restaurant.phone || "",
      address: restaurant.address,
      city: restaurant.city,
      postal_code: restaurant.postal_code || "",
      country: restaurant.country || "Spain",
      cuisine_type: restaurant.cuisine_type || "",
      description: restaurant.description || "",
      status: restaurant.status,
      commission_rate: restaurant.commission_rate || 15,
      minimum_order_amount: restaurant.minimum_order_amount || 0,
      delivery_fee: restaurant.delivery_fee || 0,
      delivery_time_min: restaurant.delivery_time_min || 30,
      delivery_time_max: restaurant.delivery_time_max || 60,
      is_delivery_available: restaurant.is_delivery_available || true,
      is_pickup_available: restaurant.is_pickup_available || true
    });
    setOwnerForm({
      email: "",
      firstName: "",
      lastName: ""
    });
    setIsDialogOpen(true);
  };

  const createRestaurantUser = async (restaurantId: string, userEmail: string, firstName: string, lastName: string) => {
    try {
      // Create user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userEmail,
        password: 'TempPass123!', // Temporary password - user will reset via email
        options: {
          data: {
            first_name: firstName,
            last_name: lastName
          },
          emailRedirectTo: `${window.location.origin}/restaurant/dashboard`
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // Link user to restaurant
        const { error: linkError } = await supabase
          .from('restaurant_users')
          .insert({
            restaurant_id: restaurantId,
            user_id: authData.user.id,
            role: 'owner'
          });

        if (linkError) throw linkError;

        toast({ 
          title: "Success", 
          description: "Restaurant owner account created. They will receive an email to set their password."
        });
      }
    } catch (error: any) {
      console.error('Error creating restaurant user:', error);
      toast({ 
        title: "Error", 
        description: error.message || "Failed to create restaurant owner account",
        variant: "destructive"
      });
    }
  };

  const handleSaveRestaurant = async () => {
    try {
      setLoading(true);

      if (editingRestaurant) {
        // Update existing restaurant
        const { error } = await supabase
          .from('restaurants')
          .update({
            ...restaurantForm,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingRestaurant.id);

        if (error) throw error;
        toast({ title: "Restaurant updated successfully" });
      } else {
        // Create new restaurant
        const { data: restaurantData, error: restaurantError } = await supabase
          .from('restaurants')
          .insert([restaurantForm])
          .select()
          .single();

        if (restaurantError) throw restaurantError;

        // Create owner account if provided
        if (ownerForm.email && ownerForm.firstName && ownerForm.lastName) {
          await createRestaurantUser(
            restaurantData.id,
            ownerForm.email,
            ownerForm.firstName,
            ownerForm.lastName
          );
        }

        toast({ title: "Restaurant created successfully" });
      }

      setIsDialogOpen(false);
      fetchRestaurants();
    } catch (error: any) {
      console.error('Error saving restaurant:', error);
      toast({ 
        title: "Error", 
        description: error.message || "Failed to save restaurant",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRestaurant = async (id: string) => {
    try {
      const { error } = await supabase
        .from('restaurants')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setRestaurants(restaurants.filter(restaurant => restaurant.id !== id));
      toast({ title: "Restaurant deleted successfully" });
    } catch (error: any) {
      console.error('Error deleting restaurant:', error);
      toast({ 
        title: "Error", 
        description: error.message || "Failed to delete restaurant",
        variant: "destructive"
      });
    }
  };

  const updateRestaurantSettings = async (settings: Partial<RestaurantSettings>) => {
    if (!selectedRestaurantId) return;

    try {
      const { error } = await supabase
        .from('restaurant_settings')
        .update(settings)
        .eq('restaurant_id', selectedRestaurantId);

      if (error) throw error;
      
      setRestaurantSettings(prev => ({ ...prev, ...settings }));
      toast({ title: "Settings updated successfully" });
    } catch (error: any) {
      console.error('Error updating settings:', error);
      toast({ 
        title: "Error", 
        description: error.message || "Failed to update settings",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "inactive": return "bg-gray-100 text-gray-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "suspended": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading && restaurants.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

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

        <Tabs defaultValue="restaurants" className="w-full">
          <TabsList>
            <TabsTrigger value="restaurants">Restaurants</TabsTrigger>
            <TabsTrigger value="settings" disabled={!selectedRestaurantId}>
              Settings {selectedRestaurantId && `(${restaurants.find(r => r.id === selectedRestaurantId)?.name})`}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="restaurants">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Cuisine</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Commission</TableHead>
                  <TableHead>Delivery</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRestaurants.map((restaurant) => (
                  <TableRow 
                    key={restaurant.id}
                    className={selectedRestaurantId === restaurant.id ? "bg-blue-50" : ""}
                  >
                    <TableCell className="font-medium">{restaurant.name}</TableCell>
                    <TableCell>{restaurant.cuisine_type || "N/A"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {restaurant.city}
                      </div>
                    </TableCell>
                    <TableCell>{restaurant.email}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(restaurant.status)}>
                        {restaurant.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{restaurant.commission_rate}%</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {restaurant.delivery_time_min}-{restaurant.delivery_time_max}min
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedRestaurantId(restaurant.id)}
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
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
          </TabsContent>

          <TabsContent value="settings">
            {restaurantSettings && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Order Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Auto Accept Orders</label>
                        <input
                          type="checkbox"
                          checked={restaurantSettings.auto_accept_orders || false}
                          onChange={(e) => updateRestaurantSettings({ auto_accept_orders: e.target.checked })}
                          className="rounded"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Max Orders Per Hour</label>
                        <Input
                          type="number"
                          value={restaurantSettings.max_orders_per_hour || 20}
                          onChange={(e) => updateRestaurantSettings({ max_orders_per_hour: parseInt(e.target.value) })}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Advance Order Hours</label>
                        <Input
                          type="number"
                          value={restaurantSettings.advance_order_hours || 24}
                          onChange={(e) => updateRestaurantSettings({ advance_order_hours: parseInt(e.target.value) })}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Pricing Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Tax Rate (%)</label>
                        <Input
                          type="number"
                          step="0.01"
                          value={restaurantSettings.tax_rate || 0}
                          onChange={(e) => updateRestaurantSettings({ tax_rate: parseFloat(e.target.value) })}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Service Charge (%)</label>
                        <Input
                          type="number"
                          step="0.01"
                          value={restaurantSettings.service_charge || 0}
                          onChange={(e) => updateRestaurantSettings({ service_charge: parseFloat(e.target.value) })}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Special Instructions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="Special instructions for customers..."
                      value={restaurantSettings.special_instructions || ""}
                      onChange={(e) => updateRestaurantSettings({ special_instructions: e.target.value })}
                      rows={4}
                    />
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingRestaurant ? "Edit Restaurant" : "Add New Restaurant"}
              </DialogTitle>
            </DialogHeader>
            
            <Tabs defaultValue="restaurant" className="w-full">
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="restaurant">Restaurant Details</TabsTrigger>
                <TabsTrigger value="owner" disabled={!!editingRestaurant}>Owner Account</TabsTrigger>
              </TabsList>

              <TabsContent value="restaurant" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Name *</label>
                    <Input
                      value={restaurantForm.name}
                      onChange={(e) => setRestaurantForm({ ...restaurantForm, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email *</label>
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
                  <div>
                    <label className="text-sm font-medium">Cuisine Type</label>
                    <Input
                      value={restaurantForm.cuisine_type}
                      onChange={(e) => setRestaurantForm({ ...restaurantForm, cuisine_type: e.target.value })}
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium">Address *</label>
                    <Input
                      value={restaurantForm.address}
                      onChange={(e) => setRestaurantForm({ ...restaurantForm, address: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">City *</label>
                    <Input
                      value={restaurantForm.city}
                      onChange={(e) => setRestaurantForm({ ...restaurantForm, city: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Postal Code</label>
                    <Input
                      value={restaurantForm.postal_code}
                      onChange={(e) => setRestaurantForm({ ...restaurantForm, postal_code: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Status</label>
                    <select
                      value={restaurantForm.status}
                      onChange={(e) => setRestaurantForm({ ...restaurantForm, status: e.target.value as any })}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="pending">Pending</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Commission Rate (%)</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={restaurantForm.commission_rate}
                      onChange={(e) => setRestaurantForm({ ...restaurantForm, commission_rate: Number(e.target.value) })}
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      value={restaurantForm.description}
                      onChange={(e) => setRestaurantForm({ ...restaurantForm, description: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={restaurantForm.is_delivery_available}
                        onChange={(e) => setRestaurantForm({ ...restaurantForm, is_delivery_available: e.target.checked })}
                      />
                      <span className="text-sm font-medium">Delivery Available</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={restaurantForm.is_pickup_available}
                        onChange={(e) => setRestaurantForm({ ...restaurantForm, is_pickup_available: e.target.checked })}
                      />
                      <span className="text-sm font-medium">Pickup Available</span>
                    </label>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="owner" className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <strong>Note:</strong> This will create a new user account for the restaurant owner. 
                    They will receive an email with instructions to set their password.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Owner Email *</label>
                    <Input
                      type="email"
                      value={ownerForm.email}
                      onChange={(e) => setOwnerForm({ ...ownerForm, email: e.target.value })}
                      placeholder="owner@restaurant.com"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">First Name *</label>
                    <Input
                      value={ownerForm.firstName}
                      onChange={(e) => setOwnerForm({ ...ownerForm, firstName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Last Name *</label>
                    <Input
                      value={ownerForm.lastName}
                      onChange={(e) => setOwnerForm({ ...ownerForm, lastName: e.target.value })}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveRestaurant} disabled={loading}>
                {loading ? "Saving..." : editingRestaurant ? "Update" : "Create"} Restaurant
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
