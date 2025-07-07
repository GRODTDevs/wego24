
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Clock, DollarSign, Users, Settings } from "lucide-react";

export function CriticalAlerts() {
  // Critical system alerts based on README analysis
  const alerts = [
    {
      id: 1,
      type: "critical",
      title: "Subscription Billing Incomplete",
      description: "Stripe recurring billing not functional - blocking 50% of revenue model",
      action: "Complete Stripe Integration",
      priority: "P0",
      icon: DollarSign
    },
    {
      id: 2,
      type: "high",
      title: "Real-time Order Pipeline Partial",
      description: "Driver assignment and notifications only partially implemented",
      action: "Complete Order Management",
      priority: "P1",
      icon: Clock
    },
    {
      id: 3,
      type: "medium",
      title: "No Automated Testing",
      description: "System lacks unit/integration tests for critical flows",
      action: "Implement Testing",
      priority: "P2",
      icon: Settings
    }
  ];

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getAlertBadge = (type: string, priority: string) => {
    switch (type) {
      case 'critical': return <Badge className="bg-red-500">{priority} Critical</Badge>;
      case 'high': return <Badge className="bg-orange-500">{priority} High</Badge>;
      case 'medium': return <Badge className="bg-yellow-500">{priority} Medium</Badge>;
      default: return <Badge variant="outline">{priority}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          Critical Alerts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {alerts.map((alert) => {
          const Icon = alert.icon;
          return (
            <div key={alert.id} className="flex items-start justify-between p-4 border rounded-lg bg-gray-50">
              <div className="flex items-start space-x-3">
                <Icon className="h-5 w-5 text-gray-600 mt-1" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{alert.title}</span>
                    {getAlertBadge(alert.type, alert.priority)}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{alert.description}</p>
                  <Button size="sm" variant="outline">
                    {alert.action}
                  </Button>
                </div>
              </div>
              <div className={`w-3 h-3 rounded-full ${getAlertColor(alert.type)} mt-1`}></div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
