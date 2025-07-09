import { useSystemSettings } from "@/contexts/SystemSettingsContext";
import { useUserRole } from "@/hooks/useUserRole";
import { useAuth } from "@/contexts/AuthContext";
import MaintenancePage from "@/components/MaintenancePage";

export default function MaintenanceGate({ children }: { children: React.ReactNode }) {
  const { settings, loading: settingsLoading } = useSystemSettings();
  const { isAdmin, loading: roleLoading, userRole } = useUserRole();
  const { user } = useAuth();

  if (typeof window !== 'undefined') {
    console.log('[MaintenanceGate] settings:', settings, 'settingsLoading:', settingsLoading);
    console.log('[MaintenanceGate] isAdmin:', isAdmin, 'userRole:', userRole, 'roleLoading:', roleLoading, 'user:', user);
  }

  if (settingsLoading || roleLoading) return null;

  // Strictly block all access for non-admins and unauthenticated users when maintenance mode is on
  if (settings.maintenance_mode === true || settings.maintenance_mode === "true") {
    if (!user || !isAdmin) {
      if (typeof window !== 'undefined') {
        console.log('[MaintenanceGate] Maintenance mode active, blocking all except authenticated admin');
      }
      return <MaintenancePage />;
    }
  }

  if (typeof window !== 'undefined') {
    console.log('[MaintenanceGate] Allowing access');
  }
  return <>{children}</>;
}
