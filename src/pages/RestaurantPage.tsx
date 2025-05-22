
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Header } from "@/components/Header";
import { OrderCart } from "@/components/OrderCart";
import { MenuItemCard } from "@/components/MenuItemCard";

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

export default function RestaurantPage() {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();

  // Cart State
  const [cart, setCart] = useState<{ [title: string]: { price: number; quantity: number } }>({});
  const [cartOpen, setCartOpen] = useState(false);

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

  return (
    <main className="min-h-screen bg-white relative pb-10">
      <Header />
      <section className="w-full max-w-3xl mx-auto px-4 py-6 mb-4 mt-4 rounded-lg bg-orange-50 border border-orange-200 shadow-sm">
        <h2 className="text-lg font-semibold text-orange-700 mb-1">Restaurant Page Demo</h2>
        <p className="text-gray-700">
          This page is the public ordering page for a restaurant. Product Owners: this is a demo UI for browsing a menu, adjusting item quantities, and adding to a cart.<br />
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
          {decodeURIComponent(name || "")}
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
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80"
          alt={name}
          className="w-full max-w-lg rounded-lg shadow mb-4 aspect-[3/1] object-cover"
        />
        <div className="max-w-xl w-full bg-white rounded-xl shadow p-6 flex flex-col gap-6">
          <div className="mb-2">
            <h3 className="text-xl font-bold text-red-500 mb-2">Featured Menu</h3>
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
