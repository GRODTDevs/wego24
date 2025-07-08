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
        phone: "+34000000000",
        is_demo: true,
        city: "Demo City",
        country: "DemoLand",
        roles: ["user", "demo"],
        is_active: true,
      }];
      const demoDrivers = [
        {
          user_id: demoProfileId,
          first_name: "Demo",
          last_name: "Driver 1",
          email: "demo.driver1@wego24.com",
          phone: "+34000000001",
          is_demo: true,
          vehicle_type: "car",
          city: "Demo City",
          is_active: true,
          is_available: true,
          registration_status: "approved",
          background_check_status: "approved",
          rating: 4.8,
          total_deliveries: 42
        }
      ];

      // Insert partner application and get generated id
      const { data: partnerAppData, error: partnerAppErr } = await supabase
        .from("partner_applications")
        .insert([{
          user_id: demoProfileId,
          business_name: "Demo Partner Business",
          business_type: "restaurant",
          email: "demo.partner@wego24.com",
          phone: "+34000000003",
          address: "789 Partner Ave",
          city: "Demo City",
          postal_code: "12345",
          description: "Demo partner application for testing.",
          status: "approved",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_demo: true,
        }])
        .select();
      if (partnerAppErr) { throw partnerAppErr; }
      const partnerAppId = partnerAppData?.[0]?.id;
      if (!partnerAppId) throw new Error("Failed to get partner application id");

      // Insert partner and get generated id
      const { data: partnerData, error: partnerErr } = await supabase
        .from("partners")
        .insert([{
          name: "Demo Partner",
          email: "demo.partner@wego24.com",
          order_count: 0,
          created_at: new Date().toISOString(),
          user_id: demoProfileId,
          is_demo: true,
        }])
        .select();
      if (partnerErr) { throw partnerErr; }
      const partnerId = partnerData?.[0]?.id;
      if (!partnerId) throw new Error("Failed to get partner id");

      // Insert restaurant(s) using generated application_id
      const { data: restaurantData, error: restErr } = await supabase
        .from("restaurants")
        .insert([
          {
            name: "Demo Restaurant 1",
            email: "demo.rest1@wego24.com",
            is_demo: true,
            address: "123 Demo St",
            city: "Demo City",
            application_id: partnerAppId
          },
        ])
        .select();
      if (restErr) { throw restErr; }
      const restaurantId = restaurantData?.[0]?.id;
      if (!restaurantId) throw new Error("Failed to get restaurant id");

      // Insert menu items using generated restaurant id
      const demoMenuItems = [
        {
          name: "Demo Pizza",
          description: "A delicious cheese and tomato pizza.",
          price: 10.99,
          image_url: "https://source.unsplash.com/400x300/?pizza",
          status: "available",
          is_featured: true,
          preparation_time: 20,
          calories: 900,
          allergens: ["gluten", "dairy"],
          dietary_info: ["vegetarian"],
          display_order: 1,
          is_demo: true,
          restaurant_id: restaurantId
        },
        {
          name: "Demo Burger",
          description: "A juicy beef burger with lettuce and tomato.",
          price: 8.99,
          image_url: "https://source.unsplash.com/400x300/?burger",
          status: "available",
          is_featured: false,
          preparation_time: 15,
          calories: 750,
          allergens: ["gluten", "egg"],
          dietary_info: ["contains beef"],
          display_order: 2,
          is_demo: true,
          restaurant_id: restaurantId
        },
      ];
      const { error: menuErr } = await supabase.from("menu_items").insert(demoMenuItems);
      if (menuErr) { throw menuErr; }
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
          driver_id: demoProfileId,
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
      await supabase.from("partner_applications").delete().eq("is_demo", true);
      await supabase.from("partners").delete().eq("is_demo", true);
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
