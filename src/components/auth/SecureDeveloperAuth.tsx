
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Secure developer authentication with environment variables
export function SecureDeveloperAuth() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Use environment variable for secure password check
      const devPassword = import.meta.env.VITE_DEV_LOGIN_PASSWORD;
      
      if (!devPassword) {
        setError("Developer authentication not configured");
        setLoading(false);
        return;
      }

      if (password !== devPassword) {
        // Log failed authentication attempt
        await supabase.rpc('log_security_event', {
          p_user_id: null,
          p_action: 'dev_login_failed',
          p_resource_type: 'authentication',
          p_details: { timestamp: new Date().toISOString() }
        });

        setError("Invalid developer credentials");
        setLoading(false);
        return;
      }

      // Generate secure session token instead of simple flag
      const sessionToken = crypto.randomUUID();
      const expiryTime = Date.now() + (2 * 60 * 60 * 1000); // 2 hours

      // Store secure session data
      sessionStorage.setItem("dev_session", JSON.stringify({
        token: sessionToken,
        expires: expiryTime,
        authenticated: true
      }));

      // Log successful authentication
      await supabase.rpc('log_security_event', {
        p_user_id: null,
        p_action: 'dev_login_success',
        p_resource_type: 'authentication',
        p_details: { 
          timestamp: new Date().toISOString(),
          session_token: sessionToken.substring(0, 8) + "..." // Log partial token for tracking
        }
      });

      toast({
        title: "Authentication Successful",
        description: "Developer access granted",
      });

      navigate("/operations");
    } catch (error) {
      console.error('Developer auth error:', error);
      setError("Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img 
              src="/lovable-uploads/999acc8c-4528-415a-85a4-1de255e2fce5.png" 
              alt="WeGo Logo" 
              className="h-16 w-auto rounded-lg"
            />
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Access Password"
              className="w-full"
              disabled={loading}
              required
            />
            
            {error && (
              <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">
                {error}
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-red-500 to-orange-400 hover:from-red-600 hover:to-orange-500" 
              disabled={loading}
            >
              {loading ? "Authenticating..." : "Secure Access"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
