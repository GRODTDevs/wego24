import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "@/contexts/TranslationContext";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { Building2, Package, Settings, BarChart3 } from "lucide-react";
import { toast } from "sonner";
import { errorLogger, withErrorLogging } from "@/utils/errorLogger";
import { MenuManagement } from "@/components/MenuManagement";
import { OrderManagement } from "@/components/OrderManagement";
import { CommissionManagement } from "@/components/CommissionManagement";
import { BusinessMetrics } from "@/components/dashboard/BusinessMetrics";
import { RevenueProgress } from "@/components/dashboard/RevenueProgress";

type Restaurant = Tables<"restaurants">;
type PartnerApplication = Tables<"partner_applications">;

export default function PartnerDashboard() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [application, setApplication] = useState<PartnerApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [orderCount, setOrderCount] = useState<number>(0);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);

  // Move fetchPartnerData outside of useEffect so it's in scope
  const fetchPartnerData = async () => {
    try {
      // First check if user has a restaurant
      const { data: restaurantUsers, error: restaurantError } = await supabase
        .from("restaurant_users")
        .select(`
          restaurant_id,
          restaurants (*)
        `)
        .eq("user_id", user?.id)
        .eq("is_active", true);

      if (restaurantError) {
        throw restaurantError;
      }

      if (restaurantUsers && restaurantUsers.length > 0 && restaurantUsers[0].restaurants) {
        // Fix: restaurantUsers[0].restaurants may be an array, so use first element if so
        const restaurantData = Array.isArray(restaurantUsers[0].restaurants)
          ? restaurantUsers[0].restaurants[0]
          : restaurantUsers[0].restaurants;
        setRestaurant(restaurantData as Restaurant);

        // Fetch order count and total revenue for this restaurant
        if (restaurantData && restaurantData.id) {
          // Fetch order count
          const { count: ordersCount, error: ordersError } = await supabase
            .from("orders")
            .select("*", { count: "exact", head: true })
            .eq("restaurant_id", restaurantData.id);
          if (!ordersError && typeof ordersCount === "number") {
            setOrderCount(ordersCount);
          } else {
            setOrderCount(0);
          }

          // Fetch total revenue
          const { data: revenueData, error: revenueError } = await supabase
            .from("orders")
            .select("total")
            .eq("restaurant_id", restaurantData.id);
          if (!revenueError && Array.isArray(revenueData)) {
            const revenue = revenueData.reduce((sum, order) => sum + (order.total || 0), 0);
            setTotalRevenue(revenue);
          } else {
            setTotalRevenue(0);
          }
        }
      } else {
        // Check for partner application
        const { data: appData, error: appError } = await supabase
          .from("partner_applications")
          .select("*")
          .eq("user_id", user?.id)
          .order("created_at", { ascending: false })
          .limit(1);

        if (appError) {
          throw appError;
        }
        if (appData && appData.length > 0) {
          setApplication(appData[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching partner data:", error);
      toast.error("Failed to load partner data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    withErrorLogging(async () => {
      if (user) {
        fetchPartnerData();
      }
    });
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <main className="flex-1 bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // If user has no restaurant and no application, redirect to register
  if (!restaurant && !application) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <main className="flex-1 bg-gray-50 p-6">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-8 text-center">
                <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-4">No Partner Account Found</h2>
                <p className="text-gray-600 mb-6">
                  You don't have a partner account yet. Apply to become a partner to access this dashboard.
                </p>
                <a
                  href="/partner-register"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-500 to-orange-400 text-white font-medium rounded-lg hover:from-orange-400 hover:to-red-500 transition-colors"
                >
                  Apply to Become a Partner
                </a>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // If application exists but not approved yet
  if (application && !restaurant) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <main className="flex-1 bg-gray-50 p-6">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Partner Application Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-medium">Status:</span>
                  <Badge className={getStatusColor(application.status)}>
                    {application.status}
                  </Badge>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Application Details</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Business Name:</span>
                      <p>{application.business_name}</p>
                    </div>
                    <div>
                      <span className="font-medium">Business Type:</span>
                      <p>{application.business_type}</p>
                    </div>
                    <div>
                      <span className="font-medium">Applied:</span>
                      <p>{new Date(application.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {application.status === "pending" && (
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-yellow-900 mb-2">Under Review</h3>
                    <p className="text-yellow-800">
                      Your application is currently being reviewed by our team. 
                      We'll notify you once a decision has been made. This typically takes 2-3 business days.
                    </p>
                  </div>
                )}

                {application.status === "rejected" && (
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-red-900 mb-2">Application Rejected</h3>
                    <p className="text-red-800 mb-2">
                      Unfortunately, your application was not approved at this time.
                    </p>
                    {application.rejection_reason && (
                      <div>
                        <span className="font-medium">Reason:</span>
                        <p className="text-sm">{application.rejection_reason}</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Partner dashboard for approved partners
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <ProtectedRoute>
        <main className="flex-1 bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Partner Dashboard</h1>
              <p className="text-gray-600 mt-2">Welcome back! Manage your business here.</p>
            </div>

            {/* Restaurant Info Card */}
            {restaurant && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-5 h-5" />
                      {restaurant.name}
                    </div>
                    <Badge className={getStatusColor(restaurant.status || "pending")}>
                      {restaurant.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Cuisine Type</span>
                      <p>{restaurant.cuisine_type || "Not specified"}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">City</span>
                      <p>{restaurant.city}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Commission Rate</span>
                      <p>{restaurant.commission_rate}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Management Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="products" className="flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Products
                </TabsTrigger>
                <TabsTrigger value="orders" className="flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Orders
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Settings
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <BusinessMetrics
                  stats={{
                    totalOrders: orderCount,
                    totalRevenue: totalRevenue,
                    activeLocations: 1, // Replace with real data if available
                    activeDrivers: 0,   // Replace with real data if available
                    totalUsers: 0       // Replace with real data if available
                  }}
                  loading={false}
                  />
                  <RevenueProgress currentRevenue={totalRevenue} />
                </div>
                <CommissionManagement />
              </TabsContent>

              <TabsContent value="products">
                {restaurant && (
                  <MenuManagement businessId={restaurant.id} />
                )}
              </TabsContent>

              <TabsContent value="orders">
                {restaurant && (
                  <OrderManagement businessId={restaurant.id} />
                )}
              </TabsContent>

              <TabsContent value="settings">
                <div className="text-gray-600">Restaurant settings and configuration options will be available here.</div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </ProtectedRoute>
      <Footer />
    </div>
  );
}
