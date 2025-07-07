
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FileText, Upload, CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react";

interface Document {
  id: string;
  document_type: string;
  document_name: string;
  document_url: string;
  status: string;
  uploaded_at: string;
  verified_at?: string;
}

interface DriverDocumentsSectionProps {
  driverId: string;
}

/**
 * Driver Documents Management Section
 * 
 * Handles document upload, verification status, and compliance tracking:
 * - Driver's license
 * - Vehicle registration
 * - Insurance documents
 * - Background check results
 */
export function DriverDocumentsSection({ driverId }: DriverDocumentsSectionProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [uploading, setUploading] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const requiredDocuments = [
    { type: 'driverLicense', name: "Driver's License", required: true },
    { type: 'vehicleRegistration', name: 'Vehicle Registration', required: true },
    { type: 'insurance', name: 'Insurance Certificate', required: true },
    { type: 'backgroundCheck', name: 'Background Check', required: false }
  ];

  useEffect(() => {
    fetchDocuments();
  }, [driverId]);

  /**
   * Fetches all documents for the driver
   */
  const fetchDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from("driver_documents")
        .select("*")
        .eq("driver_id", driverId)
        .order("uploaded_at", { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error("Error fetching documents:", error);
      toast.error("Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles file upload for a specific document type
   */
  const handleFileUpload = async (documentType: string, file: File) => {
    setUploading(documentType);
    
    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${driverId}/${documentType}_${Date.now()}.${fileExt}`;
      
      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('driver-documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('driver-documents')
        .getPublicUrl(fileName);

      // Save document record
      const { error: dbError } = await supabase
        .from('driver_documents')
        .insert({
          driver_id: driverId,
          document_type: documentType,
          document_name: file.name,
          document_url: publicUrl,
          file_size: file.size,
          status: 'pending'
        });

      if (dbError) throw dbError;

      toast.success("Document uploaded successfully");
      fetchDocuments();
    } catch (error) {
      console.error("Error uploading document:", error);
      toast.error("Failed to upload document");
    } finally {
      setUploading(null);
    }
  };

  /**
   * Gets the status badge for a document
   */
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  /**
   * Calculates completion percentage
   */
  const completionPercentage = () => {
    const requiredDocs = requiredDocuments.filter(doc => doc.required);
    const approvedDocs = requiredDocs.filter(doc => 
      documents.some(d => d.document_type === doc.type && d.status === 'approved')
    );
    return (approvedDocs.length / requiredDocs.length) * 100;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Completion Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Document Verification Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Completion Progress</span>
                <span>{completionPercentage().toFixed(0)}%</span>
              </div>
              <Progress value={completionPercentage()} className="h-2" />
            </div>
            
            {completionPercentage() < 100 && (
              <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">Action Required</p>
                  <p className="text-sm text-yellow-700">
                    Complete document verification to activate your driver account.
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Document List */}
      <div className="grid gap-4">
        {requiredDocuments.map((docType) => {
          const existingDoc = documents.find(d => d.document_type === docType.type);
          
          return (
            <Card key={docType.type}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <div>
                      <h3 className="font-medium">{docType.name}</h3>
                      {docType.required && (
                        <span className="text-xs text-red-600">Required</span>
                      )}
                      {existingDoc && (
                        <p className="text-sm text-gray-500">
                          Uploaded: {new Date(existingDoc.uploaded_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {existingDoc ? (
                      <>
                        {getStatusBadge(existingDoc.status)}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(existingDoc.document_url, '_blank')}
                        >
                          View
                        </Button>
                      </>
                    ) : (
                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          id={`upload-${docType.type}`}
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleFileUpload(docType.type, file);
                            }
                          }}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById(`upload-${docType.type}`)?.click()}
                          disabled={uploading === docType.type}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          {uploading === docType.type ? 'Uploading...' : 'Upload'}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Upload Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Accepted formats: PDF, JPG, JPEG, PNG</li>
            <li>• Maximum file size: 10MB</li>
            <li>• Ensure documents are clear and legible</li>
            <li>• All information must be visible and current</li>
            <li>• Processing time: 1-3 business days</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
