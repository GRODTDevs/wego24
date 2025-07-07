
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
            setOrders(current => [payload.new as Order, ...current]);
            toast.success('New order received!');
          } else if (payload.eventType === 'UPDATE') {
            setOrders(current => 
              current.map(order => 
                order.id === payload.new.id ? { ...order, ...payload.new } : order
              )
            );
            
            const updatedOrder = payload.new as Order;
            if (payload.old?.status !== updatedOrder.status) {
              toast.info(`Order ${updatedOrder.order_number} status: ${updatedOrder.status}`);
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
        .select('*')
        .order('created_at', { ascending: false });

      if (businessId) {
        query = query.eq('business_id', businessId);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;
      toast.success('Order status updated successfully');
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  const assignDriver = async (orderId: string, driverId: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ driver_id: driverId })
        .eq('id', orderId);

      if (error) throw error;
      toast.success('Driver assigned successfully');
    } catch (error) {
      console.error('Error assigning driver:', error);
      toast.error('Failed to assign driver');
    }
  };

  return {
    orders,
    loading,
    updateOrderStatus,
    assignDriver,
    refetch: fetchOrders
  };
}
