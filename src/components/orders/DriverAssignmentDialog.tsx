import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Driver {
  id: string;
  user_id: string;
  vehicle_type: string;
  is_available: boolean;
  rating: number;
  profiles: {
    first_name: string;
    last_name: string;
    phone: string;
  } | null;
}

interface DriverAssignmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
  onAssignDriver?: (orderId: string, driverId: string) => void;
}

export function DriverAssignmentDialog({
  open,
  onOpenChange,
  orderId,
  onAssignDriver
}: DriverAssignmentDialogProps) {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      fetchAvailableDrivers();
    }
  }, [open]);

  const fetchAvailableDrivers = async () => {
    try {
      // Get drivers first
      const { data: driversData, error: driversError } = await supabase
        .from('drivers')
        .select('id, user_id, vehicle_type, is_available, rating')
        .eq('is_active', true)
        .eq('is_available', true);

      if (driversError) throw driversError;

      if (!driversData || driversData.length === 0) {
        setDrivers([]);
        return;
      }

      // Get profiles for each driver
      const driverIds = driversData.map(d => d.user_id).filter(Boolean);
      
      let profilesData: any[] = [];
      if (driverIds.length > 0) {
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, phone')
          .in('id', driverIds);
        
        if (!profilesError) {
          profilesData = profiles || [];
        }
      }

      // Combine drivers with their profiles
      const driversWithProfiles = driversData.map(driver => ({
        ...driver,
        profiles: profilesData.find(p => p.id === driver.user_id) || null
      }));

      setDrivers(driversWithProfiles);
    } catch (error) {
      console.error('Error fetching drivers:', error);
      toast.error('Failed to load available drivers');
      setDrivers([]);
    }
  };

  const handleAssign = async () => {
    if (!selectedDriver) {
      toast.error('Please select a driver');
      return;
    }

    setLoading(true);
    try {
      if (onAssignDriver) {
        await onAssignDriver(orderId, selectedDriver);
        
        // Update driver availability
        await supabase
          .from('drivers')
          .update({ is_available: false })
          .eq('id', selectedDriver);
          
        toast.success('Driver assigned successfully');
        onOpenChange(false);
        setSelectedDriver("");
      }
    } catch (error) {
      console.error('Error assigning driver:', error);
      toast.error('Failed to assign driver. Please try again or check driver status.');
    } finally {
      setLoading(false);
    }
  };

  console.log('[DriverAssignmentDialog] props:', { open, onOpenChange, orderId, selectedDriver, loading, drivers });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Driver</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Available Drivers</label>
            <Select value={selectedDriver} onValueChange={setSelectedDriver}>
              <SelectTrigger>
                <SelectValue placeholder="Select a driver" />
              </SelectTrigger>
              <SelectContent>
                {drivers.map((driver) => (
                  <SelectItem key={driver.id} value={driver.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>
                        {driver.profiles?.first_name && driver.profiles?.last_name 
                          ? `${driver.profiles.first_name} ${driver.profiles.last_name}`
                          : `Driver ${driver.id.slice(0, 8)}`
                        }
                      </span>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{driver.vehicle_type}</span>
                        <span>★ {driver.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {drivers.length === 0 && (
            <p className="text-sm text-gray-500">
              No available drivers at the moment
            </p>
          )}

          <div className="flex gap-2">
            <Button
              onClick={handleAssign}
              disabled={!selectedDriver || loading}
              className="flex-1"
            >
              {loading ? 'Assigning...' : 'Assign Driver'}
            </Button>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
