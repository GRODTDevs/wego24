
import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'es';

interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

const translations = {
  en: {
    // Header
    'nav.home': 'Home',
    'nav.drivers': 'Drivers',
    'nav.partners': 'Partners',
    'nav.admin': 'Admin',
    
    // Homepage
    'home.subtitle': 'FRIGILIANA, NERJA, TORROX',
    'home.title': 'Local Delivery',
    'home.titleHighlight': 'Near You',
    'home.description': 'Order from your favorite local businesses, track your order, and enjoy fast delivery.',
    'home.searchPlaceholder': 'Search businesses or locations...',
    'home.searchButton': 'Search',
    'home.welcome': 'Welcome,',
    'home.loginButton': 'Login / Sign Up',
    'home.signOut': 'Sign Out',
    'home.noLocations': 'No Locations Available',
    'home.noLocationsDesc': "We're working on adding local businesses to your area. Check back soon!",
    'home.noResults': 'No results found for',
    'home.tryDifferent': 'Try a different search term.',
    
    // Location Page
    'location.demo': 'Location Page Demo',
    'location.demoDesc': 'This page is the public ordering page for a location. Product Owners: this is a demo UI for browsing a menu, adjusting item quantities, and adding to a cart.',
    'location.steps': 'Product Owner Steps:',
    'location.step1': 'Click + to add menu items to your cart.',
    'location.step2': 'Adjust item quantity using +/- buttons.',
    'location.step3': 'Open the cart & simulate checking out your order.',
    'location.step4': 'All data is local until future backend/database is added.',
    'location.viewCart': 'View Cart',
    'location.featuredMenu': 'Featured Menu',
    
    // Footer
    'footer.rights': '© 2024 ToGoo. All rights reserved.',
    
    // Language Switcher
    'language.english': 'English',
    'language.spanish': 'Español',
  },
  es: {
    // Header
    'nav.home': 'Inicio',
    'nav.drivers': 'Conductores',
    'nav.partners': 'Socios',
    'nav.admin': 'Admin',
    
    // Homepage
    'home.subtitle': 'FRIGILIANA, NERJA, TORROX',
    'home.title': 'Entrega Local',
    'home.titleHighlight': 'Cerca de Ti',
    'home.description': 'Pide de tus negocios locales favoritos, rastrea tu pedido y disfruta de entrega rápida.',
    'home.searchPlaceholder': 'Buscar negocios o ubicaciones...',
    'home.searchButton': 'Buscar',
    'home.welcome': 'Bienvenido,',
    'home.loginButton': 'Iniciar Sesión / Registrarse',
    'home.signOut': 'Cerrar Sesión',
    'home.noLocations': 'No Hay Ubicaciones Disponibles',
    'home.noLocationsDesc': 'Estamos trabajando en agregar negocios locales a tu área. ¡Vuelve pronto!',
    'home.noResults': 'No se encontraron resultados para',
    'home.tryDifferent': 'Prueba con un término de búsqueda diferente.',
    
    // Location Page
    'location.demo': 'Demo de Página de Ubicación',
    'location.demoDesc': 'Esta página es la página de pedidos pública para una ubicación. Propietarios del Producto: esta es una interfaz demo para navegar un menú, ajustar cantidades de artículos y agregar al carrito.',
    'location.steps': 'Pasos del Propietario del Producto:',
    'location.step1': 'Haz clic en + para agregar artículos del menú a tu carrito.',
    'location.step2': 'Ajusta la cantidad del artículo usando los botones +/-.',
    'location.step3': 'Abre el carrito y simula hacer el checkout de tu pedido.',
    'location.step4': 'Todos los datos son locales hasta que se agregue una base de datos/backend futuro.',
    'location.viewCart': 'Ver Carrito',
    'location.featuredMenu': 'Menú Destacado',
    
    // Footer
    'footer.rights': '© 2024 ToGoo. Todos los derechos reservados.',
    
    // Language Switcher
    'language.english': 'English',
    'language.spanish': 'Español',
  }
};

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <TranslationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
}
