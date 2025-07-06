
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function AdminSetup() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const makeUserAdmin = async () => {
    if (!email.trim()) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      console.log('Making user admin:', email);

      const { error } = await supabase.rpc('create_superuser', {
        user_email: email
      });

      if (error) {
        console.error('Error making user admin:', error);
        throw error;
      }

      toast({
        title: "Success",
        description: `User ${email} has been granted admin privileges`,
      });
      setEmail("");
    } catch (error) {
      console.error('Error in makeUserAdmin:', error);
      toast({
        title: "Error",
        description: "Failed to grant admin privileges. Make sure the user exists.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Admin Setup</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">Email Address</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter user email to make admin"
          />
        </div>
        <Button 
          onClick={makeUserAdmin} 
          disabled={loading}
          className="w-full"
        >
          {loading ? "Processing..." : "Grant Admin Role"}
        </Button>
      </CardContent>
    </Card>
  );
}
