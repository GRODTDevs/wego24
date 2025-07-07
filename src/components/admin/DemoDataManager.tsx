import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function DemoDataManager() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  async function insertDemoData() {
    setLoading(true);
    setResult("");
    try {
      const demoProfileId = "63b5d9eb-ba28-4c29-99c4-68f4d845411b";
      const demoProfile = [{
        id: demoProfileId,
        first_name: "Demo",
        last_name: "User",
        email: "demo.user@wego24.com",
        is_demo: true,
        city: "Demo City",
        country: "DemoLand",
        roles: ["user", "demo"],
        is_active: true,
      }];
      const demoDrivers = [
        { name: "Demo Driver 1", email: "demo.driver1@wego24.com", phone: "+34000000001", is_demo: true, vehicle_type: "car" },
        { name: "Demo Driver 2", email: "demo.driver2@wego24.com", phone: "+34000000002", is_demo: true, vehicle_type: "car" },
      ];
      const demoRestaurants = [
        {
          name: "Demo Restaurant 1",
          email: "demo.rest1@wego24.com",
          is_demo: true,
          address: "123 Demo St",
          city: "Demo City"
        },
        {
          name: "Demo Restaurant 2",
          email: "demo.rest2@wego24.com",
          is_demo: true,
          address: "456 Example Ave",
          city: "Demo City"
        },
      ];
      const demoMenuItems = [
        { name: "Demo Pizza", price: 10.99, is_demo: true },
        { name: "Demo Burger", price: 8.99, is_demo: true },
      ];
      const { data: profileData, error: profileErr } = await supabase
        .from("profiles")
        .insert(demoProfile)
        .select();
      if (profileErr) { throw profileErr; }
      const { data: drivers, error: driverErr } = await supabase
        .from("drivers")
        .insert(demoDrivers)
        .select();
      if (driverErr) { throw driverErr; }
      const { data: restaurants, error: restErr } = await supabase
        .from("restaurants")
        .insert(demoRestaurants)
        .select();
      if (restErr) { throw restErr; }
      if (restaurants && restaurants[0]) {
        const menuItems = demoMenuItems.map(item => ({
          ...item,
          restaurant_id: restaurants[0].id,
        }));
        const { error: menuErr } = await supabase.from("menu_items").insert(menuItems);
        if (menuErr) { throw menuErr; }
      }
      if (drivers && drivers[0] && restaurants && restaurants[0] && demoProfileId) {
        const demoOrder = [{
          business_id: restaurants[0].id,
          customer_id: demoProfileId,
          status: "pending",
          total_amount: 19.98,
          subtotal: 17.98,
          tax_amount: 2.00,
          delivery_fee: 0.00,
          service_fee: 0.00,
          payment_status: "pending",
          payment_method: "cash",
          delivery_address: { street: "123 Demo St", city: "Demo City" },
          delivery_instructions: "Leave at door",
          driver_id: drivers[0].id,
          is_demo: true,
        }];
        const { error: orderErr } = await supabase
          .from("orders")
          .insert(demoOrder);
        if (orderErr) { throw orderErr; }
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
      await supabase.from("orders").delete().eq("is_demo", true);
      await supabase.from("menu_items").delete().eq("is_demo", true);
      await supabase.from("restaurants").delete().eq("is_demo", true);
      await supabase.from("drivers").delete().eq("is_demo", true);
      await supabase.from("profiles").delete().eq("is_demo", true);
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
