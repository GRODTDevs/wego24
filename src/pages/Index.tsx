
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { LocationCard } from "@/components/LocationCard";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { InfoModal } from "@/components/InfoModal";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "@/contexts/TranslationContext";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { User, LogIn, LogOut, Truck, Building2, Search, Info } from "lucide-react";
import { toast } from "sonner";

type Location = Tables<"restaurants">;

const Index = () => {
  const [search, setSearch] = useState("");
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, signOut, loading: authLoading } = useAuth();
  const { t } = useTranslation();

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
    try {
      console.log('Starting sign out process...');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
        toast.error("Failed to sign out: " + error.message);
      } else {
        console.log('Sign out successful');
        toast.success("Signed out successfully");
      }
    } catch (error) {
      console.error('Unexpected sign out error:', error);
      toast.error("An unexpected error occurred during sign out");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Auth section */}
        <div className="absolute top-20 right-4 z-20">
          {authLoading ? (
            <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          ) : user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-md">
                <User className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-medium text-gray-700">
                  {t('home.welcome')} {user.user_metadata?.first_name || "User"}!
                </span>
              </div>
              <Button
                onClick={handleSignOut}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                {t('home.signOut')}
              </Button>
            </div>
          ) : (
            <Link to="/auth">
              <Button className="bg-gradient-to-r from-red-500 to-orange-400 hover:from-orange-400 hover:to-red-500 text-white flex items-center gap-2">
                <LogIn className="w-4 h-4" />
                {t('home.loginButton')}
              </Button>
            </Link>
          )}
        </div>

        {/* Section 1: Local Delivery Search */}
        <section className="relative py-20 px-4">
          {/* Subtle radial gradient background */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="w-[900px] h-[900px] bg-gradient-radial from-orange-100 via-white to-transparent rounded-full absolute left-1/2 -top-52 -translate-x-1/2 opacity-60"></div>
            <div className="w-[500px] h-[500px] bg-gradient-radial from-red-100 via-white to-transparent rounded-full absolute right-10 top-1/3 opacity-40"></div>
          </div>
          
          <div className="relative z-10 flex flex-col items-center max-w-5xl mx-auto">
            <span className="text-sm font-medium text-orange-600 tracking-widest mb-2 animate-fade-in">{t('home.delivery.badge')}</span>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900 text-center">
              {t('home.delivery.title')} <span className="text-red-500">{t('home.delivery.titleHighlight')}</span>
            </h1>
            <p className="text-gray-600 text-lg mb-8 text-center max-w-md">
              {t('home.delivery.description')}
            </p>
            
            <div className="flex w-full max-w-md gap-2 mb-12">
              <input
                className="w-full px-5 py-3 rounded-lg border border-orange-200 focus:ring-2 focus:ring-orange-400 outline-none shadow-sm bg-white placeholder:text-gray-400"
                placeholder={t('home.searchPlaceholder')}
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <Button
                className="bg-gradient-to-r from-red-500 to-orange-400 hover:from-orange-400 hover:to-red-500 text-white font-semibold h-12 px-6 shadow-md flex items-center gap-2"
                type="button"
              >
                <Search className="w-4 h-4" />
                {t('home.searchButton')}
              </Button>
            </div>

            {/* Locations grid */}
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : filteredLocations.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full">
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
            ) : null}
          </div>
        </section>

        {/* Section 2: Get a Courier */}
        <section 
          className="relative py-20 px-4 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('/lovable-uploads/eea68027-6b2e-4c4c-97ff-8f21f0181a9b.png')` }}
        >
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
          
          <div className="relative z-10 flex flex-col items-center max-w-4xl mx-auto text-center">
            <span className="text-sm font-medium text-orange-300 tracking-widest mb-4">{t('home.courier.badge')}</span>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-white">
              {t('home.courier.title')}
            </h2>
            <p className="text-gray-200 text-lg mb-8 max-w-2xl">
              {t('home.courier.description')}
            </p>
            <Link to="/courier-request">
              <Button
                className="bg-gradient-to-r from-red-500 to-orange-400 hover:from-orange-400 hover:to-red-500 text-white font-semibold h-14 px-8 shadow-lg flex items-center gap-3 text-lg"
                type="button"
              >
                <Truck className="w-5 h-5" />
                {t('home.getCourier')}
              </Button>
            </Link>
          </div>
        </section>

        {/* Section 3: Become a Partner */}
        <section className="py-20 px-4 bg-white">
          <div className="flex flex-col items-center max-w-4xl mx-auto text-center">
            <span className="text-sm font-medium text-blue-600 tracking-widest mb-4">{t('home.partner.badge')}</span>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-gray-900">
              {t('home.partner.title')}
            </h2>
            <p className="text-gray-600 text-lg mb-8 max-w-2xl">
              {t('home.partner.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/partner-info">
                <Button
                  variant="outline"
                  className="h-14 px-8 shadow-lg flex items-center gap-3 text-lg font-semibold"
                  type="button"
                >
                  <Info className="w-5 h-5" />
                  Learn More
                </Button>
              </Link>
              <Link to="/partner-register">
                <Button
                  className="bg-gradient-to-r from-red-500 to-orange-400 hover:from-orange-400 hover:to-red-500 text-white font-semibold h-14 px-8 shadow-lg flex items-center gap-3 text-lg"
                  type="button"
                >
                  <Building2 className="w-5 h-5" />
                  {t('home.partner.button')}
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Info Modal */}
        <InfoModal />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
