
import { useState } from "react";
import { FileUpload } from "./FileUpload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Trash2, FileText } from "lucide-react";

interface Document {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploaded_at: string;
}

interface DocumentUploadProps {
  entityId: string;
  entityType: 'restaurant' | 'user';
  documents?: Document[];
  onDocumentsChange: () => void;
}

export function DocumentUpload({ 
  entityId, 
  entityType, 
  documents = [], 
  onDocumentsChange 
}: DocumentUploadProps) {
  const [uploading, setUploading] = useState(false);

  const handleDocumentUploaded = async (url: string, fileName: string) => {
    // Here you would typically save document info to database
    // For now, just trigger the change callback
    onDocumentsChange();
  };

  const handleDocumentRemoved = () => {
    onDocumentsChange();
  };

  const downloadDocument = (doc: Document) => {
    window.open(doc.url, '_blank');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Document Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FileUpload
          bucketName="documents"
          folder={`${entityType}/${entityId}`}
          onFileUploaded={handleDocumentUploaded}
          onFileRemoved={handleDocumentRemoved}
          uploadType="document"
          maxSize={10}
          multiple={true}
          showPreview={false}
        />

        {documents.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Uploaded Documents</h4>
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="font-medium text-sm">{doc.name}</p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(doc.size)} • {new Date(doc.uploaded_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadDocument(doc)}
                  >
                    <Download className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {/* Handle delete */}}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
