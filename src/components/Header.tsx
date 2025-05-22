import { MobileNav } from "./MobileNav";

export function Header() {
  return (
    <header className="w-full bg-white/80 backdrop-blur border-b border-orange-100 shadow-sm sticky top-0 z-30">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-2 h-16">
        <div className="flex items-center gap-2">
          <span className="text-2xl mr-2">🍽️</span>
          <span className="font-bold text-xl text-gray-900 tracking-tight select-none">BiteToGo</span>
          <span className="ml-2 text-xs font-semibold text-orange-400 italic tracking-widest uppercase">Beta</span>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <a href="/" className="text-gray-700 hover:text-orange-500 font-medium transition-colors">Home</a>
          <a href="/driver" className="text-gray-700 hover:text-orange-500 font-medium transition-colors">Driver Login</a>
          <a href="/restaurant/login" className="text-gray-700 hover:text-orange-500 font-medium transition-colors">Restaurant</a>
        </nav>
        <div className="md:hidden">
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
