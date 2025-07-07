import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useAuth } from "../contexts/AuthContext";
import { useTranslation } from "@/contexts/TranslationContext";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { NotificationCenter } from "./orders/NotificationCenter";
import { MobileNav } from "./MobileNav";
import { errorLogger } from "../utils/errorLogger";

export function Header() {
  const { user, signOut } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      errorLogger.log(error instanceof Error ? error : 'Sign out failed');
      console.error('Sign out error:', error);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/e9f1fc70-186e-4f21-bbb4-bdaed5b5a6f4.png" 
              alt="WeGo Logo" 
              className="h-8 w-auto"
            />
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-600 hover:text-gray-900 transition-colors">
              {t('nav.home')}
            </Link>
            <Link to="/courier-request" className="text-gray-600 hover:text-gray-900 transition-colors">
              {t('nav.courierRequest')}
            </Link>
            <Link to="/partner-info" className="text-gray-600 hover:text-gray-900 transition-colors">
              {t('nav.partnerInfo')}
            </Link>
            <Link to="/driver-registration" className="text-gray-600 hover:text-gray-900 transition-colors">
              {t('nav.become')}
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            {user ? (
              <div className="flex items-center space-x-4">
                <NotificationCenter />
                <Link 
                  to="/operations" 
                  className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
                >
                  {t('dashboard.dashboard')}
                </Link>
                <Button variant="ghost" onClick={handleSignOut} className="text-gray-600">
                  {t('auth.signOut')}
                </Button>
              </div>
            ) : (
              <Button onClick={() => navigate('/auth')} variant="outline">
                {t('nav.signIn')}
              </Button>
            )}
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  );
}
