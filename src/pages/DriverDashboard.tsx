
import { Header } from "@/components/Header";

export default function DriverDashboard() {
  return (
    <main className="min-h-screen bg-white pb-8">
      <Header />
      <section className="w-full max-w-2xl mx-auto px-4 py-6 mt-6 mb-8 rounded-lg bg-orange-50 border border-orange-200 shadow-sm">
        <h2 className="text-lg font-semibold text-orange-700 mb-2">Demo: Driver Dashboard</h2>
        <p className="text-gray-700">
          This is the driver dashboard. It shows a list of new and pending delivery orders for assigned drivers (demo only).<br />
          <span className="font-medium text-orange-500">Product Owner Steps:</span>
          <ul className="list-disc pl-6 text-gray-600 mt-1 text-sm">
            <li>Review the format of new delivery orders and order statuses.</li>
            <li>Test driver actions and status changes (will be interactive in future sprints).</li>
          </ul>
        </p>
      </section>
      <section className="w-full max-w-3xl mx-auto px-4">
        <div className="border border-orange-200 rounded-lg shadow px-6 py-6 bg-white">
          <h3 className="text-lg font-bold mb-2 text-gray-800">Incoming Orders</h3>
          <ul className="divide-y divide-orange-100">
            {/* Demo order entries */}
            <li className="py-4 flex justify-between items-center">
              <div>
                <span className="font-semibold">Order #101</span> from <span className="text-orange-500">Sunrise Diner</span>
                <div className="text-xs text-gray-500">Pickup: 17 C/ Real, Nerja</div>
                <div className="text-xs text-gray-500">Drop-off: 9 Calle Pintada, Nerja</div>
              </div>
              <span className="text-sm bg-yellow-200 text-yellow-800 px-3 py-1 rounded">New</span>
            </li>
            <li className="py-4 flex justify-between items-center">
              <div>
                <span className="font-semibold">Order #102</span> from <span className="text-orange-500">Spice Symphony</span>
                <div className="text-xs text-gray-500">Pickup: 12 Plaza Balcón, Torrox</div>
                <div className="text-xs text-gray-500">Drop-off: 14 Av. Castilla Perez, Nerja</div>
              </div>
              <span className="text-sm bg-yellow-100 text-yellow-900 px-3 py-1 rounded">Assigned</span>
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}
