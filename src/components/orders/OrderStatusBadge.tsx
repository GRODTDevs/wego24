
import { Badge } from "@/components/ui/badge";

interface OrderStatusBadgeProps {
  status: string;
}

const statusConfig = {
  pending: { label: "Pending", className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200" },
  confirmed: { label: "Confirmed", className: "bg-blue-100 text-blue-800 hover:bg-blue-200" },
  preparing: { label: "Preparing", className: "bg-orange-100 text-orange-800 hover:bg-orange-200" },
  ready: { label: "Ready", className: "bg-green-100 text-green-800 hover:bg-green-200" },
  out_for_delivery: { label: "Out for Delivery", className: "bg-purple-100 text-purple-800 hover:bg-purple-200" },
  delivered: { label: "Delivered", className: "bg-green-100 text-green-800 hover:bg-green-200" },
  cancelled: { label: "Cancelled", className: "bg-red-100 text-red-800 hover:bg-red-200" }
};

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  
  return (
    <Badge className={config.className}>
      {config.label}
    </Badge>
  );
}
