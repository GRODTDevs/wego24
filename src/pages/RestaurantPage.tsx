import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Header } from "@/components/Header";

const demoMenus = [
  {
    title: "Breakfast Combo",
    description: "Eggs, bacon, toast & coffee",
    price: "$7.99",
  },
  {
    title: "Classic Burger",
    description: "100% beef, cheese, lettuce, tomato, fries",
    price: "$10.50"
  },
  {
    title: "Fresh Garden Salad",
    description: "Seasonal greens, vinaigrette",
    price: "$5.95"
  }
];

export default function RestaurantPage() {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-white relative pb-10">
      <Header />
      <section className="w-full max-w-3xl mx-auto px-4 py-6 mb-4 mt-4 rounded-lg bg-orange-50 border border-orange-200 shadow-sm">
        <h2 className="text-lg font-semibold text-orange-700 mb-1">Restaurant Page Demo</h2>
        <p className="text-gray-700">
          This is a sample menu page for a selected restaurant.<br />
          <span className="font-medium text-orange-500">Product Owner Steps:</span>
          <ul className="list-disc pl-6 text-gray-600 mt-1 text-sm">
            <li>Explore sample menu items (static data).</li>
            <li>Test the "Order" button to simulate a customer experience.</li>
            <li>Return to home or restaurant dashboard to try other flows.</li>
          </ul>
        </p>
      </section>
      <div className="bg-orange-50 w-full py-4 px-4 border-b border-orange-200 mb-4 flex items-center gap-2 sticky top-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          aria-label="Back"
          className="mr-2"
        >
          <ChevronRight className="rotate-180 text-orange-400" />
        </Button>
        <h2 className="font-bold text-lg text-orange-900 tracking-tight">
          {decodeURIComponent(name || "")}
        </h2>
      </div>
      <section className="flex flex-col items-center px-4">
        <img
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80"
          alt={name}
          className="w-full max-w-lg rounded-lg shadow mb-4 aspect-[3/1] object-cover"
        />
        <div className="max-w-xl w-full bg-white rounded-xl shadow p-6 flex flex-col gap-6">
          <div className="mb-2">
            <h3 className="text-xl font-bold text-red-500 mb-2">Featured Menu</h3>
            <ul className="space-y-3">
              {demoMenus.map((item) => (
                <li
                  key={item.title}
                  className="flex flex-col gap-0.5 border-b last:border-b-0 pb-3 last:pb-0"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">{item.title}</span>
                    <span className="font-medium text-orange-500">{item.price}</span>
                  </div>
                  <span className="text-gray-500 text-sm">{item.description}</span>
                </li>
              ))}
            </ul>
          </div>
          <Button className="w-full bg-gradient-to-r from-orange-400 to-red-400 text-white font-bold">
            Order (Demo)
          </Button>
        </div>
      </section>
    </main>
  );
}
