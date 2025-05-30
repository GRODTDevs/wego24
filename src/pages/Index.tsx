
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { LocationCard } from "@/components/LocationCard";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { InfoModal } from "@/components/InfoModal";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { User, LogIn, LogOut, MapPin } from "lucide-react";
import { toast } from "sonner";

type Location = Tables<"restaurants">;

const Index = () => {
  const [search, setSearch] = useState("");
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, signOut, loading: authLoading } = useAuth();

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const { data, error } = await supabase
        .from("restaurants")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setLocations(data || []);
    } catch (error) {
      console.error("Error fetching locations:", error);
      toast.error("Failed to load locations");
    } finally {
      setLoading(false);
    }
  };

  const filteredLocations = search.length === 0
    ? locations
    : locations.filter(location =>
        location.name.toLowerCase().includes(search.toLowerCase()) ||
        (location.cuisine_type && location.cuisine_type.toLowerCase().includes(search.toLowerCase())) ||
        location.city.toLowerCase().includes(search.toLowerCase())
      );

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      
      <main className="flex-1 relative pb-16">
        {/* Auth section */}
        <div className="absolute top-4 right-4 z-20">
          {authLoading ? (
            <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          ) : user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-md">
                <User className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-medium text-gray-700">
                  Welcome, {user.user_metadata?.first_name || "User"}!
                </span>
              </div>
              <Button
                onClick={handleSignOut}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </div>
          ) : (
            <Link to="/auth">
              <Button className="bg-gradient-to-r from-red-500 to-orange-400 hover:from-orange-400 hover:to-red-500 text-white flex items-center gap-2">
                <LogIn className="w-4 h-4" />
                Login / Sign Up
              </Button>
            </Link>
          )}
        </div>

        {/* Subtle radial gradient background */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="w-[900px] h-[900px] bg-gradient-radial from-orange-100 via-white to-transparent rounded-full absolute left-1/2 -top-52 -translate-x-1/2 opacity-60"></div>
          <div className="w-[500px] h-[500px] bg-gradient-radial from-red-100 via-white to-transparent rounded-full absolute right-10 top-1/3 opacity-40"></div>
        </div>
        
        <div className="relative z-10 flex flex-col items-center pt-20 px-4">
          <span className="text-sm font-medium text-orange-600 tracking-widest mb-2 animate-fade-in">FRIGILIANA, NERJA, TORROX</span>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900 text-center">
            Local Delivery <span className="text-red-500">Near You</span>
          </h1>
          <p className="text-gray-600 text-lg mb-6 text-center max-w-md">
            Order from your favorite local businesses, track your order, and enjoy fast delivery.
          </p>
          <div className="flex w-full max-w-md justify-center mb-8 gap-2">
            <input
              className="w-full px-5 py-3 rounded-lg border border-orange-200 focus:ring-2 focus:ring-orange-400 outline-none shadow-sm bg-white placeholder:text-gray-400"
              placeholder="Search businesses or locations..."
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

          {/* Locations grid */}
          <section className="w-full max-w-5xl mx-auto">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : filteredLocations.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {filteredLocations.map((location, idx) => (
                  <LocationCard
                    key={location.id}
                    name={location.name}
                    businessType={location.cuisine_type || "Business"}
                    image={location.image_url || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80"}
                    highlightColor={idx % 2 === 0 ? "red" : "orange"}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <MapPin className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Locations Available</h3>
                <p className="text-gray-600 mb-6">
                  We're working on adding local businesses to your area. Check back soon!
                </p>
                {search && (
                  <p className="text-sm text-gray-500">
                    No results found for "{search}". Try a different search term.
                  </p>
                )}
              </div>
            )}
          </section>
        </div>

        {/* Info Modal */}
        <InfoModal />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
