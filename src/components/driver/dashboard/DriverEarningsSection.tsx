import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";
import { useDriverEarnings } from "@/hooks/useDriverEarnings";
import { Button } from "@/components/ui/button";

interface DriverEarningsSectionProps {
  driverId: string;
}

export function DriverEarningsSection({ driverId }: DriverEarningsSectionProps) {
  const { summary, loading, error, requestPayout } = useDriverEarnings(driverId);
  const [payoutLoading, setPayoutLoading] = React.useState(false);
  const [payoutSuccess, setPayoutSuccess] = React.useState(false);
  const [payoutError, setPayoutError] = React.useState<string | null>(null);

  const handlePayoutRequest = async () => {
    setPayoutLoading(true);
    setPayoutError(null);
    setPayoutSuccess(false);
    const ok = await requestPayout();
    setPayoutLoading(false);
    if (ok) setPayoutSuccess(true);
    else setPayoutError("Failed to request payout. Please try again.");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="w-5 h-5" />
          Earnings
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center text-gray-500">Loading earnings...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : summary ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">€{summary.thisWeek.toFixed(2)}</p>
                <p className="text-sm text-gray-600">This Week</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">€{summary.thisMonth.toFixed(2)}</p>
                <p className="text-sm text-gray-600">This Month</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">€{summary.total.toFixed(2)}</p>
                <p className="text-sm text-gray-600">Total</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Button onClick={handlePayoutRequest} disabled={payoutLoading}>
                {payoutLoading ? "Requesting..." : "Request Payout"}
              </Button>
              {payoutSuccess && <div className="text-green-600 text-sm">Payout request sent!</div>}
              {payoutError && <div className="text-red-600 text-sm">{payoutError}</div>}
            </div>
          </>
        ) : (
          <div className="text-center text-gray-500">No earnings data available.</div>
        )}
      </CardContent>
    </Card>
  );
}
