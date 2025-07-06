
import { MobileNav } from "./MobileNav";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useTranslation } from "@/contexts/TranslationContext";

export function Header() {
  const { t } = useTranslation();

  return (
    <header className="w-full bg-gradient-to-r from-red-600 via-red-500 to-red-600 shadow-lg sticky top-0 z-30">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-2 h-16">
        <div className="flex items-center gap-3">
          <img 
            src="/lovable-uploads/999acc8c-4528-415a-85a4-1de255e2fce5.png" 
            alt="WeGo Logo" 
            className="h-10 w-auto"
          />
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <a href="/" className="text-white hover:text-red-200 font-medium transition-colors">{t('nav.home')}</a>
          <a href="/driver/login" className="text-white hover:text-red-200 font-medium transition-colors">{t('nav.drivers')}</a>
          <a href="/restaurant/login" className="text-white hover:text-red-200 font-medium transition-colors">{t('nav.partners')}</a>
          <a href="/admin/dashboard" className="text-white hover:text-red-200 font-medium transition-colors">{t('nav.admin')}</a>
          <LanguageSwitcher />
        </nav>
        <div className="md:hidden">
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
