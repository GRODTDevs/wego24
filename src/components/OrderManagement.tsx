
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Clock, User, Package, CreditCard, Banknote } from "lucide-react";

interface Order {
  id: string;
  customer: string;
  items: string[];
  status: string;
  total: string;
  time: string;
  paymentMethod: string;
}

interface OrderManagementProps {
  orders: Order[];
  onOrderStatusChange: (orderId: string, newStatus: string) => void;
}

const orderStatuses = [
  { value: "Pending", label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  { value: "Accepted", label: "Accepted", color: "bg-blue-100 text-blue-800" },
  { value: "Preparing", label: "Preparing", color: "bg-orange-100 text-orange-800" },
  { value: "Ready", label: "Ready", color: "bg-green-100 text-green-800" },
  { value: "Dispatched", label: "Dispatched", color: "bg-purple-100 text-purple-800" },
  { value: "Delivered", label: "Delivered", color: "bg-gray-100 text-gray-800" },
];

const getStatusColor = (status: string) => {
  const statusConfig = orderStatuses.find(s => s.value === status);
  return statusConfig?.color || "bg-gray-100 text-gray-800";
};

const getPaymentMethodIcon = (paymentMethod: string) => {
  return paymentMethod === "Card" ? (
    <CreditCard className="w-4 h-4" />
  ) : (
    <Banknote className="w-4 h-4" />
  );
};

export function OrderManagement({ orders, onOrderStatusChange }: OrderManagementProps) {
  const addTestOrder = () => {
    // This would typically create a new order, but for demo purposes we'll just log
    console.log("Add test order clicked");
  };

  return (
    <div className="space-y-6">
      <section className="bg-orange-50 rounded-xl shadow p-6">
        <h2 className="text-xl font-bold mb-4 text-orange-600">Incoming Orders</h2>
        
        {orders.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No orders yet.</p>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <Card key={order.id} className="border-l-4 border-l-orange-400">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        {order.id}
                      </CardTitle>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {order.time}
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {order.customer}
                        </div>
                        <div className="flex items-center gap-1">
                          {getPaymentMethodIcon(order.paymentMethod)}
                          {order.paymentMethod}
                        </div>
                      </div>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                        <Package className="w-4 h-4" />
                        Items
                      </label>
                      <ul className="text-sm text-gray-600">
                        {order.items.map((item, index) => (
                          <li key={index}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Total
                      </label>
                      <p className="text-lg font-semibold text-orange-600">{order.total}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Update Status
                      </label>
                      <Select
                        value={order.status}
                        onValueChange={(newStatus) => onOrderStatusChange(order.id, newStatus)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          {orderStatuses.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
      
      <div>
        <Button 
          onClick={addTestOrder}
          className="bg-gradient-to-r from-red-500 to-orange-400 text-white"
        >
          Add Test Order
        </Button>
      </div>
    </div>
  );
}
