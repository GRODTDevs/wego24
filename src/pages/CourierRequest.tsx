
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PickupSection } from "@/components/courier/PickupSection";
import { ItemSection } from "@/components/courier/ItemSection";
import { DropoffSection } from "@/components/courier/DropoffSection";
import { PriceCalculationSection } from "@/components/courier/PriceCalculationSection";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "@/contexts/TranslationContext";
import { supabase } from "@/integrations/supabase/client";
import { geocodeAddress, calculateStraightLineDistance } from "@/utils/geocoding";
import { formatCurrency } from "@/lib/currency";
import { ArrowLeft, CreditCard } from "lucide-react";
import { toast } from "sonner";

const CourierRequest = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    pickupLocation: "",
    pickupDate: "",
    pickupTime: "",
    itemDescription: "",
    itemSize: "",
    itemWeight: "",
    dropoffLocation: "",
    dropoffDate: "",
    dropoffTime: "",
    specialInstructions: ""
  });
  
  const [priceCalculation, setPriceCalculation] = useState<{
    distance: number;
    totalPrice: number;
    baseFee: number;
    distanceFee: number;
  } | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [calculatingPrice, setCalculatingPrice] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'pickupLocation' || field === 'dropoffLocation') {
      setPriceCalculation(null);
    }
  };

  const calculatePrice = async () => {
    if (!formData.pickupLocation || !formData.dropoffLocation) {
      toast.error(t('courier.errors.bothAddresses'));
      return;
    }

    setCalculatingPrice(true);
    try {
      const [pickupCoords, dropoffCoords] = await Promise.all([
        geocodeAddress(formData.pickupLocation),
        geocodeAddress(formData.dropoffLocation)
      ]);

      if (!pickupCoords || !dropoffCoords) {
        toast.error(t('courier.errors.addressNotFound'));
        return;
      }

      const distance = calculateStraightLineDistance(
        pickupCoords.lat, 
        pickupCoords.lng, 
        dropoffCoords.lat, 
        dropoffCoords.lng
      );

      // Updated pricing structure
      const baseFee = 8.50; // Increased base fee
      const distanceFee = distance * 0.75; // Increased per km rate
      const totalPrice = baseFee + distanceFee;

      setPriceCalculation({
        distance,
        totalPrice,
        baseFee,
        distanceFee
      });

      toast.success(`${t('courier.success.priceCalculated')} ${formatCurrency(totalPrice)}`);
    } catch (error) {
      console.error("Error calculating price:", error);
      toast.error(t('courier.errors.priceCalculation'));
    } finally {
      setCalculatingPrice(false);
    }
  };

  const handlePayment = async () => {
    if (!user) {
      toast.error(t('courier.signInRequired'));
      return;
    }

    if (!priceCalculation) {
      toast.error(t('courier.errors.calculatePrice'));
      return;
    }

    setLoading(true);
    try {
      const [pickupCoords, dropoffCoords] = await Promise.all([
        geocodeAddress(formData.pickupLocation),
        geocodeAddress(formData.dropoffLocation)
      ]);

      if (!pickupCoords || !dropoffCoords) {
        toast.error(t('courier.errors.addressNotFound'));
        return;
      }

      const { data, error } = await supabase.functions.invoke('create-courier-payment', {
        body: {
          pickupLat: pickupCoords.lat,
          pickupLng: pickupCoords.lng,
          dropoffLat: dropoffCoords.lat,
          dropoffLng: dropoffCoords.lng,
          pickupLocation: formData.pickupLocation,
          dropoffLocation: formData.dropoffLocation,
          itemDescription: formData.itemDescription,
          userEmail: user.email
        }
      });

      if (error) {
        console.error("Payment error:", error);
        toast.error(t('courier.errors.paymentSession'));
        return;
      }

      window.open(data.url, '_blank');
      
    } catch (error) {
      console.error("Error processing payment:", error);
      toast.error(t('courier.errors.paymentProcessing'));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.pickupLocation || !formData.dropoffLocation || !formData.itemDescription) {
      toast.error(t('courier.errors.fillRequired'));
      return;
    }

    if (!priceCalculation) {
      toast.error(t('courier.errors.calculateFirst'));
      return;
    }

    handlePayment();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1 px-3 sm:px-4 py-4 sm:py-8">
        <div className="max-w-2xl mx-auto">
          {/* Mobile-optimized back button */}
          <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 sm:mb-6 text-sm sm:text-base">
            <ArrowLeft className="w-4 h-4" />
            {t('courier.backToHome')}
          </Link>

          {/* Mobile-optimized header */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{t('courier.title')}</h1>
            <p className="text-gray-600 text-sm sm:text-base px-2">{t('courier.description')}</p>
          </div>

          {/* Mobile-optimized form */}
          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            <PickupSection 
              formData={formData} 
              onInputChange={handleInputChange} 
            />

            <ItemSection 
              formData={formData} 
              onInputChange={handleInputChange} 
            />

            <DropoffSection 
              formData={formData} 
              onInputChange={handleInputChange} 
            />

            {/* Special Instructions - Mobile optimized */}
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
              <Label htmlFor="specialInstructions" className="text-base sm:text-lg font-medium">
                {t('courier.specialInstructions')}
              </Label>
              <Textarea
                id="specialInstructions"
                placeholder={t('courier.specialInstructionsPlaceholder')}
                value={formData.specialInstructions}
                onChange={(e) => handleInputChange("specialInstructions", e.target.value)}
                className="mt-2 min-h-[80px] text-base"
              />
            </div>

            <PriceCalculationSection
              priceCalculation={priceCalculation}
              calculatingPrice={calculatingPrice}
              canCalculate={!!formData.pickupLocation && !!formData.dropoffLocation}
              onCalculatePrice={calculatePrice}
            />

            {/* Mobile-optimized submit button */}
            <div className="text-center pt-4">
              <Button
                type="submit"
                disabled={loading || !priceCalculation || !user}
                className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg flex items-center justify-center gap-2 min-h-[48px]"
              >
                <CreditCard className="w-5 h-5" />
                {loading ? t('courier.processing') : `${t('courier.pay')} ${priceCalculation ? formatCurrency(priceCalculation.totalPrice) : ""} ${t('courier.book')}`}
              </Button>
              
              {!user && (
                <p className="text-sm text-gray-500 mt-3 px-4">
                  {t('courier.signInRequired')} <Link to="/auth" className="text-blue-600 hover:underline">{t('courier.signInLink')}</Link>
                </p>
              )}
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CourierRequest;
