
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { MenuManagement } from "@/components/MenuManagement";
import { OrderManagement } from "@/components/OrderManagement";

const demoOrders = [
  {
    id: "ORD-4001",
    customer: "Alice Johnson",
    items: ["Pizza Margherita", "Cola"],
    status: "Pending",
    total: "€18.80",
    time: "12:41",
    paymentMethod: "Card",
  },
  {
    id: "ORD-4002",
    customer: "Carlos Rivera",
    items: ["Spicy Chicken Curry", "Rice"],
    status: "Accepted",
    total: "€13.50",
    time: "12:44",
    paymentMethod: "Cash",
  },
  {
    id: "ORD-4003",
    customer: "Sophie Martin",
    items: ["Salmon Sushi", "Miso Soup"],
    status: "Preparing",
    total: "€23.00",
    time: "12:52",
    paymentMethod: "Card",
  },
];

export default function RestaurantDashboard() {
  const [activeTab, setActiveTab] = useState<"orders" | "menu">("orders");
  const [orders, setOrders] = useState(demoOrders);

  const handleOrderStatusChange = (orderId: string, newStatus: string) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  return (
    <main className="min-h-screen bg-white py-6">
      <Header />
      <section className="w-full max-w-3xl mx-auto px-4 py-6 mb-6 mt-4 rounded-lg bg-orange-50 border border-orange-200 shadow-sm">
        <h2 className="text-lg font-semibold text-orange-700 mb-1">Restaurant Dashboard Demo</h2>
        <p className="text-gray-700">
          Here, restaurant users can see, accept, and process incoming demo orders, plus manage their menu.<br />
          <span className="font-medium text-orange-500">Product Owner Steps:</span>
          <ul className="list-disc pl-6 text-gray-600 mt-1 text-sm">
            <li>View the order list and process demo orders.</li>
            <li>Switch to Menu Management to add/remove menu items.</li>
            <li>Try switching between customer, restaurant, and (eventually) driver roles.</li>
          </ul>
        </p>
      </section>
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Dashboard</h1>
        
        {/* Tab Navigation */}
        <div className="flex gap-4 mb-6">
          <Button 
            variant={activeTab === "orders" ? "default" : "outline"}
            onClick={() => setActiveTab("orders")}
            className={activeTab === "orders" ? "bg-gradient-to-r from-orange-400 to-red-400 text-white" : ""}
          >
            Orders
          </Button>
          <Button 
            variant={activeTab === "menu" ? "default" : "outline"}
            onClick={() => setActiveTab("menu")}
            className={activeTab === "menu" ? "bg-gradient-to-r from-orange-400 to-red-400 text-white" : ""}
          >
            Menu Management
          </Button>
        </div>

        {/* Tab Content */}
        {activeTab === "orders" ? (
          <OrderManagement orders={orders} onOrderStatusChange={handleOrderStatusChange} />
        ) : (
          <MenuManagement />
        )}
      </div>
    </main>
  );
}
