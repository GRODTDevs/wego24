
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Order {
  id: string;
  order_number: string;
  customer_id: string;
  business_id: string;
  driver_id?: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  payment_method?: string;
  subtotal: number;
  delivery_fee: number;
  service_fee: number;
  tax_amount: number;
  total_amount: number;
  delivery_address?: any;
  delivery_instructions?: string;
  estimated_delivery_time?: string;
  actual_delivery_time?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  customer_profile?: {
    first_name?: string;
    last_name?: string;
    phone?: string;
  };
  restaurant_info?: {
    name: string;
    phone?: string;
  };
}

export interface OrderStatusHistory {
  id: string;
  order_id: string;
  status: string;
  changed_by?: string;
  changed_at: string;
  notes?: string;
}

export function useRealTimeOrders(businessId?: string) {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    fetchOrders();
    
    // Subscribe to real-time changes
    const channel = supabase
      .channel('orders-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          console.log('Order change received:', payload);
          
          if (payload.eventType === 'INSERT') {
            const newOrder = payload.new as Order;
            setOrders(current => [newOrder, ...current]);
            
            // Create notification for new order
            if (newOrder.status === 'pending') {
              toast.success('New order received!', {
                description: `Order ${newOrder.order_number} - €${newOrder.total_amount.toFixed(2)}`
              });
              
              // Notify restaurant users
              notifyRestaurantUsers(newOrder);
            }
          } else if (payload.eventType === 'UPDATE') {
            const updatedOrder = payload.new as Order;
            setOrders(current => 
              current.map(order => 
                order.id === updatedOrder.id ? { ...order, ...updatedOrder } : order
              )
            );
            
            // Handle status change notifications
            if (payload.old?.status !== updatedOrder.status) {
              handleStatusChangeNotification(updatedOrder, payload.old?.status);
            }

            // Handle driver assignment notifications
            if (payload.old?.driver_id !== updatedOrder.driver_id && updatedOrder.driver_id) {
              handleDriverAssignmentNotification(updatedOrder);
            }
          } else if (payload.eventType === 'DELETE') {
            setOrders(current => current.filter(order => order.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, businessId]);

  const fetchOrders = async () => {
    try {
      let query = supabase
        .from('orders')
        .select(`
          *,
          customer_profile:profiles!orders_customer_id_fkey(first_name, last_name, phone),
          restaurant_info:restaurants!orders_business_id_fkey(name, phone)
        `)
        .order('created_at', { ascending: false });

      if (businessId) {
        query = query.eq('business_id', businessId);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      
      const typedOrders = (data || []).map(order => ({
        ...order,
        delivery_fee: order.delivery_fee || 0,
        service_fee: order.service_fee || 0,
        tax_amount: order.tax_amount || 0,
        payment_status: order.payment_status || 'pending'
      } as Order));
      
      setOrders(typedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string, notes?: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString(),
          ...(newStatus === 'delivered' && { actual_delivery_time: new Date().toISOString() })
        })
        .eq('id', orderId);

      if (error) throw error;
      
      toast.success('Order status updated successfully');
      
      // Create status history entry will be handled by database trigger
      
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  const assignDriver = async (orderId: string, driverId: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          driver_id: driverId,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (error) throw error;
      toast.success('Driver assigned successfully');
    } catch (error) {
      console.error('Error assigning driver:', error);
      toast.error('Failed to assign driver');
    }
  };

  const estimateDeliveryTime = (orderTime: string, preparationMinutes: number = 30) => {
    const orderDate = new Date(orderTime);
    const estimatedTime = new Date(orderDate.getTime() + preparationMinutes * 60000);
    return estimatedTime.toISOString();
  };

  const notifyRestaurantUsers = async (order: Order) => {
    try {
      // Get restaurant users to notify
      const { data: restaurantUsers } = await supabase
        .from('restaurant_users')
        .select('user_id')
        .eq('restaurant_id', order.business_id)
        .eq('is_active', true);

      if (restaurantUsers) {
        for (const user of restaurantUsers) {
          await supabase
            .from('notifications')
            .insert({
              user_id: user.user_id,
              order_id: order.id,
              type: 'order_status',
              title: 'New Order Received',
              message: `Order ${order.order_number} for €${order.total_amount.toFixed(2)} needs your attention`
            });
        }
      }
    } catch (error) {
      console.error('Error notifying restaurant users:', error);
    }
  };

  const handleStatusChangeNotification = async (order: Order, oldStatus: string) => {
    try {
      const statusMessages = {
        confirmed: 'Your order has been confirmed and is being prepared',
        preparing: 'Your order is now being prepared',
        ready: 'Your order is ready for pickup/delivery',
        out_for_delivery: 'Your order is out for delivery',
        delivered: 'Your order has been delivered',
        cancelled: 'Your order has been cancelled'
      };

      const message = statusMessages[order.status as keyof typeof statusMessages];
      
      if (message) {
        await supabase
          .from('notifications')
          .insert({
            user_id: order.customer_id,
            order_id: order.id,
            type: 'order_status',
            title: `Order ${order.order_number} Update`,
            message
          });
      }
    } catch (error) {
      console.error('Error creating status change notification:', error);
    }
  };

  const handleDriverAssignmentNotification = async (order: Order) => {
    try {
      await supabase
        .from('notifications')
        .insert({
          user_id: order.customer_id,
          order_id: order.id,
          type: 'driver_assignment',
          title: `Driver Assigned - Order ${order.order_number}`,
          message: 'A driver has been assigned to your order and will pick it up soon'
        });
    } catch (error) {
      console.error('Error creating driver assignment notification:', error);
    }
  };

  return {
    orders,
    loading,
    updateOrderStatus,
    assignDriver,
    estimateDeliveryTime,
    refetch: fetchOrders
  };
}
