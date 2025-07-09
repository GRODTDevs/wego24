import { useSystemSettings } from "@/contexts/SystemSettingsContext";
import { useUserRole } from "@/hooks/useUserRole";
import MaintenancePage from "@/components/MaintenancePage";

export default function MaintenanceGate({ children }: { children: React.ReactNode }) {
  const { settings, loading } = useSystemSettings();
  const { isAdmin } = useUserRole();

  if (loading) return null;
  if (settings.maintenance_mode === true || settings.maintenance_mode === "true") {
    if (!isAdmin) return <MaintenancePage />;
  }
  return <>{children}</>;
}
