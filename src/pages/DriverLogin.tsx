
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";

export default function DriverLogin() {
  const navigate = useNavigate();
  const [driverID, setDriverID] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Demo: go to dashboard regardless of input
    navigate("/driver/dashboard");
  }

  return (
    <main className="min-h-screen bg-white pb-8">
      <Header />
      <section className="w-full max-w-2xl mx-auto px-4 py-6 mt-6 mb-6 rounded-lg bg-orange-50 border border-orange-200 shadow-sm">
        <h2 className="text-lg font-semibold text-orange-700 mb-2">Drivers: Demo Login</h2>
        <p className="text-gray-700">
          This page allows you to log in as a delivery driver (demo only). <br />
          <span className="font-medium text-orange-500">Product Owner Steps:</span>
          <ul className="list-disc pl-6 text-gray-600 mt-1 text-sm">
            <li>Enter any driver ID (optional for demo) and click 'Login'.</li>
            <li>You will be taken to the demo driver dashboard.</li>
            <li>Review how drivers will interact with incoming orders.</li>
          </ul>
        </p>
      </section>
      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 max-w-sm mx-auto bg-white border border-orange-100 shadow px-8 py-6 rounded-lg">
        <label className="w-full">
          <span className="font-bold text-orange-600">Driver ID (demo):</span>
          <input
            className="w-full mt-1 mb-3 px-4 py-2 border border-orange-200 rounded shadow-inner focus:outline-none focus:ring-2 focus:ring-orange-400"
            value={driverID}
            onChange={e => setDriverID(e.target.value)}
            placeholder="Enter any driver ID or leave blank"
            autoFocus
          />
        </label>
        <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold text-base">
          Login
        </Button>
      </form>
    </main>
  );
}
