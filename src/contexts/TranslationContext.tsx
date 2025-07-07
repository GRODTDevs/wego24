import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "es" | "fr";

interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

export const translations = {
  en: {
    nav: {
      home: "Home",
      courierRequest: "Courier Request",
      partnerInfo: "Partner Info",
      become: "Become a Partner",
      signIn: "Sign In",
    },
    auth: {
      signOut: "Sign Out",
    },
    footer: {
      rights: "All rights reserved.",
      beta: "BETA",
    },
    home: {
      delivery: {
        badge: "LOCAL DELIVERY",
        title: "Order from your",
        titleHighlight: "favorite places",
        description:
          "Discover amazing restaurants, cafes, and local shops in your area.",
      },
      searchPlaceholder: "Search restaurants, cafes, shops...",
      searchButton: "Search",
      courier: {
        badge: "COURIER SERVICE",
        title: "Need something delivered?",
        description:
          "Our professional couriers can pick up and deliver anything you need, anywhere in the city. Fast, reliable, and affordable.",
      },
      getCourier: "Get Courier",
      partner: {
        badge: "BUSINESS PARTNERSHIP",
        title: "Grow your business with us",
        description:
          "Join our platform and reach more customers. Increase your sales with our delivery network and grow your business today.",
        buttonInfo: "Learn More",
        buttonRegister: "Become a Partner",
      },
    },
    locations: {
      businessTypes: {
        restaurant: "Restaurant",
        cafe: "Cafe",
        shop: "Shop",
      },
    },
    lang: {
      english: "EN",
      spanish: "ES",
    },
    modal: {
      welcomeTitle: "Welcome to WeGo!",
      welcomeDescription:
        "Explore local restaurants, order food, and get anything delivered.",
      productOwnerStepsTitle: "How it works:",
      step: {
        searchRestaurants: "Search for restaurants",
        viewMenu: "View the menu",
        reviewFlows: "Check delivery flows",
        loggedIn: "You are logged in!",
        loginPrompt: "Log in to place an order.",
      },
    },
    courierRequest: {
      title: "Courier Request",
      description: "Book a courier to deliver your items quickly and safely.",
      pickup: {
        title: "Pickup Details",
        locationLabel: "Location *",
        locationPlaceholder: "Enter pickup address",
        dateLabel: "Date",
        datePlaceholder: "dd/mm/yyyy",
        timeLabel: "Time",
        timePlaceholder: "--:--",
      },
      item: {
        title: "Item Details",
        descriptionLabel: "Description *",
        descriptionPlaceholder: "Describe the item to be delivered",
        sizeLabel: "Size",
        sizePlaceholder: "e.g. Medium box",
        weightLabel: "Weight",
        weightPlaceholder: "e.g. 2kg",
      },
      dropoff: {
        title: "Dropoff Details",
        locationLabel: "Location *",
        locationPlaceholder: "Enter dropoff address",
        dateLabel: "Date",
        datePlaceholder: "dd/mm/yyyy",
        timeLabel: "Time",
        timePlaceholder: "--:--",
      },
      specialInstructions: "Special Instructions",
      specialInstructionsPlaceholder: "Any additional info for the courier?",
      priceCalculated: "Price calculated",
      processing: "Processing...",
      pay: "Pay",
      andBookDelivery: "and book delivery",
      signInPrompt: "Please sign in to book a courier.",
      errors: {
        enterAddresses: "Please enter both pickup and dropoff addresses.",
        findAddresses: "Could not find one or both addresses.",
        calculatingPrice: "Error calculating price.",
        signIn: "You must be signed in to pay.",
        calculatePrice: "Please calculate the price first.",
        paymentSession: "Error creating payment session.",
        processingPayment: "Error processing payment.",
        fillFields: "Please fill in all required fields.",
      },
      calculation: {
        title: "Price Calculation",
        calculate: "Calculate",
        calculating: "Calculating...",
        baseFee: "Base Fee",
        distanceFee: "Distance Fee",
        total: "Total",
      },
    },
    common: {
      backToHome: "Back to Home",
      signIn: "Sign In",
    },
    dashboard: {
      dashboard: "Operations",
      loading: "Loading dashboard...",
      title: "Operations",
      orders: "Orders",
      revenue: "Revenue",
      activeUsers: "Active Users",
      partners: "Partners",
      drivers: "Drivers",
      recentOrders: "Recent Orders",
      courierStatus: "Courier Status",
      alerts: "Alerts",
      failedOrder: "Failed Order",
      partnerAnalytics: "Partner & Driver Analytics",
      topPartners: "Top Partners",
      topDrivers: "Top Drivers",
      deliveries: "Deliveries",
      recentActivity: "Recent Activity",
    },
  },
  es: {
    nav: {
      home: "Inicio",
      courierRequest: "Mensajería",
      partnerInfo: "Información Socio",
      become: "Hazte Socio",
      signIn: "Iniciar Sesión",
    },
    auth: {
      signOut: "Cerrar Sesión",
    },
    footer: {
      rights: "Todos los derechos reservados.",
      beta: "BETA",
    },
    home: {
      delivery: {
        badge: "ENTREGA LOCAL",
        title: "Pide de tus",
        titleHighlight: "lugares favoritos",
        description:
          "Descubre increíbles restaurantes, cafeterías y tiendas locales en tu área.",
      },
      searchPlaceholder: "Buscar restaurantes, cafeterías, tiendas...",
      searchButton: "Buscar",
      courier: {
        badge: "SERVICIO DE MENSAJERÍA",
        title: "¿Necesitas algo entregado?",
        description:
          "Nuestros mensajeros profesionales pueden recoger y entregar cualquier cosa que necesites, en cualquier lugar de la ciudad. Rápido, confiable y económico.",
      },
      getCourier: "Obtener Mensajero",
      partner: {
        badge: "ASOCIACIÓN COMERCIAL",
        title: "Haz crecer tu negocio con nosotros",
        description:
          "Únete a nuestra plataforma y llega a más clientes. Aumenta tus ventas con nuestra red de entrega y haz crecer tu negocio hoy.",
        buttonInfo: "Más Información",
        buttonRegister: "Convertirse en Socio",
      },
    },
    locations: {
      businessTypes: {
        restaurant: "Restaurante",
        cafe: "Cafetería",
        shop: "Tienda",
      },
    },
    lang: {
      english: "EN",
      spanish: "ES",
    },
    modal: {
      welcomeTitle: "¡Bienvenido a WeGo!",
      welcomeDescription:
        "Explora restaurantes locales, pide comida y recibe cualquier cosa a domicilio.",
      productOwnerStepsTitle: "Cómo funciona:",
      step: {
        searchRestaurants: "Busca restaurantes",
        viewMenu: "Ver el menú",
        reviewFlows: "Revisa los flujos de entrega",
        loggedIn: "¡Has iniciado sesión!",
        loginPrompt: "Inicia sesión para hacer un pedido.",
      },
    },
    courierRequest: {
      title: "Solicitud de Mensajero",
      description:
        "Reserva un mensajero para entregar tus artículos de forma rápida y segura.",
      pickup: {
        title: "Detalles de Recogida",
        locationLabel: "Ubicación *",
        locationPlaceholder: "Introduce la dirección de recogida",
        dateLabel: "Fecha",
        datePlaceholder: "dd/mm/aaaa",
        timeLabel: "Hora",
        timePlaceholder: "--:--",
      },
      item: {
        title: "Detalles del Artículo",
        descriptionLabel: "Descripción *",
        descriptionPlaceholder: "Describe el artículo a entregar",
        sizeLabel: "Tamaño",
        sizePlaceholder: "ej. Caja mediana",
        weightLabel: "Peso",
        weightPlaceholder: "ej. 2kg",
      },
      dropoff: {
        title: "Detalles de Entrega",
        locationLabel: "Ubicación *",
        locationPlaceholder: "Introduce la dirección de entrega",
        dateLabel: "Fecha",
        datePlaceholder: "dd/mm/aaaa",
        timeLabel: "Hora",
        timePlaceholder: "--:--",
      },
      specialInstructions: "Instrucciones Especiales",
      specialInstructionsPlaceholder:
        "¿Alguna información adicional para el mensajero?",
      priceCalculated: "Precio calculado",
      processing: "Procesando...",
      pay: "Pagar",
      andBookDelivery: "y reservar entrega",
      signInPrompt: "Por favor, inicia sesión para reservar un mensajero.",
      errors: {
        enterAddresses:
          "Por favor, introduce ambas direcciones de recogida y entrega.",
        findAddresses: "No se pudo encontrar una o ambas direcciones.",
        calculatingPrice: "Error al calcular el precio.",
        signIn: "Debes iniciar sesión para pagar.",
        calculatePrice: "Por favor, calcula el precio primero.",
        paymentSession: "Error al crear la sesión de pago.",
        processingPayment: "Error al procesar el pago.",
        fillFields: "Por favor, completa todos los campos obligatorios.",
      },
      calculation: {
        title: "Cálculo de Precio",
        calculate: "Calcular",
        calculating: "Calculando...",
        baseFee: "Tarifa Base",
        distanceFee: "Tarifa por Distancia",
        total: "Total",
      },
    },
    common: {
      backToHome: "Volver al inicio",
      signIn: "Iniciar Sesión",
    },
    dashboard: {
      dashboard: "Operaciones",
      loading: "Cargando panel...",
      title: "Panel de Operaciones",
      orders: "Pedidos",
      revenue: "Ingresos",
      activeUsers: "Usuarios Activos",
      partners: "Socios",
      drivers: "Repartidores",
      recentOrders: "Pedidos Recientes",
      courierStatus: "Estado de Mensajeros",
      alerts: "Alertas",
      failedOrder: "Pedido Fallido",
      partnerAnalytics: "Analítica de Socios y Repartidores",
      topPartners: "Socios Destacados",
      topDrivers: "Repartidores Destacados",
      deliveries: "Entregas",
      recentActivity: "Actividad Reciente",
    },
  },
};

