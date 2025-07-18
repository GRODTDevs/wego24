import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { errorLogger, withErrorLogging } from '@/utils/errorLogger';

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price_monthly: number;
  features: string[];
  max_orders_per_month: number;
  max_restaurants: number;
  max_drivers: number;
  is_active: boolean;
}

export interface UserSubscription {
  id: string;
  subscribed: boolean;
  subscription_plan_id: string | null;
  current_period_end: string | null;
  subscription_status: string;
  cancel_at_period_end: boolean;
  plan?: SubscriptionPlan;
}

export interface UsageData {
  metric_type: string;
  count: number;
  period_start: string;
  period_end: string;
}

export function useSubscription() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [usage, setUsage] = useState<UsageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user) {
      fetchPlans();
      checkSubscription();
      fetchUsage();
    }
  }, [user]);

  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('price_monthly');

      if (error) {
        throw error;
      }
      
      // Transform the data to match our interface, handling the Json type properly
      const transformedPlans: SubscriptionPlan[] = (data || []).map(plan => ({
        id: plan.id,
        name: plan.name,
        description: plan.description || '',
        price_monthly: plan.price_monthly,
        max_orders_per_month: plan.max_orders_per_month || 0,
        max_restaurants: plan.max_restaurants || 0,
        max_drivers: plan.max_drivers || 0,
        is_active: plan.is_active || false,
        features: Array.isArray(plan.features) 
          ? (plan.features as string[])
          : typeof plan.features === 'string' 
            ? [plan.features] 
            : []
      }));
      
      setPlans(transformedPlans);
    } catch (error) {
      console.error('Error fetching plans:', error);
      toast.error('Failed to load subscription plans');
    }
  };

  const checkSubscription = async (showToast = false) => {
    await withErrorLogging(async () => {
      if (!user) {
        return;
      }

      try {
        setRefreshing(true);
        
        const { data, error } = await supabase.functions.invoke('check-subscription', {
          headers: {
            Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          },
        });

        if (error) {
          throw error;
        }

        // Fetch the subscription details from our database
        const { data: subData, error: subError } = await supabase
          .from('subscribers')
          .select(`
            id,
            subscribed,
            subscription_plan_id,
            current_period_end,
            subscription_status,
            cancel_at_period_end,
            subscription_plans!subscribers_subscription_plan_id_fkey (
              id,
              name,
              description,
              price_monthly,
              features,
              max_orders_per_month,
              max_restaurants,
              max_drivers,
              is_active
            )
          `)
          .eq('user_id', user.id)
          .single();

        if (subError && subError.code !== 'PGRST116') {
          errorLogger.log(subError);
          console.error('Error fetching subscription details:', subError);
        } else if (subData) {
          // Transform the subscription plan data
          const planData = subData.subscription_plans;
          // Handle if planData is an array (which is likely due to the join)
          const planObj = Array.isArray(planData) ? planData[0] : planData;
          if (planObj) {
            const transformedSubscription: UserSubscription = {
              id: subData.id,
              subscribed: subData.subscribed,
              subscription_plan_id: subData.subscription_plan_id,
              current_period_end: subData.current_period_end,
              subscription_status: subData.subscription_status,
              cancel_at_period_end: subData.cancel_at_period_end,
              plan: {
                id: planObj.id,
                name: planObj.name,
                description: planObj.description || '',
                price_monthly: planObj.price_monthly,
                max_orders_per_month: planObj.max_orders_per_month || 0,
                max_restaurants: planObj.max_restaurants || 0,
                max_drivers: planObj.max_drivers || 0,
                is_active: planObj.is_active || false,
                features: Array.isArray(planObj.features)
                  ? (planObj.features as string[])
                  : typeof planObj.features === 'string'
                    ? [planObj.features]
                    : []
              }
            };
            
            setSubscription(transformedSubscription);
          }
        }

        if (showToast) {
          toast.success('Subscription status refreshed');
        }
      } catch (error) {
        console.error('Error checking subscription:', error);
        if (showToast) {
          toast.error('Failed to refresh subscription status');
        }
      } finally {
        setRefreshing(false);
        setLoading(false);
      }
    }, user?.id);
  };

  const fetchUsage = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('usage_tracking')
        .select('*')
        .order('period_start', { ascending: false })
        .limit(12); // Last 12 months

      if (error) throw error;
      setUsage(data || []);
    } catch (error) {
      console.error('Error fetching usage:', error);
    }
  };

  const createCheckoutSession = async (planId: string) => {
    if (!user) {
      toast.error('Please log in to subscribe');
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { planId },
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
      });

      if (error) throw error;

      // Open Stripe checkout in a new tab
      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast.error('Failed to start checkout process');
    }
  };

  const openCustomerPortal = async () => {
    if (!user) {
      toast.error('Please log in to manage subscription');
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('customer-portal', {
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
      });

      if (error) throw error;

      // Open customer portal in a new tab
      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast.error('Failed to open customer portal');
    }
  };

  const trackUsage = async (metricType: string, increment = 1) => {
    if (!user) return;

    try {
      const { error } = await supabase.rpc('track_usage', {
        p_user_id: user.id,
        p_metric_type: metricType,
        p_increment: increment
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error tracking usage:', error);
    }
  };

  const refreshSubscription = () => checkSubscription(true);

  return {
    subscription,
    plans,
    usage,
    loading,
    refreshing,
    checkSubscription: refreshSubscription,
    createCheckoutSession,
    openCustomerPortal,
    trackUsage,
    fetchUsage,
  };
}
