import React, { useState } from "react";

const MobileMenu: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden relative">
      <button
        className="p-2 rounded bg-white text-red-600 border border-red-600"
        onClick={() => setOpen((o) => !o)}
        aria-label="Open mobile menu"
      >
        ☰
      </button>
      {open && (
        <nav className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded z-50">
          <ul className="flex flex-col">
            <li><a href="/" className="block px-4 py-2 hover:bg-red-100">Home</a></li>
            <li><a href="/dashboard" className="block px-4 py-2 hover:bg-red-100">Dashboard</a></li>
            <li><a href="/support-chat" className="block px-4 py-2 hover:bg-red-100">Support</a></li>
            {/* Add more links as needed */}
          </ul>
        </nav>
      )}
    </div>
  );
};

export default MobileMenu;
