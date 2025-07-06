
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UseFileUploadProps {
  bucketName: string;
  folder?: string;
  maxSize?: number;
  allowedTypes?: string[];
}

export function useFileUpload({ 
  bucketName, 
  folder = '', 
  maxSize = 5, 
  allowedTypes = [] 
}: UseFileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const validateFile = (file: File): boolean => {
    // Size validation
    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`File size must be less than ${maxSize}MB`);
      return false;
    }

    // Type validation
    if (allowedTypes.length > 0) {
      const isValidType = allowedTypes.some(type => {
        if (type.startsWith('.')) {
          return file.name.toLowerCase().endsWith(type.toLowerCase());
        }
        return file.type.includes(type);
      });

      if (!isValidType) {
        toast.error(`File type not allowed. Allowed types: ${allowedTypes.join(', ')}`);
        return false;
      }
    }

    return true;
  };

  const uploadFile = async (file: File): Promise<string | null> => {
    if (!validateFile(file)) return null;

    try {
      setUploading(true);
      setUploadProgress(0);

      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = folder ? `${folder}/${fileName}` : fileName;

      // Simulate progress for better UX
      setUploadProgress(30);

      // Upload file
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      setUploadProgress(80);

      // Get public URL
      const { data } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      setUploadProgress(100);
      toast.success('File uploaded successfully');
      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file');
      return null;
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const deleteFile = async (filePath: string): Promise<boolean> => {
    try {
      const { error } = await supabase.storage
        .from(bucketName)
        .remove([filePath]);

      if (error) throw error;

      toast.success('File deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error('Failed to delete file');
      return false;
    }
  };

  return {
    uploadFile,
    deleteFile,
    uploading,
    uploadProgress
  };
}
