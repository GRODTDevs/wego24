import { useEffect, useState } from "react";
import { useSystemSettings } from "@/contexts/SystemSettingsContext";
import { supabase } from "@/integrations/supabase/client";

export default function LivePackageTracking({ orderId }) {
  const { settings } = useSystemSettings();
  const [location, setLocation] = useState(null);
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (!orderId) {
      return;
    }
    supabase.from("orders").select("*", { count: "exact" }).eq("id", orderId).single().then(({ data }) => setOrder(data));
  }, [orderId]);

  useEffect(() => {
    if (!order || !order.driver_id) {
      return;
    }
    // Subscribe to driver's location updates
    const channel = supabase
      .channel("driver_locations")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "driver_locations", filter: `order_id=eq.${orderId}` },
        (payload) => setLocation(payload.new)
      )
      .subscribe();
    // Initial fetch
    supabase.from("driver_locations").select("*").eq("order_id", orderId).single().then(({ data }) => setLocation(data));
    return () => { supabase.removeChannel(channel); };
  }, [order]);

  if (!settings.enable_live_tracking) {
    return null;
  }
  if (!order) return <div>Loading order...</div>;
  if (!order.driver_id) return <div>No driver assigned yet.</div>;

  return (
    <div className="w-full h-64 bg-gray-100 rounded shadow my-4">
      <h3 className="text-lg font-semibold mb-2">Live Package Tracking</h3>
      {location ? (
        <iframe
          title="Driver Location"
          width="100%"
          height="250"
          style={{ border: 0 }}
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${location.lng-0.01}%2C${location.lat-0.01}%2C${location.lng+0.01}%2C${location.lat+0.01}&layer=mapnik&marker=${location.lat}%2C${location.lng}`}
          allowFullScreen
        />
      ) : (
        <div>Waiting for driver location update...</div>
      )}
    </div>
  );
}
