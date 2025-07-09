import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface SystemSetting {
  key: string;
  value: any;
  description?: string;
}

interface SystemSettingsContextType {
  settings: Record<string, any>;
  refreshSettings: () => Promise<void>;
  loading: boolean;
}

const SystemSettingsContext = createContext<SystemSettingsContextType | undefined>(undefined);

export const SystemSettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("system_settings").select("key, value");
    if (!error && data) {
      const mapped: Record<string, any> = {};
      data.forEach((row: { key: string; value: any }) => {
        mapped[row.key] = typeof row.value === "string" && row.value.match(/^\d+(\.\d+)?$/)
          ? parseFloat(row.value)
          : row.value;
      });
      setSettings(mapped);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SystemSettingsContext.Provider value={{ settings, refreshSettings: fetchSettings, loading }}>
      {children}
    </SystemSettingsContext.Provider>
  );
};

export function useSystemSettings() {
  const ctx = useContext(SystemSettingsContext);
  if (!ctx) throw new Error("useSystemSettings must be used within SystemSettingsProvider");
  return ctx;
}
