import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Line, Bar } from "react-chartjs-2";
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function AdvancedAnalyticsPanel() {
  const [deliveryStats, setDeliveryStats] = useState([]);
  const [heatmapData, setHeatmapData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      supabase.rpc("get_delivery_time_stats"), // or use SQL query
      supabase.rpc("get_order_heatmap") // or use SQL query
    ]).then(([statsRes, heatmapRes]) => {
      setDeliveryStats(statsRes.data || []);
      setHeatmapData(heatmapRes.data || []);
      setLoading(false);
    });
  }, []);

  // Example chart data
  const deliveryTimeChart = {
    labels: deliveryStats.map((d) => d.driver_id),
    datasets: [
      {
        label: "Avg Delivery Time (min)",
        data: deliveryStats.map((d) => d.avg_delivery_minutes),
        backgroundColor: "rgba(255,99,132,0.5)",
      },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Advanced Analytics</h2>
      {loading ? <div>Loading analytics...</div> : (
        <>
          <section className="mb-8">
            <h3 className="text-lg font-semibold mb-2">Delivery Time Stats</h3>
            <Bar data={deliveryTimeChart} />
          </section>
          <section className="mb-8">
            <h3 className="text-lg font-semibold mb-2">Order Heatmap (Last 30 Days)</h3>
            <MapContainer center={[36.8, -3.9]} zoom={11} style={{ height: 300, width: "100%" }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {heatmapData.map((pt, i) => (
                <CircleMarker
                  key={i}
                  center={[pt.lat, pt.lng]}
                  radius={Math.max(4, Math.log(pt.order_count) * 4)}
                  color="red"
                  fillOpacity={0.5}
                >
                  <Tooltip>{pt.order_count} orders</Tooltip>
                </CircleMarker>
              ))}
            </MapContainer>
          </section>
          {/* Add churn/retention charts as needed */}
        </>
      )}
    </div>
  );
}
