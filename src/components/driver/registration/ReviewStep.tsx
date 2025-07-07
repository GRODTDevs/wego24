
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Car, FileText, Calendar, Phone, MapPin } from "lucide-react";
import { DriverRegistrationData } from "../DriverRegistration";

interface ReviewStepProps {
  data: DriverRegistrationData;
  onSubmit: () => void;
  onPrev: () => void;
  isSubmitting: boolean;
}

export function ReviewStep({ data, onSubmit, onPrev, isSubmitting }: ReviewStepProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return "Not provided";
    return new Date(dateString).toLocaleDateString();
  };

  const uploadedDocuments = Object.entries(data.documents).filter(([_, file]) => file);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Review Your Information</h2>
        <p className="text-gray-600 mb-6">
          Please review all the information before submitting your application.
        </p>
      </div>

      {/* Personal Information */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Full Name</p>
              <p>{data.firstName} {data.lastName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Date of Birth</p>
              <p>{formatDate(data.dateOfBirth)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p>{data.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Phone</p>
              <p>{data.phone}</p>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Address</p>
            <p>{data.address}, {data.city} {data.postalCode}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Emergency Contact</p>
              <p>{data.emergencyContactName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Emergency Phone</p>
              <p>{data.emergencyContactPhone}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Information */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="w-5 h-5" />
            Vehicle Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Vehicle Type</p>
              <Badge variant="secondary" className="capitalize">
                {data.vehicleType}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">License Plate</p>
              <p className="font-mono">{data.licensePlate}</p>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Vehicle Details</p>
            <p>{data.vehicleYear} {data.vehicleMake} {data.vehicleModel}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">License Number</p>
              <p className="font-mono">{data.licenseNumber}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">License Expiry</p>
              <p>{formatDate(data.licenseExpiryDate)}</p>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Insurance Expiry</p>
            <p>{formatDate(data.insuranceExpiryDate)}</p>
          </div>
        </CardContent>
      </Card>

      {/* Documents */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Uploaded Documents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {uploadedDocuments.map(([key, file]) => (
              <div key={key} className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded">
                <FileText className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}: {(file as File).name}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Important Notice */}
      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
        <h3 className="font-medium text-yellow-800 mb-2">Important Notice</h3>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Your application will be reviewed by our team within 2-3 business days</li>
          <li>• You will receive an email notification about the status of your application</li>
          <li>• All documents will be verified before approval</li>
          <li>• Once approved, you can start accepting delivery requests</li>
        </ul>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev} disabled={isSubmitting}>
          Previous Step
        </Button>
        <Button onClick={onSubmit} disabled={isSubmitting} className="px-8">
          {isSubmitting ? "Submitting..." : "Submit Application"}
        </Button>
      </div>
    </div>
  );
}
