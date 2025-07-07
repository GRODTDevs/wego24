
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { DriverRegistrationData } from "../DriverRegistration";

interface DocumentUploadStepProps {
  data: DriverRegistrationData;
  onUpdate: (data: Partial<DriverRegistrationData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const REQUIRED_DOCUMENTS = [
  {
    key: "driverLicense" as keyof DriverRegistrationData["documents"],
    title: "Driver's License",
    description: "Clear photo of both sides of your driver's license",
    required: true
  },
  {
    key: "vehicleRegistration" as keyof DriverRegistrationData["documents"],
    title: "Vehicle Registration",
    description: "Current vehicle registration document",
    required: true
  },
  {
    key: "insurance" as keyof DriverRegistrationData["documents"],
    title: "Insurance Certificate",
    description: "Valid vehicle insurance certificate",
    required: true
  },
  {
    key: "backgroundCheck" as keyof DriverRegistrationData["documents"],
    title: "Background Check",
    description: "Criminal background check (if available)",
    required: false
  }
];

export function DocumentUploadStep({ data, onUpdate, onNext, onPrev }: DocumentUploadStepProps) {
  const [uploadErrors, setUploadErrors] = useState<Record<string, string>>({});

  const handleFileUpload = (documentKey: keyof DriverRegistrationData["documents"], file: File) => {
    // Validate file
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];

    if (file.size > maxSize) {
      setUploadErrors({
        ...uploadErrors,
        [documentKey]: "File size must be less than 5MB"
      });
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      setUploadErrors({
        ...uploadErrors,
        [documentKey]: "File must be a JPEG, PNG, or PDF"
      });
      return;
    }

    // Clear any previous errors
    const newErrors = { ...uploadErrors };
    delete newErrors[documentKey];
    setUploadErrors(newErrors);

    // Update the documents
    onUpdate({
      documents: {
        ...data.documents,
        [documentKey]: file
      }
    });
  };

  const removeDocument = (documentKey: keyof DriverRegistrationData["documents"]) => {
    const newDocuments = { ...data.documents };
    delete newDocuments[documentKey];
    onUpdate({ documents: newDocuments });
  };

  const validateDocuments = () => {
    const requiredDocs = REQUIRED_DOCUMENTS.filter(doc => doc.required);
    const missingDocs = requiredDocs.filter(doc => !data.documents[doc.key]);
    
    if (missingDocs.length > 0) {
      const newErrors: Record<string, string> = {};
      missingDocs.forEach(doc => {
        newErrors[doc.key] = "This document is required";
      });
      setUploadErrors(newErrors);
      return false;
    }
    
    return true;
  };

  const handleNext = () => {
    if (validateDocuments()) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Document Upload</h2>
        <p className="text-gray-600 mb-6">
          Please upload the required documents. All documents should be clear and readable.
        </p>
      </div>

      <div className="space-y-4">
        {REQUIRED_DOCUMENTS.map((doc) => (
          <Card key={doc.key} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <Label className="font-medium">{doc.title}</Label>
                    {doc.required && <span className="text-red-500 text-sm">*</span>}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{doc.description}</p>

                  {data.documents[doc.key] ? (
                    <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">
                        {(data.documents[doc.key] as File).name}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDocument(doc.key)}
                        className="ml-auto text-red-600 hover:text-red-800"
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <input
                        type="file"
                        id={doc.key}
                        accept="image/*,.pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleFileUpload(doc.key, file);
                          }
                        }}
                        className="hidden"
                      />
                      <Label
                        htmlFor={doc.key}
                        className="flex items-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
                      >
                        <Upload className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium">
                          Click to upload {doc.title.toLowerCase()}
                        </span>
                      </Label>
                    </div>
                  )}

                  {uploadErrors[doc.key] && (
                    <div className="flex items-center gap-2 mt-2 text-red-600">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm">{uploadErrors[doc.key]}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-medium mb-2">Document Guidelines</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Documents should be clear and all text should be readable</li>
          <li>• Accepted formats: JPEG, PNG, PDF</li>
          <li>• Maximum file size: 5MB per document</li>
          <li>• Ensure all information is visible and not cut off</li>
        </ul>
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
