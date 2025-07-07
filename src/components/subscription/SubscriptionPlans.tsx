
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { SubscriptionPlan, UserSubscription } from "@/hooks/useSubscription";
import { formatCurrency } from "@/lib/currency";

interface SubscriptionPlansProps {
  plans: SubscriptionPlan[];
  currentSubscription?: UserSubscription | null;
  onSelectPlan: (planId: string) => void;
  loading?: boolean;
}

export function SubscriptionPlans({ 
  plans, 
  currentSubscription, 
  onSelectPlan, 
  loading = false 
}: SubscriptionPlansProps) {
  const isCurrentPlan = (planId: string) => {
    return currentSubscription?.subscription_plan_id === planId && currentSubscription.subscribed;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {plans.map((plan) => {
        const isCurrent = isCurrentPlan(plan.id);
        const features = Array.isArray(plan.features) ? plan.features : [];
        
        return (
          <Card key={plan.id} className={`relative ${isCurrent ? 'ring-2 ring-orange-500' : ''}`}>
            {isCurrent && (
              <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-orange-500">
                Current Plan
              </Badge>
            )}
            
            <CardHeader>
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <div className="text-3xl font-bold">
                {formatCurrency(plan.price_monthly)}
                <span className="text-sm font-normal text-gray-600">/month</span>
              </div>
              <p className="text-gray-600">{plan.description}</p>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="text-sm text-gray-600">
                  • {plan.max_orders_per_month} orders per month
                </div>
                <div className="text-sm text-gray-600">
                  • Up to {plan.max_restaurants} restaurants
                </div>
                <div className="text-sm text-gray-600">
                  • Up to {plan.max_drivers} drivers
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Features:</h4>
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              
              <Button
                onClick={() => onSelectPlan(plan.id)}
                disabled={loading || isCurrent}
                className="w-full"
                variant={isCurrent ? "outline" : "default"}
              >
                {isCurrent ? "Current Plan" : "Select Plan"}
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
