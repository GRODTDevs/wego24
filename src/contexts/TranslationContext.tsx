
import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'es' | 'fr';

interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Common
    'common.home': 'Home',
    'common.courierRequest': 'Request Courier',
    'common.partnerInfo': 'Partner Info',
    
    // Home page
    'home.welcome': 'Welcome',
    'home.signOut': 'Sign Out',
    'home.loginButton': 'Sign In',
    'home.delivery.badge': 'FAST DELIVERY',
    'home.delivery.title': 'Get your favorite food',
    'home.delivery.titleHighlight': 'delivered fast',
    'home.delivery.description': 'Order from your favorite restaurants and get it delivered quickly',
    'home.searchPlaceholder': 'Search restaurants, food...',
    'home.searchButton': 'Search',
    'home.courier.badge': 'COURIER SERVICE',
    'home.courier.title': 'Need something delivered?',
    'home.courier.description': 'Fast and reliable courier service for all your delivery needs',
    'home.getCourier': 'Get a Courier',
    'home.partner.badge': 'BECOME A PARTNER',
    'home.partner.title': 'Partner with us',
    'home.partner.description': 'Join our network of restaurants and grow your business',
    'home.partner.button': 'Become a Partner',
    
    // Language
    'language.english': 'English',
    'language.spanish': 'Spanish',
    'language.french': 'French',
    
    // Auth
    'auth.signIn': 'Sign In',
    'auth.signOut': 'Sign Out',
    
    // Driver
    'driver.become': 'Become a Driver',
    'driver.registration.title': 'Driver Registration',
    'driver.registration.subtitle': 'Join our delivery network',
    'driver.profile.title': 'Driver Profile',
    'driver.dashboard.title': 'Driver Dashboard',
    'driver.performance.title': 'Performance Metrics',
    'driver.earnings.title': 'Earnings',
    'driver.documents.title': 'Documents',
    'driver.location.title': 'Location Tracking'
  },
  es: {
    'common.home': 'Inicio',
    'common.courierRequest': 'Solicitar Mensajero',
    'common.partnerInfo': 'Información del Socio',
    'home.welcome': 'Bienvenido',
    'home.signOut': 'Cerrar Sesión',
    'home.loginButton': 'Iniciar Sesión',
    'auth.signIn': 'Iniciar Sesión',
    'auth.signOut': 'Cerrar Sesión',
    'driver.become': 'Ser Conductor',
    'language.english': 'Inglés',
    'language.spanish': 'Español',
    'language.french': 'Francés'
  },
  fr: {
    'common.home': 'Accueil',
    'common.courierRequest': 'Demander un Coursier',
    'common.partnerInfo': 'Informations Partenaire',
    'home.welcome': 'Bienvenue',
    'home.signOut': 'Se Déconnecter',
    'home.loginButton': 'Se Connecter',
    'auth.signIn': 'Se Connecter',
    'auth.signOut': 'Se Déconnecter',
    'driver.become': 'Devenir Chauffeur',
    'language.english': 'Anglais',
    'language.spanish': 'Espagnol',
    'language.french': 'Français'
  }
};

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    // Always return English fallback if translation not found, or the key itself as last resort
    if (!value && language !== 'en') {
      let fallback: any = translations.en;
      for (const k of keys) {
        fallback = fallback?.[k];
      }
      return fallback || key.split('.').pop() || key;
    }
    
    return value || key.split('.').pop() || key;
  };

  return (
    <TranslationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};
