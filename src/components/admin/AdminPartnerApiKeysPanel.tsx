import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

function generateApiKey() {
  return ([1,2,3,4].map(() => Math.random().toString(36).substring(2, 10)).join("-")).toUpperCase();
}

export default function AdminPartnerApiKeysPanel({ partnerId }) {
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!partnerId) {
      return;
    }
    setLoading(true);
    supabase.from("partner_api_keys").select("*").eq("partner_id", partnerId).then(({ data }) => {
      setApiKeys(data || []);
      setLoading(false);
    });
  }, [partnerId]);

  const createApiKey = async () => {
    const apiKey = generateApiKey();
    await supabase.from("partner_api_keys").insert({ partner_id: partnerId, api_key: apiKey });
    const { data } = await supabase.from("partner_api_keys").select("*").eq("partner_id", partnerId);
    setApiKeys(data || []);
  };

  const revokeApiKey = async (id) => {
    await supabase.from("partner_api_keys").update({ active: false }).eq("id", id);
    const { data } = await supabase.from("partner_api_keys").select("*").eq("partner_id", partnerId);
    setApiKeys(data || []);
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-bold mb-2">API Keys</h3>
      <Button onClick={createApiKey}>Generate New API Key</Button>
      {loading ? <div>Loading...</div> : (
        <ul>
          {apiKeys.map(key => (
            <li key={key.id} className="border-b py-2 flex justify-between items-center">
              <span className={key.active ? "text-green-600" : "text-gray-400"}>{key.api_key}</span>
              {key.active ? <Button size="sm" variant="destructive" onClick={() => revokeApiKey(key.id)}>Revoke</Button> : <span>Revoked</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
