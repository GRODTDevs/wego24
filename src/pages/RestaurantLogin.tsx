
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function RestaurantLogin() {
  const [name, setName] = useState("");
  const [pass, setPass] = useState("");
  const nav = useNavigate();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Demo only: always 'log in'
    nav("/restaurant/dashboard");
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <div className="w-full max-w-sm bg-white border border-orange-100 rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-4 text-center text-orange-500">Restaurant Login</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Username</label>
            <input
              className="w-full border rounded px-3 py-2 bg-white"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Restaurant name"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Password</label>
            <input
              type="password"
              className="w-full border rounded px-3 py-2 bg-white"
              value={pass}
              onChange={e => setPass(e.target.value)}
              placeholder="Password"
              required
            />
          </div>
          <Button type="submit" className="w-full bg-gradient-to-r from-red-500 to-orange-400 text-white">Log In</Button>
        </form>
      </div>
    </main>
  );
}
