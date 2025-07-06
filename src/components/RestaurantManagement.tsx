
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Building2, MapPin, Clock, Euro, Settings } from "lucide-react";

interface Business {
  id: string;
  name: string;
  description: string;
  cuisine_type: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postal_code: string;
  country: string;
  image_url: string;
  banner_url: string;
  is_delivery_available: boolean;
  is_pickup_available: boolean;
  delivery_fee: number;
  minimum_order_amount: number;
  delivery_time_min: number;
  delivery_time_max: number;
  status: string;
  operating_hours: any;
}

interface BusinessManagementProps {
  businessId: string;
}

export function BusinessManagement({ businessId }: BusinessManagementProps) {
  const { user } = useAuth();
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
    image_url: "",
    banner_url: "",
    is_delivery_available: true,
    is_pickup_available: true,
    delivery_fee: "0",
    minimum_order_amount: "0",
    delivery_time_min: "30",
    delivery_time_max: "60"
  });

  useEffect(() => {
    if (businessId) {
      fetchBusiness();
    }
  }, [businessId]);

  const fetchBusiness = async () => {
    try {
      const { data, error } = await supabase
        .from("restaurants")
        .select("*")
        .eq("id", businessId)
        .single();

      if (error) throw error;

      setBusiness(data);
      setFormData({
        name: data.name || "",
        description: data.description || "",
        cuisine_type: data.cuisine_type || "",
        email: data.email || "",
        phone: data.phone || "",
        address: data.address || "",
        city: data.city || "",
        postal_code: data.postal_code || "",
        country: data.country || "Spain",
        image_url: data.image_url || "",
        banner_url: data.banner_url || "",
        is_delivery_available: data.is_delivery_available ?? true,
        is_pickup_available: data.is_pickup_available ?? true,
        delivery_fee: data.delivery_fee?.toString() || "0",
        minimum_order_amount: data.minimum_order_amount?.toString() || "0",
        delivery_time_min: data.delivery_time_min?.toString() || "30",
        delivery_time_max: data.delivery_time_max?.toString() || "60"
      });
    } catch (error) {
      console.error("Error fetching business:", error);
      toast.error("Failed to load business information");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const updateData = {
        name: formData.name,
        description: formData.description,
        cuisine_type: formData.cuisine_type,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        postal_code: formData.postal_code,
        country: formData.country,
        image_url: formData.image_url || null,
        banner_url: formData.banner_url || null,
        is_delivery_available: formData.is_delivery_available,
        is_pickup_available: formData.is_pickup_available,
        delivery_fee: parseFloat(formData.delivery_fee),
        minimum_order_amount: parseFloat(formData.minimum_order_amount),
        delivery_time_min: parseInt(formData.delivery_time_min),
        delivery_time_max: parseInt(formData.delivery_time_max),
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from("restaurants")
        .update(updateData)
        .eq("id", businessId);

      if (error) throw error;

      toast.success("Business information updated successfully");
      fetchBusiness();
    } catch (error) {
      console.error("Error updating business:", error);
      toast.error("Failed to update business information");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading business information...</div>;
  }

  if (!business) {
    return <div className="text-center p-8">Business not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Building2 className="w-5 h-5" />
        <h2 className="text-xl font-semibold">Business Management</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Business Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="cuisine_type">Business Type</Label>
                <Select value={formData.cuisine_type} onValueChange={(value) => setFormData({ ...formData, cuisine_type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select business type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="restaurant">Restaurant</SelectItem>
                    <SelectItem value="cafe">Café</SelectItem>
                    <SelectItem value="bakery">Bakery</SelectItem>
                    <SelectItem value="fast_food">Fast Food</SelectItem>
                    <SelectItem value="grocery">Grocery Store</SelectItem>
                    <SelectItem value="pharmacy">Pharmacy</SelectItem>
                    <SelectItem value="retail">Retail Store</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                placeholder="Describe your business..."
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="image_url">Logo URL</Label>
                <Input
                  id="image_url"
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="banner_url">Banner Image URL</Label>
                <Input
                  id="banner_url"
                  type="url"
                  value={formData.banner_url}
                  onChange={(e) => setFormData({ ...formData, banner_url: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Contact & Location
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="postal_code">Postal Code</Label>
                <Input
                  id="postal_code"
                  value={formData.postal_code}
                  onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Select value={formData.country} onValueChange={(value) => setFormData({ ...formData, country: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Spain">Spain</SelectItem>
                    <SelectItem value="Germany">Germany</SelectItem>
                    <SelectItem value="France">France</SelectItem>
                    <SelectItem value="Italy">Italy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Service Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Service Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="delivery">Delivery Service</Label>
                  <p className="text-sm text-gray-600">Enable delivery for customers</p>
                </div>
                <Switch
                  id="delivery"
                  checked={formData.is_delivery_available}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_delivery_available: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="pickup">Pickup Service</Label>
                  <p className="text-sm text-gray-600">Enable pickup for customers</p>
                </div>
                <Switch
                  id="pickup"
                  checked={formData.is_pickup_available}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_pickup_available: checked })}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="delivery_fee">Delivery Fee (€)</Label>
                <Input
                  id="delivery_fee"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.delivery_fee}
                  onChange={(e) => setFormData({ ...formData, delivery_fee: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="minimum_order">Minimum Order Amount (€)</Label>
                <Input
                  id="minimum_order"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.minimum_order_amount}
                  onChange={(e) => setFormData({ ...formData, minimum_order_amount: e.target.value })}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="delivery_min">Min Delivery Time (minutes)</Label>
                <Input
                  id="delivery_min"
                  type="number"
                  min="1"
                  value={formData.delivery_time_min}
                  onChange={(e) => setFormData({ ...formData, delivery_time_min: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="delivery_max">Max Delivery Time (minutes)</Label>
                <Input
                  id="delivery_max"
                  type="number"
                  min="1"
                  value={formData.delivery_time_max}
                  onChange={(e) => setFormData({ ...formData, delivery_time_max: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
