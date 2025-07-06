
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Clock, MapPin, Phone, CreditCard, Package } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Order {
  id: string;
  business_id: string;
  customer_id: string;
  order_number: string;
  status: string;
  total_amount: number;
  subtotal: number;
  delivery_address: any;
  delivery_instructions?: string;
  payment_method?: string;
  payment_status?: string;
  created_at: string;
  estimated_delivery_time?: string;
}

interface OrderManagementProps {
  businessId: string;
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  preparing: "bg-orange-100 text-orange-800",
  ready: "bg-green-100 text-green-800",
  out_for_delivery: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800"
};

export function OrderManagement({ businessId }: OrderManagementProps) {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    if (businessId) {
      fetchOrders();
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

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
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
    statusFilter === "all" || order.status === statusFilter
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
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="preparing">Preparing</SelectItem>
            <SelectItem value="ready">Ready</SelectItem>
            <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {filteredOrders.map((order) => (
          <Card key={order.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">Order #{order.order_number}</h3>
                    <Badge className={statusColors[order.status as keyof typeof statusColors]}>
                      {order.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}</span>
                    </div>
                    
                    {order.delivery_address && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{order.delivery_address.street || 'Address provided'}</span>
                      </div>
                    )}
                    
                    {order.payment_method && (
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        <span>{order.payment_method} • {order.payment_status}</span>
                      </div>
                    )}
                    
                    {order.delivery_instructions && (
                      <div className="text-gray-500">
                        <strong>Instructions:</strong> {order.delivery_instructions}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-xl font-bold mb-2">€{order.total_amount.toFixed(2)}</div>
                  
                  {order.status !== 'delivered' && order.status !== 'cancelled' && (
                    <div className="space-y-2">
                      {order.status === 'pending' && (
                        <div className="flex flex-col gap-2">
                          <Button
                            size="sm"
                            onClick={() => updateOrderStatus(order.id, 'confirmed')}
                          >
                            Accept Order
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateOrderStatus(order.id, 'cancelled')}
                          >
                            Decline
                          </Button>
                        </div>
                      )}
                      
                      {order.status === 'confirmed' && (
                        <Button
                          size="sm"
                          onClick={() => updateOrderStatus(order.id, 'preparing')}
                        >
                          Start Preparing
                        </Button>
                      )}
                      
                      {order.status === 'preparing' && (
                        <Button
                          size="sm"
                          onClick={() => updateOrderStatus(order.id, 'ready')}
                        >
                          Mark Ready
                        </Button>
                      )}
                      
                      {order.status === 'ready' && (
                        <Button
                          size="sm"
                          onClick={() => updateOrderStatus(order.id, 'out_for_delivery')}
                        >
                          Out for Delivery
                        </Button>
                      )}
                      
                      {order.status === 'out_for_delivery' && (
                        <Button
                          size="sm"
                          onClick={() => updateOrderStatus(order.id, 'delivered')}
                        >
                          Mark Delivered
                        </Button>
                      )}
                    </div>
                  )}
                </div>
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
              {orders.length === 0 
                ? "No orders have been placed yet" 
                : "No orders match the current filter"
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
