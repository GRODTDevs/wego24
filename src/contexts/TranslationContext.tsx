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
    'home.getCourier': 'Get a Courier',
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
    
    // Product Owner Dashboard
    'dashboard.title': 'Product Owner Dashboard',
    'dashboard.stats.totalOrders': 'Total Orders',
    'dashboard.stats.totalRevenue': 'Total Revenue',
    'dashboard.stats.activeLocations': 'Active Locations',
    'dashboard.stats.activeDrivers': 'Active Drivers',
    'dashboard.stats.totalUsers': 'Total Users',
    'dashboard.stats.fromLastMonth': 'from last month',
    'dashboard.stats.newThisMonth': 'new this month',
    'dashboard.chart.title': 'Monthly Revenue & Orders',
    'dashboard.chart.revenue': 'Revenue (€)',
    'dashboard.chart.orders': 'Orders',
    'dashboard.tabs.users': 'Users',
    'dashboard.tabs.locations': 'Locations',
    'dashboard.tabs.drivers': 'Drivers',
    'dashboard.tabs.commissions': 'Commissions',
    'dashboard.tabs.analytics': 'Analytics',
    'dashboard.tabs.admin': 'Admin',
    'dashboard.analytics.title': 'Advanced Analytics',
    'dashboard.analytics.comingSoon': 'Advanced analytics and reporting features coming soon...',
    'dashboard.admin.title': 'Admin Management',
    'dashboard.admin.description': 'Manage administrator privileges and system settings.',
    
    // Courier Request
    'courier.title': 'Request a Courier',
    'courier.description': 'Fill in the details below and we\'ll arrange pickup and delivery for you',
    'courier.backToHome': 'Back to Home',
    'courier.pickup.title': 'Pickup Details',
    'courier.pickup.location': 'Pickup Location',
    'courier.pickup.locationPlaceholder': 'Enter pickup address',
    'courier.pickup.date': 'Pickup Date',
    'courier.pickup.time': 'Pickup Time',
    'courier.item.title': 'Item Details',
    'courier.item.description': 'Item Description',
    'courier.item.descriptionPlaceholder': 'Describe what needs to be delivered',
    'courier.item.size': 'Size/Dimensions',
    'courier.item.sizePlaceholder': 'e.g., 30cm x 20cm x 10cm',
    'courier.item.weight': 'Weight',
    'courier.item.weightPlaceholder': 'e.g., 2kg',
    'courier.dropoff.title': 'Dropoff Details',
    'courier.dropoff.location': 'Dropoff Location',
    'courier.dropoff.locationPlaceholder': 'Enter delivery address',
    'courier.dropoff.date': 'Preferred Delivery Date',
    'courier.dropoff.time': 'Preferred Delivery Time',
    'courier.specialInstructions': 'Special Instructions',
    'courier.specialInstructionsPlaceholder': 'Any special handling instructions or notes',
    'courier.price.title': 'Price Calculation',
    'courier.price.calculate': 'Calculate Price',
    'courier.price.calculating': 'Calculating...',
    'courier.price.distance': 'Distance:',
    'courier.price.baseFee': 'Base fee:',
    'courier.price.distanceFee': 'Distance fee',
    'courier.price.total': 'Total:',
    'courier.pay': 'Pay',
    'courier.book': '& Book Courier',
    'courier.processing': 'Processing...',
    'courier.signInRequired': 'Please sign in to proceed with payment',
    'courier.signInLink': 'sign in',
    'courier.errors.fillRequired': 'Please fill in all required fields',
    'courier.errors.calculateFirst': 'Please calculate the price before proceeding',
    'courier.errors.calculatePrice': 'Please calculate the price first',
    'courier.errors.addressNotFound': 'Could not find one or both addresses. Please check and try again.',
    'courier.errors.priceCalculation': 'Failed to calculate price. Please try again.',
    'courier.errors.paymentSession': 'Failed to create payment session',
    'courier.errors.paymentProcessing': 'Failed to process payment',
    'courier.errors.bothAddresses': 'Please enter both pickup and dropoff locations',
    'courier.success.priceCalculated': 'Price calculated:',
    
    // Courier Success
    'courierSuccess.title': 'Payment Successful!',
    'courierSuccess.description': 'Your courier request has been submitted and payment processed successfully.',
    'courierSuccess.nextSteps': 'What happens next?',
    'courierSuccess.step1': '• We\'ll assign a courier to your request within 30 minutes',
    'courierSuccess.step2': '• You\'ll receive SMS/email updates on pickup and delivery status',
    'courierSuccess.step3': '• Your courier will contact you directly for any questions',
    'courierSuccess.step4': '• Expected delivery based on your preferred time slots',
    'courierSuccess.referenceId': 'Reference ID:',
    'courierSuccess.keepRecord': 'Please keep this for your records',
    'courierSuccess.backToHome': 'Back to Home',
    'courierSuccess.bookAnother': 'Book Another Courier',
    
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
    'home.getCourier': 'Obtener un Mensajero',
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
    
    // Product Owner Dashboard
    'dashboard.title': 'Panel del Propietario del Producto',
    'dashboard.stats.totalOrders': 'Pedidos Totales',
    'dashboard.stats.totalRevenue': 'Ingresos Totales',
    'dashboard.stats.activeLocations': 'Ubicaciones Activas',
    'dashboard.stats.activeDrivers': 'Conductores Activos',
    'dashboard.stats.totalUsers': 'Usuarios Totales',
    'dashboard.stats.fromLastMonth': 'del mes pasado',
    'dashboard.stats.newThisMonth': 'nuevos este mes',
    'dashboard.chart.title': 'Ingresos y Pedidos Mensuales',
    'dashboard.chart.revenue': 'Ingresos (€)',
    'dashboard.chart.orders': 'Pedidos',
    'dashboard.tabs.users': 'Usuarios',
    'dashboard.tabs.locations': 'Ubicaciones',
    'dashboard.tabs.drivers': 'Conductores',
    'dashboard.tabs.commissions': 'Comisiones',
    'dashboard.tabs.analytics': 'Analíticos',
    'dashboard.tabs.admin': 'Admin',
    'dashboard.analytics.title': 'Análisis Avanzados',
    'dashboard.analytics.comingSoon': 'Funciones avanzadas de análisis e informes próximamente...',
    'dashboard.admin.title': 'Gestión de Administrador',
    'dashboard.admin.description': 'Gestionar privilegios de administrador y configuraciones del sistema.',
    
    // Location Management Spanish
    'locations.title': 'Gestión de Ubicaciones',
    'locations.addLocation': 'Agregar Ubicación',
    'locations.editLocation': 'Editar Ubicación',
    'locations.addNewLocation': 'Agregar Nueva Ubicación',
    'locations.businessName': 'Nombre del Negocio',
    'locations.contactEmail': 'Correo de Contacto',
    'locations.phone': 'Teléfono',
    'locations.businessType': 'Tipo de Negocio',
    'locations.selectBusinessType': 'Seleccionar tipo de negocio',
    'locations.businessTypes.restaurant': 'Restaurante',
    'locations.businessTypes.cafe': 'Cafetería',
    'locations.businessTypes.bakery': 'Panadería',
    'locations.businessTypes.fastFood': 'Comida Rápida',
    'locations.businessTypes.grocery': 'Tienda de Comestibles',
    'locations.businessTypes.pharmacy': 'Farmacia',
    'locations.businessTypes.retail': 'Tienda Minorista',
    'locations.businessTypes.other': 'Otro',
    'locations.description': 'Descripción',
    'locations.address': 'Dirección',
    'locations.city': 'Ciudad',
    'locations.postalCode': 'Código Postal',
    'locations.images': 'Imágenes',
    'locations.featuredImage': 'Imagen Destacada',
    'locations.bannerImage': 'Imagen de Banner',
    'locations.deliveryFee': 'Tarifa de Entrega (€)',
    'locations.minimumOrder': 'Pedido Mínimo (€)',
    'locations.minDeliveryTime': 'Tiempo Mín de Entrega (min)',
    'locations.maxDeliveryTime': 'Tiempo Máx de Entrega (min)',
    'locations.deliveryAvailable': 'Entrega Disponible',
    'locations.pickupAvailable': 'Recogida Disponible',
    'locations.cancel': 'Cancelar',
    'locations.createLocation': 'Crear Ubicación',
    'locations.updateLocation': 'Actualizar Ubicación',
    'locations.uploading': 'Subiendo...',
    'locations.noLocationsYet': 'Aún no hay ubicaciones',
    'locations.noLocationsDesc': 'Comienza agregando tu primera ubicación de negocio.',
    'locations.addFirstLocation': 'Agregar Primera Ubicación',
    'locations.deleteConfirm': '¿Estás seguro de que quieres eliminar esta ubicación?',
    'locations.loading': 'Cargando...',
    'locations.required': '*',
    'locations.success.locationCreated': 'Ubicación y cuenta de propietario creadas exitosamente',
    'locations.success.locationUpdated': 'Ubicación actualizada exitosamente',
    'locations.success.locationDeleted': 'Ubicación eliminada exitosamente',
    'locations.success.imageUploaded': 'imagen subida exitosamente',
    'locations.errors.failedToLoad': 'Error al cargar ubicaciones',
    'locations.errors.failedToSave': 'Error al guardar ubicación',
    'locations.errors.failedToDelete': 'Error al eliminar ubicación',
    'locations.errors.failedToUpload': 'Error al subir imagen',
    
    // Courier Request
    'courier.title': 'Solicitar un Mensajero',
    'courier.description': 'Completa los detalles a continuación y organizaremos la recogida y entrega para ti',
    'courier.backToHome': 'Volver al Inicio',
    'courier.pickup.title': 'Detalles de Recogida',
    'courier.pickup.location': 'Ubicación de Recogida',
    'courier.pickup.locationPlaceholder': 'Ingresa la dirección de recogida',
    'courier.pickup.date': 'Fecha de Recogida',
    'courier.pickup.time': 'Hora de Recogida',
    'courier.item.title': 'Detalles del Artículo',
    'courier.item.description': 'Descripción del Artículo',
    'courier.item.descriptionPlaceholder': 'Describe lo que necesita ser entregado',
    'courier.item.size': 'Tamaño/Dimensiones',
    'courier.item.sizePlaceholder': 'ej., 30cm x 20cm x 10cm',
    'courier.item.weight': 'Peso',
    'courier.item.weightPlaceholder': 'ej., 2kg',
    'courier.dropoff.title': 'Detalles de Entrega',
    'courier.dropoff.location': 'Ubicación de Entrega',
    'courier.dropoff.locationPlaceholder': 'Ingresa la dirección de entrega',
    'courier.dropoff.date': 'Fecha Preferida de Entrega',
    'courier.dropoff.time': 'Hora Preferida de Entrega',
    'courier.specialInstructions': 'Instrucciones Especiales',
    'courier.specialInstructionsPlaceholder': 'Cualquier instrucción especial de manejo o notas',
    'courier.price.title': 'Cálculo de Precio',
    'courier.price.calculate': 'Calcular Precio',
    'courier.price.calculating': 'Calculando...',
    'courier.price.distance': 'Distancia:',
    'courier.price.baseFee': 'Tarifa base:',
    'courier.price.distanceFee': 'Tarifa por distancia',
    'courier.price.total': 'Total:',
    'courier.pay': 'Pagar',
    'courier.book': 'y Reservar Mensajero',
    'courier.processing': 'Procesando...',
    'courier.signInRequired': 'Por favor inicia sesión para proceder con el pago',
    'courier.signInLink': 'iniciar sesión',
    'courier.errors.fillRequired': 'Por favor completa todos los campos requeridos',
    'courier.errors.calculateFirst': 'Por favor calcula el precio antes de continuar',
    'courier.errors.calculatePrice': 'Por favor calcula el precio primero',
    'courier.errors.addressNotFound': 'No se pudieron encontrar una o ambas direcciones. Por favor verifica e intenta de nuevo.',
    'courier.errors.priceCalculation': 'Error al calcular el precio. Por favor intenta de nuevo.',
    'courier.errors.paymentSession': 'Error al crear la sesión de pago',
    'courier.errors.paymentProcessing': 'Error al procesar el pago',
    'courier.errors.bothAddresses': 'Por favor ingresa tanto la ubicación de recogida como la de entrega',
    'courier.success.priceCalculated': 'Precio calculado:',
    
    // Courier Success
    'courierSuccess.title': '¡Pago Exitoso!',
    'courierSuccess.description': 'Tu solicitud de mensajero ha sido enviada y el pago procesado exitosamente.',
    'courierSuccess.nextSteps': '¿Qué sigue?',
    'courierSuccess.step1': '• Asignaremos un mensajero a tu solicitud dentro de 30 minutos',
    'courierSuccess.step2': '• Recibirás actualizaciones por SMS/email sobre el estado de recogida y entrega',
    'courierSuccess.step3': '• Tu mensajero te contactará directamente para cualquier pregunta',
    'courierSuccess.step4': '• Entrega esperada basada en tus horarios preferidos',
    'courierSuccess.referenceId': 'ID de Referencia:',
    'courierSuccess.keepRecord': 'Por favor guarda esto para tus registros',
    'courierSuccess.backToHome': 'Volver al Inicio',
    'courierSuccess.bookAnother': 'Reservar Otro Mensajero',
    
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
