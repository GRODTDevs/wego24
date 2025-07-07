
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";

interface DriverEarningsSectionProps {
  driverId: string;
}

export function DriverEarningsSection({ driverId }: DriverEarningsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="w-5 h-5" />
          Earnings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">€245</p>
            <p className="text-sm text-gray-600">This Week</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">€1,120</p>
            <p className="text-sm text-gray-600">This Month</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">€12,450</p>
            <p className="text-sm text-gray-600">Total</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
