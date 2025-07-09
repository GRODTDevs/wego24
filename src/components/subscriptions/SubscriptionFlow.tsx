import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSystemSettings } from "@/contexts/SystemSettingsContext";

const SubscriptionFlow = () => {
  const { settings } = useSystemSettings();
  const [plans, setPlans] = useState([]);
  const [activeSubscription, setActiveSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const userRes = await supabase.auth.getUser();
        const userId = userRes.data?.user?.id;
        const [plansRes, subRes] = await Promise.all([
          supabase.from("subscription_plans").select("*"),
          userId
            ? supabase
                .from("subscriptions")
                .select("*", { count: "exact" })
                .eq("user_id", userId)
                .single()
            : Promise.resolve({ data: null }),
        ]);
        setPlans(plansRes.data || []);
        setActiveSubscription(subRes.data || null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubscribe = async (planId) => {
    setLoading(true);
    try {
      const userRes = await supabase.auth.getUser();
      const userId = userRes.data?.user?.id;
      if (!userId) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }
      const { error } = await supabase.from("subscriptions").insert({
        user_id: userId,
        plan_id: planId,
        status: "active",
        start_date: new Date().toISOString(),
        auto_renew: settings?.auto_renewal_default ?? true,
      });
      if (error) {
        setError(error.message);
      } else {
        window.location.reload();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Subscription Plans</h2>
      {loading ? (
        <div>Loading subscription info...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <>
          {activeSubscription ? (
            <div className="mb-4 p-2 border rounded bg-green-50">
              <strong>Active Subscription:</strong>{" "}
              {plans.find((p) => p.id === activeSubscription.plan_id)?.name ||
                "Unknown"}
              <br />Status: {activeSubscription.status}
              <br />Renews:{" "}
              {activeSubscription.auto_renew ? "Yes" : "No"}
            </div>
          ) : (
            <div className="mb-4 text-yellow-700">No active subscription</div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="border rounded p-4 flex flex-col"
              >
                <h3 className="font-semibold text-lg mb-2">{plan.name}</h3>
                <div className="mb-2">
                  Price: {plan.price} {settings?.currency || "USD"}
                </div>
                <div className="mb-2">
                  Duration: {plan.duration_months} months
                </div>
                <button
                  className="mt-auto bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
                  disabled={!!activeSubscription}
                  onClick={() => handleSubscribe(plan.id)}
                >
                  Subscribe
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SubscriptionFlow;