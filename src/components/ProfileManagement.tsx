
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User, Mail, Phone, MapPin, Clock, Save } from "lucide-react";

export function ProfileManagement() {
  const [profile, setProfile] = useState({
    restaurantName: "Bella Italia",
    ownerName: "Marco Rossi",
    email: "marco@bellaitalia.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main Street, Downtown, City Center",
    description: "Authentic Italian cuisine with fresh ingredients and traditional recipes.",
    openingHours: {
      monday: "11:00 AM - 10:00 PM",
      tuesday: "11:00 AM - 10:00 PM",
      wednesday: "11:00 AM - 10:00 PM",
      thursday: "11:00 AM - 10:00 PM",
      friday: "11:00 AM - 11:00 PM",
      saturday: "12:00 PM - 11:00 PM",
      sunday: "12:00 PM - 9:00 PM",
    }
  });

  const handleSave = () => {
    console.log("Profile saved:", profile);
    // Here you would typically save to a database
  };

  const handleInputChange = (field: string, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleHoursChange = (day: string, value: string) => {
    setProfile(prev => ({
      ...prev,
      openingHours: {
        ...prev.openingHours,
        [day]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      <section className="bg-orange-50 rounded-xl shadow p-6">
        <h2 className="text-xl font-bold mb-4 text-orange-600 flex items-center gap-2">
          <User className="w-5 h-5" />
          Restaurant Profile
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="restaurantName">Restaurant Name</Label>
                <Input
                  id="restaurantName"
                  value={profile.restaurantName}
                  onChange={(e) => handleInputChange("restaurantName", e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="ownerName">Owner Name</Label>
                <Input
                  id="ownerName"
                  value={profile.ownerName}
                  onChange={(e) => handleInputChange("ownerName", e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="email" className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="phone" className="flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  Phone
                </Label>
                <Input
                  id="phone"
                  value={profile.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="address" className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  Address
                </Label>
                <Textarea
                  id="address"
                  value={profile.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  rows={2}
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={profile.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Opening Hours
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(profile.openingHours).map(([day, hours]) => (
                <div key={day}>
                  <Label htmlFor={day} className="capitalize">{day}</Label>
                  <Input
                    id={day}
                    value={hours}
                    onChange={(e) => handleHoursChange(day, e.target.value)}
                    placeholder="e.g., 9:00 AM - 9:00 PM"
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-6">
          <Button 
            onClick={handleSave}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Profile
          </Button>
        </div>
      </section>
    </div>
  );
}
