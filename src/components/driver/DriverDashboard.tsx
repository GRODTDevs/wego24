import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useSystemSettings } from "@/contexts/SystemSettingsContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loading } from "@/components/ui/loading";
import { 
  Car, 
  Star, 
  TrendingUp, 
  FileText,
  DollarSign,
  Activity
} from "lucide-react";
import { DriverProfileSection } from "./dashboard/DriverProfileSection";
import { DriverPerformanceSection } from "./dashboard/DriverPerformanceSection";
import { DriverDocumentsSection } from "./dashboard/DriverDocumentsSection";
import { DriverEarningsSection } from "./dashboard/DriverEarningsSection";
import { DriverSchedulingSection } from "./dashboard/DriverSchedulingSection";
import { DriverFeedbackSection } from "./dashboard/DriverFeedbackSection";

interface DriverData {
  id: string;
  user_id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  vehicle_type: string;
  vehicle_info?: any;
  is_active: boolean;
  is_available: boolean;
  rating: number;
  total_deliveries: number;
  registration_status: string;
  background_check_status: string;
  created_at: string;
}

export function DriverDashboard() {
  const { user } = useAuth();
  const { settings } = useSystemSettings();
  const [driverData, setDriverData] = useState<DriverData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    if (user) {
      fetchDriverData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchDriverData = async () => {
    try {
      console.log('Fetching driver data for user:', user?.id);
      const { data, error } = await supabase
        .from("drivers")
        .select("*")
        .eq("user_id", user?.id)
        .single();

      if (error) {
        console.error('Driver data fetch error:', error);
        if (error.code === 'PGRST116') {
          console.log('No driver profile found');
          setDriverData(null);
        } else {
          throw error;
        }
      } else {
        console.log('Driver data fetched:', data);
        setDriverData(data);
        setIsOnline(data.is_available);
      }
    } catch (error) {
      console.error("Error fetching driver data:", error);
      toast.error("Failed to load driver profile");
    } finally {
      setLoading(false);
    }
  };

  const toggleOnlineStatus = async () => {
    if (!driverData) return;

    try {
      const newStatus = !isOnline;
      const { error } = await supabase
        .from("drivers")
        .update({ is_available: newStatus })
        .eq("id", driverData.id);

      if (error) throw error;

      setIsOnline(newStatus);
      toast.success(`You are now ${newStatus ? 'online' : 'offline'}`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Loading text="Loading dashboard..." />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <Car className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Please Sign In</h2>
          <p className="text-gray-600 mb-4">You need to sign in to access the driver dashboard</p>
          <Button onClick={() => window.location.href = '/auth'}>
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  if (!driverData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <Car className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Driver Profile Not Found</h2>
          <p className="text-gray-600 mb-4">
            Complete your driver registration to access the dashboard
          </p>
          <Button onClick={() => window.location.href = '/driver-registration'}>
            Complete Registration
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Driver Dashboard
              </h1>
              <p className="text-gray-600">
                Welcome back, {driverData.first_name || 'Driver'}!
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                <span className="text-sm font-medium">
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
              <Button
                onClick={toggleOnlineStatus}
                variant={isOnline ? "outline" : "default"}
                className="min-w-[100px]"
              >
                {isOnline ? 'Go Offline' : 'Go Online'}
              </Button>
            </div>
          </div>

          {/* Status Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <div>
                    <p className="text-sm text-gray-600">Rating</p>
                    <p className="font-semibold">{driverData.rating?.toFixed(1) || '0.0'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-600">Deliveries</p>
                    <p className="font-semibold">{driverData.total_deliveries || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <Badge variant={driverData.is_active ? "default" : "secondary"}>
                      {driverData.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-500" />
                  <div>
                    <p className="text-sm text-gray-600">Registration</p>
                    <Badge variant={driverData.registration_status === 'approved' ? "default" : "secondary"}>
                      {driverData.registration_status || 'pending'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
            <TabsTrigger value="scheduling">Scheduling</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">32</p>
                      <p className="text-sm text-gray-600">Hours This Week</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">€245</p>
                      <p className="text-sm text-gray-600">Earnings This Week</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <p className="text-2xl font-bold text-purple-600">98%</p>
                      <p className="text-sm text-gray-600">Completion Rate</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="profile" className="mt-6">
            <DriverProfileSection driverData={driverData} onUpdate={fetchDriverData} />
          </TabsContent>

          <TabsContent value="performance" className="mt-6">
            <DriverPerformanceSection driverId={driverData.id} />
          </TabsContent>

          <TabsContent value="documents" className="mt-6">
            <DriverDocumentsSection driverId={driverData.id} />
          </TabsContent>

          <TabsContent value="earnings" className="mt-6">
            <DriverEarningsSection driverId={driverData.id} />
          </TabsContent>

          <TabsContent value="scheduling" className="mt-6">
            <DriverSchedulingSection driverId={driverData.id} />
          </TabsContent>
          <TabsContent value="feedback" className="mt-6">
            <DriverFeedbackSection driverId={driverData.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
