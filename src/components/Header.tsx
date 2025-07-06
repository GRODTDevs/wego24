
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useLocation } from "react-router-dom";

export function Header() {
  const location = useLocation();
  const isRegistrationPage = location.pathname === '/partner-register';

  return (
    <header className="w-full bg-gradient-to-r from-red-600 via-red-500 to-red-600 shadow-lg sticky top-0 z-30">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-2 h-16">
        <div className="flex items-center gap-3">
          <img 
            src="/lovable-uploads/999acc8c-4528-415a-85a4-1de255e2fce5.png" 
            alt="WeGo Logo" 
            className="h-10 w-auto rounded-lg"
          />
        </div>
        <LanguageSwitcher />
      </div>
    </header>
  );
}
