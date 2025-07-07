
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, AlertTriangle, DollarSign, Users, Package, Truck } from "lucide-react";
import { formatCurrency } from "@/lib/currency";

interface BusinessMetricsProps {
  stats: {
    totalOrders: number;
    totalRevenue: number;
    activeLocations: number;
    activeDrivers: number;
    totalUsers: number;
  };
  loading: boolean;
}

export function BusinessMetrics({ stats, loading }: BusinessMetricsProps) {
  // Calculate growth indicators (mock data for now - in real app, compare with previous period)
  const metrics = [
    {
      title: "Total Revenue",
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      trend: 12.5,
      subtitle: "vs last month"
    },
    {
      title: "Total Orders",
      value: stats.totalOrders.toLocaleString(),
      icon: Package,
      trend: 8.2,
      subtitle: "vs last month"
    },
    {
      title: "Active Users",
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      trend: 15.3,
      subtitle: "vs last month"
    },
    {
      title: "Active Restaurants",
      value: stats.activeLocations,
      icon: Package,
      trend: 5.7,
      subtitle: "vs last month"
    },
    {
      title: "Active Drivers",
      value: stats.activeDrivers,
      icon: Truck,
      trend: -2.1,
      subtitle: "vs last month"
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {[...Array(5)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-3">
              <div className="w-32 h-4 bg-gray-200 animate-pulse rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="w-20 h-8 bg-gray-200 animate-pulse rounded mb-2"></div>
              <div className="w-24 h-3 bg-gray-200 animate-pulse rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        const isPositive = metric.trend > 0;
        const TrendIcon = isPositive ? TrendingUp : TrendingDown;
        
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {metric.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">{metric.value}</div>
              <div className="flex items-center space-x-1 text-xs">
                <TrendIcon className={`h-3 w-3 ${isPositive ? 'text-green-500' : 'text-red-500'}`} />
                <span className={isPositive ? 'text-green-500' : 'text-red-500'}>
                  {isPositive ? '+' : ''}{metric.trend}%
                </span>
                <span className="text-gray-500">{metric.subtitle}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
