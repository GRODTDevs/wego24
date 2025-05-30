
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Calculate straight-line distance using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      pickupLat, 
      pickupLng, 
      dropoffLat, 
      dropoffLng,
      pickupLocation,
      dropoffLocation,
      itemDescription,
      userEmail 
    } = await req.json();

    console.log("Received payment request:", { pickupLat, pickupLng, dropoffLat, dropoffLng });

    // Calculate distance and price
    const distance = calculateDistance(pickupLat, pickupLng, dropoffLat, dropoffLng);
    const baseFee = 6.50;
    const distanceFee = distance * 0.50;
    const totalPrice = baseFee + distanceFee;
    const totalPriceCents = Math.round(totalPrice * 100);

    console.log("Calculated:", { distance, baseFee, distanceFee, totalPrice, totalPriceCents });

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Check if customer exists
    const customers = await stripe.customers.list({ email: userEmail, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : userEmail,
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: { 
              name: "Courier Delivery Service",
              description: `From: ${pickupLocation} to ${dropoffLocation} (${distance.toFixed(2)} km)`
            },
            unit_amount: totalPriceCents,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/courier-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/courier-request`,
      metadata: {
        pickup_location: pickupLocation,
        dropoff_location: dropoffLocation,
        item_description: itemDescription,
        distance: distance.toString(),
        user_email: userEmail
      }
    });

    return new Response(JSON.stringify({ 
      url: session.url,
      distance: distance.toFixed(2),
      totalPrice: totalPrice.toFixed(2)
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error creating payment session:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