const TranslationContext = createContext<TranslationContextType | undefined>(
  undefined
);

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguage] = useState<Language>("en");
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize the context
    setIsInitialized(true);
    console.log("TranslationProvider initialized with language:", language);
  }, [language]);

  const t = (key: string): string => {
    try {
      if (!isInitialized) {
        console.warn(
          "Translation context not initialized, using fallback for:",
          key
        );
        return key.split(".").pop() || key;
      }

      console.log("Translation requested for key:", key, "language:", language);

      const keys = key.split(".");
      let value: any = translations[language];

      for (const k of keys) {
        if (value && typeof value === "object") {
          value = value[k];
        } else {
          value = undefined;
          break;
        }
      }

      // If translation not found, try English fallback
      if (!value && language !== "en") {
        let fallback: any = translations.en;
        for (const k of keys) {
          if (fallback && typeof fallback === "object") {
            fallback = fallback[k];
          } else {
            fallback = undefined;
            break;
          }
        }
        if (fallback) {
          console.log("Using English fallback for:", key, "=", fallback);
          return fallback;
        }
      }

      // Return the translation if found, otherwise return the last part of the key
      const result = value || key.split(".").pop() || key;
      console.log("Translation result for", key, "=", result);
      return result;
    } catch (error) {
      console.error("Translation error:", error, "for key:", key);
      return key.split(".").pop() || key;
    }
  };

  const contextValue = {
    language,
    setLanguage,
    t,
  };

  if (!isInitialized) {
    return <div>Loading translations...</div>;
  }

  return (
    <TranslationContext.Provider value={contextValue}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  console.log(
    "useTranslation called, context:",
    context ? "available" : "undefined"
  );

  if (context === undefined) {
    console.error("useTranslation must be used within a TranslationProvider");
    throw new Error("useTranslation must be used within a TranslationProvider");
  }
  return context;
};
