import { useTranslation } from "@/contexts/TranslationContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function OperationsDashboard() {
  const { t } = useTranslation();
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

  if (loading) return <div>{t('dashboard.loading')}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{t('dashboard.title')}</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded shadow">
          <div className="text-gray-500">{t('dashboard.orders')}</div>
          <div className="text-2xl font-bold">{metrics.orders}</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="text-gray-500">{t('dashboard.revenue')}</div>
          <div className="text-2xl font-bold">€{metrics.revenue.toFixed(2)}</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="text-gray-500">{t('dashboard.activeUsers')}</div>
          <div className="text-2xl font-bold">{metrics.activeUsers}</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="text-gray-500">{t('dashboard.partners')}</div>
          <div className="text-2xl font-bold">{metrics.partners}</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="text-gray-500">{t('dashboard.drivers')}</div>
          <div className="text-2xl font-bold">{metrics.drivers}</div>
        </div>
      </div>
      <h2 className="text-xl font-semibold mb-2">{t('dashboard.recentOrders')}</h2>
      <ul className="mb-8">
        {metrics.recentOrders.map(order => (
          <li key={order.id} className="border-b py-2 flex justify-between">
            <span>{order.customer_name} ({order.status})</span>
            <span>€{order.total_amount?.toFixed(2)}</span>
          </li>
        ))}
      </ul>
      <h2 className="text-xl font-semibold mb-2">{t('dashboard.courierStatus')}</h2>
      <ul className="mb-8">
        {metrics.courierStatus.map(driver => (
          <li key={driver.id} className="border-b py-2 flex justify-between">
            <span>{driver.name} ({driver.status})</span>
            <span>{driver.current_location}</span>
          </li>
        ))}
      </ul>
      <h2 className="text-xl font-semibold mb-2">{t('dashboard.alerts')}</h2>
      <ul>
        {metrics.alerts.map(alert => (
          <li key={alert.id} className="text-red-600 border-b py-2">
            {t('dashboard.failedOrder')}: {alert.id}
          </li>
        ))}
      </ul>
      <h2 className="text-xl font-semibold mb-2">{t('dashboard.partnerAnalytics')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-4 rounded shadow">
          <div className="text-gray-500">{t('dashboard.topPartners')}</div>
          <ul>
            {metrics.partnersList?.slice(0, 3).map(partner => (
              <li key={partner.id} className="flex justify-between py-1">
                <span>{partner.name}</span>
                <span>{t('dashboard.orders')}: {partner.order_count}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="text-gray-500">{t('dashboard.topDrivers')}</div>
          <ul>
            {metrics.driversList?.slice(0, 3).map(driver => (
              <li key={driver.id} className="flex justify-between py-1">
                <span>{driver.name}</span>
                <span>{t('dashboard.deliveries')}: {driver.delivery_count}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <h2 className="text-xl font-semibold mb-2">{t('dashboard.recentActivity')}</h2>
      <ul className="mb-8">
        {metrics.recentActivity?.map(activity => (
          <li key={activity.id} className="border-b py-2">
            {activity.message} <span className="text-gray-400 text-xs">{new Date(activity.timestamp).toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}