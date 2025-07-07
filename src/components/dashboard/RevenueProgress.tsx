
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target, TrendingUp } from "lucide-react";
import { formatCurrency } from "@/lib/currency";

interface RevenueProgressProps {
  currentRevenue: number;
}

export function RevenueProgress({ currentRevenue }: RevenueProgressProps) {
  // Business targets from README
  const monthlyTarget = 6900; // €6,900/month target
  const annualTarget = 82800; // €82,800 annual projection
  
  const progressPercent = Math.min((currentRevenue / monthlyTarget) * 100, 100);
  const remainingToTarget = Math.max(monthlyTarget - currentRevenue, 0);

  // Calculate subscription vs order revenue split (mock for now)
  const subscriptionRevenue = currentRevenue * 0.5; // 50% from subscriptions
  const orderRevenue = currentRevenue * 0.5; // 50% from orders

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-500" />
            Monthly Revenue Target
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold">{formatCurrency(currentRevenue)}</span>
            <span className="text-sm text-gray-600">of {formatCurrency(monthlyTarget)}</span>
          </div>
          <Progress value={progressPercent} className="h-3" />
          <div className="flex justify-between text-sm">
            <span className="text-green-600">{progressPercent.toFixed(1)}% achieved</span>
            <span className="text-gray-600">{formatCurrency(remainingToTarget)} to go</span>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            Revenue Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Subscription Revenue</span>
              <span className="font-bold">{formatCurrency(subscriptionRevenue)}</span>
            </div>
            <Progress value={50} className="h-2" />
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Order Revenue</span>
              <span className="font-bold">{formatCurrency(orderRevenue)}</span>
            </div>
            <Progress value={50} className="h-2" />
          </div>
          <div className="pt-2 border-t">
            <div className="text-xs text-gray-600">
              Target: 50% subscriptions, 50% orders
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
