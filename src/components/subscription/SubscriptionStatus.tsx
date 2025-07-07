
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, ExternalLink } from "lucide-react";
import { UserSubscription } from "@/hooks/useSubscription";
import { formatCurrency } from "@/lib/currency";

interface SubscriptionStatusProps {
  subscription: UserSubscription | null;
  refreshing: boolean;
  onRefresh: () => void;
  onManageSubscription: () => void;
}

export function SubscriptionStatus({ 
  subscription, 
  refreshing, 
  onRefresh, 
  onManageSubscription 
}: SubscriptionStatusProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'past_due':
        return 'bg-yellow-500';
      case 'canceled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Subscription Status</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {subscription?.subscribed ? (
          <>
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(subscription.subscription_status)}>
                {subscription.subscription_status}
              </Badge>
              {subscription.plan && (
                <span className="font-medium">{subscription.plan.name}</span>
              )}
            </div>
            
            {subscription.plan && (
              <div className="text-2xl font-bold">
                {formatCurrency(subscription.plan.price_monthly)}/month
              </div>
            )}
            
            <div className="space-y-2 text-sm text-gray-600">
              <div>
                <span className="font-medium">Current period ends:</span>{' '}
                {formatDate(subscription.current_period_end)}
              </div>
              
              {subscription.cancel_at_period_end && (
                <div className="text-orange-600">
                  <span className="font-medium">⚠ Subscription will cancel at period end</span>
                </div>
              )}
            </div>
            
            <Button
              onClick={onManageSubscription}
              variant="outline"
              className="w-full"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Manage Subscription
            </Button>
          </>
        ) : (
          <div className="text-center space-y-4">
            <Badge variant="outline">No Active Subscription</Badge>
            <p className="text-gray-600">
              Subscribe to a plan to access premium features and track your usage.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
