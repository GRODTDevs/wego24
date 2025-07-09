import { useSystemSettings } from "@/contexts/SystemSettingsContext";
import { useUserRole } from "@/hooks/useUserRole";
import MaintenancePage from "@/components/MaintenancePage";

export default function MaintenanceGate({ children }: { children: React.ReactNode }) {
  const { settings, loading: settingsLoading } = useSystemSettings();
  const { isAdmin, loading: roleLoading } = useUserRole();

  if (settingsLoading || roleLoading) return null;
  // Only block non-admins if maintenance mode is enabled
  if ((settings.maintenance_mode === true || settings.maintenance_mode === "true") && !isAdmin) {
    return <MaintenancePage />;
  }
  return <>{children}</>;
}
