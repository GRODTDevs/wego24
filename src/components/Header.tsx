import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useAuth } from "../contexts/AuthContext";
import { useTranslation } from "../contexts/TranslationContext";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { NotificationCenter } from "./orders/NotificationCenter";
import { MobileNav } from "./MobileNav";
import { useUserRole } from "../hooks/useUserRole";
import { User } from "lucide-react";

export function Header() {
  const { user, signOut } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">W</span>
            </div>
            <span className="text-xl font-bold text-gray-900">WeGo</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-600 hover:text-gray-900 transition-colors">
              {t('common.home')}
            </Link>
            <Link to="/courier-request" className="text-gray-600 hover:text-gray-900 transition-colors">
              {t('common.courierRequest')}
            </Link>
            <Link to="/partner-info" className="text-gray-600 hover:text-gray-900 transition-colors">
              {t('common.partnerInfo')}
            </Link>
            <Link to="/driver-registration" className="text-gray-600 hover:text-gray-900 transition-colors">
              {t('driver.become')}
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            {user ? (
              <div className="flex items-center space-x-4">
                {/* Show driver dashboard link if user is a driver */}
                <Link 
                  to="/driver-dashboard" 
                  className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
                >
                  Driver Dashboard
                </Link>
                <Button variant="ghost" onClick={handleSignOut} className="text-gray-600">
                  {t('auth.signOut')}
                </Button>
              </div>
            ) : (
              <Button onClick={() => navigate('/auth')} variant="outline">
                {t('auth.signIn')}
              </Button>
            )}
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  );
}
