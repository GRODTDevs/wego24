import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function ShopPage() {
  const { slug } = useParams();
  const [settings, setSettings] = useState<any>(null);
  const [restaurant, setRestaurant] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShop = async () => {
      setLoading(true);
      setError(null);
      // Fetch restaurant_settings by slug
      const { data: settingsData, error: settingsError } = await supabase
        .from("restaurant_settings")
        .select("*")
        .eq("slug", slug)
        .single();
      if (settingsError || !settingsData) {
        setError("Shop not found");
        setLoading(false);
        return;
      }
      setSettings(settingsData);
      // Fetch restaurant by restaurant_id
      const { data: restaurantData, error: restError } = await supabase
        .from("restaurants")
        .select("*")
        .eq("id", settingsData.restaurant_id)
        .single();
      if (restError || !restaurantData) {
        setError("Restaurant not found");
        setLoading(false);
        return;
      }
      setRestaurant(restaurantData);
      // Fetch products/menu for this restaurant
      const { data: productsData, error: productsError } = await supabase
        .from("products")
        .select("*")
        .eq("restaurant_id", settingsData.restaurant_id)
        .order("created_at", { ascending: true });
      if (productsError) {
        setError("Failed to load products");
        setProducts([]);
      } else {
        setProducts(productsData || []);
      }
      setLoading(false);
    };
    if (slug) fetchShop();
  }, [slug]);

  if (loading) return <div className="p-8 text-center">Loading shop...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
  if (!settings || !restaurant) return <div className="p-8 text-center">Shop not found.</div>;

  return (
    <div className="min-h-screen bg-white">
      {/* Banner */}
      {settings.banner_url && (
        <div className="w-full h-48 bg-cover bg-center mb-4" style={{ backgroundImage: `url(${settings.banner_url})` }} />
      )}
      <div className="max-w-4xl mx-auto p-6">
        {/* Logo and name */}
        <div className="flex items-center gap-4 mb-6">
          {settings.logo_url && (
            <img src={settings.logo_url} alt="Logo" className="h-16 w-16 rounded-full object-cover border" />
          )}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{restaurant.name}</h1>
            {settings.description && <p className="text-gray-600 mt-1">{settings.description}</p>}
          </div>
        </div>
        {/* Menu/products */}
        <h2 className="text-xl font-semibold mb-4">Menu</h2>
        {products.length === 0 ? (
          <div className="text-gray-500">No products available yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {products.map(product => (
              <div key={product.id} className="border rounded-lg p-4 flex flex-col gap-2 bg-gray-50">
                <div className="font-bold text-lg">{product.name}</div>
                {product.image_url && <img src={product.image_url} alt={product.name} className="h-32 w-full object-cover rounded" />}
                <div className="text-gray-700">{product.description}</div>
                <div className="text-red-600 font-semibold">€{product.price?.toFixed(2)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
