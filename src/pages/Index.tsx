
import { useState } from "react";
import { RestaurantCard } from "@/components/RestaurantCard";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";

const mockRestaurants = [
  {
    name: "Sunrise Diner",
    cuisine: "American, Breakfast",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Spice Symphony",
    cuisine: "Indian, Curry",
    image: "https://images.pexels.com/photos/20943933/pexels-photo-20943933/free-photo-of-close-up-of-a-person-eating-a-meal.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    name: "La Vita Pizzeria",
    cuisine: "Italian, Pizza",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Tokyo Nights",
    cuisine: "Japanese, Sushi",
    image: "https://images.pexels.com/photos/31002119/pexels-photo-31002119/free-photo-of-vibrant-japanese-lantern-display-in-tokyo.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    name: "Fresh Greens",
    cuisine: "Healthy, Salad",
    image: "https://images.pexels.com/photos/2291347/pexels-photo-2291347.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    name: "Burger Barn",
    cuisine: "Burgers, Sandwiches",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=600&q=80",
  },
];

const Index = () => {
  const [search, setSearch] = useState("");

  const filteredRestaurants = search.length === 0
    ? mockRestaurants
    : mockRestaurants.filter(r =>
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.cuisine.toLowerCase().includes(search.toLowerCase())
      );

  return (
    <main className="min-h-screen bg-white relative pb-16">
      <Header />
      {/* Info section */}
      <section className="w-full max-w-3xl mx-auto px-4 py-6 mb-4 mt-4 rounded-lg bg-orange-50 border border-orange-200 shadow-sm">
        <h2 className="text-lg font-semibold text-orange-700 mb-1">Welcome to the BiteToGo Demo</h2>
        <p className="text-gray-700">
          This is the main customer/home page. Here users can search and select restaurants to view their menu and place demo orders.
          <br />
          <span className="font-medium text-orange-500">Product Owner Steps:</span>
          <ul className="list-disc pl-6 text-gray-600 mt-1 text-sm">
            <li>Try searching or browsing restaurants.</li>
            <li>Click a restaurant to view its menu.</li>
            <li>Use the Restaurant or Driver login to review order and delivery flows.</li>
          </ul>
        </p>
      </section>
      {/* Subtle radial gradient background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="w-[900px] h-[900px] bg-gradient-radial from-orange-100 via-white to-transparent rounded-full absolute left-1/2 -top-52 -translate-x-1/2 opacity-60"></div>
        <div className="w-[500px] h-[500px] bg-gradient-radial from-red-100 via-white to-transparent rounded-full absolute right-10 top-1/3 opacity-40"></div>
      </div>
      <div className="relative z-10 flex flex-col items-center pt-20 px-4">
        <span className="text-sm font-medium text-orange-600 tracking-widest mb-2 animate-fade-in">FRIGILIANA, NERJA, TORROX</span>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900 text-center">
          Food Delivery <span className="text-red-500">Near You</span>
        </h1>
        <p className="text-gray-600 text-lg mb-6 text-center max-w-md">
          Order food from your favorite local spots, track your order, and enjoy fast delivery.
        </p>
        <div className="flex w-full max-w-md justify-center mb-8 gap-2">
          <input
            className="w-full px-5 py-3 rounded-lg border border-orange-200 focus:ring-2 focus:ring-orange-400 outline-none shadow-sm bg-white placeholder:text-gray-400"
            placeholder="Search restaurants or food... "
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <Button
            className="bg-gradient-to-r from-red-500 to-orange-400 hover:from-orange-400 hover:to-red-500 text-white font-semibold h-12 px-6 shadow-md"
            type="button"
          >
            Search
          </Button>
        </div>
        {/* Restaurant grid */}
        <section className="w-full max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {filteredRestaurants.map((r, idx) => (
            <RestaurantCard
              key={r.name}
              name={r.name}
              cuisine={r.cuisine}
              image={r.image}
              highlightColor={idx % 2 === 0 ? "red" : "orange"}
            />
          ))}
        </section>
      </div>
    </main>
  );
};

export default Index;
