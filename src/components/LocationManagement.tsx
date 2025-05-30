
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { Plus, Edit, Trash2, Upload, MapPin } from "lucide-react";

type Location = Tables<"restaurants">;
type LocationSettings = Tables<"restaurant_settings">;

export function LocationManagement() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    cuisine_type: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postal_code: "",
    country: "Spain",
    minimum_order_amount: 0,
    delivery_fee: 0,
    delivery_time_min: 30,
    delivery_time_max: 60,
    is_delivery_available: true,
    is_pickup_available: true,
    commission_rate: 15.00,
    image_url: "",
    banner_url: ""
  });

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const { data, error } = await supabase
        .from("restaurants")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setLocations(data || []);
    } catch (error) {
      console.error("Error fetching locations:", error);
      toast.error("Failed to load locations");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File, type: 'featured' | 'banner') => {
    try {
      setUploadingImage(true);
      
      // Create a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `location-images/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('location-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase.storage
        .from('location-images')
        .getPublicUrl(filePath);

      const imageUrl = data.publicUrl;
      
      // Update form data
      if (type === 'featured') {
        setFormData(prev => ({ ...prev, image_url: imageUrl }));
      } else {
        setFormData(prev => ({ ...prev, banner_url: imageUrl }));
      }

      toast.success(`${type === 'featured' ? 'Featured' : 'Banner'} image uploaded successfully`);
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingLocation) {
        const { error } = await supabase
          .from("restaurants")
          .update(formData)
          .eq("id", editingLocation.id);

        if (error) throw error;
        toast.success("Location updated successfully");
      } else {
        // Create auth user for the location owner
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: formData.email,
          email_confirm: true,
          user_metadata: {
            first_name: formData.name + " Owner",
            role: "location_owner"
          }
        });

        if (authError) throw authError;

        // Create location
        const { data: locationData, error: locationError } = await supabase
          .from("restaurants")
          .insert(formData)
          .select()
          .single();

        if (locationError) throw locationError;

        // Link user to location
        const { error: linkError } = await supabase
          .from("restaurant_users")
          .insert({
            restaurant_id: locationData.id,
            user_id: authData.user.id,
            role: "owner"
          });

        if (linkError) throw linkError;

        toast.success("Location and owner account created successfully");
      }
      
      resetForm();
      fetchLocations();
    } catch (error) {
      console.error("Error saving location:", error);
      toast.error("Failed to save location");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      cuisine_type: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      postal_code: "",
      country: "Spain",
      minimum_order_amount: 0,
      delivery_fee: 0,
      delivery_time_min: 30,
      delivery_time_max: 60,
      is_delivery_available: true,
      is_pickup_available: true,
      commission_rate: 15.00,
      image_url: "",
      banner_url: ""
    });
    setShowAddForm(false);
    setEditingLocation(null);
  };

  const handleEdit = (location: Location) => {
    setEditingLocation(location);
    setFormData({
      name: location.name,
      description: location.description || "",
      cuisine_type: location.cuisine_type || "",
      email: location.email,
      phone: location.phone || "",
      address: location.address,
      city: location.city,
      postal_code: location.postal_code || "",
      country: location.country || "Spain",
      minimum_order_amount: Number(location.minimum_order_amount) || 0,
      delivery_fee: Number(location.delivery_fee) || 0,
      delivery_time_min: location.delivery_time_min || 30,
      delivery_time_max: location.delivery_time_max || 60,
      is_delivery_available: location.is_delivery_available ?? true,
      is_pickup_available: location.is_pickup_available ?? true,
      commission_rate: Number(location.commission_rate) || 15.00,
      image_url: location.image_url || "",
      banner_url: location.banner_url || ""
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this location?")) return;
    
    try {
      const { error } = await supabase
        .from("restaurants")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Location deleted successfully");
      fetchLocations();
    } catch (error) {
      console.error("Error deleting location:", error);
      toast.error("Failed to delete location");
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Location Management</h2>
        <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Location
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingLocation ? "Edit Location" : "Add New Location"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Business Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Contact Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="cuisine_type">Business Type</Label>
                  <Select value={formData.cuisine_type} onValueChange={(value) => setFormData({...formData, cuisine_type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select business type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Restaurant">Restaurant</SelectItem>
                      <SelectItem value="Cafe">Cafe</SelectItem>
                      <SelectItem value="Bakery">Bakery</SelectItem>
                      <SelectItem value="Fast Food">Fast Food</SelectItem>
                      <SelectItem value="Grocery">Grocery Store</SelectItem>
                      <SelectItem value="Pharmacy">Pharmacy</SelectItem>
                      <SelectItem value="Retail">Retail Shop</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="postal_code">Postal Code</Label>
                  <Input
                    id="postal_code"
                    value={formData.postal_code}
                    onChange={(e) => setFormData({...formData, postal_code: e.target.value})}
                  />
                </div>
              </div>

              {/* Image Upload Section */}
              <div className="space-y-4">
                <h4 className="font-medium">Images</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Featured Image</Label>
                    <div className="mt-2 space-y-2">
                      {formData.image_url && (
                        <img src={formData.image_url} alt="Featured" className="w-full h-32 object-cover rounded" />
                      )}
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(file, 'featured');
                        }}
                        disabled={uploadingImage}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Banner Image</Label>
                    <div className="mt-2 space-y-2">
                      {formData.banner_url && (
                        <img src={formData.banner_url} alt="Banner" className="w-full h-32 object-cover rounded" />
                      )}
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(file, 'banner');
                        }}
                        disabled={uploadingImage}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="delivery_fee">Delivery Fee (€)</Label>
                  <Input
                    id="delivery_fee"
                    type="number"
                    step="0.01"
                    value={formData.delivery_fee}
                    onChange={(e) => setFormData({...formData, delivery_fee: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="minimum_order">Minimum Order (€)</Label>
                  <Input
                    id="minimum_order"
                    type="number"
                    step="0.01"
                    value={formData.minimum_order_amount}
                    onChange={(e) => setFormData({...formData, minimum_order_amount: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="delivery_time_min">Min Delivery (min)</Label>
                  <Input
                    id="delivery_time_min"
                    type="number"
                    value={formData.delivery_time_min}
                    onChange={(e) => setFormData({...formData, delivery_time_min: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="delivery_time_max">Max Delivery (min)</Label>
                  <Input
                    id="delivery_time_max"
                    type="number"
                    value={formData.delivery_time_max}
                    onChange={(e) => setFormData({...formData, delivery_time_max: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="delivery"
                    checked={formData.is_delivery_available}
                    onCheckedChange={(checked) => setFormData({...formData, is_delivery_available: checked})}
                  />
                  <Label htmlFor="delivery">Delivery Available</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="pickup"
                    checked={formData.is_pickup_available}
                    onCheckedChange={(checked) => setFormData({...formData, is_pickup_available: checked})}
                  />
                  <Label htmlFor="pickup">Pickup Available</Label>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
                <Button type="submit" disabled={uploadingImage}>
                  {uploadingImage ? "Uploading..." : editingLocation ? "Update Location" : "Create Location"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {locations.map((location) => (
          <Card key={location.id}>
            <CardContent className="p-4">
              {location.image_url && (
                <img src={location.image_url} alt={location.name} className="w-full h-40 object-cover rounded mb-4" />
              )}
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-lg">{location.name}</h3>
                  <Badge variant={location.status === 'active' ? 'default' : 'secondary'}>
                    {location.status}
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-600">{location.cuisine_type}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="w-4 h-4 mr-1" />
                  {location.city}
                </div>
                
                <div className="flex justify-end space-x-2 mt-4">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(location)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(location.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {locations.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <MapPin className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No locations yet</h3>
            <p className="text-gray-500 mb-4">Get started by adding your first business location.</p>
            <Button onClick={() => setShowAddForm(true)}>Add First Location</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
