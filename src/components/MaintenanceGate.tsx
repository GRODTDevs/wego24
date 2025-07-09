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

  // Allow /auth route for all users even during maintenance
  if (location.pathname === '/auth') {
    if (typeof window !== 'undefined') {
      console.log('[MaintenanceGate] Allowing /auth route during maintenance');
    }
    return <>{children}</>;
  }

  // Fail safe: treat missing/undefined maintenance_mode as enabled
  const maintenanceOn = settings.maintenance_mode === true || settings.maintenance_mode === "true" || typeof settings.maintenance_mode === 'undefined';

  if (maintenanceOn) {
    if (!user || !isAdmin) {
      if (typeof window !== 'undefined') {
        console.log('[MaintenanceGate] Maintenance mode active (or undefined), blocking all except authenticated admin');
      }
      // Extra debug: show what is being blocked
      console.log('[MaintenanceGate] Blocked user:', user, 'isAdmin:', isAdmin, 'userRole:', userRole);
      return <MaintenancePage />;
    }
  }

  // Extra debug: show when access is allowed
  if (typeof window !== 'undefined') {
    console.log('[MaintenanceGate] Allowing access for user:', user, 'isAdmin:', isAdmin, 'userRole:', userRole);
  }
  return <>{children}</>;
}
