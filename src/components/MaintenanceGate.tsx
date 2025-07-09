import { useSystemSettings } from "@/contexts/SystemSettingsContext";
import { useUserRole } from "@/hooks/useUserRole";
import { useAuth } from "@/contexts/AuthContext";
import MaintenancePage from "@/components/MaintenancePage";
import { useLocation } from "react-router-dom";

export default function MaintenanceGate({ children }: { children: React.ReactNode }) {
  const { settings, loading: settingsLoading } = useSystemSettings();
  const { isAdmin, loading: roleLoading, userRole } = useUserRole();
  const { user } = useAuth();
  const location = useLocation();

  // Always wait for settings and role to load before any logic
  if (settingsLoading || roleLoading) {
    if (typeof window !== 'undefined') {
      console.log('[MaintenanceGate] Waiting for settings/role to load');
    }
    return null;
  }

  // Only enable maintenance mode if explicitly true (boolean or string)
  const maintenanceOn = settings.maintenance_mode === true || settings.maintenance_mode === "true";

  // Allow /auth route for all users even during maintenance
  if (location.pathname === '/auth') {
    if (typeof window !== 'undefined') {
      console.log('[MaintenanceGate] Allowing /auth route during maintenance');
    }
    return <>{children}</>;
  }

  if (maintenanceOn) {
    if (!user || !isAdmin) {
      if (typeof window !== 'undefined') {
        console.log('[MaintenanceGate] Maintenance mode active, blocking all except authenticated admin');
      }
      return <MaintenancePage />;
    }
  }

  if (typeof window !== 'undefined') {
    console.log('[MaintenanceGate] Allowing access for user:', user, 'isAdmin:', isAdmin, 'userRole:', userRole);
  }
  return <>{children}</>;
}
