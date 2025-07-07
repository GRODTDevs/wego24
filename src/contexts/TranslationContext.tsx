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
    
    // Auth
    'auth.signIn': 'Sign In',
    'auth.signOut': 'Sign Out',
    
    // Courier
    'courier.title': 'Request Courier Service',
    'courier.description': 'Fast and reliable delivery service for your packages',
    'courier.backToHome': 'Back to Home',
    
    // Pickup
    'courier.pickup.title': 'Pickup Details',
    'courier.pickup.location': 'Pickup Location',
    'courier.pickup.locationPlaceholder': 'Enter pickup address',
    'courier.pickup.date': 'Pickup Date',
    'courier.pickup.time': 'Pickup Time',
    
    // Item
    'courier.item.title': 'Item Details',
    'courier.item.description': 'Item Description',
    'courier.item.descriptionPlaceholder': 'Describe what needs to be delivered',
    'courier.item.size': 'Package Size',
    'courier.item.sizePlaceholder': 'e.g., Small, Medium, Large',
    'courier.item.weight': 'Weight',
    'courier.item.weightPlaceholder': 'e.g., 2kg, 5lbs',
    
    // Dropoff
    'courier.dropoff.title': 'Delivery Details',
    'courier.dropoff.location': 'Delivery Location',
    'courier.dropoff.locationPlaceholder': 'Enter delivery address',
    'courier.dropoff.date': 'Delivery Date',
    'courier.dropoff.time': 'Delivery Time',
    
    // Price
    'courier.price.title': 'Price Calculation',
    'courier.price.calculate': 'Calculate Price',
    'courier.price.calculating': 'Calculating...',
    'courier.price.distance': 'Distance',
    'courier.price.baseFee': 'Base Fee',
    'courier.price.distanceFee': 'Distance Fee',
    'courier.price.total': 'Total Price',
    
    // Special Instructions
    'courier.specialInstructions': 'Special Instructions',
    'courier.specialInstructionsPlaceholder': 'Any special delivery instructions...',
    
    // Actions
    'courier.pay': 'Pay',
    'courier.book': '& Book Delivery',
    'courier.processing': 'Processing...',
    'courier.signInRequired': 'Please sign in to book a delivery',
    'courier.signInLink': 'Sign in here',
    
    // Errors
    'courier.errors.bothAddresses': 'Please enter both pickup and delivery addresses',
    'courier.errors.addressNotFound': 'Could not find one or both addresses',
    'courier.errors.priceCalculation': 'Error calculating price. Please try again.',
    'courier.errors.calculatePrice': 'Please calculate the price first',
    'courier.errors.fillRequired': 'Please fill in all required fields',
    'courier.errors.calculateFirst': 'Please calculate the price before booking',
    'courier.errors.paymentSession': 'Error creating payment session',
    'courier.errors.paymentProcessing': 'Error processing payment',
    
    // Success
    'courier.success.priceCalculated': 'Price calculated successfully:',
    
    // Courier Success Page
    'courierSuccess.title': 'Delivery Booked Successfully!',
    'courierSuccess.description': 'Your delivery request has been confirmed and payment processed.',
    'courierSuccess.nextSteps': 'What happens next?',
    'courierSuccess.step1': '1. We will assign a driver to your delivery within 15 minutes',
    'courierSuccess.step2': '2. You will receive SMS and email notifications with driver details',
    'courierSuccess.step3': '3. Track your delivery in real-time through our platform',
    'courierSuccess.step4': '4. Driver will contact you for any special instructions',
    'courierSuccess.referenceId': 'Reference ID:',
    'courierSuccess.keepRecord': 'Please keep this reference for your records',
    'courierSuccess.backToHome': 'Back to Home',
    'courierSuccess.bookAnother': 'Book Another Delivery'
  },
  es: {
    // Add Spanish translations as needed
    'common.home': 'Inicio',
    'common.courierRequest': 'Solicitar Mensajero',
    'courier.title': 'Solicitar Servicio de Mensajería',
    // ... other Spanish translations
  },
  fr: {
    // Add French translations as needed
    'common.home': 'Accueil',
    'common.courierRequest': 'Demander un Coursier',
    'courier.title': 'Demander un Service de Coursier',
    // ... other French translations
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
    
    return value || key; // Return key if translation not found
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
