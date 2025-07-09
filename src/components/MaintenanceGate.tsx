import { useSystemSettings } from "@/contexts/SystemSettingsContext";
import { useUserRole } from "@/hooks/useUserRole";
import MaintenancePage from "@/components/MaintenancePage";

export default function MaintenanceGate({ children }: { children: React.ReactNode }) {
  const { settings, loading: settingsLoading } = useSystemSettings();
  const { isAdmin, loading: roleLoading, userRole } = useUserRole();

  if (typeof window !== 'undefined') {
    console.log('[MaintenanceGate] settings:', settings, 'settingsLoading:', settingsLoading);
    console.log('[MaintenanceGate] isAdmin:', isAdmin, 'userRole:', userRole, 'roleLoading:', roleLoading);
  }

  if (settingsLoading || roleLoading) return null;

  // Strictly block all access for non-admins when maintenance mode is on
  if (settings.maintenance_mode === true || settings.maintenance_mode === "true") {
    if (!isAdmin) {
      if (typeof window !== 'undefined') {
        console.log('[MaintenanceGate] Maintenance mode active, blocking all except admin');
      }
      return <MaintenancePage />;
    }
  }

  if (typeof window !== 'undefined') {
    console.log('[MaintenanceGate] Allowing access');
  }
  return <>{children}</>;
}
