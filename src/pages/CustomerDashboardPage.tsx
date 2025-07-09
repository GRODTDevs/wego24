import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SubscriptionStatus } from "@/components/subscription/SubscriptionStatus";
import { UsageChart } from "@/components/subscription/UsageChart";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function CustomerDashboardPage() {
  const { user } = useAuth();
  const {
    subscription,
    usage,
    refreshing,
    checkSubscription,
    openCustomerPortal,
  } = useSubscription();
  const [orders, setOrders] = useState([]);
  const [activeOrders, setActiveOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    Promise.all([
      supabase.from("orders").select("*", { count: "exact" }).eq("user_id", user.id).order("created_at", { ascending: false }),
      supabase.from("orders").select("*", { count: "exact" }).eq("user_id", user.id).in("status", ["pending", "assigned", "in_progress"]),
    ]).then(([orderRes, activeRes]) => {
      setOrders(orderRes.data || []);
      setActiveOrders(activeRes.data || []);
      setLoading(false);
    });
  }, [user]);

  if (!user) return <div className="p-8 text-center">Please sign in to view your dashboard.</div>;
  if (loading) return <div className="p-8 text-center">Loading your dashboard...</div>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Customer Dashboard</h2>
      {/* Active Orders */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Active Orders</h3>
        {activeOrders.length === 0 ? (
          <div>No active orders.</div>
        ) : (
          <ul>
            {activeOrders.map((order) => (
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
      {/* Order History */}
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
      {/* Subscription Management */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Subscription Management</h3>
        <SubscriptionStatus
          subscription={subscription}
          refreshing={refreshing}
          onRefresh={checkSubscription}
          onManageSubscription={openCustomerPortal}
        />
        <div className="mt-4">
          <UsageChart usage={usage} subscription={subscription} />
        </div>
      </section>
      {/* Payment Methods */}
      <section>
        <h3 className="text-lg font-semibold mb-2">Payment Methods</h3>
        <Button onClick={openCustomerPortal} variant="outline">
          Manage Payment Methods (Stripe Portal)
        </Button>
      </section>
    </div>
  );
}
