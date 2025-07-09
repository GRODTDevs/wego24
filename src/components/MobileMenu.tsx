import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "@/contexts/TranslationContext";

const MobileMenu: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  console.log('[MobileMenu] open:', open);

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
            <li>
              <Link 
                to="/" 
                className="block px-4 py-2 hover:bg-red-100"
                onClick={() => setOpen(false)}
              >
                {t("nav.home")}
              </Link>
            </li>
            <li>
              <Link 
                to="/courier-request" 
                className="block px-4 py-2 hover:bg-red-100"
                onClick={() => setOpen(false)}
              >
                {t("nav.courierRequest")}
              </Link>
            </li>
            <li>
              <Link 
                to="/partner-info" 
                className="block px-4 py-2 hover:bg-red-100"
                onClick={() => setOpen(false)}
              >
                {t("nav.partnerInfo")}
              </Link>
            </li>
            <li>
              <Link 
                to="/driver-registration" 
                className="block px-4 py-2 hover:bg-red-100"
                onClick={() => setOpen(false)}
              >
                {t("nav.become")}
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default MobileMenu;
