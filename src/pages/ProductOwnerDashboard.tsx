
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { UserManagement } from "@/components/UserManagement";
import { LocationManagement } from "@/components/LocationManagement";
import { DriverManagement } from "@/components/DriverManagement";
import { CommissionManagement } from "@/components/CommissionManagement";
import { SuperuserCreation } from "@/components/SuperuserCreation";
import { PartnerApplications } from "@/components/PartnerApplications";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useTranslation } from "@/contexts/TranslationContext";
import { formatCurrency } from "@/lib/currency";
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
      <ProtectedRoute requireAdmin={true}>
        <main className="flex-1 bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('dashboard.title')}</h1>
            
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">{t('dashboard.stats.totalOrders')}</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="w-16 h-8 bg-gray-200 animate-pulse rounded"></div>
                  ) : (
                    <div className="text-2xl font-bold">{stats.totalOrders.toLocaleString()}</div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">{t('dashboard.stats.totalRevenue')}</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="w-20 h-8 bg-gray-200 animate-pulse rounded"></div>
                  ) : (
                    <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">{t('dashboard.stats.activeLocations')}</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="w-12 h-8 bg-gray-200 animate-pulse rounded"></div>
                  ) : (
                    <div className="text-2xl font-bold">{stats.activeLocations}</div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">{t('dashboard.stats.activeDrivers')}</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="w-12 h-8 bg-gray-200 animate-pulse rounded"></div>
                  ) : (
                    <div className="text-2xl font-bold">{stats.activeDrivers}</div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">{t('dashboard.stats.totalUsers')}</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="w-16 h-8 bg-gray-200 animate-pulse rounded"></div>
                  ) : (
                    <div className="text-2xl font-bold">{stats.totalUsers}</div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Management Tabs */}
            <Tabs defaultValue="users" className="space-y-6">
              <TabsList className="grid grid-cols-7 w-full">
                <TabsTrigger value="users">{t('dashboard.tabs.users')}</TabsTrigger>
                <TabsTrigger value="locations">{t('dashboard.tabs.locations')}</TabsTrigger>
                <TabsTrigger value="partners">Partners</TabsTrigger>
                <TabsTrigger value="drivers">{t('dashboard.tabs.drivers')}</TabsTrigger>
                <TabsTrigger value="commissions">{t('dashboard.tabs.commissions')}</TabsTrigger>
                <TabsTrigger value="analytics">{t('dashboard.tabs.analytics')}</TabsTrigger>
                <TabsTrigger value="admin">{t('dashboard.tabs.admin')}</TabsTrigger>
              </TabsList>

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

              <TabsContent value="commissions">
                <CommissionManagement />
              </TabsContent>

              <TabsContent value="analytics">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('dashboard.analytics.title')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{t('dashboard.analytics.comingSoon')}</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="admin">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t('dashboard.admin.title')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-6">{t('dashboard.admin.description')}</p>
                      <SuperuserCreation />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </ProtectedRoute>
      <Footer />
    </div>
  );
}
