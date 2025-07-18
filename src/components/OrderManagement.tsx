import { RealTimeOrderDashboard } from "./orders/RealTimeOrderDashboard";

interface OrderManagementProps {
  businessId: string;
}

export function OrderManagement({ businessId }: OrderManagementProps) {
  console.log('[OrderManagement] businessId:', businessId);

  return (
    <RealTimeOrderDashboard 
      businessId={businessId} 
      userRole="restaurant"
    />
  );
}
