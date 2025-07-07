import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function DemoDataManager() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  // Demo data definitions
  const demoDrivers = [
    { name: "Demo Driver 1", email: "demo.driver1@wego24.com", phone: "+34000000001", is_demo: true },
    { name: "Demo Driver 2", email: "demo.driver2@wego24.com", phone: "+34000000002", is_demo: true },
  ];
  const demoRestaurants = [
    { name: "Demo Restaurant 1", email: "demo.rest1@wego24.com", is_demo: true },
    { name: "Demo Restaurant 2", email: "demo.rest2@wego24.com", is_demo: true },
  ];
  const demoMenuItems = [
    { name: "Demo Pizza", price: 10.99, is_demo: true },
    { name: "Demo Burger", price: 8.99, is_demo: true },
  ];

  async function insertDemoData() {
    setLoading(true);
    setResult("");
    try {
      // Insert demo drivers
      const { data: drivers, error: driverErr } = await supabase
        .from("drivers")
        .insert(demoDrivers)
        .select();
      if (driverErr) throw driverErr;
      // Insert demo restaurants
      const { data: restaurants, error: restErr } = await supabase
        .from("restaurants")
        .insert(demoRestaurants)
        .select();
      if (restErr) throw restErr;
      // Insert menu items for first restaurant
      if (restaurants && restaurants[0]) {
        const menuItems = demoMenuItems.map(item => ({
          ...item,
          restaurant_id: restaurants[0].id,
        }));
        const { error: menuErr } = await supabase.from("menu_items").insert(menuItems);
        if (menuErr) throw menuErr;
      }
      // Insert a demo order for first driver and restaurant
      if (drivers && drivers[0] && restaurants && restaurants[0]) {
        const { data: order, error: orderErr } = await supabase
          .from("orders")
          .insert({
            customer_name: "Demo Customer",
            restaurant_id: restaurants[0].id,
            driver_id: drivers[0].id,
            status: "pending",
            total_amount: 19.98,
            is_demo: true,
          })
          .select();
        if (orderErr) throw orderErr;
      }
      setResult("Demo data inserted successfully.");
    } catch (err: any) {
      setResult("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  async function deleteDemoData() {
    setLoading(true);
    setResult("");
    try {
      // Delete demo orders
      await supabase.from("orders").delete().eq("is_demo", true);
      // Delete demo menu items
      await supabase.from("menu_items").delete().eq("is_demo", true);
      // Delete demo restaurants
      await supabase.from("restaurants").delete().eq("is_demo", true);
      // Delete demo drivers
      await supabase.from("drivers").delete().eq("is_demo", true);
      setResult("Demo data deleted successfully.");
    } catch (err: any) {
      setResult("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle>Demo Data Manager</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={insertDemoData} disabled={loading} className="w-full">
            {loading ? "Inserting..." : "Insert Demo Data"}
          </Button>
          <Button onClick={deleteDemoData} disabled={loading} variant="destructive" className="w-full">
            {loading ? "Deleting..." : "Delete Demo Data"}
          </Button>
          {result && <div className="text-center mt-2">{result}</div>}
        </CardContent>
      </Card>
    </div>
  );
}
