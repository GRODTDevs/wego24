import { MobileNav } from "./MobileNav";

export function Header() {
  return (
    <header className="w-full bg-gradient-to-r from-red-600 via-red-500 to-red-600 shadow-lg sticky top-0 z-30">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-2 h-16">
        <div className="flex items-center gap-3">
          <img 
            src="/lovable-uploads/873dc4b0-6899-44a9-bba8-9a323fa0550d.png" 
            alt="ToGoo Logo" 
            className="h-10 w-auto"
          />
          <div className="flex flex-col">
            <span className="font-bold text-xl text-white tracking-tight select-none">ToGoo</span>
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
