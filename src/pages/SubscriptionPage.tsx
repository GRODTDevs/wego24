
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SubscriptionPlans } from "@/components/subscription/SubscriptionPlans";
import { SubscriptionStatus } from "@/components/subscription/SubscriptionStatus";
import { UsageChart } from "@/components/subscription/UsageChart";
import { useSubscription } from "@/hooks/useSubscription";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function SubscriptionPage() {
  const { user } = useAuth();
  const {
    subscription,
    plans,
    usage,
    loading,
    refreshing,
    checkSubscription,
    createCheckoutSession,
    openCustomerPortal,
  } = useSubscription();

  // Auto-refresh subscription status every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (user) {
        checkSubscription();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [user, checkSubscription]);

  const handleSelectPlan = async (planId: string) => {
    if (!user) {
      toast.error('Please log in to subscribe');
      return;
    }
    
    await createCheckoutSession(planId);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <main className="flex-1 bg-gray-50 p-6">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-6 text-center">
                <h2 className="text-xl font-semibold mb-4">Authentication Required</h2>
                <p className="text-gray-600">
                  Please log in to view and manage your subscription.
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <main className="flex-1 bg-gray-50 p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Subscription Management</h1>
          
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid grid-cols-3 w-full max-w-md">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="plans">Plans</TabsTrigger>
              <TabsTrigger value="usage">Usage</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SubscriptionStatus
                  subscription={subscription}
                  refreshing={refreshing}
                  onRefresh={checkSubscription}
                  onManageSubscription={openCustomerPortal}
                />
                <UsageChart usage={usage} subscription={subscription} />
              </div>
            </TabsContent>

            <TabsContent value="plans">
              <Card>
                <CardHeader>
                  <CardTitle>Choose Your Plan</CardTitle>
                  <p className="text-gray-600">
                    Select the perfect plan for your business needs. You can upgrade or downgrade at any time.
                  </p>
                </CardHeader>
                <CardContent>
                  <SubscriptionPlans
                    plans={plans}
                    currentSubscription={subscription}
                    onSelectPlan={handleSelectPlan}
                    loading={refreshing}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="usage">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <UsageChart usage={usage} subscription={subscription} />
                
                <Card>
                  <CardHeader>
                    <CardTitle>Usage History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {usage.length > 0 ? (
                      <div className="space-y-4">
                        {usage.slice(0, 6).map((item, index) => (
                          <div key={index} className="flex justify-between items-center py-2 border-b">
                            <div>
                              <div className="font-medium capitalize">{item.metric_type}</div>
                              <div className="text-sm text-gray-600">
                                {new Date(item.period_start).toLocaleDateString()} - {new Date(item.period_end).toLocaleDateString()}
                              </div>
                            </div>
                            <div className="text-lg font-semibold">{item.count}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600">No usage data available yet.</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
