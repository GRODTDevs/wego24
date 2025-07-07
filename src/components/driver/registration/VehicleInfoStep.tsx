
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DriverRegistrationData } from "../DriverRegistration";

interface VehicleInfoStepProps {
  data: DriverRegistrationData;
  onUpdate: (data: Partial<DriverRegistrationData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const VEHICLE_TYPES = [
  { value: "motorcycle", label: "Motorcycle" },
  { value: "bicycle", label: "Bicycle" },
  { value: "car", label: "Car" },
  { value: "van", label: "Van" },
  { value: "truck", label: "Truck" }
];

export function VehicleInfoStep({ data, onUpdate, onNext, onPrev }: VehicleInfoStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!data.vehicleType) newErrors.vehicleType = "Vehicle type is required";
    if (!data.vehicleMake.trim()) newErrors.vehicleMake = "Vehicle make is required";
    if (!data.vehicleModel.trim()) newErrors.vehicleModel = "Vehicle model is required";
    if (!data.vehicleYear.trim()) newErrors.vehicleYear = "Vehicle year is required";
    if (!data.licensePlate.trim()) newErrors.licensePlate = "License plate is required";
    if (!data.licenseNumber.trim()) newErrors.licenseNumber = "License number is required";
    if (!data.licenseExpiryDate) newErrors.licenseExpiryDate = "License expiry date is required";
    if (!data.insuranceExpiryDate) newErrors.insuranceExpiryDate = "Insurance expiry date is required";

    // Validate dates are in the future
    const today = new Date().toISOString().split('T')[0];
    if (data.licenseExpiryDate && data.licenseExpiryDate <= today) {
      newErrors.licenseExpiryDate = "License must not be expired";
    }
    if (data.insuranceExpiryDate && data.insuranceExpiryDate <= today) {
      newErrors.insuranceExpiryDate = "Insurance must not be expired";
    }

    // Validate vehicle year
    const currentYear = new Date().getFullYear();
    const vehicleYear = parseInt(data.vehicleYear);
    if (vehicleYear && (vehicleYear < 1990 || vehicleYear > currentYear + 1)) {
      newErrors.vehicleYear = "Please enter a valid vehicle year";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
  };

  const handleInputChange = (field: keyof DriverRegistrationData, value: string) => {
    onUpdate({ [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Vehicle Information</h2>
        <p className="text-gray-600 mb-6">Please provide details about your vehicle and driving license.</p>
      </div>

      <div>
        <Label htmlFor="vehicleType">Vehicle Type *</Label>
        <Select value={data.vehicleType} onValueChange={(value) => handleInputChange("vehicleType", value)}>
          <SelectTrigger className={errors.vehicleType ? "border-red-500" : ""}>
            <SelectValue placeholder="Select vehicle type" />
          </SelectTrigger>
          <SelectContent>
            {VEHICLE_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.vehicleType && <p className="text-red-500 text-sm mt-1">{errors.vehicleType}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="vehicleMake">Make *</Label>
          <Input
            id="vehicleMake"
            placeholder="e.g., Toyota"
            value={data.vehicleMake}
            onChange={(e) => handleInputChange("vehicleMake", e.target.value)}
            className={errors.vehicleMake ? "border-red-500" : ""}
          />
          {errors.vehicleMake && <p className="text-red-500 text-sm mt-1">{errors.vehicleMake}</p>}
        </div>

        <div>
          <Label htmlFor="vehicleModel">Model *</Label>
          <Input
            id="vehicleModel"
            placeholder="e.g., Corolla"
            value={data.vehicleModel}
            onChange={(e) => handleInputChange("vehicleModel", e.target.value)}
            className={errors.vehicleModel ? "border-red-500" : ""}
          />
          {errors.vehicleModel && <p className="text-red-500 text-sm mt-1">{errors.vehicleModel}</p>}
        </div>

        <div>
          <Label htmlFor="vehicleYear">Year *</Label>
          <Input
            id="vehicleYear"
            placeholder="e.g., 2020"
            value={data.vehicleYear}
            onChange={(e) => handleInputChange("vehicleYear", e.target.value)}
            className={errors.vehicleYear ? "border-red-500" : ""}
          />
          {errors.vehicleYear && <p className="text-red-500 text-sm mt-1">{errors.vehicleYear}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="licensePlate">License Plate *</Label>
        <Input
          id="licensePlate"
          placeholder="e.g., ABC-123"
          value={data.licensePlate}
          onChange={(e) => handleInputChange("licensePlate", e.target.value.toUpperCase())}
          className={errors.licensePlate ? "border-red-500" : ""}
        />
        {errors.licensePlate && <p className="text-red-500 text-sm mt-1">{errors.licensePlate}</p>}
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium mb-3">License & Insurance Information</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="licenseNumber">Driver's License Number *</Label>
            <Input
              id="licenseNumber"
              value={data.licenseNumber}
              onChange={(e) => handleInputChange("licenseNumber", e.target.value)}
              className={errors.licenseNumber ? "border-red-500" : ""}
            />
            {errors.licenseNumber && <p className="text-red-500 text-sm mt-1">{errors.licenseNumber}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="licenseExpiryDate">License Expiry Date *</Label>
              <Input
                id="licenseExpiryDate"
                type="date"
                value={data.licenseExpiryDate}
                onChange={(e) => handleInputChange("licenseExpiryDate", e.target.value)}
                className={errors.licenseExpiryDate ? "border-red-500" : ""}
              />
              {errors.licenseExpiryDate && <p className="text-red-500 text-sm mt-1">{errors.licenseExpiryDate}</p>}
            </div>

            <div>
              <Label htmlFor="insuranceExpiryDate">Insurance Expiry Date *</Label>
              <Input
                id="insuranceExpiryDate"
                type="date"
                value={data.insuranceExpiryDate}
                onChange={(e) => handleInputChange("insuranceExpiryDate", e.target.value)}
                className={errors.insuranceExpiryDate ? "border-red-500" : ""}
              />
              {errors.insuranceExpiryDate && <p className="text-red-500 text-sm mt-1">{errors.insuranceExpiryDate}</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          Previous Step
        </Button>
        <Button onClick={handleNext} className="px-8">
          Next Step
        </Button>
      </div>
    </div>
  );
}
