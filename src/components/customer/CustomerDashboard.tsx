import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { useSystemSettings } from "@/contexts/SystemSettingsContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import LivePackageTracking from "@/components/tracking/LivePackageTracking";
import { useAuth } from "@/contexts/AuthContext";

interface CustomerDashboardProps {
  user: User | null;
}

export default function CustomerDashboard({ user }: CustomerDashboardProps) {
  const { settings } = useSystemSettings();
  const [orders, setOrders] = useState([]);
  const [activeOrders, setActiveOrders] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      return;
    }
    setLoading(true);
    Promise.all([
      supabase.from("orders").select("*", { count: "exact" }).eq("user_id", user.id).order("created_at", { ascending: false }),
      supabase.from("orders").select("*", { count: "exact" }).eq("user_id", user.id).in("status", ["pending", "assigned", "in_progress", "scheduled"]),
      supabase.from("subscribers").select("*", { count: "exact" }).eq("user_id", user.id)
    ]).then(([orderRes, activeRes, subRes]) => {
      setOrders(orderRes.data || []);
      setActiveOrders(activeRes.data || []);
      setSubscriptions(subRes.data || []);
      setLoading(false);
    });
  }, [user]);

  // Scheduling new delivery (simplified example)
  const scheduleDelivery = async (orderId, scheduledTime) => {
    await supabase.from("orders").update({ scheduled_time: scheduledTime, status: "scheduled" }).eq("id", orderId);
    // Refresh orders
    const { data } = await supabase.from("orders").select("*").eq("user_id", user.id);
    setOrders(data || []);
  };

  if (!user) return <div>Please sign in to view your dashboard.</div>;
  if (loading) return <div>Loading your dashboard...</div>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Customer Dashboard</h2>
      <section className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Active & Scheduled Orders</h3>
        {activeOrders.length === 0 ? (
          <div>No active or scheduled orders.</div>
        ) : (
          <ul>
            {activeOrders.map((order) => (
              <li key={order.id} className="border-b py-2">
                <div>Order #{order.id} - {order.status}</div>
                <div>Type: {order.type} | Placed: {new Date(order.created_at).toLocaleString()}</div>
                <div>Pickup: {order.pickup_location} → Dropoff: {order.dropoff_location}</div>
                <div>Total: €{order.total_price}</div>
                {order.scheduled_time && <div>Scheduled for: {new Date(order.scheduled_time).toLocaleString()}</div>}
                <div>Status: {order.status} {order.driver_id && `(Driver assigned)`}</div>
                {/* Optionally, allow rescheduling if order is not yet in progress */}
                {order.status === "scheduled" && (
                  <Button size="sm" onClick={() => scheduleDelivery(order.id, prompt("Enter new date/time (ISO)", order.scheduled_time))}>Reschedule</Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
      <section className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Order History</h3>
        {orders.length === 0 ? (
          <div>No past orders.</div>
        ) : (
          <ul>
            {orders.map((order) => (
              <li key={order.id} className="border-b py-2">
                <div>Order #{order.id} - {order.status}</div>
                <div>Type: {order.type} | Placed: {new Date(order.created_at).toLocaleString()}</div>
                <div>Pickup: {order.pickup_location} → Dropoff: {order.dropoff_location}</div>
                <div>Total: €{order.total_price}</div>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Subscription Management</h3>
        {subscriptions.length === 0 ? (
          <div>No active subscriptions.</div>
        ) : (
          <ul>
            {subscriptions.map((sub) => (
              <li key={sub.id} className="border-b py-2">
                <div>Plan: {sub.subscription_plan_id} | Status: {sub.subscription_status}</div>
                <div>Current period end: {sub.current_period_end}</div>
                <Button size="sm" variant="outline">Upgrade</Button>
                <Button size="sm" variant="destructive">Cancel</Button>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section>
        <h3 className="text-lg font-semibold mb-2">Payment Methods</h3>
        <div>Manage your saved cards and payment options in your account settings.</div>
      </section>
      {/* Show live tracking for each active order with a driver assigned */}
      {activeOrders.filter(o => o.driver_id).map(order => (
        <LivePackageTracking key={order.id} orderId={order.id} />
      ))}
    </div>
  );
}
