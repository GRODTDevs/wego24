
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User, Car, Phone, Mail, MapPin, Edit3, Save, X } from "lucide-react";

interface DriverProfileSectionProps {
  driverData: any;
  onUpdate: () => void;
}

/**
 * Driver Profile Management Section
 * 
 * Allows drivers to view and edit their profile information including:
 * - Personal details
 * - Vehicle information
 * - Contact information
 * - Emergency contacts
 */
export function DriverProfileSection({ driverData, onUpdate }: DriverProfileSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: driverData.first_name || '',
    last_name: driverData.last_name || '',
    email: driverData.email || '',
    phone: driverData.phone || '',
    address: driverData.address || '',
    city: driverData.city || '',
    postal_code: driverData.postal_code || '',
    vehicle_type: driverData.vehicle_type || '',
    emergency_contact_name: driverData.emergency_contact_name || '',
    emergency_contact_phone: driverData.emergency_contact_phone || '',
    vehicle_info: driverData.vehicle_info || {}
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleVehicleInfoChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      vehicle_info: { ...prev.vehicle_info, [field]: value }
    }));
  };

  /**
   * Saves profile changes to the database
   */
  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("drivers")
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          postal_code: formData.postal_code,
          vehicle_type: formData.vehicle_type,
          emergency_contact_name: formData.emergency_contact_name,
          emergency_contact_phone: formData.emergency_contact_phone,
          vehicle_info: formData.vehicle_info,
          updated_at: new Date().toISOString()
        })
        .eq("id", driverData.id);

      if (error) throw error;

      toast.success("Profile updated successfully");
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      first_name: driverData.first_name || '',
      last_name: driverData.last_name || '',
      email: driverData.email || '',
      phone: driverData.phone || '',
      address: driverData.address || '',
      city: driverData.city || '',
      postal_code: driverData.postal_code || '',
      vehicle_type: driverData.vehicle_type || '',
      emergency_contact_name: driverData.emergency_contact_name || '',
      emergency_contact_phone: driverData.emergency_contact_phone || '',
      vehicle_info: driverData.vehicle_info || {}
    });
    setIsEditing(false);
  };

  return (
    <div className="grid gap-6">
      {/* Personal Information */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5" />
            <CardTitle>Personal Information</CardTitle>
          </div>
          {!isEditing ? (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              <Edit3 className="w-4 h-4 mr-2" />
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSave} disabled={loading}>
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" size="sm" onClick={handleCancel}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="first_name">First Name</Label>
              {isEditing ? (
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => handleInputChange('first_name', e.target.value)}
                />
              ) : (
                <p className="mt-1 text-gray-900">{formData.first_name || 'Not provided'}</p>
              )}
            </div>
            <div>
              <Label htmlFor="last_name">Last Name</Label>
              {isEditing ? (
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => handleInputChange('last_name', e.target.value)}
                />
              ) : (
                <p className="mt-1 text-gray-900">{formData.last_name || 'Not provided'}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              {isEditing ? (
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              ) : (
                <p className="mt-1 text-gray-900">{formData.email || 'Not provided'}</p>
              )}
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              {isEditing ? (
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              ) : (
                <p className="mt-1 text-gray-900">{formData.phone || 'Not provided'}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            {isEditing ? (
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
              />
            ) : (
              <p className="mt-1 text-gray-900">{formData.address || 'Not provided'}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              {isEditing ? (
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                />
              ) : (
                <p className="mt-1 text-gray-900">{formData.city || 'Not provided'}</p>
              )}
            </div>
            <div>
              <Label htmlFor="postal_code">Postal Code</Label>
              {isEditing ? (
                <Input
                  id="postal_code"
                  value={formData.postal_code}
                  onChange={(e) => handleInputChange('postal_code', e.target.value)}
                />
              ) : (
                <p className="mt-1 text-gray-900">{formData.postal_code || 'Not provided'}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Car className="w-5 h-5" />
            <CardTitle>Vehicle Information</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="vehicle_type">Vehicle Type</Label>
            {isEditing ? (
              <Select value={formData.vehicle_type} onValueChange={(value) => handleInputChange('vehicle_type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select vehicle type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="car">Car</SelectItem>
                  <SelectItem value="motorcycle">Motorcycle</SelectItem>
                  <SelectItem value="bicycle">Bicycle</SelectItem>
                  <SelectItem value="van">Van</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <p className="mt-1 text-gray-900 capitalize">{formData.vehicle_type || 'Not provided'}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="vehicle_make">Vehicle Make</Label>
              {isEditing ? (
                <Input
                  id="vehicle_make"
                  value={formData.vehicle_info?.make || ''}
                  onChange={(e) => handleVehicleInfoChange('make', e.target.value)}
                />
              ) : (
                <p className="mt-1 text-gray-900">{formData.vehicle_info?.make || 'Not provided'}</p>
              )}
            </div>
            <div>
              <Label htmlFor="vehicle_model">Vehicle Model</Label>
              {isEditing ? (
                <Input
                  id="vehicle_model"
                  value={formData.vehicle_info?.model || ''}
                  onChange={(e) => handleVehicleInfoChange('model', e.target.value)}
                />
              ) : (
                <p className="mt-1 text-gray-900">{formData.vehicle_info?.model || 'Not provided'}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="vehicle_year">Vehicle Year</Label>
              {isEditing ? (
                <Input
                  id="vehicle_year"
                  value={formData.vehicle_info?.year || ''}
                  onChange={(e) => handleVehicleInfoChange('year', e.target.value)}
                />
              ) : (
                <p className="mt-1 text-gray-900">{formData.vehicle_info?.year || 'Not provided'}</p>
              )}
            </div>
            <div>
              <Label htmlFor="license_plate">License Plate</Label>
              {isEditing ? (
                <Input
                  id="license_plate"
                  value={formData.vehicle_info?.licensePlate || ''}
                  onChange={(e) => handleVehicleInfoChange('licensePlate', e.target.value)}
                />
              ) : (
                <p className="mt-1 text-gray-900">{formData.vehicle_info?.licensePlate || 'Not provided'}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contact */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            <CardTitle>Emergency Contact</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="emergency_name">Contact Name</Label>
              {isEditing ? (
                <Input
                  id="emergency_name"
                  value={formData.emergency_contact_name}
                  onChange={(e) => handleInputChange('emergency_contact_name', e.target.value)}
                />
              ) : (
                <p className="mt-1 text-gray-900">{formData.emergency_contact_name || 'Not provided'}</p>
              )}
            </div>
            <div>
              <Label htmlFor="emergency_phone">Contact Phone</Label>
              {isEditing ? (
                <Input
                  id="emergency_phone"
                  value={formData.emergency_contact_phone}
                  onChange={(e) => handleInputChange('emergency_contact_phone', e.target.value)}
                />
              ) : (
                <p className="mt-1 text-gray-900">{formData.emergency_contact_phone || 'Not provided'}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
