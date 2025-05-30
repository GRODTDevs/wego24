
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { geocodeAddress, calculateStraightLineDistance } from "@/utils/geocoding";
import { formatCurrency } from "@/lib/currency";
import { ArrowLeft, MapPin, Clock, Package, Calculator, CreditCard } from "lucide-react";
import { toast } from "sonner";

const CourierRequest = () => {
  const { user } = useAuth();
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
    // Reset price calculation when addresses change
    if (field === 'pickupLocation' || field === 'dropoffLocation') {
      setPriceCalculation(null);
    }
  };

  const calculatePrice = async () => {
    if (!formData.pickupLocation || !formData.dropoffLocation) {
      toast.error("Please enter both pickup and dropoff locations");
      return;
    }

    setCalculatingPrice(true);
    try {
      // Geocode both addresses
      const [pickupCoords, dropoffCoords] = await Promise.all([
        geocodeAddress(formData.pickupLocation),
        geocodeAddress(formData.dropoffLocation)
      ]);

      if (!pickupCoords || !dropoffCoords) {
        toast.error("Could not find one or both addresses. Please check and try again.");
        return;
      }

      // Calculate distance
      const distance = calculateStraightLineDistance(
        pickupCoords.lat, 
        pickupCoords.lng, 
        dropoffCoords.lat, 
        dropoffCoords.lng
      );

      const baseFee = 6.50;
      const distanceFee = distance * 0.50;
      const totalPrice = baseFee + distanceFee;

      setPriceCalculation({
        distance,
        totalPrice,
        baseFee,
        distanceFee
      });

      toast.success(`Price calculated: ${formatCurrency(totalPrice)}`);
    } catch (error) {
      console.error("Error calculating price:", error);
      toast.error("Failed to calculate price. Please try again.");
    } finally {
      setCalculatingPrice(false);
    }
  };

  const handlePayment = async () => {
    if (!user) {
      toast.error("Please sign in to proceed with payment");
      return;
    }

    if (!priceCalculation) {
      toast.error("Please calculate the price first");
      return;
    }

    setLoading(true);
    try {
      // Geocode addresses again for payment
      const [pickupCoords, dropoffCoords] = await Promise.all([
        geocodeAddress(formData.pickupLocation),
        geocodeAddress(formData.dropoffLocation)
      ]);

      if (!pickupCoords || !dropoffCoords) {
        toast.error("Could not find addresses. Please try again.");
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
        toast.error("Failed to create payment session");
        return;
      }

      // Redirect to Stripe checkout
      window.open(data.url, '_blank');
      
    } catch (error) {
      console.error("Error processing payment:", error);
      toast.error("Failed to process payment");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.pickupLocation || !formData.dropoffLocation || !formData.itemDescription) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!priceCalculation) {
      toast.error("Please calculate the price before proceeding");
      return;
    }

    handlePayment();
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      
      <main className="flex-1 px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Back button */}
          <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Request a Courier</h1>
            <p className="text-gray-600">Fill in the details below and we'll arrange pickup and delivery for you</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Pickup Section */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-blue-500" />
                <h2 className="text-xl font-semibold text-gray-900">Pickup Details</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="pickupLocation">Pickup Location *</Label>
                  <Input
                    id="pickupLocation"
                    placeholder="Enter pickup address"
                    value={formData.pickupLocation}
                    onChange={(e) => handleInputChange("pickupLocation", e.target.value)}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="pickupDate">Pickup Date</Label>
                    <Input
                      id="pickupDate"
                      type="date"
                      value={formData.pickupDate}
                      onChange={(e) => handleInputChange("pickupDate", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="pickupTime">Pickup Time</Label>
                    <Input
                      id="pickupTime"
                      type="time"
                      value={formData.pickupTime}
                      onChange={(e) => handleInputChange("pickupTime", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Item Section */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-5 h-5 text-orange-500" />
                <h2 className="text-xl font-semibold text-gray-900">Item Details</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="itemDescription">Item Description *</Label>
                  <Textarea
                    id="itemDescription"
                    placeholder="Describe what needs to be delivered"
                    value={formData.itemDescription}
                    onChange={(e) => handleInputChange("itemDescription", e.target.value)}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="itemSize">Size/Dimensions</Label>
                    <Input
                      id="itemSize"
                      placeholder="e.g., 30cm x 20cm x 10cm"
                      value={formData.itemSize}
                      onChange={(e) => handleInputChange("itemSize", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="itemWeight">Weight</Label>
                    <Input
                      id="itemWeight"
                      placeholder="e.g., 2kg"
                      value={formData.itemWeight}
                      onChange={(e) => handleInputChange("itemWeight", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Dropoff Section */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-red-500" />
                <h2 className="text-xl font-semibold text-gray-900">Dropoff Details</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="dropoffLocation">Dropoff Location *</Label>
                  <Input
                    id="dropoffLocation"
                    placeholder="Enter delivery address"
                    value={formData.dropoffLocation}
                    onChange={(e) => handleInputChange("dropoffLocation", e.target.value)}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dropoffDate">Preferred Delivery Date</Label>
                    <Input
                      id="dropoffDate"
                      type="date"
                      value={formData.dropoffDate}
                      onChange={(e) => handleInputChange("dropoffDate", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="dropoffTime">Preferred Delivery Time</Label>
                    <Input
                      id="dropoffTime"
                      type="time"
                      value={formData.dropoffTime}
                      onChange={(e) => handleInputChange("dropoffTime", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Special Instructions */}
            <div>
              <Label htmlFor="specialInstructions">Special Instructions</Label>
              <Textarea
                id="specialInstructions"
                placeholder="Any special handling instructions or notes"
                value={formData.specialInstructions}
                onChange={(e) => handleInputChange("specialInstructions", e.target.value)}
              />
            </div>

            {/* Price Calculation Section */}
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <Calculator className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">Price Calculation</h2>
              </div>
              
              <div className="space-y-4">
                <Button
                  type="button"
                  onClick={calculatePrice}
                  disabled={calculatingPrice || !formData.pickupLocation || !formData.dropoffLocation}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {calculatingPrice ? "Calculating..." : "Calculate Price"}
                </Button>
                
                {priceCalculation && (
                  <div className="bg-white p-4 rounded-md border">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Distance:</span>
                        <span>{priceCalculation.distance.toFixed(2)} km</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Base fee:</span>
                        <span>{formatCurrency(priceCalculation.baseFee)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Distance fee ({formatCurrency(0.50)}/km):</span>
                        <span>{formatCurrency(priceCalculation.distanceFee)}</span>
                      </div>
                      <hr className="my-2" />
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total:</span>
                        <span>{formatCurrency(priceCalculation.totalPrice)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <Button
                type="submit"
                disabled={loading || !priceCalculation || !user}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold px-8 py-3 text-lg flex items-center gap-2"
              >
                <CreditCard className="w-5 h-5" />
                {loading ? "Processing..." : `Pay ${priceCalculation ? formatCurrency(priceCalculation.totalPrice) : ""} & Book Courier`}
              </Button>
              
              {!user && (
                <p className="text-sm text-gray-500 mt-2">
                  Please <Link to="/auth" className="text-blue-600 hover:underline">sign in</Link> to proceed with payment
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
