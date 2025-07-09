// @deno-types="https://cdn.skypack.dev/-/stripe@v14.21.0-JwQwQw8QwQwQwQw/dist=es2020,mode=types/index.d.ts"
//@ts-ignore
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
// @ts-ignore Stripe types not available for esm.sh import
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno&no-check";
// @ts-ignore
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper logging function for enhanced debugging
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-SUBSCRIPTION] ${step}${detailsStr}`);
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Use Deno.env.get for environment variables in Deno
  //@ts-ignore
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
  //@ts-ignore
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  //@ts-ignore
  const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !STRIPE_SECRET_KEY) {
    return new Response(
      JSON.stringify({ error: "Missing required environment variables." }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }

  // Use the service role key to perform writes (upsert) in Supabase
  const supabaseClient = createClient(
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header provided");
    }
    logStep("Authorization header found");

    const token = authHeader.replace("Bearer ", "");
    logStep("Authenticating user with token");

    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) {
      throw new Error(`Authentication error: ${userError.message}`);
    }
    const {user} = userData;
    if (!user?.email) {
      throw new Error("User not authenticated or email not available");
    }
    logStep("User authenticated", { userId: user.id, email: user.email });

    const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" });
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });

    if (customers.data.length === 0) {
      logStep("No customer found, updating unsubscribed state");
      await supabaseClient.from("subscribers").upsert({
        email: user.email,
        user_id: user.id,
        stripe_customer_id: null,
        subscribed: false,
        subscription_plan_id: null,
        current_period_end: null,
        subscription_status: 'inactive',
        updated_at: new Date().toISOString(),
      }, { onConflict: 'email' });
      return new Response(JSON.stringify({ subscribed: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const customerId = customers.data[0].id;
    logStep("Found Stripe customer", { customerId });

    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      limit: 1,
    });

    let hasActiveSub = false;
    let subscriptionPlanId: string | null = null;
    let currentPeriodEnd: string | null = null;
    let subscriptionStatus = 'inactive';
    let stripeSubscriptionId: string | null = null;
    let cancelAtPeriodEnd = false;

    if (subscriptions.data.length > 0) {
      const subscription = subscriptions.data[0];
      hasActiveSub = subscription.status === 'active';
      subscriptionStatus = subscription.status;
      stripeSubscriptionId = subscription.id;
      cancelAtPeriodEnd = subscription.cancel_at_period_end;
      currentPeriodEnd = new Date(subscription.current_period_end * 1000).toISOString();

      logStep("Subscription found", {
        subscriptionId: subscription.id,
        status: subscription.status,
        endDate: currentPeriodEnd,
        cancelAtEnd: cancelAtPeriodEnd
      });

      // Get the plan from our database based on Stripe price ID
      const priceId = subscription.items.data[0].price.id;
      const { data: planData } = await supabaseClient
        .from('subscription_plans')
        .select('id')
        .eq('stripe_price_id', priceId)
        .single();

      if (planData) {
        subscriptionPlanId = planData.id;
      }

      logStep("Determined subscription plan", { priceId, subscriptionPlanId });
    } else {
      logStep("No subscription found");
    }

    await supabaseClient.from("subscribers").upsert({
      email: user.email,
      user_id: user.id,
      stripe_customer_id: customerId,
      stripe_subscription_id: stripeSubscriptionId,
      subscribed: hasActiveSub,
      subscription_plan_id: subscriptionPlanId,
      current_period_end: currentPeriodEnd,
      subscription_status: subscriptionStatus,
      cancel_at_period_end: cancelAtPeriodEnd,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'email' });

    logStep("Updated database with subscription info", {
      subscribed: hasActiveSub,
      subscriptionPlanId,
      status: subscriptionStatus
    });

    return new Response(JSON.stringify({
      subscribed: hasActiveSub,
      subscription_plan_id: subscriptionPlanId,
      current_period_end: currentPeriodEnd,
      subscription_status: subscriptionStatus,
      cancel_at_period_end: cancelAtPeriodEnd
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in check-subscription", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

// Placeholder for future delivery scheduling/tracking logic
// TODO: Implement advanced delivery scheduling, route optimization, and real-time driver tracking for parcel subscriptions.
