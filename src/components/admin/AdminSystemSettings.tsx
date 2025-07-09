import { useEffect, useState } from "react";
import { useSystemSettings } from "@/contexts/SystemSettingsContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export default function AdminSystemSettings() {
  const { settings, refreshSettings, loading } = useSystemSettings();
  const [editValues, setEditValues] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setEditValues(settings);
  }, [settings]);

  const handleChange = (key: string, value: any) => {
    setEditValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (key: string) => {
    setSaving(true);
    await supabase.from("system_settings").update({ value: editValues[key] }).eq("key", key);
    await refreshSettings();
    setSaving(false);
  };

  if (loading) return <div>Loading system settings...</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">System Settings</h2>
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th className="text-left">Key</th>
            <th className="text-left">Value</th>
            <th className="text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(settings).map((key) => (
            <tr key={key} className="border-b">
              <td>{key}</td>
              <td>
                <input
                  className="border px-2 py-1 w-full"
                  value={editValues[key] ?? ''}
                  onChange={(e) => handleChange(key, e.target.value)}
                  disabled={saving}
                />
              </td>
              <td>
                <Button onClick={() => handleSave(key)} disabled={saving} size="sm">
                  Save
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
