
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Package, Truck, User } from "lucide-react";
import { Order } from "@/hooks/useRealTimeOrders";

interface OrderTimelineViewProps {
  order: Order;
}

export function OrderTimelineView({ order }: OrderTimelineViewProps) {
  const getTimelineSteps = () => {
    const baseSteps = [
      {
        id: 'pending',
        title: 'Order Placed',
        description: 'Customer placed the order',
        icon: Clock,
        status: 'completed' as const,
        timestamp: order.created_at
      },
      {
        id: 'confirmed',
        title: 'Order Confirmed',
        description: 'Restaurant accepted the order',
        icon: CheckCircle,
        status: order.status === 'pending' ? 'pending' : 'completed' as const,
        timestamp: order.status !== 'pending' ? order.updated_at : undefined
      },
      {
        id: 'preparing',
        title: 'Preparing',
        description: 'Restaurant is preparing your order',
        icon: Package,
        status: ['pending', 'confirmed'].includes(order.status) ? 'pending' : 
                order.status === 'preparing' ? 'current' : 'completed' as const,
        timestamp: order.status === 'preparing' ? order.updated_at : undefined
      },
      {
        id: 'ready',
        title: 'Ready for Pickup',
        description: 'Order is ready for delivery',
        icon: CheckCircle,
        status: ['pending', 'confirmed', 'preparing'].includes(order.status) ? 'pending' : 
                order.status === 'ready' ? 'current' : 'completed' as const,
        timestamp: order.status === 'ready' ? order.updated_at : undefined
      }
    ];

    if (order.driver_id) {
      baseSteps.push({
        id: 'out_for_delivery',
        title: 'Out for Delivery',
        description: 'Driver is on the way',
        icon: Truck,
        status: ['delivered'].includes(order.status) ? 'completed' : 
                order.status === 'out_for_delivery' ? 'current' : 'pending' as const,
        timestamp: order.status === 'out_for_delivery' ? order.updated_at : undefined
      });
    }

    baseSteps.push({
      id: 'delivered',
      title: 'Delivered',
      description: 'Order has been delivered',
      icon: User,
      status: order.status === 'delivered' ? 'completed' : 'pending' as const,
      timestamp: order.actual_delivery_time || (order.status === 'delivered' ? order.updated_at : undefined)
    });

    return baseSteps;
  };

  const getStepColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'current': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-gray-400 bg-gray-100';
      default: return 'text-gray-400 bg-gray-100';
    }
  };

  const formatTimestamp = (timestamp?: string) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleString();
  };

  const steps = getTimelineSteps();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="w-5 h-5" />
          Order Timeline - #{order.order_number}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isLast = index === steps.length - 1;
            
            return (
              <div key={step.id} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div className={`p-2 rounded-full ${getStepColor(step.status)}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  {!isLast && (
                    <div className={`w-px h-8 mt-2 ${
                      step.status === 'completed' ? 'bg-green-300' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{step.title}</h4>
                    <Badge 
                      variant="outline"
                      className={getStepColor(step.status)}
                    >
                      {step.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{step.description}</p>
                  {step.timestamp && (
                    <p className="text-xs text-gray-400">
                      {formatTimestamp(step.timestamp)}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {order.delivery_instructions && (
          <div className="mt-6 p-3 bg-blue-50 rounded-lg">
            <h5 className="font-medium text-blue-900 mb-1">Delivery Instructions</h5>
            <p className="text-sm text-blue-700">{order.delivery_instructions}</p>
          </div>
        )}

        {order.notes && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <h5 className="font-medium text-gray-900 mb-1">Order Notes</h5>
            <p className="text-sm text-gray-700">{order.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
