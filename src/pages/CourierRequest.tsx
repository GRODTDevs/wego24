
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArrowLeft, MapPin, Clock, Package } from "lucide-react";
import { toast } from "sonner";

const CourierRequest = () => {
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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.pickupLocation || !formData.dropoffLocation || !formData.itemDescription) {
      toast.error("Please fill in all required fields");
      return;
    }

    // For now, just show success message
    toast.success("Courier request submitted! We'll contact you soon.");
    console.log("Courier request:", formData);
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

            {/* Submit Button */}
            <div className="text-center">
              <Button
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-8 py-3 text-lg"
              >
                Submit Courier Request
              </Button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CourierRequest;
