import React from "react";

export default function MaintenancePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-red-600 mb-4">Maintenance Mode</h1>
      <p className="text-lg text-gray-700 mb-6">We are currently performing scheduled maintenance.<br />Please check back soon.</p>
      <img src="/lovable-uploads/999acc8c-4528-415a-85a4-1de255e2fce5.png" alt="Maintenance" className="h-24 w-auto" />
    </div>
  );
}
