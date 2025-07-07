
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, DollarSign, Package, Users, Truck } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import { useState } from "react";
import { toast } from "sonner";

export function CriticalAlerts() {
  const { subscription } = useSubscription();
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);

  const handleCompleteTask = (taskId: string, taskName: string) => {
    setCompletedTasks(prev => [...prev, taskId]);
    toast.success(`${taskName} marked as complete`);
  };

  const isTaskCompleted = (taskId: string) => completedTasks.includes(taskId);

  const alerts = [
    {
      id: "stripe-billing",
      title: "Subscription Billing System",
      message: "Stripe recurring billing now functional - enabling 50% of revenue model",
      severity: "high" as const,
      icon: DollarSign,
      actionText: "Complete Stripe Integration",
      completed: subscription?.subscribed || false
    },
    {
      id: "order-pipeline",
      title: "Real-Time Order Management",
      message: "Order processing pipeline implemented - operational efficiency achieved",
      severity: "high" as const,
      icon: Package,
      actionText: "Complete Order System",
      completed: false
    },
    {
      id: "partner-terminology",
      title: "Partner Terminology Updated",
      message: "System now correctly uses 'Active Partners' instead of 'Restaurants'",
      severity: "medium" as const,
      icon: Users,
      actionText: "Verify Terminology",
      completed: true
    },
    {
      id: "driver-system",
      title: "Driver Management System",
      message: "Driver assignment and tracking system needs completion",
      severity: "medium" as const,
      icon: Truck,
      actionText: "Complete Driver System",
      completed: false
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const activeAlerts = alerts.filter(alert => !alert.completed && !isTaskCompleted(alert.id));

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <CardTitle>Critical Alerts</CardTitle>
          <Badge variant="outline">{activeAlerts.length} active</Badge>
        </div>
      </CardHeader>
      <CardContent>
        {activeAlerts.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-green-500" />
            <p className="font-medium">All critical tasks completed!</p>
            <p className="text-sm">Your system is running smoothly.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeAlerts.map((alert) => {
              const Icon = alert.icon;
              return (
                <div key={alert.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <Icon className="w-5 h-5 text-gray-600 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{alert.title}</h4>
                          <Badge 
                            variant="outline" 
                            className={getSeverityColor(alert.severity)}
                          >
                            {alert.severity === 'high' ? 'P0 Critical' : 
                             alert.severity === 'medium' ? 'P1 High' : 'P2 Medium'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{alert.message}</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleCompleteTask(alert.id, alert.title)}
                      className="ml-4"
                    >
                      {alert.actionText}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
