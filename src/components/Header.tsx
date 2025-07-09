import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useAuth } from "../contexts/AuthContext";
import { useTranslation } from "@/contexts/TranslationContext";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { NotificationCenter } from "./orders/NotificationCenter";
import { MobileNav } from "./MobileNav";
import { errorLogger } from "../utils/errorLogger";
import { useUserRole } from "@/hooks/useUserRole";

export function Header() {
  const { user, signOut } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAdmin } = useUserRole();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      errorLogger.log(error instanceof Error ? error : "Sign out failed");
      console.error("Sign out error:", error);
    }
  };

  return (
    // if the page is dev-login, do not show the header
    <header className="bg-red-600 text-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2 rounded-sm">
            <img
              src="/lovable-uploads/e9f1fc70-186e-4f21-bbb4-bdaed5b5a6f4.png"
              alt="WeGo Logo"
              className="h-8 w-auto rounded-sm"
            />
          </Link>

          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            {user ? (
              <div className="flex items-center space-x-4">
                <NotificationCenter />
                <Button
                  variant="ghost"
                  onClick={handleSignOut}
                  className="text-white"
                >
                  {t("auth.signOut")}
                </Button>
              </div>
            ) : (
              <Button onClick={() => navigate("/auth")} variant="outline" className="bg-transparent text-white border-white">
                {t("nav.signIn")}
              </Button>
            )}
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  );
}
