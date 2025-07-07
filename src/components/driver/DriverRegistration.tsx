
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PersonalInfoStep } from "./registration/PersonalInfoStep";
import { VehicleInfoStep } from "./registration/VehicleInfoStep";
import { DocumentUploadStep } from "./registration/DocumentUploadStep";
import { ReviewStep } from "./registration/ReviewStep";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Truck } from "lucide-react";

export interface DriverRegistrationData {
  // Personal Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  city: string;
  postalCode: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  
  // Vehicle Info
  vehicleType: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: string;
  licensePlate: string;
  licenseNumber: string;
  licenseExpiryDate: string;
  insuranceExpiryDate: string;
  
  // Documents
  documents: {
    driverLicense?: File;
    vehicleRegistration?: File;
    insurance?: File;
    backgroundCheck?: File;
  };
}

const STEPS = [
  { id: 1, title: "Personal Information", description: "Basic details and contact info" },
  { id: 2, title: "Vehicle Information", description: "Vehicle and license details" },
  { id: 3, title: "Document Upload", description: "Required documents" },
  { id: 4, title: "Review & Submit", description: "Confirm your information" }
];

export function DriverRegistration() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationData, setRegistrationData] = useState<DriverRegistrationData>({
    firstName: "",
    lastName: "",
    email: user?.email || "",
    phone: "",
    dateOfBirth: "",
    address: "",
    city: "",
    postalCode: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    vehicleType: "",
    vehicleMake: "",
    vehicleModel: "",
    vehicleYear: "",
    licensePlate: "",
    licenseNumber: "",
    licenseExpiryDate: "",
    insuranceExpiryDate: "",
    documents: {}
  });

  const updateRegistrationData = (data: Partial<DriverRegistrationData>) => {
    setRegistrationData(prev => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error("You must be logged in to register as a driver");
      return;
    }

    setIsSubmitting(true);
    try {
      // Create driver record
      const { data: driverData, error: driverError } = await supabase
        .from("drivers")
        .insert({
          user_id: user.id,
          email: registrationData.email,
          first_name: registrationData.firstName,
          last_name: registrationData.lastName,
          date_of_birth: registrationData.dateOfBirth,
          address: registrationData.address,
          city: registrationData.city,
          postal_code: registrationData.postalCode,
          emergency_contact_name: registrationData.emergencyContactName,
          emergency_contact_phone: registrationData.emergencyContactPhone,
          vehicle_type: registrationData.vehicleType,
          license_number: registrationData.licenseNumber,
          license_expiry_date: registrationData.licenseExpiryDate,
          insurance_expiry_date: registrationData.insuranceExpiryDate,
          vehicle_info: {
            make: registrationData.vehicleMake,
            model: registrationData.vehicleModel,
            year: registrationData.vehicleYear,
            licensePlate: registrationData.licensePlate
          },
          registration_status: "pending",
          background_check_status: "pending",
          is_active: false,
          is_available: false
        })
        .select()
        .single();

      if (driverError) throw driverError;

      // Upload documents if any
      const documentPromises = [];
      
      for (const [docType, file] of Object.entries(registrationData.documents)) {
        if (file) {
          const fileName = `${user.id}/${docType}_${Date.now()}.${file.name.split('.').pop()}`;
          
          const { error: uploadError } = await supabase.storage
            .from('driver-documents')
            .upload(fileName, file);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('driver-documents')
            .getPublicUrl(fileName);

          documentPromises.push(
            supabase.from('driver_documents').insert({
              driver_id: driverData.id,
              document_type: docType,
              document_name: file.name,
              document_url: publicUrl,
              file_size: file.size,
              status: 'pending'
            })
          );
        }
      }

      if (documentPromises.length > 0) {
        await Promise.all(documentPromises);
      }

      toast.success("Driver registration submitted successfully! We'll review your application soon.");
      navigate("/driver/dashboard");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Failed to submit registration. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = (currentStep / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Truck className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Become a Driver</h1>
          </div>
          <p className="text-gray-600">Join our delivery network and start earning today</p>
        </div>

        {/* Progress Bar */}
        <Card className="border-0 shadow-sm mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              {STEPS.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step.id 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step.id}
                  </div>
                  {index < STEPS.length - 1 && (
                    <div className={`h-1 w-16 mx-2 ${
                      currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <Progress value={progress} className="h-2" />
            <div className="mt-4">
              <h3 className="font-semibold">{STEPS[currentStep - 1].title}</h3>
              <p className="text-sm text-gray-600">{STEPS[currentStep - 1].description}</p>
            </div>
          </CardContent>
        </Card>

        {/* Step Content */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            {currentStep === 1 && (
              <PersonalInfoStep
                data={registrationData}
                onUpdate={updateRegistrationData}
                onNext={nextStep}
              />
            )}
            {currentStep === 2 && (
              <VehicleInfoStep
                data={registrationData}
                onUpdate={updateRegistrationData}
                onNext={nextStep}
                onPrev={prevStep}
              />
            )}
            {currentStep === 3 && (
              <DocumentUploadStep
                data={registrationData}
                onUpdate={updateRegistrationData}
                onNext={nextStep}
                onPrev={prevStep}
              />
            )}
            {currentStep === 4 && (
              <ReviewStep
                data={registrationData}
                onSubmit={handleSubmit}
                onPrev={prevStep}
                isSubmitting={isSubmitting}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
