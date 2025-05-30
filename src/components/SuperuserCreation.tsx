
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const SuperuserCreation = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { toast } = useToast();

  const createSuperuser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const { error } = await supabase.rpc('create_superuser', {
        user_email: email
      });

      if (error) {
        setMessage(`Error: ${error.message}`);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
      } else {
        setMessage('Successfully granted admin privileges!');
        toast({
          title: "Success",
          description: "Admin privileges granted successfully!"
        });
        setEmail('');
      }
    } catch (err) {
      setMessage('An unexpected error occurred');
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create Superuser</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={createSuperuser} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">User Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email of existing user to make admin"
              required
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating..." : "Grant Admin Privileges"}
          </Button>
          
          {message && (
            <Alert className={message.includes('Error') ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}>
              <AlertDescription className={message.includes('Error') ? 'text-red-700' : 'text-green-700'}>
                {message}
              </AlertDescription>
            </Alert>
          )}
        </form>
        
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>Instructions:</strong> First create a regular account through the signup process, then enter that email here to grant admin privileges.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
