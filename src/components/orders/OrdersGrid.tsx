
import { OrderCard } from "./OrderCard";
import { Order } from "@/hooks/useRealTimeOrders";
import { EmptyState } from "@/components/EmptyState";

interface OrdersGridProps {
  orders: Order[];
  onStatusUpdate?: (orderId: string, newStatus: string) => void;
  onAssignDriver?: (orderId: string, driverId: string) => void;
  userRole?: 'customer' | 'restaurant' | 'driver' | 'admin';
  loading?: boolean;
}

export function OrdersGrid({ 
  orders, 
  onStatusUpdate, 
  onAssignDriver, 
  userRole = 'restaurant',
  loading = false 
}: OrdersGridProps) {
  
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-64 bg-gray-100 animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <EmptyState
        title="No orders found"
        description="When orders are placed, they will appear here"
      />
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          onStatusUpdate={onStatusUpdate}
          onAssignDriver={onAssignDriver}
          userRole={userRole}
        />
      ))}
    </div>
  );
}
