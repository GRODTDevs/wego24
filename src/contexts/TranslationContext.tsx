
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
    'driver.location.title': 'Location Tracking',
    
    // Dashboard
    'dashboard.tabs.users': 'Users',
    'dashboard.tabs.locations': 'Locations',
    'dashboard.tabs.drivers': 'Drivers',
    'dashboard.tabs.analytics': 'Analytics',
    'dashboard.tabs.admin': 'Admin',
    'dashboard.admin.title': 'Admin Tools',
    'dashboard.admin.description': 'Manage system settings and create superusers'
  },
  es: {
    'common.home': 'Inicio',
    'common.courierRequest': 'Solicitar Mensajero',
    'common.partnerInfo': 'Información del Socio',
    'home.welcome': 'Bienvenido',
    'home.signOut': 'Cerrar Sesión',
    'home.loginButton': 'Iniciar Sesión',
    'home.delivery.badge': 'ENTREGA RÁPIDA',
    'home.delivery.title': 'Obtén tu comida favorita',
    'home.delivery.titleHighlight': 'entregada rápido',
    'home.delivery.description': 'Ordena de tus restaurantes favoritos y recíbelo rápidamente',
    'home.searchPlaceholder': 'Buscar restaurantes, comida...',
    'home.searchButton': 'Buscar',
    'home.courier.badge': 'SERVICIO DE MENSAJERÍA',
    'home.courier.title': '¿Necesitas algo entregado?',
    'home.courier.description': 'Servicio de mensajería rápido y confiable para todas tus necesidades',
    'home.getCourier': 'Obtener Mensajero',
    'home.partner.badge': 'CONVIÉRTETE EN SOCIO',
    'home.partner.title': 'Asóciate con nosotros',
    'home.partner.description': 'Únete a nuestra red de restaurantes y haz crecer tu negocio',
    'home.partner.button': 'Convertirse en Socio',
    'auth.signIn': 'Iniciar Sesión',
    'auth.signOut': 'Cerrar Sesión',
    'driver.become': 'Ser Conductor',
    'language.english': 'Inglés',
    'language.spanish': 'Español',
    'language.french': 'Francés',
    'dashboard.tabs.users': 'Usuarios',
    'dashboard.tabs.locations': 'Ubicaciones',
    'dashboard.tabs.drivers': 'Conductores',
    'dashboard.tabs.analytics': 'Análisis',
    'dashboard.tabs.admin': 'Admin',
    'dashboard.admin.title': 'Herramientas de Admin',
    'dashboard.admin.description': 'Gestionar configuraciones del sistema y crear superusuarios'
  },
  fr: {
    'common.home': 'Accueil',
    'common.courierRequest': 'Demander un Coursier',
    'common.partnerInfo': 'Informations Partenaire',
    'home.welcome': 'Bienvenue',
    'home.signOut': 'Se Déconnecter',
    'home.loginButton': 'Se Connecter',
    'home.delivery.badge': 'LIVRAISON RAPIDE',
    'home.delivery.title': 'Obtenez votre nourriture préférée',
    'home.delivery.titleHighlight': 'livrée rapidement',
    'home.delivery.description': 'Commandez dans vos restaurants préférés et recevez-le rapidement',
    'home.searchPlaceholder': 'Rechercher restaurants, nourriture...',
    'home.searchButton': 'Rechercher',
    'home.courier.badge': 'SERVICE DE COURSIER',
    'home.courier.title': 'Besoin de quelque chose à livrer?',
    'home.courier.description': 'Service de coursier rapide et fiable pour tous vos besoins',
    'home.getCourier': 'Obtenir un Coursier',
    'home.partner.badge': 'DEVENEZ PARTENAIRE',
    'home.partner.title': 'Partenaire avec nous',
    'home.partner.description': 'Rejoignez notre réseau de restaurants et développez votre entreprise',
    'home.partner.button': 'Devenir Partenaire',
    'auth.signIn': 'Se Connecter',
    'auth.signOut': 'Se Déconnecter',
    'driver.become': 'Devenir Chauffeur',
    'language.english': 'Anglais',
    'language.spanish': 'Espagnol',
    'language.french': 'Français',
    'dashboard.tabs.users': 'Utilisateurs',
    'dashboard.tabs.locations': 'Emplacements',
    'dashboard.tabs.drivers': 'Chauffeurs',
    'dashboard.tabs.analytics': 'Analytique',
    'dashboard.tabs.admin': 'Admin',
    'dashboard.admin.title': 'Outils Admin',
    'dashboard.admin.description': 'Gérer les paramètres système et créer des superutilisateurs'
  }
};

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    try {
      const keys = key.split('.');
      let value: any = translations[language];
      
      for (const k of keys) {
        if (value && typeof value === 'object') {
          value = value[k];
        } else {
          value = undefined;
          break;
        }
      }
      
      // If translation not found, try English fallback
      if (!value && language !== 'en') {
        let fallback: any = translations.en;
        for (const k of keys) {
          if (fallback && typeof fallback === 'object') {
            fallback = fallback[k];
          } else {
            fallback = undefined;
            break;
          }
        }
        if (fallback) return fallback;
      }
      
      // Return the translation if found, otherwise return the last part of the key
      return value || key.split('.').pop() || key;
    } catch (error) {
      console.error('Translation error:', error, 'for key:', key);
      return key.split('.').pop() || key;
    }
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
