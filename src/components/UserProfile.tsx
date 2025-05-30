
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Phone, MapPin, Calendar, Settings, Plus, X } from "lucide-react";

interface UserProfileData {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  date_of_birth: string | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  country: string | null;
  preferred_language: string | null;
  phone_verified: boolean | null;
  email_notifications: boolean | null;
  sms_notifications: boolean | null;
  marketing_emails: boolean | null;
  dietary_preferences: string[] | null;
  allergies: string[] | null;
  delivery_instructions: string | null;
  is_active: boolean | null;
}

export function UserProfile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [newDietaryPreference, setNewDietaryPreference] = useState("");
  const [newAllergy, setNewAllergy] = useState("");

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        toast({ title: "Error loading profile", description: error.message, variant: "destructive" });
        return;
      }

      setProfile(data);
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    if (!user || !profile) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: profile.first_name,
          last_name: profile.last_name,
          phone: profile.phone,
          date_of_birth: profile.date_of_birth,
          address: profile.address,
          city: profile.city,
          postal_code: profile.postal_code,
          country: profile.country,
          preferred_language: profile.preferred_language,
          email_notifications: profile.email_notifications,
          sms_notifications: profile.sms_notifications,
          marketing_emails: profile.marketing_emails,
          dietary_preferences: profile.dietary_preferences,
          allergies: profile.allergies,
          delivery_instructions: profile.delivery_instructions,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) {
        toast({ title: "Error updating profile", description: error.message, variant: "destructive" });
        return;
      }

      toast({ title: "Profile updated successfully!", description: "Your changes have been saved." });
    } catch (err) {
      toast({ title: "Error", description: "An unexpected error occurred.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const addDietaryPreference = () => {
    if (newDietaryPreference.trim() && profile) {
      const currentPrefs = profile.dietary_preferences || [];
      if (!currentPrefs.includes(newDietaryPreference.trim())) {
        setProfile({
          ...profile,
          dietary_preferences: [...currentPrefs, newDietaryPreference.trim()]
        });
      }
      setNewDietaryPreference("");
    }
  };

  const removeDietaryPreference = (pref: string) => {
    if (profile) {
      setProfile({
        ...profile,
        dietary_preferences: (profile.dietary_preferences || []).filter(p => p !== pref)
      });
    }
  };

  const addAllergy = () => {
    if (newAllergy.trim() && profile) {
      const currentAllergies = profile.allergies || [];
      if (!currentAllergies.includes(newAllergy.trim())) {
        setProfile({
          ...profile,
          allergies: [...currentAllergies, newAllergy.trim()]
        });
      }
      setNewAllergy("");
    }
  };

  const removeAllergy = (allergy: string) => {
    if (profile) {
      setProfile({
        ...profile,
        allergies: (profile.allergies || []).filter(a => a !== allergy)
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600">Profile not found. Please try refreshing the page.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={profile.first_name || ""}
                onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={profile.last_name || ""}
                onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email" className="flex items-center gap-1">
                <Mail className="w-4 h-4" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={profile.email || ""}
                disabled
                className="bg-gray-50"
              />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed here</p>
            </div>
            <div>
              <Label htmlFor="phone" className="flex items-center gap-1">
                <Phone className="w-4 h-4" />
                Phone
              </Label>
              <Input
                id="phone"
                value={profile.phone || ""}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="dateOfBirth" className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Date of Birth
            </Label>
            <Input
              id="dateOfBirth"
              type="date"
              value={profile.date_of_birth || ""}
              onChange={(e) => setProfile({ ...profile, date_of_birth: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Address Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="address">Street Address</Label>
            <Textarea
              id="address"
              value={profile.address || ""}
              onChange={(e) => setProfile({ ...profile, address: e.target.value })}
              rows={2}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={profile.city || ""}
                onChange={(e) => setProfile({ ...profile, city: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input
                id="postalCode"
                value={profile.postal_code || ""}
                onChange={(e) => setProfile({ ...profile, postal_code: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={profile.country || ""}
                onChange={(e) => setProfile({ ...profile, country: e.target.value })}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="deliveryInstructions">Delivery Instructions</Label>
            <Textarea
              id="deliveryInstructions"
              value={profile.delivery_instructions || ""}
              onChange={(e) => setProfile({ ...profile, delivery_instructions: e.target.value })}
              placeholder="Special instructions for delivery (e.g., gate code, apartment number)"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Preferences & Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-medium mb-3">Dietary Preferences</h4>
            <div className="flex flex-wrap gap-2 mb-3">
              {(profile.dietary_preferences || []).map((pref) => (
                <Badge key={pref} variant="secondary" className="flex items-center gap-1">
                  {pref}
                  <button
                    onClick={() => removeDietaryPreference(pref)}
                    className="ml-1 hover:text-red-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add dietary preference (e.g., Vegetarian, Vegan)"
                value={newDietaryPreference}
                onChange={(e) => setNewDietaryPreference(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addDietaryPreference()}
              />
              <Button onClick={addDietaryPreference} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-3">Allergies</h4>
            <div className="flex flex-wrap gap-2 mb-3">
              {(profile.allergies || []).map((allergy) => (
                <Badge key={allergy} variant="destructive" className="flex items-center gap-1">
                  {allergy}
                  <button
                    onClick={() => removeAllergy(allergy)}
                    className="ml-1 hover:text-red-300"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add allergy (e.g., Nuts, Dairy, Gluten)"
                value={newAllergy}
                onChange={(e) => setNewAllergy(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addAllergy()}
              />
              <Button onClick={addAllergy} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-medium">Notification Preferences</h4>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="emailNotifications"
                checked={profile.email_notifications || false}
                onCheckedChange={(checked) => setProfile({ ...profile, email_notifications: !!checked })}
              />
              <Label htmlFor="emailNotifications">Email notifications</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="smsNotifications"
                checked={profile.sms_notifications || false}
                onCheckedChange={(checked) => setProfile({ ...profile, sms_notifications: !!checked })}
              />
              <Label htmlFor="smsNotifications">SMS notifications</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="marketingEmails"
                checked={profile.marketing_emails || false}
                onCheckedChange={(checked) => setProfile({ ...profile, marketing_emails: !!checked })}
              />
              <Label htmlFor="marketingEmails">Marketing emails</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={updateProfile}
          disabled={saving}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white"
        >
          {saving ? "Saving..." : "Save Profile"}
        </Button>
      </div>
    </div>
  );
}
