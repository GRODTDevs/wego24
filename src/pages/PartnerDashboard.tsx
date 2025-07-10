import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "@/contexts/TranslationContext";
import { Tables } from "@/integrations/supabase/types";
import { Building2, Package, Settings, BarChart3 } from "lucide-react";
import { toast } from "sonner";
import { errorLogger, withErrorLogging } from "@/utils/errorLogger";
import { MenuManagement } from "@/components/MenuManagement";
import { OrderManagement } from "@/components/OrderManagement";
import { CommissionManagement } from "@/components/CommissionManagement";
import { BusinessMetrics } from "@/components/dashboard/BusinessMetrics";
import { RevenueProgress } from "@/components/dashboard/RevenueProgress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useSystemSettings } from "@/contexts/SystemSettingsContext";

type Restaurant = Tables<"restaurants">;
type PartnerApplication = Tables<"partner_applications">;

export default function PartnerDashboard() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { partnerId } = useParams();
  const [partner, setPartner] = useState<any>(null);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [application, setApplication] = useState<PartnerApplication | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [orderCount, setOrderCount] = useState<number>(0);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [restaurantSettings, setRestaurantSettings] = useState<any>(null);
  const { settings, loading: settingsLoading } = useSystemSettings();

  const fetchPartnerData = async () => {
    try {
      setLoading(true);
      setError(null);
      if (partnerId) {
        // Admin/operations view: load partner and their restaurant by partnerId
        const { data: partnerData, error: partnerError } = await supabase
          .from("partners")
          .select("*", { count: "exact" })
          .eq("id", partnerId)
          .single();
        if (partnerError) throw partnerError;
        setPartner(partnerData);
        // Find restaurant for this partner (by user_id)
        const { data: restaurantData, error: restError } = await supabase
          .from("restaurants")
          .select("*")
          .eq("user_id", partnerData.user_id)
          .single();
        if (restError) throw restError;
        setRestaurant(restaurantData);
        // Fetch order count and revenue
        if (restaurantData && restaurantData.id) {
          const { count: ordersCount } = await supabase
            .from("orders")
            .select("*", { count: "exact", head: true })
            .eq("restaurant_id", restaurantData.id);
          setOrderCount(ordersCount || 0);
          const { data: revenueData } = await supabase
            .from("orders")
            .select("total")
            .eq("restaurant_id", restaurantData.id);
          const revenue = Array.isArray(revenueData)
            ? revenueData.reduce((sum, order) => sum + (order.total || 0), 0)
            : 0;
          setTotalRevenue(revenue);
        }
        // Fetch restaurant_settings by restaurant_id
        const { data: settingsData } = await supabase
          .from("restaurant_settings")
          .select("*")
          .eq("restaurant_id", restaurantData.id)
          .single();
        setRestaurantSettings(settingsData);
      } else if (user) {
        // Self-service: load restaurant for current user
        const { data: restaurantUsers } = await supabase
          .from("restaurant_users")
          .select(`restaurant_id, restaurants (*)`)
          .eq("user_id", user.id)
          .eq("is_active", true);
        if (
          restaurantUsers &&
          restaurantUsers.length > 0 &&
          restaurantUsers[0].restaurants
        ) {
          const restaurantData = Array.isArray(restaurantUsers[0].restaurants)
            ? restaurantUsers[0].restaurants[0]
            : restaurantUsers[0].restaurants;
          setRestaurant(restaurantData as Restaurant);
          if (restaurantData && restaurantData.id) {
            const { count: ordersCount } = await supabase
              .from("orders")
              .select("*", { count: "exact", head: true })
              .eq("restaurant_id", restaurantData.id);
            setOrderCount(ordersCount || 0);
            const { data: revenueData } = await supabase
              .from("orders")
              .select("total")
              .eq("restaurant_id", restaurantData.id);
            const revenue = Array.isArray(revenueData)
              ? revenueData.reduce((sum, order) => sum + (order.total || 0), 0)
              : 0;
            setTotalRevenue(revenue);
          }
          // Fetch restaurant_settings by restaurant_id
          const { data: settingsData } = await supabase
            .from("restaurant_settings")
            .select("*")
            .eq("restaurant_id", restaurantData.id)
            .single();
          setRestaurantSettings(settingsData);
        } else {
          // Check for partner application
          const { data: appData } = await supabase
            .from("partner_applications")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(1);
          if (appData && appData.length > 0) {
            setApplication(appData[0]);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching partner data:", error);
      toast.error("Failed to load partner data");
      setError("Failed to load partner data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    withErrorLogging(async () => {
      if (user || partnerId) {
        fetchPartnerData();
      }
    });
  }, [user, partnerId]);

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

  if (loading || settingsLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <main className="flex-1 bg-gray-50 p-6 w-full">
          <div className="w-full flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </main>
      </div>
    );
  }

  // If user has no restaurant and no application, redirect to register
  if (!restaurant && !application) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <main className="flex-1 bg-gray-50 p-6 w-full">
          <div className="w-full">
            <Card>
              <CardContent className="p-8 text-center">
                <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  No Partner Account Found
                </h2>
                <p className="text-gray-600 mb-6">
                  You don't have a partner account yet. Apply to become a
                  partner to access this dashboard.
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
      </div>
    );
  }

  // If application exists but not approved yet
  if (application && !restaurant) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <main className="flex-1 bg-gray-50 p-6 w-full">
          <div className="w-full">
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
                  <h3 className="font-semibold text-blue-900 mb-2">
                    Application Details
                  </h3>
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
                      <p>
                        {new Date(application.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {application.status === "pending" && (
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-yellow-900 mb-2">
                      Under Review
                    </h3>
                    <p className="text-yellow-800">
                      Your application is currently being reviewed by our team.
                      We'll notify you once a decision has been made. This
                      typically takes 2-3 business days.
                    </p>
                  </div>
                )}

                {application.status === "rejected" && (
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-red-900 mb-2">
                      Application Rejected
                    </h3>
                    <p className="text-red-800 mb-2">
                      Unfortunately, your application was not approved at this
                      time.
                    </p>
                    {application.rejection_reason && (
                      <div>
                        <span className="font-medium">Reason:</span>
                        <p className="text-sm">
                          {application.rejection_reason}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  // Partner dashboard for approved partners
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <ProtectedRoute>
        <main className="flex-1 bg-gray-50 p-6 w-full">
          <div className="w-full">
            <div className="mb-8">
              <h1 className="text-2xl text-red-900 text-right mb-2">
                 {restaurant.name}
              </h1>
            </div>

            {/* Restaurant Info Card */}
            {restaurant && restaurantSettings && (
              <Card className="mb-6">
                <CardContent>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <span className="text-sm font-medium text-gray-500">Type</span>
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
                    </div>
                    <div className="flex-shrink-0 flex items-center justify-end">
                      <a
                        href={`/shop/${restaurantSettings.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded shadow hover:bg-red-700 font-semibold"
                      >
                        Go to Public View
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Management Tabs */}
            <Tabs defaultValue="overview" className="space-y-6 w-full">
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger
                  value="overview"
                  className="flex items-center gap-2"
                >
                  <BarChart3 className="w-4 h-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="products"
                  className="flex items-center gap-2"
                >
                  <Package className="w-4 h-4" />
                  Products
                </TabsTrigger>
                <TabsTrigger value="orders" className="flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Orders
                </TabsTrigger>
                <TabsTrigger
                  value="settings"
                  className="flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 w-full">
                  <BusinessMetrics
                    stats={{
                      totalOrders: orderCount,
                      totalRevenue: totalRevenue,
                      activeLocations: 1, // Replace with real data if available
                      activeDrivers: 0, // Replace with real data if available
                      totalUsers: 0, // Replace with real data if available
                    }}
                    loading={false}
                  />
                  <RevenueProgress currentRevenue={totalRevenue} />
                </div>
                <CommissionManagement />
              </TabsContent>

              <TabsContent value="products">
                {restaurant && <MenuManagement businessId={restaurant.id} />}
              </TabsContent>

              <TabsContent value="orders">
                {restaurant && <OrderManagement businessId={restaurant.id} />}
              </TabsContent>

              <TabsContent value="settings">
                {restaurantSettings ? (
                  <form
                    className="max-w-2xl mx-auto space-y-6"
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const form = e.target as HTMLFormElement;
                      const formData = new FormData(form);
                      const updates: any = {
                        description: formData.get("description"),
                        slug: formData.get("slug"),
                        auto_accept_orders: formData.get("auto_accept_orders") === "on",
                        max_orders_per_hour: Number(formData.get("max_orders_per_hour")),
                        advance_order_hours: Number(formData.get("advance_order_hours")),
                        tax_rate: Number(formData.get("tax_rate")),
                        service_charge: Number(formData.get("service_charge")),
                        payment_methods: formData.getAll("payment_methods"),
                        special_instructions: formData.get("special_instructions"),
                      };
                      // Handle logo upload
                      const logoFile = formData.get("logo") as File;
                      if (logoFile && logoFile.size > 0) {
                        const { data, error } = await supabase.storage
                          .from("restaurant-assets")
                          .upload(
                            `logos/${restaurantSettings.restaurant_id}_${Date.now()}`,
                            logoFile,
                            { upsert: true }
                          );
                        if (!error && data?.path) {
                          const { data: publicUrlData } = supabase.storage
                            .from("restaurant-assets")
                            .getPublicUrl(data.path);
                          updates.logo_url = publicUrlData.publicUrl;
                        }
                      }
                      // Handle banner upload
                      const bannerFile = formData.get("banner") as File;
                      if (bannerFile && bannerFile.size > 0) {
                        const { data, error } = await supabase.storage
                          .from("restaurant-assets")
                          .upload(
                            `banners/${restaurantSettings.restaurant_id}_${Date.now()}`,
                            bannerFile,
                            { upsert: true }
                          );
                        if (!error && data?.path) {
                          const { data: publicUrlData } = supabase.storage
                            .from("restaurant-assets")
                            .getPublicUrl(data.path);
                          updates.banner_url = publicUrlData.publicUrl;
                        }
                      }
                      // Update settings
                      const { error } = await supabase
                        .from("restaurant_settings")
                        .update(updates)
                        .eq("restaurant_id", restaurantSettings.restaurant_id);
                      if (error) {
                        toast.error("Failed to update settings: " + error.message);
                      } else {
                        toast.success("Settings updated successfully");
                        // Refresh settings
                        const { data: newSettings } = await supabase
                          .from("restaurant_settings")
                          .select("*")
                          .eq("restaurant_id", restaurantSettings.restaurant_id)
                          .single();
                        setRestaurantSettings(newSettings);
                      }
                    }}
                  >
                    <div>
                      <label className="block font-medium mb-1">Public Slug</label>
                      <Input
                        name="slug"
                        defaultValue={restaurantSettings.slug || ""}
                        required
                        minLength={3}
                        maxLength={64}
                      />
                      <div className="text-xs text-gray-500">
                        This will be used in your public shop link. Must be unique.
                      </div>
                    </div>
                    <div>
                      <label className="block font-medium mb-1">Description</label>
                      <Textarea
                        name="description"
                        defaultValue={restaurantSettings.description || ""}
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-1">Logo</label>
                      {restaurantSettings.logo_url && (
                        <img
                          src={restaurantSettings.logo_url}
                          alt="Logo"
                          className="h-16 w-16 rounded-full mb-2"
                        />
                      )}
                      <Input type="file" name="logo" accept="image/*" />
                    </div>
                    <div>
                      <label className="block font-medium mb-1">Banner</label>
                      {restaurantSettings.banner_url && (
                        <img
                          src={restaurantSettings.banner_url}
                          alt="Banner"
                          className="h-24 w-full object-cover mb-2 rounded"
                        />
                      )}
                      <Input type="file" name="banner" accept="image/*" />
                    </div>
                    <div>
                      <label className="block font-medium mb-1">Auto Accept Orders</label>
                      <input type="checkbox" name="auto_accept_orders" defaultChecked={!!restaurantSettings.auto_accept_orders} />
                    </div>
                    <div>
                      <label className="block font-medium mb-1">Max Orders Per Hour</label>
                      <Input type="number" name="max_orders_per_hour" min={1} defaultValue={restaurantSettings.max_orders_per_hour || 20} />
                    </div>
                    <div>
                      <label className="block font-medium mb-1">Advance Order Hours</label>
                      <Input type="number" name="advance_order_hours" min={0} defaultValue={restaurantSettings.advance_order_hours || 24} />
                    </div>
                    <div>
                      <label className="block font-medium mb-1">Tax Rate (%)</label>
                      <Input type="number" name="tax_rate" step="0.01" min={0} defaultValue={restaurantSettings.tax_rate || 0} />
                    </div>
                    <div>
                      <label className="block font-medium mb-1">Service Charge (€)</label>
                      <Input type="number" name="service_charge" step="0.01" min={0} defaultValue={restaurantSettings.service_charge || 0} />
                    </div>
                    <div>
                      <label className="block font-medium mb-1">Payment Methods</label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-1">
                          <input type="checkbox" name="payment_methods" value="cash" defaultChecked={restaurantSettings.payment_methods?.includes("cash")} /> Cash
                        </label>
                        <label className="flex items-center gap-1">
                          <input type="checkbox" name="payment_methods" value="card" defaultChecked={restaurantSettings.payment_methods?.includes("card")} /> Card
                        </label>
                        {/* Add more payment methods as needed */}
                      </div>
                    </div>
                    <div>
                      <label className="block font-medium mb-1">Special Instructions</label>
                      <Textarea name="special_instructions" defaultValue={restaurantSettings.special_instructions || ""} rows={2} />
                    </div>
                    <Button
                      type="submit"
                      className="bg-red-600 hover:bg-red-700 text-white font-semibold"
                    >
                      Save Settings
                    </Button>
                  </form>
                ) : (
                  <div className="text-gray-600">
                    Restaurant settings and configuration options will be
                    available here.
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </ProtectedRoute>
    </div>
  );
}
