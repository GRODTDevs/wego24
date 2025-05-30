
import { MobileNav } from "./MobileNav";

export function Header() {
  return (
    <header className="w-full bg-gradient-to-r from-red-600 via-red-500 to-red-600 shadow-lg sticky top-0 z-30">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-2 h-16">
        <div className="flex items-center gap-3">
          <img 
            src="/lovable-uploads/d34e1469-dfda-43a5-b6b6-9f830c0e10aa.png" 
            alt="ToGoo Logo" 
            className="h-10 w-auto"
          />
          <div className="flex flex-col">
            <span className="font-bold text-xl text-white tracking-tight select-none">ToGoo</span>
            <span className="text-xs font-semibold text-red-200 italic tracking-widest uppercase">Beta</span>
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <a href="/" className="text-white hover:text-red-200 font-medium transition-colors">Home</a>
          <a href="/driver/login" className="text-white hover:text-red-200 font-medium transition-colors">Drivers</a>
          <a href="/restaurant/login" className="text-white hover:text-red-200 font-medium transition-colors">Restaurant</a>
          <a href="/admin/dashboard" className="text-white hover:text-red-200 font-medium transition-colors">Admin</a>
        </nav>
        <div className="md:hidden">
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
