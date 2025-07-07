
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { UsageData, UserSubscription } from "@/hooks/useSubscription";

interface UsageChartProps {
  usage: UsageData[];
  subscription?: UserSubscription | null;
}

export function UsageChart({ usage, subscription }: UsageChartProps) {
  const currentPeriodUsage = usage.filter(u => 
    new Date(u.period_end) > new Date()
  );

  const getUsageForMetric = (metricType: string) => {
    return currentPeriodUsage.find(u => u.metric_type === metricType)?.count || 0;
  };

  const getLimit = (metricType: string) => {
    if (!subscription?.plan) return 0;
    
    switch (metricType) {
      case 'orders':
        return subscription.plan.max_orders_per_month;
      case 'restaurants':
        return subscription.plan.max_restaurants;
      case 'drivers':
        return subscription.plan.max_drivers;
      default:
        return 0;
    }
  };

  const getUsagePercentage = (metricType: string) => {
    const usage = getUsageForMetric(metricType);
    const limit = getLimit(metricType);
    return limit > 0 ? (usage / limit) * 100 : 0;
  };

  if (!subscription?.subscribed) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Usage Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Subscribe to a plan to track your usage.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Usage</CardTitle>
        <p className="text-sm text-gray-600">
          Usage for current billing period
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Orders</span>
            <span>{getUsageForMetric('orders')} / {getLimit('orders')}</span>
          </div>
          <Progress value={getUsagePercentage('orders')} className="h-2" />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Restaurants</span>
            <span>{getUsageForMetric('restaurants')} / {getLimit('restaurants')}</span>
          </div>
          <Progress value={getUsagePercentage('restaurants')} className="h-2" />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Drivers</span>
            <span>{getUsageForMetric('drivers')} / {getLimit('drivers')}</span>
          </div>
          <Progress value={getUsagePercentage('drivers')} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}
