
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/driver", label: "Driver" },
  { to: "/restaurant", label: "Restaurant" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        className="md:hidden bg-transparent hover:bg-gray-100 px-3 py-2"
        variant="ghost"
        size="icon"
        aria-label="Open menu"
        onClick={() => setOpen(true)}
      >
        <Menu className="h-6 w-6 text-gray-700" />
      </Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <div className="flex items-center justify-between px-6 py-6">
            <span className="text-xl font-bold text-orange-500">🍽️</span>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X />
            </Button>
          </div>
          <nav className="flex flex-col gap-2 px-6">
            {navLinks.map((link) => (
              <a
                key={link.to}
                href={link.to}
                className={cn(
                  "text-lg font-medium text-gray-700 hover:text-orange-600 py-2 transition-colors"
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
