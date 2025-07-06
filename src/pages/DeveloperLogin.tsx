
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function DeveloperLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "1vAUBnF3ao9d") {
      // Store authentication in localStorage
      localStorage.setItem("dev_authenticated", "true");
      navigate("/");
    } else {
      setError("Invalid password");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white border border-orange-100 rounded-xl shadow-lg p-8">
        <div className="flex justify-center mb-8">
          <img 
            src="/lovable-uploads/999acc8c-4528-415a-85a4-1de255e2fce5.png" 
            alt="WeGo Logo" 
            className="h-16 w-auto rounded-lg"
          />
        </div>
        
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full text-center"
              required
            />
          </div>
          
          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}
          
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-red-500 to-orange-400 text-white hover:from-red-600 hover:to-orange-500"
          >
            Enter
          </Button>
        </form>
      </div>
    </div>
  );
}
