
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Package, Clock, Car, Fuel } from "lucide-react";
import { useState } from "react";
import { VehicleManagement } from "@/components/VehicleManagement";

interface Order {
  id: string;
  restaurant: string;
  customer: string;
  pickupAddress: string;
  deliveryAddress: string;
  status: string;
  time: string;
  items: string[];
}

export default function DriverDashboard() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"orders" | "vehicles">("orders");
  
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "Order #101",
      restaurant: "Sunrise Diner",
      customer: "Maria Garcia",
      pickupAddress: "17 C/ Real, Nerja",
      deliveryAddress: "9 Calle Pintada, Nerja",
      status: "Ready",
      time: "12:30 PM",
      items: ["Paella Valenciana", "Gazpacho", "Sangria"]
    },
    {
      id: "Order #102",
      restaurant: "Spice Symphony",
      customer: "John Smith",
      pickupAddress: "12 Plaza Balcón, Torrox",
      deliveryAddress: "14 Av. Castilla Perez, Nerja",
      status: "Assigned",
      time: "12:45 PM",
      items: ["Chicken Curry", "Naan Bread", "Mango Lassi"]
    }
  ]);

  const openGoogleMaps = (address: string, type: 'pickup' | 'delivery') => {
    const encodedAddress = encodeURIComponent(address);
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
    window.open(googleMapsUrl, '_blank');
  };

  const getStatusColor = (status: string) => {
    const statusColors: { [key: string]: string } = {
      "New": "bg-yellow-200 text-yellow-800",
      "Assigned": "bg-yellow-100 text-yellow-900", 
      "Ready": "bg-green-100 text-green-800",
      "Collected": "bg-blue-100 text-blue-800",
      "Delivered": "bg-gray-100 text-gray-800",
      "Returned": "bg-red-100 text-red-800"
    };
    return statusColors[status] || "bg-gray-100 text-gray-800";
  };

  const canUpdateStatus = (currentStatus: string) => {
    return currentStatus === "Ready" || currentStatus === "Collected";
  };

  const getAvailableStatusUpdates = (currentStatus: string) => {
    if (currentStatus === "Ready") {
      return ["Collected"];
    }
    if (currentStatus === "Collected") {
      return ["Delivered", "Returned"];
    }
    return [];
  };

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus }
          : order
      )
    );
    
    toast({
      title: "Status Updated",
      description: `${orderId} marked as ${newStatus}`,
    });
  };

  return (
    <main className="min-h-screen bg-white pb-8">
      <Header />
      <section className="w-full max-w-2xl mx-auto px-4 py-6 mt-6 mb-8 rounded-lg bg-orange-50 border border-orange-200 shadow-sm">
        <h2 className="text-lg font-semibold text-orange-700 mb-2">Driver Dashboard</h2>
        <p className="text-gray-700">
          Manage your delivery orders and vehicles. Click on addresses to get directions and update order status as you progress.
        </p>
      </section>

      {/* Tab Navigation */}
      <section className="w-full max-w-4xl mx-auto px-4 mb-6">
        <div className="flex gap-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("orders")}
            className={`pb-2 px-1 font-medium text-sm border-b-2 transition-colors ${
              activeTab === "orders"
                ? "border-orange-500 text-orange-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <Package className="w-4 h-4 inline mr-2" />
            Orders
          </button>
          <button
            onClick={() => setActiveTab("vehicles")}
            className={`pb-2 px-1 font-medium text-sm border-b-2 transition-colors ${
              activeTab === "vehicles"
                ? "border-orange-500 text-orange-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <Car className="w-4 h-4 inline mr-2" />
            Vehicles
          </button>
        </div>
      </section>
      
      <section className="w-full max-w-4xl mx-auto px-4">
        {activeTab === "orders" && (
          <div className="space-y-4">
            {orders.map(order => (
              <Card key={order.id} className="border border-orange-200 shadow">
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
                        <span className="text-orange-500 font-medium">{order.restaurant}</span>
                      </div>
                      <div className="text-sm text-gray-600">Customer: {order.customer}</div>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="w-4 h-4 text-orange-500" />
                        <span className="font-medium">Pickup:</span>
                        <button 
                          onClick={() => openGoogleMaps(order.pickupAddress, "pickup")}
                          className="text-blue-600 hover:text-blue-800 underline ml-1"
                        >
                          {order.pickupAddress}
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="w-4 h-4 text-green-500" />
                        <span className="font-medium">Drop-off:</span>
                        <button 
                          onClick={() => openGoogleMaps(order.deliveryAddress, "delivery")}
                          className="text-blue-600 hover:text-blue-800 underline ml-1"
                        >
                          {order.deliveryAddress}
                        </button>
                      </div>
                      
                      <div className="flex items-start gap-1 text-sm">
                        <Package className="w-4 h-4 mt-0.5" />
                        <div>
                          <span className="font-medium">Items:</span>
                          <ul className="text-gray-600 ml-1">
                            {order.items.map((item, index) => (
                              <li key={index}>• {item}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col justify-center">
                      <h4 className="font-medium text-gray-700 mb-3">Update Status</h4>
                      {canUpdateStatus(order.status) ? (
                        <div className="flex flex-wrap gap-2">
                          {getAvailableStatusUpdates(order.status).map(status => (
                            <Button
                              key={status}
                              onClick={() => updateOrderStatus(order.id, status)}
                              variant="outline"
                              size="sm"
                              className="bg-orange-50 border-orange-200 hover:bg-orange-100"
                            >
                              Mark as {status}
                            </Button>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">
                          No status updates available for {order.status} orders
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === "vehicles" && <VehicleManagement />}
      </section>
    </main>
  );
}
