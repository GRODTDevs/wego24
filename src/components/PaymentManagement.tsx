
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CreditCard, TrendingUp, Calendar, Euro } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Payment {
  id: string;
  order_id: string;
  amount: number;
  currency: string;
  status: string;
  payment_method?: string;
  created_at: string;
  stripe_payment_intent_id?: string;
}

interface PaymentStats {
  total_revenue: number;
  pending_payments: number;
  successful_payments: number;
  failed_payments: number;
}

interface PaymentManagementProps {
  businessId: string;
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  succeeded: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
  cancelled: "bg-gray-100 text-gray-800"
};

export function PaymentManagement({ businessId }: PaymentManagementProps) {
  const { user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState<PaymentStats>({
    total_revenue: 0,
    pending_payments: 0,
    successful_payments: 0,
    failed_payments: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (businessId) {
      fetchPayments();
    }
  }, [businessId]);

  const fetchPayments = async () => {
    try {
      // Fetch payments for orders from this business
      const { data: paymentsData, error: paymentsError } = await supabase
        .from("payments")
        .select(`
          *,
          orders!inner(business_id)
        `)
        .eq("orders.business_id", businessId)
        .order("created_at", { ascending: false });

      if (paymentsError) throw paymentsError;

      const paymentsWithoutOrders = paymentsData.map(payment => {
        const { orders, ...paymentData } = payment;
        return paymentData;
      }) as Payment[];

      setPayments(paymentsWithoutOrders);

      // Calculate stats
      const totalRevenue = paymentsWithoutOrders
        .filter(p => p.status === 'succeeded')
        .reduce((sum, p) => sum + p.amount, 0);

      const pendingPayments = paymentsWithoutOrders.filter(p => p.status === 'pending').length;
      const successfulPayments = paymentsWithoutOrders.filter(p => p.status === 'succeeded').length;
      const failedPayments = paymentsWithoutOrders.filter(p => p.status === 'failed').length;

      setStats({
        total_revenue: totalRevenue,
        pending_payments: pendingPayments,
        successful_payments: successfulPayments,
        failed_payments: failedPayments
      });

    } catch (error) {
      console.error("Error fetching payments:", error);
      toast.error("Failed to load payment data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading payments...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <CreditCard className="w-5 h-5" />
        <h2 className="text-xl font-semibold">Payment Management</h2>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">€{stats.total_revenue.toFixed(2)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Successful</p>
                <p className="text-2xl font-bold text-green-600">{stats.successful_payments}</p>
              </div>
              <CreditCard className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending_payments}</p>
              </div>
              <Calendar className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Failed</p>
                <p className="text-2xl font-bold text-red-600">{stats.failed_payments}</p>
              </div>
              <Euro className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payments List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Recent Payments</h3>
        {payments.map((payment) => (
          <Card key={payment.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">Order #{payment.order_id.slice(-8)}</p>
                    <Badge className={statusColors[payment.status as keyof typeof statusColors]}>
                      {payment.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    {payment.payment_method && `${payment.payment_method} • `}
                    {formatDistanceToNow(new Date(payment.created_at), { addSuffix: true })}
                  </p>
                  {payment.stripe_payment_intent_id && (
                    <p className="text-xs text-gray-500">
                      Stripe ID: {payment.stripe_payment_intent_id}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold">
                    €{payment.amount.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {payment.currency.toUpperCase()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {payments.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <CreditCard className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No payments yet</h3>
            <p className="text-gray-600">Payments will appear here once you start receiving orders</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
