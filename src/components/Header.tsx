
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useAuth } from "../contexts/AuthContext";
import { useTranslation } from "../contexts/TranslationContext";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { NotificationCenter } from "./orders/NotificationCenter";
import { MobileNav } from "./MobileNav";
import { useUserRole } from "../hooks/useUserRole";
import { User } from "lucide-react";

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
            <img 
              src="/lovable-uploads/999acc8c-4528-415a-85a4-1de255e2fce5.png" 
              alt="WeGo Logo" 
              className="h-8 w-auto"
            />
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
              <>
                <Link 
                  to="/partner-info" 
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {t('common.partnerInfo')}
                </Link>
                <Link 
                  to="/driver/register" 
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Become a Driver
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            
            {user ? (
              <div className="flex items-center space-x-2">
                <NotificationCenter />
                
                <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm">
                  <User className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-medium text-gray-700">
                    Welcome {user.user_metadata?.first_name || "User"}!
                  </span>
                </div>
                
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
