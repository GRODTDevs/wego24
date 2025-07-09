
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { generateSecureApiKey, logSecurityEvent } from "@/utils/securityUtils";

interface SecureAdminPartnerApiKeysPanelProps {
  partnerId: string;
}

export default function SecureAdminPartnerApiKeysPanel({ partnerId }: SecureAdminPartnerApiKeysPanelProps) {
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!partnerId) return;
    
    fetchApiKeys();
  }, [partnerId]);

  const fetchApiKeys = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("partner_api_keys")
        .select("*")
        .eq("partner_id", partnerId);

      if (error) throw error;
      setApiKeys(data || []);
    } catch (error) {
      console.error('Error fetching API keys:', error);
      toast({
        title: "Error",
        description: "Failed to load API keys",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createApiKey = async () => {
    try {
      const apiKey = generateSecureApiKey();
      
      const { error } = await supabase
        .from("partner_api_keys")
        .insert({ 
          partner_id: partnerId, 
          api_key: apiKey,
          active: true
        });

      if (error) throw error;

      // Log API key creation
      await logSecurityEvent(
        'api_key_created',
        'partner_api_key',
        partnerId,
        { api_key_prefix: apiKey.substring(0, 8) + "..." }
      );

      toast({
        title: "Success",
        description: "New API key generated successfully",
      });

      fetchApiKeys();
    } catch (error) {
      console.error('Error creating API key:', error);
      toast({
        title: "Error",
        description: "Failed to create API key",
        variant: "destructive"
      });
    }
  };

  const revokeApiKey = async (keyId: string, apiKey: string) => {
    try {
      const { error } = await supabase
        .from("partner_api_keys")
        .update({ active: false })
        .eq("id", keyId);

      if (error) throw error;

      // Log API key revocation
      await logSecurityEvent(
        'api_key_revoked',
        'partner_api_key',
        partnerId,
        { 
          revoked_key_id: keyId,
          api_key_prefix: apiKey.substring(0, 8) + "..."
        }
      );

      toast({
        title: "Success",
        description: "API key revoked successfully",
      });

      fetchApiKeys();
    } catch (error) {
      console.error('Error revoking API key:', error);
      toast({
        title: "Error",
        description: "Failed to revoke API key",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <h3 className="text-lg font-bold mb-4">API Keys</h3>
        <div className="text-gray-500">Loading API keys...</div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">API Keys</h3>
        <Button onClick={createApiKey} size="sm">
          Generate New Key
        </Button>
      </div>
      
      {apiKeys.length === 0 ? (
        <div className="text-gray-500 text-center py-4">
          No API keys generated yet
        </div>
      ) : (
        <div className="space-y-2">
          {apiKeys.map((key) => (
            <div key={key.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <div className="font-mono text-sm">
                  {key.active ? (
                    <span className="text-green-600">{key.api_key}</span>
                  ) : (
                    <span className="text-gray-400 line-through">{key.api_key}</span>
                  )}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Created: {new Date(key.created_at).toLocaleDateString()}
                </div>
              </div>
              <div className="ml-4">
                {key.active ? (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => revokeApiKey(key.id, key.api_key)}
                  >
                    Revoke
                  </Button>
                ) : (
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    Revoked
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
