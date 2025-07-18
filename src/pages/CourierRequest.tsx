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
import { useSystemSettings } from "@/contexts/SystemSettingsContext";
import { supabase } from "@/integrations/supabase/client";
import { geocodeAddress, calculateStraightLineDistance } from "@/utils/geocoding";
import { formatCurrency } from "@/lib/currency";
import { ArrowLeft, CreditCard } from "lucide-react";
import { toast } from "sonner";

const CourierRequest = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { settings } = useSystemSettings();
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
      toast.error(t('courierRequest.errors.enterAddresses'));
      return;
    }
    setCalculatingPrice(true);
    try {
      const [pickupCoords, dropoffCoords] = await Promise.all([
        geocodeAddress(formData.pickupLocation),
        geocodeAddress(formData.dropoffLocation)
      ]);
      if (!pickupCoords || !dropoffCoords) {
        toast.error(t('courierRequest.errors.findAddresses'));
        return;
      }
      const distance = calculateStraightLineDistance(
        pickupCoords.lat, 
        pickupCoords.lng, 
        dropoffCoords.lat, 
        dropoffCoords.lng
      );
      // Use settings for pricing
      const baseFee = parseFloat(settings.base_delivery_fee ?? 8.50);
      const perKmFee = parseFloat(settings.per_km_fee ?? 0.75);
      const distanceFee = Math.max(0, distance) * perKmFee;
      const totalPrice = baseFee + distanceFee;
      setPriceCalculation({
        distance,
        totalPrice,
        baseFee,
        distanceFee
      });
      toast.success(`${t('courierRequest.priceCalculated')}: ${formatCurrency(totalPrice)}`);
    } catch (error) {
      console.error("Error calculating price:", error);
      toast.error(t('courierRequest.errors.calculatingPrice'));
    } finally {
      setCalculatingPrice(false);
    }
  };

  const handlePayment = async () => {
    if (!user) {
      toast.error(t('courierRequest.errors.signIn'));
      return;
    }

    if (!priceCalculation) {
      toast.error(t('courierRequest.errors.calculatePrice'));
      return;
    }

    setLoading(true);
    try {
      const [pickupCoords, dropoffCoords] = await Promise.all([
        geocodeAddress(formData.pickupLocation),
        geocodeAddress(formData.dropoffLocation)
      ]);

      if (!pickupCoords || !dropoffCoords) {
        toast.error(t('courierRequest.errors.findAddresses'));
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
        toast.error(t('courierRequest.errors.paymentSession'));
        return;
      }

      window.open(data.url, '_blank');

      // After successful payment, create order with status 'awaiting_driver'
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_id: user.id,
          business_id: null, // For courier requests, may be null or a special courier business
          status: 'awaiting_driver',
          payment_status: 'completed',
          subtotal: priceCalculation.baseFee + priceCalculation.distanceFee,
          delivery_fee: priceCalculation.distanceFee,
          service_fee: 0,
          tax_amount: 0,
          total_amount: priceCalculation.totalPrice,
          delivery_address: formData.dropoffLocation,
          delivery_instructions: formData.specialInstructions,
          notes: formData.itemDescription,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      if (orderError) throw orderError;
      // Optionally: trigger driver assignment logic here or via backend function
      
    } catch (error) {
      console.error("Error processing payment:", error);
      toast.error(t('courierRequest.errors.processingPayment'));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.pickupLocation || !formData.dropoffLocation || !formData.itemDescription) {
      toast.error(t('courierRequest.errors.fillFields'));
      return;
    }

    if (!priceCalculation) {
      toast.error(t('courierRequest.errors.calculatePrice'));
      return;
    }

    handlePayment();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 px-3 sm:px-4 py-4 sm:py-8">
        <div className="max-w-2xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 sm:mb-6 text-sm sm:text-base">
            <ArrowLeft className="w-4 h-4" />
            {t('common.backToHome')}
          </Link>

          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{t('courierRequest.title')}</h1>
            <p className="text-gray-600 text-sm sm:text-base px-2">{t('courierRequest.description')}</p>
          </div>

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

            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
              <Label htmlFor="specialInstructions" className="text-base sm:text-lg font-medium">
                {t('courierRequest.specialInstructions')}
              </Label>
              <Textarea
                id="specialInstructions"
                placeholder={t('courierRequest.specialInstructionsPlaceholder')}
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

            <div className="text-center pt-4">
              <Button
                type="submit"
                disabled={loading || !priceCalculation || !user}
                className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg flex items-center justify-center gap-2 min-h-[48px]"
              >
                <CreditCard className="w-5 h-5" />
                {loading ? t('courierRequest.processing') : `${t('courierRequest.pay')} ${priceCalculation ? formatCurrency(priceCalculation.totalPrice) : ""} ${t('courierRequest.andBookDelivery')}`}
              </Button>
              
              {!user && (
                <p className="text-sm text-gray-500 mt-3 px-4">
                  {t('courierRequest.signInPrompt')} <Link to="/auth" className="text-blue-600 hover:underline">{t('common.signIn')}</Link>
                </p>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CourierRequest;
