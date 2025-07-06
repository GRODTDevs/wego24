
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Clock, MapPin, User, Phone, Euro, Package } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Order {
  id: string;
  order_number: string;
  status: string;
  total_amount: number;
  payment_status: string;
  created_at: string;
  estimated_delivery_time?: string;
  delivery_address?: any;
  delivery_instructions?: string;
  customer_id: string;
  driver_id?: string;
  notes?: string;
}

interface OrderManagementProps {
  businessId: string;
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  preparing: "bg-purple-100 text-purple-800",
  ready: "bg-green-100 text-green-800",
  out_for_delivery: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800"
};

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "preparing", label: "Preparing" },
  { value: "ready", label: "Ready" },
  { value: "out_for_delivery", label: "Out for Delivery" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" }
];

export function OrderManagement({ businessId }: OrderManagementProps) {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    if (businessId) {
      fetchOrders();
      setupRealtimeSubscription();
    }
  }, [businessId]);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("business_id", businessId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('order-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `business_id=eq.${businessId}`
        },
        () => {
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq("id", orderId);

      if (error) throw error;
      toast.success("Order status updated successfully");
      fetchOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    }
  };

  const filteredOrders = orders.filter(order => 
    filterStatus === "all" || order.status === filterStatus
  );

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading orders...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5" />
          <h2 className="text-xl font-semibold">Order Management</h2>
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders</SelectItem>
            {statusOptions.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {filteredOrders.map((order) => (
          <Card key={order.id} className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg">#{order.order_number}</CardTitle>
                  <Badge className={statusColors[order.status as keyof typeof statusColors]}>
                    {order.status.replace('_', ' ')}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">€{order.total_amount}</p>
                  <p className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4" />
                    <span>Customer ID: {order.customer_id}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Euro className="w-4 h-4" />
                    <span>Payment: {order.payment_status}</span>
                  </div>
                  {order.delivery_address && (
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="w-4 h-4 mt-0.5" />
                      <div>
                        <p>{order.delivery_address.street}</p>
                        <p>{order.delivery_address.city}, {order.delivery_address.postal_code}</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  {order.estimated_delivery_time && (
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4" />
                      <span>
                        Est. delivery: {new Date(order.estimated_delivery_time).toLocaleString()}
                      </span>
                    </div>
                  )}
                  {order.delivery_instructions && (
                    <div className="text-sm">
                      <strong>Instructions:</strong> {order.delivery_instructions}
                    </div>
                  )}
                  {order.notes && (
                    <div className="text-sm">
                      <strong>Notes:</strong> {order.notes}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t">
                <span className="text-sm font-medium">Update Status:</span>
                <Select
                  value={order.status}
                  onValueChange={(newStatus) => updateOrderStatus(order.id, newStatus)}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No orders found</h3>
            <p className="text-gray-600">
              {filterStatus === "all" 
                ? "You haven't received any orders yet" 
                : `No orders with status "${filterStatus}"`
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
