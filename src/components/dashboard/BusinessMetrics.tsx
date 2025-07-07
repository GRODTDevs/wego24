
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
  previousStats?: {
    totalOrders: number;
    totalRevenue: number;
    activeLocations: number;
    activeDrivers: number;
    totalUsers: number;
  };
  loading: boolean;
}

export function BusinessMetrics({ stats, previousStats, loading }: BusinessMetricsProps) {
  // Calculate real growth percentages
  const calculateGrowth = (current: number, previous: number): number => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  const metrics = [
    {
      title: "Total Revenue",
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      trend: previousStats ? calculateGrowth(stats.totalRevenue, previousStats.totalRevenue) : 0,
      subtitle: "vs last period"
    },
    {
      title: "Total Orders",
      value: stats.totalOrders.toLocaleString(),
      icon: Package,
      trend: previousStats ? calculateGrowth(stats.totalOrders, previousStats.totalOrders) : 0,
      subtitle: "vs last period"
    },
    {
      title: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      trend: previousStats ? calculateGrowth(stats.totalUsers, previousStats.totalUsers) : 0,
      subtitle: "vs last period"
    },
    {
      title: "Active Partners",
      value: stats.activeLocations,
      icon: Package,
      trend: previousStats ? calculateGrowth(stats.activeLocations, previousStats.activeLocations) : 0,
      subtitle: "vs last period"
    },
    {
      title: "Active Drivers",
      value: stats.activeDrivers,
      icon: Truck,
      trend: previousStats ? calculateGrowth(stats.activeDrivers, previousStats.activeDrivers) : 0,
      subtitle: "vs last period"
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="border-0 shadow-sm">
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
          <Card key={index} className="border-0 shadow-sm">
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
                  {isPositive ? '+' : ''}{metric.trend.toFixed(1)}%
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
