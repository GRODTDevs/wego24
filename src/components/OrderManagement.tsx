
import { RealTimeOrderDashboard } from "./orders/RealTimeOrderDashboard";

interface OrderManagementProps {
  businessId: string;
}

export function OrderManagement({ businessId }: OrderManagementProps) {
  return (
    <RealTimeOrderDashboard 
      businessId={businessId} 
      userRole="restaurant"
    />
  );
}
