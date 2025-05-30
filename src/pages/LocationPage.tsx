
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Header } from "@/components/Header";
import { OrderCart } from "@/components/OrderCart";
import { MenuItemCard } from "@/components/MenuItemCard";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { toast } from "sonner";

type Location = Tables<"restaurants">;
type MenuItem = Tables<"menu_items">;

const demoMenus = [
  {
    title: "Breakfast Combo",
    description: "Eggs, bacon, toast & coffee",
    price: 7.99,
  },
  {
    title: "Classic Burger",
    description: "100% beef, cheese, lettuce, tomato, fries",
    price: 10.5
  },
  {
    title: "Fresh Garden Salad",
    description: "Seasonal greens, vinaigrette",
    price: 5.95
  }
];

export default function LocationPage() {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  const [location, setLocation] = useState<Location | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Cart State
  const [cart, setCart] = useState<{ [title: string]: { price: number; quantity: number } }>({});
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    if (name) {
      fetchLocation(decodeURIComponent(name));
    }
  }, [name]);

  const fetchLocation = async (locationName: string) => {
    try {
      const { data: locationData, error: locationError } = await supabase
        .from("restaurants")
        .select("*")
        .eq("name", locationName)
        .eq("status", "active")
        .single();

      if (locationError) throw locationError;
      setLocation(locationData);

      // Fetch menu items for this location
      const { data: menuData, error: menuError } = await supabase
        .from("menu_items")
        .select("*")
        .eq("restaurant_id", locationData.id)
        .eq("status", "available")
        .order("display_order", { ascending: true });

      if (menuError) throw menuError;
      setMenuItems(menuData || []);
    } catch (error) {
      console.error("Error fetching location:", error);
      toast.error("Location not found");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = (item: typeof demoMenus[0]) => {
    setCart(prev => ({
      ...prev,
      [item.title]: {
        price: item.price,
        quantity: (prev[item.title]?.quantity || 0) + 1
      }
    }));
  };

  const handleRemove = (item: typeof demoMenus[0]) => {
    setCart(prev => {
      const qty = (prev[item.title]?.quantity || 0) - 1;
      if (qty <= 0) {
        const newCart = { ...prev };
        delete newCart[item.title];
        return newCart;
      } else {
        return { ...prev, [item.title]: { ...prev[item.title], quantity: qty } };
      }
    });
  };

  const handleUpdateQty = (title: string, newQty: number) => {
    setCart(prev => {
      if (newQty <= 0) {
        const newCart = { ...prev };
        delete newCart[title];
        return newCart;
      }
      return { ...prev, [title]: { ...prev[title], quantity: newQty } };
    });
  };

  const handleRemoveItem = (title: string) => {
    setCart(prev => {
      const nextCart = { ...prev };
      delete nextCart[title];
      return nextCart;
    });
  };

  const cartItems = Object.keys(cart).map(title => ({
    title,
    price: cart[title].price,
    quantity: cart[title].quantity
  }));

  const handleCheckout = () => {
    // Demo only: go to a mock "Checkout" (future step)
    alert("Proceed to checkout step (coming soon)");
    setCartOpen(false);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-white">
        <Header />
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </main>
    );
  }

  if (!location) {
    return (
      <main className="min-h-screen bg-white">
        <Header />
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Location Not Found</h2>
            <p className="text-gray-600 mb-4">The location you're looking for doesn't exist or is not available.</p>
            <Button onClick={() => navigate("/")} className="bg-gradient-to-r from-red-500 to-orange-400">
              Back to Home
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white relative pb-10">
      <Header />
      <section className="w-full max-w-3xl mx-auto px-4 py-6 mb-4 mt-4 rounded-lg bg-orange-50 border border-orange-200 shadow-sm">
        <h2 className="text-lg font-semibold text-orange-700 mb-1">Location Page Demo</h2>
        <p className="text-gray-700">
          This page is the public ordering page for a location. Product Owners: this is a demo UI for browsing a menu, adjusting item quantities, and adding to a cart.<br />
          <span className="font-medium text-orange-500">Product Owner Steps:</span>
          <ul className="list-disc pl-6 text-gray-600 mt-1 text-sm">
            <li>Click + to add menu items to your cart.</li>
            <li>Adjust item quantity using +/- buttons.</li>
            <li>Open the cart & simulate checking out your order.</li>
            <li>All data is local until future backend/database is added.</li>
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
          {location.name}
        </h2>
        <Button
          className="ml-auto bg-gradient-to-r from-orange-400 to-red-400 text-white font-semibold"
          onClick={() => setCartOpen(true)}
        >
          View Cart ({cartItems.reduce((total, item) => total + item.quantity, 0)})
        </Button>
      </div>
      <section className="flex flex-col items-center px-4">
        <img
          src={location.banner_url || location.image_url || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80"}
          alt={location.name}
          className="w-full max-w-lg rounded-lg shadow mb-4 aspect-[3/1] object-cover"
        />
        <div className="max-w-xl w-full bg-white rounded-xl shadow p-6 flex flex-col gap-6">
          <div className="mb-2">
            <h3 className="text-xl font-bold text-red-500 mb-2">Featured Menu</h3>
            {menuItems.length > 0 ? (
              <ul className="space-y-3">
                {menuItems.map((item) => (
                  <MenuItemCard
                    key={item.id}
                    title={item.name}
                    description={item.description || ""}
                    price={Number(item.price)}
                    quantity={cart[item.name]?.quantity || 0}
                    onAdd={() => handleAdd({ title: item.name, description: item.description || "", price: Number(item.price) })}
                    onRemove={() => handleRemove({ title: item.name, description: item.description || "", price: Number(item.price) })}
                  />
                ))}
              </ul>
            ) : (
              <div>
                <p className="text-gray-600 mb-4">Menu items coming soon! For now, here's a demo menu:</p>
                <ul className="space-y-3">
                  {demoMenus.map((item) => (
                    <MenuItemCard
                      key={item.title}
                      title={item.title}
                      description={item.description}
                      price={item.price}
                      quantity={cart[item.title]?.quantity || 0}
                      onAdd={() => handleAdd(item)}
                      onRemove={() => handleRemove(item)}
                    />
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>
      <OrderCart
        open={cartOpen}
        items={cartItems}
        onUpdateQty={handleUpdateQty}
        onRemove={handleRemoveItem}
        onClose={() => setCartOpen(false)}
        onCheckout={handleCheckout}
      />
    </main>
  );
}
