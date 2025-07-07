
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, CheckCircle, Clock, Database, Server, Zap } from "lucide-react";

export function SystemHealth() {
  // Mock system health data - in real app, this would come from monitoring services
  const healthMetrics = [
    {
      name: "Database",
      status: "healthy",
      uptime: 99.9,
      responseTime: "12ms",
      icon: Database
    },
    {
      name: "API Server",
      status: "healthy",
      uptime: 99.8,
      responseTime: "45ms",
      icon: Server
    },
    {
      name: "Edge Functions",
      status: "warning",
      uptime: 98.5,
      responseTime: "120ms",
      icon: Zap
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy': return <Badge className="bg-green-500">Healthy</Badge>;
      case 'warning': return <Badge className="bg-yellow-500">Warning</Badge>;
      case 'error': return <Badge className="bg-red-500">Error</Badge>;
      default: return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          System Health
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {healthMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Icon className="h-5 w-5 text-gray-600" />
                <div>
                  <div className="font-medium">{metric.name}</div>
                  <div className="text-sm text-gray-600">
                    Uptime: {metric.uptime}% | Response: {metric.responseTime}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusBadge(metric.status)}
                <div className="flex items-center space-x-1">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(metric.status)}`}></div>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
