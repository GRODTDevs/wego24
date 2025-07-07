
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

interface DriverPerformanceSectionProps {
  driverId: string;
}

export function DriverPerformanceSection({ driverId }: DriverPerformanceSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Performance Metrics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">95%</p>
            <p className="text-sm text-gray-600">On-time Rate</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">4.8</p>
            <p className="text-sm text-gray-600">Average Rating</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
