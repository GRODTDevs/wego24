import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { DriverAssignmentDialog } from "./DriverAssignmentDialog";
import { Clock, MapPin, CreditCard, User, Phone } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Order } from "@/hooks/useRealTimeOrders";
import { useState } from "react";

interface OrderCardProps {
  order: Order;
  onStatusUpdate?: (orderId: string, newStatus: string) => void;
  onAssignDriver?: (orderId: string, driverId: string) => void;
  showActions?: boolean;
  userRole?: 'customer' | 'restaurant' | 'driver' | 'admin';
}

export function OrderCard({ 
  order, 
  onStatusUpdate, 
  onAssignDriver, 
  showActions = true,
  userRole = 'restaurant'
}: OrderCardProps) {
  const [showDriverDialog, setShowDriverDialog] = useState(false);
  
  const getNextStatus = (currentStatus: string) => {
    const statusFlow = {
      pending: 'confirmed',
      confirmed: 'preparing',
      preparing: 'ready',
      ready: 'out_for_delivery',
      out_for_delivery: 'delivered'
    };
    return statusFlow[currentStatus as keyof typeof statusFlow];
  };

  const canUpdateStatus = (status: string) => {
    if (userRole === 'customer') return false;
    return !['delivered', 'cancelled'].includes(status);
  };

  const getStatusActionText = (status: string) => {
    const actionTexts = {
      pending: 'Accept Order',
      confirmed: 'Start Preparing',
      preparing: 'Mark Ready',
      ready: 'Out for Delivery',
      out_for_delivery: 'Mark Delivered'
    };
    return actionTexts[status as keyof typeof actionTexts] || 'Update Status';
  };

  const formatCustomerInfo = () => {
    const profile = order.customer_profile;
    if (profile?.first_name || profile?.last_name) {
      return `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
    }
    return 'Customer';
  };

  const getDeliveryAddress = () => {
    if (!order.delivery_address) return null;
    
    try {
      // Handle if delivery_address is already an object
      if (typeof order.delivery_address === 'object' && order.delivery_address !== null) {
        const addr = order.delivery_address as any;
        return addr.street || 'Address provided';
      }
      
      // Handle if delivery_address is a string
      if (typeof order.delivery_address === 'string') {
        const parsed = JSON.parse(order.delivery_address);
        return parsed.street || 'Address provided';
      }
    } catch (error) {
      console.error('Error parsing delivery address:', error);
    }
    
    return 'Address provided';
  };

  const canShowAssignDriver = () => {
    // Only show assign driver if order is ready, no driver assigned, and user is admin or restaurant
    return order.status === 'ready' && !order.driver_id && (userRole === 'admin' || userRole === 'restaurant');
  };

  return (
    <>
      <Card className="w-full hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">
              Order #{order.order_number}
            </CardTitle>
            <OrderStatusBadge status={order.status} />
          </div>
          <div className="text-sm text-gray-600">
            {formatCustomerInfo()}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span>{formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-gray-500" />
              <span>€{order.total_amount.toFixed(2)}</span>
            </div>
          </div>

          {order.customer_profile?.phone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-gray-500" />
              <span>{order.customer_profile.phone}</span>
            </div>
          )}

          {order.delivery_address && (
            <div className="flex items-start gap-2 text-sm">
              <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
              <div>
                <p>{getDeliveryAddress()}</p>
                {order.delivery_instructions && (
                  <p className="text-gray-600 text-xs mt-1">
                    Note: {order.delivery_instructions}
                  </p>
                )}
              </div>
            </div>
          )}

          {order.driver_id && (
            <div className="flex items-center gap-2 text-sm">
              <User className="w-4 h-4 text-gray-500" />
              <span>Driver assigned</span>
            </div>
          )}

          {order.estimated_delivery_time && (
            <div className="text-xs text-gray-500">
              Estimated delivery: {new Date(order.estimated_delivery_time).toLocaleString()}
            </div>
          )}

          {showActions && canUpdateStatus(order.status) && onStatusUpdate && (
            <div className="flex gap-2 pt-2">
              {order.status === 'pending' && (
                <>
                  <Button
                    size="sm"
                    onClick={() => onStatusUpdate(order.id, 'confirmed')}
                    className="flex-1"
                  >
                    Accept Order
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onStatusUpdate(order.id, 'cancelled')}
                    className="flex-1"
                  >
                    Decline
                  </Button>
                </>
              )}
              
              {order.status !== 'pending' && getNextStatus(order.status) && (
                <Button
                  size="sm"
                  onClick={() => onStatusUpdate(order.id, getNextStatus(order.status)!)}
                  className="flex-1"
                >
                  {getStatusActionText(getNextStatus(order.status)!)}
                </Button>
              )}

              {canShowAssignDriver() && onAssignDriver && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowDriverDialog(true)}
                  className="flex-1"
                >
                  Assign Driver
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <DriverAssignmentDialog
        open={showDriverDialog}
        onOpenChange={setShowDriverDialog}
        orderId={order.id}
        onAssignDriver={onAssignDriver}
      />
    </>
  );
}
