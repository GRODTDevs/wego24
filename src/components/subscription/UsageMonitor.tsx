
import { useEffect } from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { toast } from 'sonner';

interface UsageMonitorProps {
  children: React.ReactNode;
}

export function UsageMonitor({ children }: UsageMonitorProps) {
  const { subscription, usage, trackUsage } = useSubscription();

  const checkUsageLimits = () => {
    if (!subscription?.subscribed || !subscription.plan) return;

    const currentPeriodUsage = usage.filter(u => 
      new Date(u.period_end) > new Date()
    );

    // Check orders limit
    const ordersUsage = currentPeriodUsage.find(u => u.metric_type === 'orders')?.count || 0;
    const ordersLimit = subscription.plan.max_orders_per_month;
    
    if (ordersUsage >= ordersLimit * 0.8) {
      toast.warning(
        `You've used ${ordersUsage}/${ordersLimit} orders this month (${Math.round((ordersUsage / ordersLimit) * 100)}%)`
      );
    }

    // Check restaurants limit
    const restaurantsUsage = currentPeriodUsage.find(u => u.metric_type === 'restaurants')?.count || 0;
    const restaurantsLimit = subscription.plan.max_restaurants;
    
    if (restaurantsUsage >= restaurantsLimit) {
      toast.error('You\'ve reached your restaurant limit. Please upgrade your plan.');
    }

    // Check drivers limit
    const driversUsage = currentPeriodUsage.find(u => u.metric_type === 'drivers')?.count || 0;
    const driversLimit = subscription.plan.max_drivers;
    
    if (driversUsage >= driversLimit) {
      toast.error('You\'ve reached your driver limit. Please upgrade your plan.');
    }
  };

  useEffect(() => {
    checkUsageLimits();
  }, [usage, subscription]);

  // Auto-track usage for new orders, restaurants, and drivers
  const trackOrderCreation = () => trackUsage('orders');
  const trackRestaurantCreation = () => trackUsage('restaurants');
  const trackDriverCreation = () => trackUsage('drivers');

  return (
    <div>
      {children}
    </div>
  );
}
