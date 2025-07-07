
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Order } from "@/hooks/useRealTimeOrders";
import { formatDistanceToNow } from "date-fns";

interface OrderTimelineViewProps {
  order: Order;
}

const statusSteps = [
  { key: 'pending', label: 'Order Placed', icon: Clock },
  { key: 'confirmed', label: 'Confirmed', icon: CheckCircle },
  { key: 'preparing', label: 'Preparing', icon: Clock },
  { key: 'ready', label: 'Ready', icon: CheckCircle },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: Clock },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle }
];

export function OrderTimelineView({ order }: OrderTimelineViewProps) {
  const getCurrentStepIndex = () => {
    return statusSteps.findIndex(step => step.key === order.status);
  };

  const currentStepIndex = getCurrentStepIndex();

  const getStepStatus = (index: number) => {
    if (index < currentStepIndex) return 'completed';
    if (index === currentStepIndex) return 'current';
    return 'pending';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Order Timeline
          <Badge variant="outline">#{order.order_number}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {statusSteps.map((step, index) => {
            const status = getStepStatus(index);
            const Icon = step.icon;
            
            return (
              <div key={step.key} className="flex items-center gap-3">
                <div className={`
                  flex items-center justify-center w-8 h-8 rounded-full border-2
                  ${status === 'completed' ? 'bg-green-100 border-green-500 text-green-600' : ''}
                  ${status === 'current' ? 'bg-blue-100 border-blue-500 text-blue-600' : ''}
                  ${status === 'pending' ? 'bg-gray-100 border-gray-300 text-gray-400' : ''}
                `}>
                  <Icon className="w-4 h-4" />
                </div>
                
                <div className="flex-1">
                  <div className={`font-medium ${
                    status === 'current' ? 'text-blue-600' : 
                    status === 'completed' ? 'text-green-600' : 'text-gray-400'
                  }`}>
                    {step.label}
                  </div>
                  
                  {status === 'current' && (
                    <div className="text-sm text-gray-500">
                      {step.key === 'pending' && 'Waiting for restaurant confirmation'}
                      {step.key === 'confirmed' && 'Restaurant is preparing your order'}
                      {step.key === 'preparing' && 'Your order is being prepared'}
                      {step.key === 'ready' && 'Ready for pickup/delivery'}
                      {step.key === 'out_for_delivery' && 'Driver is on the way'}
                      {step.key === 'delivered' && 'Order completed'}
                    </div>
                  )}
                </div>

                {status === 'current' && (
                  <div className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(order.updated_at), { addSuffix: true })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {order.estimated_delivery_time && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-blue-700">
              <Clock className="w-4 h-4" />
              <span>
                Estimated delivery: {new Date(order.estimated_delivery_time).toLocaleString()}
              </span>
            </div>
          </div>
        )}

        {order.status === 'cancelled' && (
          <div className="mt-4 p-3 bg-red-50 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-red-700">
              <AlertCircle className="w-4 h-4" />
              <span>This order has been cancelled</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
