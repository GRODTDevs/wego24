import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const SystemSettingsContext = createContext<any>(undefined);

export function SystemSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);

  // Define fetchSettings outside useEffect so it can be used in the provider value
  async function fetchSettings() {
    setLoading(true);
    const { data, error } = await supabase.from("system_settings").select("key,value");
    if (error) {
      console.error("[SystemSettingsContext] Error fetching settings:", error);
      setSettings({});
    } else {
      const settingsObj: Record<string, any> = {};
      if (Array.isArray(data)) {
        data.forEach((row) => {
          settingsObj[row.key] = row.value;
        });
      }
      setSettings(settingsObj);
      if (typeof window !== 'undefined') {
        console.log('[SystemSettingsContext] fetched settings:', settingsObj);
      }
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log('[SystemSettingsContext] settings:', settings, 'loading:', loading);
    }
  }, [settings, loading]);

  return (
    <SystemSettingsContext.Provider value={{ settings, refreshSettings: fetchSettings, loading }}>
      {children}
    </SystemSettingsContext.Provider>
  );
}

export function useSystemSettings() {
  const ctx = useContext(SystemSettingsContext);
  if (!ctx) {
    throw new Error("useSystemSettings must be used within SystemSettingsProvider");
  }
  return ctx;
}
