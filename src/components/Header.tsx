
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useAuth } from "../contexts/AuthContext";
import { useTranslation } from "../contexts/TranslationContext";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { NotificationCenter } from "./orders/NotificationCenter";
import { MobileNav } from "./MobileNav";
import { useUserRole } from "../hooks/useUserRole";

export function Header({ className }: { className?: string }) {
  const { user, signOut } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { userRole } = useUserRole();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className={`border-b bg-white shadow-sm ${className}`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-lg">
              <span className="font-bold text-xl">WeGo</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              {t('common.home')}
            </Link>
            <Link 
              to="/courier-request" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              {t('common.courierRequest')}
            </Link>
            {!user && (
              <Link 
                to="/partner-info" 
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                {t('common.partnerInfo')}
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            
            {user ? (
              <div className="flex items-center space-x-2">
                {/* Show notification center for authenticated users */}
                <NotificationCenter />
                
                <span className="text-sm text-gray-600 hidden md:inline">
                  {user.email}
                </span>
                
                {userRole?.includes('admin') && (
                  <Button asChild variant="outline" size="sm">
                    <Link to="/admin/dashboard">{t('common.adminDashboard')}</Link>
                  </Button>
                )}
                
                {userRole?.includes('partner') && (
                  <Button asChild variant="outline" size="sm">
                    <Link to="/partner/dashboard">{t('common.partnerDashboard')}</Link>
                  </Button>
                )}
                
                <Button 
                  onClick={handleSignOut} 
                  variant="outline" 
                  size="sm"
                  className="hidden md:inline-flex"
                >
                  {t('auth.signOut')}
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button asChild variant="outline" size="sm">
                  <Link to="/auth">{t('auth.signIn')}</Link>
                </Button>
              </div>
            )}
            
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  );
}
