
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export function DemoDataManager() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  async function insertDemoData() {
    setLoading(true);
    setResult("");
    
    try {
      console.log("Starting demo data insertion...");
      const demoProfileId = "63b5d9eb-ba28-4c29-99c4-68f4d845411b";
      
      // Insert demo profile first
      const demoProfile = {
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
      };

      console.log("Inserting demo profile...");
      const { error: profileErr } = await supabase
        .from("profiles")
        .upsert(demoProfile, { onConflict: 'id' });
      
      if (profileErr) {
        console.error("Profile error:", profileErr);
        throw profileErr;
      }

      // Insert demo driver
      const demoDriver = {
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
        total_deliveries: 42,
      };

      console.log("Inserting demo driver...");
      const { error: driverErr } = await supabase
        .from("drivers")
        .upsert(demoDriver, { onConflict: 'user_id' });
      
      if (driverErr) {
        console.error("Driver error:", driverErr);
        throw driverErr;
      }

      // Insert partner application
      console.log("Inserting partner application...");
      const { data: partnerAppData, error: partnerAppErr } = await supabase
        .from("partner_applications")
        .upsert([
          {
            id: "demo-partner-app-id",
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
          },
        ], { onConflict: 'id' })
        .select();
      
      if (partnerAppErr) {
        console.error("Partner application error:", partnerAppErr);
        throw partnerAppErr;
      }
      
      const partnerAppId = partnerAppData?.[0]?.id || "demo-partner-app-id";

      // Insert partner
      console.log("Inserting partner...");
      const { data: partnerData, error: partnerErr } = await supabase
        .from("partners")
        .upsert([
          {
            id: "demo-partner-id",
            name: "Demo Partner",
            email: "demo.partner@wego24.com",
            order_count: 0,
            created_at: new Date().toISOString(),
            user_id: demoProfileId,
            is_demo: true,
          },
        ], { onConflict: 'id' })
        .select();
      
      if (partnerErr) {
        console.error("Partner error:", partnerErr);
        throw partnerErr;
      }
      
      const partnerId = partnerData?.[0]?.id || "demo-partner-id";

      // Insert restaurant
      console.log("Inserting restaurant...");
      const { data: restaurantData, error: restaurantInsertErr } = await supabase
        .from("restaurants")
        .upsert([
          {
            id: "demo-restaurant-id",
            name: "Demo Restaurant 1",
            email: "demo.rest1@wego24.com",
            is_demo: true,
            address: "123 Demo St",
            city: "Demo City",
            application_id: partnerAppId,
          },
        ], { onConflict: 'id' })
        .select();
      
      if (restaurantInsertErr) {
        console.error("Restaurant error:", restaurantInsertErr);
        throw restaurantInsertErr;
      }
      
      const restaurantId = restaurantData?.[0]?.id || "demo-restaurant-id";

      // Insert menu items
      console.log("Inserting menu items...");
      const demoMenuItems = [
        {
          id: "demo-menu-item-1",
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
          restaurant_id: restaurantId,
        },
        {
          id: "demo-menu-item-2",
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
          restaurant_id: restaurantId,
        },
      ];
      
      const { error: menuErr } = await supabase
        .from("menu_items")
        .upsert(demoMenuItems, { onConflict: 'id' });
      
      if (menuErr) {
        console.error("Menu items error:", menuErr);
        throw menuErr;
      }

      // Insert demo order
      console.log("Inserting demo order...");
      const { error: orderErr } = await supabase
        .from("orders")
        .upsert([
          {
            id: "demo-order-id",
            business_id: restaurantId,
            customer_id: demoProfileId,
            status: "pending",
            total_amount: 19.98,
            subtotal: 17.98,
            tax_amount: 2.0,
            delivery_fee: 0.0,
            service_fee: 0.0,
            payment_status: "pending",
            payment_method: "cash",
            delivery_address: { street: "123 Demo St", city: "Demo City" },
            delivery_instructions: "Leave at door",
            driver_id: demoProfileId,
            is_demo: true,
          },
        ], { onConflict: 'id' });
      
      if (orderErr) {
        console.error("Order error:", orderErr);
        throw orderErr;
      }

      console.log("Demo data insertion completed successfully");
      setResult("Demo data inserted successfully.");
      toast.success("Demo data inserted successfully!");
      
    } catch (err: any) {
      console.error("Demo data insertion failed:", err);
      setResult("Error: " + err.message);
      toast.error("Failed to insert demo data: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  async function deleteDemoData() {
    setLoading(true);
    setResult("");
    
    try {
      console.log("Starting demo data deletion...");
      
      // Delete in reverse order to respect foreign key constraints
      await supabase.from("orders").delete().eq("is_demo", true);
      await supabase.from("menu_items").delete().eq("is_demo", true);
      await supabase.from("restaurants").delete().eq("is_demo", true);
      await supabase.from("partners").delete().eq("is_demo", true);
      await supabase.from("partner_applications").delete().eq("is_demo", true);
      await supabase.from("drivers").delete().eq("is_demo", true);
      await supabase.from("profiles").delete().eq("is_demo", true);
      
      console.log("Demo data deletion completed successfully");
      setResult("Demo data deleted successfully.");
      toast.success("Demo data deleted successfully!");
      
    } catch (err: any) {
      console.error("Demo data deletion failed:", err);
      setResult("Error: " + err.message);
      toast.error("Failed to delete demo data: " + err.message);
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
          <Button
            onClick={insertDemoData}
            disabled={loading}
            className="w-full"
          >
            {loading ? "Inserting..." : "Insert Demo Data"}
          </Button>
          <Button
            onClick={deleteDemoData}
            disabled={loading}
            variant="destructive"
            className="w-full"
          >
            {loading ? "Deleting..." : "Delete Demo Data"}
          </Button>
          {result && (
            <div className={`text-center mt-2 ${result.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
              {result}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
