
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
      toast.error("Please enter both pickup and delivery addresses");
      return;
    }

    setCalculatingPrice(true);
    try {
      const [pickupCoords, dropoffCoords] = await Promise.all([
        geocodeAddress(formData.pickupLocation),
        geocodeAddress(formData.dropoffLocation)
      ]);

      if (!pickupCoords || !dropoffCoords) {
        toast.error("Could not find one or both addresses");
        return;
      }

      const distance = calculateStraightLineDistance(
        pickupCoords.lat, 
        pickupCoords.lng, 
        dropoffCoords.lat, 
        dropoffCoords.lng
      );

      // Updated pricing structure
      const baseFee = 8.50;
      const distanceFee = distance * 0.75;
      const totalPrice = baseFee + distanceFee;

      setPriceCalculation({
        distance,
        totalPrice,
        baseFee,
        distanceFee
      });

      toast.success(`Price calculated successfully: ${formatCurrency(totalPrice)}`);
    } catch (error) {
      console.error("Error calculating price:", error);
      toast.error("Error calculating price. Please try again.");
    } finally {
      setCalculatingPrice(false);
    }
  };

  const handlePayment = async () => {
    if (!user) {
      toast.error("Please sign in to book a delivery");
      return;
    }

    if (!priceCalculation) {
      toast.error("Please calculate the price first");
      return;
    }

    setLoading(true);
    try {
      const [pickupCoords, dropoffCoords] = await Promise.all([
        geocodeAddress(formData.pickupLocation),
        geocodeAddress(formData.dropoffLocation)
      ]);

      if (!pickupCoords || !dropoffCoords) {
        toast.error("Could not find one or both addresses");
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
        toast.error("Error creating payment session");
        return;
      }

      window.open(data.url, '_blank');
      
    } catch (error) {
      console.error("Error processing payment:", error);
      toast.error("Error processing payment");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.pickupLocation || !formData.dropoffLocation || !formData.itemDescription) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!priceCalculation) {
      toast.error("Please calculate the price before booking");
      return;
    }

    handlePayment();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1 px-3 sm:px-4 py-4 sm:py-8">
        <div className="max-w-2xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 sm:mb-6 text-sm sm:text-base">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Request Courier Service</h1>
            <p className="text-gray-600 text-sm sm:text-base px-2">Fast and reliable delivery service for your packages</p>
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
                Special Instructions
              </Label>
              <Textarea
                id="specialInstructions"
                placeholder="Any special delivery instructions..."
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
                {loading ? "Processing..." : `Pay ${priceCalculation ? formatCurrency(priceCalculation.totalPrice) : ""} & Book Delivery`}
              </Button>
              
              {!user && (
                <p className="text-sm text-gray-500 mt-3 px-4">
                  Please sign in to book a delivery <Link to="/auth" className="text-blue-600 hover:underline">Sign in here</Link>
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
