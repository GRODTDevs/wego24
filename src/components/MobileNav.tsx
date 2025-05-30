
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/driver/login", label: "Drivers" },
  { to: "/restaurant/login", label: "Restaurant" },
  { to: "/admin/dashboard", label: "Admin" }
];

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        className="md:hidden bg-transparent hover:bg-red-700 px-3 py-2"
        variant="ghost"
        size="icon"
        aria-label="Open menu"
        onClick={() => setOpen(true)}
      >
        <Menu className="h-6 w-6 text-white" />
      </Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="p-0 w-64 bg-gradient-to-b from-red-600 to-red-700">
          <div className="flex items-center justify-between px-6 py-6">
            <div className="flex items-center gap-3">
              <img 
                src="/lovable-uploads/873dc4b0-6899-44a9-bba8-9a323fa0550d.png" 
                alt="ToGoo Logo" 
                className="h-8 w-auto"
              />
              <span className="text-xl font-bold text-white">ToGoo</span>
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
          </nav>
        </SheetContent>
      </Sheet>
    </>
  );
}
