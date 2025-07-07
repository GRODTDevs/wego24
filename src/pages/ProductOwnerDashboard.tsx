
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserManagement } from "@/components/UserManagement";
import { LocationManagement } from "@/components/LocationManagement";
import { DriverManagement } from "@/components/DriverManagement";
import { CommissionManagement } from "@/components/CommissionManagement";
import { SuperuserCreation } from "@/components/SuperuserCreation";
import { PartnerApplications } from "@/components/PartnerApplications";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SubscriptionStatus } from "@/components/subscription/SubscriptionStatus";
import { UsageChart } from "@/components/subscription/UsageChart";
import { BusinessMetrics } from "@/components/dashboard/BusinessMetrics";
import { SystemHealth } from "@/components/dashboard/SystemHealth";
import { RevenueProgress } from "@/components/dashboard/RevenueProgress";
import { CriticalAlerts } from "@/components/dashboard/CriticalAlerts";
import { RealTimeOrderDashboard } from "@/components/orders/RealTimeOrderDashboard";
import { useTranslation } from "@/contexts/TranslationContext";
import { useSubscription } from "@/hooks/useSubscription";
import { supabase } from "@/integrations/supabase/client";

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  activeLocations: number;
  activeDrivers: number;
  totalUsers: number;
}

export default function ProductOwnerDashboard() {
  const { t } = useTranslation();
  const {
    subscription,
    usage,
    loading: subscriptionLoading,
    refreshing,
    checkSubscription,
    openCustomerPortal,
  } = useSubscription();
  
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalRevenue: 0,
    activeLocations: 0,
    activeDrivers: 0,
    totalUsers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Fetch total orders
        const { count: ordersCount } = await supabase
          .from('orders')
          .select('*', { count: 'exact', head: true });

        // Fetch total revenue
        const { data: revenueData } = await supabase
          .from('orders')
          .select('total_amount')
          .eq('payment_status', 'completed');

        const totalRevenue = revenueData?.reduce((sum, order) => sum + (Number(order.total_amount) || 0), 0) || 0;

        // Fetch active restaurants
        const { count: restaurantsCount } = await supabase
          .from('restaurants')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'active');

        // Fetch active drivers
        const { count: driversCount } = await supabase
          .from('drivers')
          .select('*', { count: 'exact', head: true })
          .eq('is_active', true);

        // Fetch total users
        const { count: usersCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        setStats({
          totalOrders: ordersCount || 0,
          totalRevenue,
          activeLocations: restaurantsCount || 0,
          activeDrivers: driversCount || 0,
          totalUsers: usersCount || 0
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('dashboard.title')}</h1>
          
          {/* Enhanced Business Metrics */}
          <div className="mb-8">
            <BusinessMetrics stats={stats} loading={loading} />
          </div>

          {/* Revenue Progress & System Health */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <RevenueProgress currentRevenue={stats.totalRevenue} />
            </div>
            <div>
              <SystemHealth />
            </div>
          </div>

          {/* Critical Alerts */}
          <div className="mb-8">
            <CriticalAlerts />
          </div>

          {/* Management Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid grid-cols-9 w-full">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="users">{t('dashboard.tabs.users')}</TabsTrigger>
              <TabsTrigger value="locations">{t('dashboard.tabs.locations')}</TabsTrigger>
              <TabsTrigger value="partners">Partners</TabsTrigger>
              <TabsTrigger value="drivers">{t('dashboard.tabs.drivers')}</TabsTrigger>
              <TabsTrigger value="subscription">Subscription</TabsTrigger>
              <TabsTrigger value="analytics">{t('dashboard.tabs.analytics')}</TabsTrigger>
              <TabsTrigger value="admin">{t('dashboard.tabs.admin')}</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SubscriptionStatus
                  subscription={subscription}
                  refreshing={refreshing}
                  onRefresh={checkSubscription}
                  onManageSubscription={openCustomerPortal}
                />
                <UsageChart usage={usage} subscription={subscription} />
              </div>
            </TabsContent>

            <TabsContent value="orders">
              <RealTimeOrderDashboard userRole="admin" />
            </TabsContent>

            <TabsContent value="users">
              <UserManagement />
            </TabsContent>

            <TabsContent value="locations">
              <LocationManagement />
            </TabsContent>

            <TabsContent value="partners">
              <PartnerApplications />
            </TabsContent>

            <TabsContent value="drivers">
              <DriverManagement />
            </TabsContent>

            <TabsContent value="subscription">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SubscriptionStatus
                  subscription={subscription}
                  refreshing={refreshing}
                  onRefresh={checkSubscription}
                  onManageSubscription={openCustomerPortal}
                />
                <UsageChart usage={usage} subscription={subscription} />
              </div>
            </TabsContent>

            <TabsContent value="analytics">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RevenueProgress currentRevenue={stats.totalRevenue} />
                <SystemHealth />
              </div>
            </TabsContent>

            <TabsContent value="admin">
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-lg border">
                    <h3 className="text-lg font-semibold mb-4">{t('dashboard.admin.title')}</h3>
                    <p className="text-gray-600 mb-6">{t('dashboard.admin.description')}</p>
                    <SuperuserCreation />
                  </div>
                  <CriticalAlerts />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
