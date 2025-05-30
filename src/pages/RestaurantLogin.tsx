
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

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
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <section className="w-full max-w-3xl mx-auto px-4 py-6 mb-6 mt-8 rounded-lg bg-orange-50 border border-orange-200 shadow-sm">
          <h2 className="text-lg font-semibold text-orange-700 mb-1">Restaurant Login Demo</h2>
          <p className="text-gray-700">
            This page allows restaurant operators to log in and manage their demo orders.<br />
            <span className="font-medium text-orange-500">Product Owner Steps:</span>
            <ul className="list-disc pl-6 text-gray-600 mt-1 text-sm">
              <li>Log in with any credentials (demo-only).</li>
              <li>Be redirected to the dashboard to view & process orders.</li>
              <li>Return to the home page to see the customer side.</li>
            </ul>
          </p>
        </section>
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
      <Footer />
    </div>
  );
}
