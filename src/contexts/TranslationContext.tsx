import { createContext, useContext, useState, useEffect } from 'react';

interface TranslationContextProps {
  language: string;
  setLanguage: (language: string) => void;
  t: (key: string) => string;
}

const TranslationContext = createContext<TranslationContextProps | undefined>(undefined);

interface TranslationProviderProps {
  children: React.ReactNode;
}

const translations = {
  en: {
    nav: {
      home: "Home",
      drivers: "Drivers",
      partners: "Partners",
      admin: "Admin",
    },
    language: {
      english: "English",
      spanish: "Spanish",
    },
    auth: {
      login: "Login",
      register: "Register",
      logout: "Logout",
      email: "Email",
      password: "Password",
      firstName: "First Name",
      lastName: "Last Name",
      loginButton: "Login",
      registerButton: "Register",
      forgotPassword: "Forgot Password?",
      resetPassword: "Reset Password",
      confirmPassword: "Confirm Password",
      resetPasswordButton: "Reset Password",
      goBackToLogin: "Back to Login",
      emailVerification: "Email Verification",
      emailVerificationDescription: "We've sent a verification link to your email address. Please check your inbox and click on the link to verify your account.",
      emailVerificationButton: "Resend Verification Email",
    },
    home: {
      welcome: "Welcome",
      signOut: "Sign Out",
      loginButton: "Sign In",
      searchPlaceholder: "Search restaurants, cafes, shops...",
      searchButton: "Search",
      getCourier: "Get Courier",
      noLocations: "No locations available",
      noLocationsDesc: "There are currently no active locations in your area.",
      noResults: "No results found for",
      tryDifferent: "Try a different search term.",
      delivery: {
        badge: "LOCAL DELIVERY",
        title: "Order from your",
        titleHighlight: "favorite places",
        description: "Discover amazing local restaurants, cafes, and shops in your area."
      },
      courier: {
        badge: "COURIER SERVICE",
        title: "Need something delivered?",
        description: "Our professional couriers can pick up and deliver anything you need, anywhere in the city. Fast, reliable, and affordable."
      },
      partner: {
        badge: "BUSINESS PARTNERSHIP",
        title: "Grow your business with us",
        description: "Join our platform and reach more customers. Increase your sales with our delivery network and grow your business today.",
        button: "Become a Partner"
      }
    },
    partner: {
      register: {
        title: "Become a Partner",
        subtitle: "Join our platform and reach more customers.",
        form: {
          title: "Business Information",
        },
        businessName: "Business Name",
        businessNamePlaceholder: "Enter your business name",
        businessType: "Business Type",
        selectBusinessType: "Select business type",
        contactEmail: "Contact Email",
        contactEmailPlaceholder: "Enter your contact email",
        phoneNumber: "Phone Number",
        businessAddress: "Business Address",
        businessAddressPlaceholder: "Enter your business address",
        city: "City",
        cityPlaceholder: "Enter your city",
        postalCode: "Postal Code",
        postalCodePlaceholder: "Enter your postal code",
        businessDescription: "Business Description",
        businessDescriptionPlaceholder: "Enter a brief description of your business",
        required: "(Required)",
        nextSteps: "What happens next?",
        step1: "1. Submit your application.",
        step2: "2. We review your application.",
        step3: "3. Get approved and start selling.",
        step4: "4. Grow your business with us.",
        submit: "Submit Application",
        submitting: "Submitting...",
      },
      dashboard: {
        title: "Partner Dashboard",
        welcome: "Welcome",
        signOut: "Sign Out",
      }
    },
    locations: {
      businessTypes: {
        restaurant: "Restaurant",
        cafe: "Cafe",
        bakery: "Bakery",
        fastFood: "Fast Food",
        grocery: "Grocery",
        pharmacy: "Pharmacy",
        retail: "Retail",
        other: "Other",
      }
    },
    driver: {
      login: {
        title: "Driver Login",
        email: "Email",
        password: "Password",
        loginButton: "Login",
        forgotPassword: "Forgot Password?",
        register: "Register",
      },
      dashboard: {
        title: "Driver Dashboard",
        welcome: "Welcome",
        signOut: "Sign Out",
      }
    },
    restaurant: {
      login: {
        title: "Restaurant Login",
        email: "Email",
        password: "Password",
        loginButton: "Login",
        forgotPassword: "Forgot Password?",
        register: "Register",
      },
      dashboard: {
        title: "Restaurant Dashboard",
        welcome: "Welcome",
        signOut: "Sign Out",
      }
    },
    admin: {
      dashboard: {
        title: "Admin Dashboard",
        welcome: "Welcome",
        signOut: "Sign Out",
      }
    },
    auth: {
      registerSuccess: "Registration successful! Please check your email to verify your account.",
      resetPasswordSuccess: "Password reset successful! You can now login with your new password.",
      resetPasswordEmailSent: "Password reset email sent! Please check your inbox to reset your password.",
    }
  },
  es: {
    nav: {
      home: "Inicio",
      drivers: "Conductores",
      partners: "Socios",
      admin: "Administrador",
    },
    language: {
      english: "Inglés",
      spanish: "Español",
    },
     auth: {
      login: "Iniciar Sesión",
      register: "Registrarse",
      logout: "Cerrar Sesión",
      email: "Correo Electrónico",
      password: "Contraseña",
      firstName: "Nombre",
      lastName: "Apellido",
      loginButton: "Iniciar Sesión",
      registerButton: "Registrarse",
      forgotPassword: "¿Olvidaste tu Contraseña?",
      resetPassword: "Restablecer Contraseña",
      confirmPassword: "Confirmar Contraseña",
      resetPasswordButton: "Restablecer Contraseña",
      goBackToLogin: "Volver al Inicio de Sesión",
      emailVerification: "Verificación de Correo Electrónico",
      emailVerificationDescription: "Hemos enviado un enlace de verificación a tu dirección de correo electrónico. Por favor, revisa tu bandeja de entrada y haz clic en el enlace para verificar tu cuenta.",
      emailVerificationButton: "Reenviar Correo de Verificación",
    },
    home: {
      welcome: "Bienvenido",
      signOut: "Cerrar Sesión",
      loginButton: "Iniciar Sesión",
      searchPlaceholder: "Buscar restaurantes, cafeterías, tiendas...",
      searchButton: "Buscar",
      getCourier: "Obtener Mensajero",
      noLocations: "No hay ubicaciones disponibles",
      noLocationsDesc: "Actualmente no hay ubicaciones activas en tu área.",
      noResults: "No se encontraron resultados para",
      tryDifferent: "Prueba con un término de búsqueda diferente.",
      delivery: {
        badge: "ENTREGA LOCAL",
        title: "Pide de tus",
        titleHighlight: "lugares favoritos",
        description: "Descubre increíbles restaurantes, cafeterías y tiendas locales en tu área."
      },
      courier: {
        badge: "SERVICIO DE MENSAJERÍA",
        title: "¿Necesitas algo entregado?",
        description: "Nuestros mensajeros profesionales pueden recoger y entregar cualquier cosa que necesites, en cualquier lugar de la ciudad. Rápido, confiable y económico."
      },
      partner: {
        badge: "ASOCIACIÓN COMERCIAL",
        title: "Haz crecer tu negocio con nosotros",
        description: "Únete a nuestra plataforma y llega a más clientes. Aumenta tus ventas con nuestra red de entrega y haz crecer tu negocio hoy.",
        button: "Convertirse en Socio"
      }
    },
    partner: {
      register: {
        title: "Conviértete en Socio",
        subtitle: "Únete a nuestra plataforma y llega a más clientes.",
        form: {
          title: "Información del Negocio",
        },
        businessName: "Nombre del Negocio",
        businessNamePlaceholder: "Ingresa el nombre de tu negocio",
        businessType: "Tipo de Negocio",
        selectBusinessType: "Selecciona el tipo de negocio",
        contactEmail: "Correo Electrónico de Contacto",
        contactEmailPlaceholder: "Ingresa tu correo electrónico de contacto",
        phoneNumber: "Número de Teléfono",
        businessAddress: "Dirección del Negocio",
        businessAddressPlaceholder: "Ingresa la dirección de tu negocio",
        city: "Ciudad",
        cityPlaceholder: "Ingresa tu ciudad",
        postalCode: "Código Postal",
        postalCodePlaceholder: "Ingresa tu código postal",
        businessDescription: "Descripción del Negocio",
        businessDescriptionPlaceholder: "Ingresa una breve descripción de tu negocio",
        required: "(Requerido)",
        nextSteps: "¿Qué sigue?",
        step1: "1. Envía tu solicitud.",
        step2: "2. Revisamos tu solicitud.",
        step3: "3. Obtén la aprobación y comienza a vender.",
        step4: "4. Haz crecer tu negocio con nosotros.",
        submit: "Enviar Solicitud",
        submitting: "Enviando...",
      },
      dashboard: {
        title: "Panel de Socio",
        welcome: "Bienvenido",
        signOut: "Cerrar Sesión",
      }
    },
    locations: {
      businessTypes: {
        restaurant: "Restaurante",
        cafe: "Cafetería",
        bakery: "Panadería",
        fastFood: "Comida Rápida",
        grocery: "Supermercado",
        pharmacy: "Farmacia",
        retail: "Minorista",
        other: "Otro",
      }
    },
    driver: {
      login: {
        title: "Inicio de Sesión de Conductor",
        email: "Correo Electrónico",
        password: "Contraseña",
        loginButton: "Iniciar Sesión",
        forgotPassword: "¿Olvidaste tu Contraseña?",
        register: "Registrarse",
      },
      dashboard: {
        title: "Panel de Conductor",
        welcome: "Bienvenido",
        signOut: "Cerrar Sesión",
      }
    },
    restaurant: {
      login: {
        title: "Inicio de Sesión de Restaurante",
        email: "Correo Electrónico",
        password: "Contraseña",
        loginButton: "Iniciar Sesión",
        forgotPassword: "¿Olvidaste tu Contraseña?",
        register: "Registrarse",
      },
      dashboard: {
        title: "Panel de Restaurante",
        welcome: "Bienvenido",
        signOut: "Cerrar Sesión",
      }
    },
    admin: {
      dashboard: {
        title: "Panel de Administrador",
        welcome: "Bienvenido",
        signOut: "Cerrar Sesión",
      }
    },
    auth: {
      registerSuccess: "¡Registro exitoso! Por favor, revisa tu correo electrónico para verificar tu cuenta.",
      resetPasswordSuccess: "¡Contraseña restablecida con éxito! Ahora puedes iniciar sesión con tu nueva contraseña.",
      resetPasswordEmailSent: "¡Correo electrónico de restablecimiento de contraseña enviado! Por favor, revisa tu bandeja de entrada para restablecer tu contraseña.",
    }
  }
};

export const TranslationProvider: React.FC<TranslationProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string) => {
    const keys = key.split('.');
    let value: any = translations[language as keyof typeof translations];
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k as keyof typeof value];
      } else {
        return key;
      }
    }
    return typeof value === 'string' ? value : key;
  };

  return (
    <TranslationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};
