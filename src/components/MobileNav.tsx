import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/contexts/TranslationContext";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const navLinks = [
    { to: "/", label: t('nav.home') },
    { to: "/driver-registration", label: t('nav.drivers') },
    { to: "/partner-info", label: t('nav.partners') },
    { to: "/operations", label: t('nav.admin') }
  ];

  console.log('[MobileNav] open:', open);

  return (
    <>
      <Button
        className="md:hidden bg-transparent hover:bg-red-700 px-3 py-2"
        variant="ghost"
        size="icon"
        aria-label="Open menu"
        onClick={() => setOpen(true)}
      >
        <Menu className="h-6 w-6 text-gray-600" />
      </Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="p-0 w-64 bg-gradient-to-b from-red-600 to-red-700">
          <div className="flex items-center justify-between px-6 py-6">
            <div className="flex items-center gap-3">
              <img 
                src="/lovable-uploads/e9f1fc70-186e-4f21-bbb4-bdaed5b5a6f4.png" 
                alt="WeGo Logo" 
                className="h-8 w-auto"
              />
            </div>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="text-white hover:bg-red-700">
              <X />
            </Button>
          </div>
          <nav className="flex flex-col gap-2 px-6">
            {navLinks.map((link) => (
              <a
                key={link.to}
                href={link.to}
                className={cn(
                  "text-lg font-medium text-white hover:text-red-200 py-2 transition-colors"
                )}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="mt-4 pt-4 border-t border-red-500">
              <LanguageSwitcher />
            </div>
          </nav>
        </SheetContent>
      </Sheet>
    </>
  );
}
