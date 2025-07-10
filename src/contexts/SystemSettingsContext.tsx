console.log("[SystemSettingsContext] File loaded");
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const SystemSettingsContext = createContext<any>(undefined);

export function SystemSettingsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    console.log("[SystemSettingsContext] fetchSettings called");
    console.log("[SystemSettingsContext] supabase client:", supabase);
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("system_settings")
        .select("*")
        .throwOnError();

      console.log("[SystemSettingsContext] Supabase response:", {
        data,
        error,
      });

      if (!data || data.length === 0) {
        console.warn("[SystemSettingsContext] system_settings table is empty.");
        setSettings({});
      } else {
        console.log("[SystemSettingsContext] Raw system_settings data:", data);
        const settingsObj = {};
        data.forEach((row) => {
          settingsObj[row.key] = row.value;
        });
        console.log("[SystemSettingsContext] Parsed settings:", settingsObj);
        setSettings(settingsObj);
      }
    } catch (err) {
      console.error("[SystemSettingsContext] Query threw error:", err);
      setSettings({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("[SystemSettingsContext] useEffect running");
    if (typeof window !== "undefined") {
      fetchSettings();
    } else {
      console.log(
        "[SystemSettingsContext] Skipping fetchSettings: SSR detected"
      );
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      console.log(
        "[SystemSettingsContext] settings:",
        settings,
        "loading:",
        loading
      );
    }
  }, [settings, loading]);

  return (
    <SystemSettingsContext.Provider
      value={{ settings, refreshSettings: fetchSettings, loading }}
    >
      {children}
    </SystemSettingsContext.Provider>
  );
}

export function useSystemSettings() {
  const ctx = useContext(SystemSettingsContext);
  if (!ctx) {
    return { settings: {}, loading: false, refreshSettings: () => {} };
  }
  return ctx;
}
