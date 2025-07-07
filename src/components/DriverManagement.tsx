import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Car, Search, Star, MapPin, Phone } from "lucide-react";
import type { Database } from "@/integrations/supabase/database.types";

export function DriverManagement() {
  const { user } = useAuth();
  const [drivers, setDrivers] = useState<Database["public"]["Tables"]["drivers"]["Row"][]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const { data, error } = await supabase
        .from("drivers")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setDrivers(data || []);
    } catch (error) {
      console.error("Error fetching drivers:", error);
      toast.error("Failed to load drivers");
    } finally {
      setLoading(false);
    }
  };

  const toggleDriverStatus = async (driverId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("drivers")
        .update({ is_active: !currentStatus })
        .eq("id", driverId);

      if (error) throw error;
      toast.success("Driver status updated successfully");
      fetchDrivers();
    } catch (error) {
      console.error("Error updating driver status:", error);
      toast.error("Failed to update driver status");
    }
  };

  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = driver.license_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         driver.vehicle_type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === "all" || 
                         (filterStatus === "active" && driver.is_active) ||
                         (filterStatus === "available" && driver.is_available) ||
                         (filterStatus === "inactive" && !driver.is_active);

    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading drivers...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Car className="w-5 h-5" />
          <h2 className="text-xl font-semibold">Driver Management</h2>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search by license number or vehicle type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Drivers</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Drivers Grid */}
      <div className="grid gap-4">
        {filteredDrivers.map((driver) => (
          <Card key={driver.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Car className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">Driver #{driver.id.slice(-8)}</h3>
                      <Badge variant={driver.is_active ? "default" : "secondary"}>
                        {driver.is_active ? "Active" : "Inactive"}
                      </Badge>
                      {driver.is_available && driver.is_active && (
                        <Badge className="bg-green-100 text-green-800">Available</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                      <span className="capitalize">{driver.vehicle_type}</span>
                      {driver.license_number && (
                        <span>License: {driver.license_number}</span>
                      )}
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span>{driver.rating.toFixed(1)}</span>
                      </div>
                      <span>{driver.total_deliveries} deliveries</span>
                    </div>
                    {driver.current_location && (
                      <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
                        <MapPin className="w-4 h-4" />
                        <span>Location available</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleDriverStatus(driver.id, driver.is_active)}
                  >
                    {driver.is_active ? "Deactivate" : "Activate"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDrivers.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Car className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No drivers found</h3>
            <p className="text-gray-600">
              {drivers.length === 0 
                ? "No drivers have registered yet" 
                : "No drivers match your current filters"
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
