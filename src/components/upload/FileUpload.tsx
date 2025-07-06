
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload, X, File, Image as ImageIcon, FileText } from "lucide-react";

interface FileUploadProps {
  bucketName: string;
  folder?: string;
  currentFileUrl?: string;
  onFileUploaded: (url: string, fileName: string) => void;
  onFileRemoved: () => void;
  acceptedTypes?: string;
  maxSize?: number; // in MB
  multiple?: boolean;
  showPreview?: boolean;
  uploadType: 'image' | 'document' | 'avatar';
}

export function FileUpload({ 
  bucketName,
  folder = '',
  currentFileUrl, 
  onFileUploaded, 
  onFileRemoved,
  acceptedTypes = "*",
  maxSize = 5,
  multiple = false,
  showPreview = true,
  uploadType
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentFileUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getAcceptedTypes = () => {
    if (acceptedTypes !== "*") return acceptedTypes;
    
    switch (uploadType) {
      case 'image':
      case 'avatar':
        return "image/*";
      case 'document':
        return ".pdf,.doc,.docx,.txt,.csv,.xlsx";
      default:
        return "*";
    }
  };

  const validateFile = (file: File): boolean => {
    // Size validation
    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`File size must be less than ${maxSize}MB`);
      return false;
    }

    // Type validation for images
    if ((uploadType === 'image' || uploadType === 'avatar') && !file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return false;
    }

    return true;
  };

  const uploadFile = async (file: File) => {
    if (!validateFile(file)) return;

    try {
      setUploading(true);
      
      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = folder ? `${folder}/${fileName}` : fileName;

      // Upload file
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      const fileUrl = data.publicUrl;
      
      if (uploadType === 'image' || uploadType === 'avatar') {
        setPreviewUrl(fileUrl);
      }
      
      onFileUploaded(fileUrl, file.name);
      toast.success('File uploaded successfully');
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    if (multiple) {
      Array.from(files).forEach(uploadFile);
    } else {
      uploadFile(files[0]);
    }
  };

  const handleRemoveFile = async () => {
    if (currentFileUrl) {
      try {
        // Extract file path from URL for deletion
        const urlParts = currentFileUrl.split('/');
        const fileName = urlParts[urlParts.length - 1];
        const filePath = folder ? `${folder}/${fileName}` : fileName;
        
        await supabase.storage
          .from(bucketName)
          .remove([filePath]);
      } catch (error) {
        console.error('Error deleting file:', error);
      }
    }
    
    setPreviewUrl(null);
    onFileRemoved();
  };

  const getFileIcon = () => {
    switch (uploadType) {
      case 'image':
      case 'avatar':
        return <ImageIcon className="w-8 h-8 text-gray-400" />;
      case 'document':
        return <FileText className="w-8 h-8 text-gray-400" />;
      default:
        return <File className="w-8 h-8 text-gray-400" />;
    }
  };

  const renderPreview = () => {
    if (!showPreview || !previewUrl) return null;

    if (uploadType === 'image' || uploadType === 'avatar') {
      return (
        <div className="relative inline-block">
          <img
            src={previewUrl}
            alt="Preview"
            className={`object-cover rounded-lg border ${
              uploadType === 'avatar' ? 'w-24 h-24 rounded-full' : 'w-32 h-32'
            }`}
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
            onClick={handleRemoveFile}
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2 p-2 border rounded-lg">
        <FileText className="w-4 h-4" />
        <span className="text-sm truncate flex-1">File uploaded</span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleRemoveFile}
        >
          <X className="w-3 h-3" />
        </Button>
      </div>
    );
  };

  return (
    <div className="space-y-2">
      {previewUrl && showPreview ? (
        renderPreview()
      ) : (
        <div className={`border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center ${
          uploadType === 'avatar' ? 'w-24 h-24 rounded-full' : 'w-32 h-32'
        }`}>
          {getFileIcon()}
        </div>
      )}

      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept={getAcceptedTypes()}
          onChange={handleFileSelect}
          className="hidden"
          multiple={multiple}
          disabled={uploading}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-4 h-4 mr-2" />
          {uploading ? 'Uploading...' : `Upload ${uploadType}`}
        </Button>
      </div>
    </div>
  );
}
