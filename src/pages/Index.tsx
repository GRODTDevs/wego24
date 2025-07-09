import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Info, Building2 } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { toast } from "sonner";
import { useTranslation } from "@/contexts/TranslationContext";

// Ensure all text is wrapped with t('...') and translation keys exist in your translation files (en.json, es.json, etc.)

type Location = Tables<"restaurants">;

const Index = () => {
  const [search, setSearch] = useState("");
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();
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

      if (error) {
        throw error;
      }
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

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Delivery Section */}
        <section className="relative h-[340px] md:h-[400px] flex items-center justify-center bg-gray-900 bg-cover bg-center" style={{ backgroundImage: `url('/lovable-uploads/363cf1fe-e5d2-4476-ade0-61691f9e5f58.png')` }}>
          <div className="absolute inset-0 bg-black bg-opacity-60" />
          <div className="relative z-10 flex flex-col items-center text-center px-4">
            <span className="text-sm font-medium text-orange-300 tracking-widest mb-2">{t('home.courier.badge')}</span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3">
              {t('home.courier.title')}
            </h1>
            <p className="text-lg text-orange-100 mb-6 max-w-xl">
              {t('home.courier.description')}
            </p>
            <Link to="/courier-request">
              <Button className="bg-gradient-to-r from-red-500 to-orange-400 hover:from-orange-400 hover:to-red-500 text-white font-semibold h-14 px-8 shadow-lg flex items-center gap-3 text-lg">
                <span role="img" aria-label="courier">🚚</span> {t('home.getCourier')}
              </Button>
            </Link>
          </div>
        </section>

        {/* Partner Signup Section */}
        <section className="py-20 px-4 bg-white">
          <div className="flex flex-col items-center max-w-4xl mx-auto text-center">
            <span className="text-sm font-medium text-blue-600 tracking-widest mb-4">{t('partner.info.heroTitle')}</span>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-gray-900">
              {t('partner.info.heroDescription')}
            </h2>
            <p className="text-gray-600 text-lg mb-8 max-w-2xl">
              {t('partner.info.ctaDesc')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/partner-info">
                <Button
                  variant="outline"
                  className="h-14 px-8 shadow-lg flex items-center gap-3 text-lg font-semibold"
                  type="button"
                >
                  <Info className="w-5 h-5" />
                  {t('partner.info.learnMore')}
                </Button>
              </Link>
              <Link to="/partner-register">
                <Button
                  className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-400 hover:to-blue-600 text-white font-semibold h-14 px-8 shadow-lg flex items-center gap-3 text-lg"
                  type="button"
                >
                  <Building2 className="w-5 h-5" />
                  {t('partner.info.applyNow')}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
