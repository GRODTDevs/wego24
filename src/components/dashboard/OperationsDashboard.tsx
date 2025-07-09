import { useTranslation } from "@/contexts/TranslationContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { RealTimeOrderDashboard } from "@/components/orders/RealTimeOrderDashboard";
import { UserManagement } from "@/components/UserManagement";
import { DriverManagement } from "@/components/DriverManagement";
import { SystemHealthMonitor } from "@/components/monitoring/SystemHealthMonitor";
import { Header } from "@/components/Header";
import { PartnerApplications } from "@/components/PartnerApplications";
import { AdminDriverManagement } from "./AdminDriverManagement";
import { useSystemSettings } from "@/contexts/SystemSettingsContext";
import { Link } from "react-router-dom";
import { Breadcrumbs } from "@/components/admin/Breadcrumbs";

export function OperationsDashboard() {
  const { t } = useTranslation();
  const { settings, refreshSettings, loading: settingsLoading } = useSystemSettings();
  const [metrics, setMetrics] = useState({
    orders: 0,
    revenue: 0,
    activeUsers: 0,
    partners: 0,
    drivers: 0,
    alerts: [],
    recentOrders: [],
    courierStatus: [],
    partnersList: [],
    driversList: [],
    recentActivity: [],
  });
  const [loading, setLoading] = useState(true);
  const [maintenanceSaving, setMaintenanceSaving] = useState(false);

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      // Orders count
      const { count: orders } = await supabase.from('orders').select('*', { count: 'exact', head: true });
      // Revenue (use total_amount column)
      const { data: revenueData } = await supabase.from('orders').select('total_amount');
      const revenue = revenueData ? revenueData.reduce((sum, o) => sum + (o.total_amount || 0), 0) : 0;
      // Active users (use profiles table)
      const { count: activeUsers } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
      // Partners
            const { count: partners } = await supabase.from('partners' as any).select('*', { count: 'exact', head: true });
      // Drivers
      const { count: drivers } = await supabase.from('drivers').select('*', { count: 'exact', head: true });
      // Recent orders
      const { data: recentOrders } = await supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(10);
      // Driver status (replace courierStatus)
      const { data: courierStatus } = await supabase.from('drivers').select('*');
      // Alerts (failed orders)
      const { data: alerts } = await supabase.from('orders').select('*').eq('status', 'failed').limit(5);
      // Top partners/drivers (make sure these columns exist)
      const { data: partnersList } = await supabase.from('partners' as any).select('id, name, order_count').order('order_count', { ascending: false }).limit(3);
      const { data: driversList } = await supabase.from('drivers').select('id, name, delivery_count').order('delivery_count', { ascending: false }).limit(3);
      // Fetch recent activity from activity_log
      const { data: recentActivity } = await supabase
        .from('activity_log' as any)
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(10);
      setMetrics({
        orders: orders || 0,
        revenue,
        activeUsers: activeUsers || 0,
        partners: partners || 0,
        drivers: drivers || 0,
        alerts: alerts || [],
        recentOrders: recentOrders || [],
        courierStatus: courierStatus || [],
        partnersList: partnersList || [],
        driversList: driversList || [],
        recentActivity: recentActivity || [],
      });
      setLoading(false);
    };
    fetchMetrics();
  }, []);

  const handleToggleMaintenance = async () => {
    setMaintenanceSaving(true);
    const newValue = !(settings.maintenance_mode === true || settings.maintenance_mode === "true");
    await supabase.from("system_settings").upsert({ key: "maintenance_mode", value: newValue });
    await refreshSettings();
    setMaintenanceSaving(false);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log('[OperationsDashboard] Rendering dashboard, metrics:', metrics);
    }
  }, [metrics]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full border-b-2 border-blue-600 h-12 w-12 mb-2"></div>
        <span className="text-gray-600 text-lg">{t('dashboard.loading')}</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 p-6">
        <Breadcrumbs />
        <h1 className="text-2xl font-bold mb-4">{t('dashboard.title')}</h1>
        <div className="mb-6 flex flex-wrap gap-4">
          <Link to="/admin/partners-management">
            <button className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 font-semibold">
              Manage Partners
            </button>
          </Link>
        </div>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-6 flex flex-wrap gap-2">
            <TabsTrigger value="overview">{t('dashboard.tabs.overview')}</TabsTrigger>
            <TabsTrigger value="orders">{t('dashboard.tabs.orders')}</TabsTrigger>
            <TabsTrigger value="partners">{t('dashboard.tabs.partners')}</TabsTrigger>
            <TabsTrigger value="drivers">{t('dashboard.tabs.drivers')}</TabsTrigger>
            <TabsTrigger value="users">{t('dashboard.tabs.users')}</TabsTrigger>
            <TabsTrigger value="activity">{t('dashboard.tabs.activity')}</TabsTrigger>
            <TabsTrigger value="alerts">{t('dashboard.tabs.alerts')}</TabsTrigger>
            <TabsTrigger value="systemHealth">{t('dashboard.tabs.systemHealth')}</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            {/* Overview metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              <div className="bg-white p-3 rounded shadow flex flex-col items-center">
                <div className="text-gray-500 text-sm">{t('dashboard.orders')}</div>
                <div className="text-xl font-bold">{metrics.orders}</div>
              </div>
              <div className="bg-white p-3 rounded shadow flex flex-col items-center">
                <div className="text-gray-500 text-sm">{t('dashboard.revenue')}</div>
                <div className="text-xl font-bold">€{metrics.revenue.toFixed(2)}</div>
              </div>
              <div className="bg-white p-3 rounded shadow flex flex-col items-center">
                <div className="text-gray-500 text-sm">{t('dashboard.activeUsers')}</div>
                <div className="text-xl font-bold">{metrics.activeUsers}</div>
              </div>
              <div className="bg-white p-3 rounded shadow flex flex-col items-center">
                <div className="text-gray-500 text-sm">{t('dashboard.partners')}</div>
                <div className="text-xl font-bold">{metrics.partners}</div>
              </div>
              <div className="bg-white p-3 rounded shadow flex flex-col items-center">
                <div className="text-gray-500 text-sm">{t('dashboard.drivers')}</div>
                <div className="text-xl font-bold">{metrics.drivers}</div>
              </div>
            </div>
            {/* Recent orders */}
            <h2 className="text-xl font-semibold mb-2">{t('dashboard.recentOrders')}</h2>
            <ul className="mb-8">
              {metrics.recentOrders.map(order => (
                <li key={order.id} className="border-b py-2 flex justify-between">
                  <span>{order.customer_name} ({order.status})</span>
                  <span>€{order.total_amount?.toFixed(2)}</span>
                </li>
              ))}
            </ul>
            {/* Driver status */}
            <h2 className="text-xl font-semibold mb-2">{t('dashboard.courierStatus')}</h2>
            <ul className="mb-8">
              {metrics.courierStatus.map(driver => (
                <li key={driver.id} className="border-b py-2 flex justify-between">
                  <span>{driver.name} ({driver.status})</span>
                  <span>{driver.current_location}</span>
                </li>
              ))}
            </ul>
          </TabsContent>
          <TabsContent value="orders">
            <RealTimeOrderDashboard userRole="admin" />
          </TabsContent>
          <TabsContent value="partners">
            <section>
              <h2 className="text-xl font-semibold mb-4">Partner Applications & Management</h2>
              <PartnerApplications />
            </section>
          </TabsContent>
          <TabsContent value="drivers">
            <DriverManagement />
            <div className="mt-8">
              <AdminDriverManagement />
            </div>
          </TabsContent>
          <TabsContent value="users">
            <UserManagement />
          </TabsContent>
          <TabsContent value="activity">
            {/* Recent activity log */}
            <h2 className="text-xl font-semibold mb-2">{t('dashboard.recentActivity')}</h2>
            <ul className="mb-8">
              {metrics.recentActivity?.map(activity => (
                <li key={activity.id} className="border-b py-2">
                  {activity.message} <span className="text-gray-400 text-xs">{new Date(activity.timestamp).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          </TabsContent>
          <TabsContent value="alerts">
            {/* Critical alerts */}
            <h2 className="text-xl font-semibold mb-2">{t('dashboard.alerts')}</h2>
            <ul>
              {metrics.alerts.map(alert => (
                <li key={alert.id} className="text-red-600 border-b py-2">
                  {t('dashboard.failedOrder')}: {alert.id}
                </li>
              ))}
            </ul>
          </TabsContent>
          <TabsContent value="systemHealth">
            <SystemHealthMonitor />
          </TabsContent>
        </Tabs>
        {/* Maintenance mode toggle - visible only to admins */}
        <div className="my-4 p-4 bg-yellow-50 border border-yellow-300 rounded">
          <span className="font-semibold mr-2">Maintenance Mode:</span>
          <button
            onClick={handleToggleMaintenance}
            disabled={maintenanceSaving || settingsLoading}
            className={`px-4 py-2 rounded ${settings.maintenance_mode === true || settings.maintenance_mode === "true" ? "bg-red-500 text-white" : "bg-green-500 text-white"}`}
          >
            {settings.maintenance_mode === true || settings.maintenance_mode === "true" ? "Disable" : "Enable"}
          </button>
          {maintenanceSaving && <span className="ml-2 text-sm text-gray-500">Saving...</span>}
        </div>
      </main>
    </div>
  );
}