
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { validateFileUpload, logSecurityEvent } from "@/utils/securityUtils";
import { supabase } from "@/integrations/supabase/client";

interface SecureFileUploadProps {
  onUploadComplete: (url: string) => void;
  bucket: string;
  accept?: string;
  maxSize?: number;
}

export function SecureFileUpload({ 
  onUploadComplete, 
  bucket, 
  accept = "image/*,.pdf,.txt",
  maxSize = 10 * 1024 * 1024 
}: SecureFileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);

      // Validate file before upload
      const validation = validateFileUpload(file);
      if (!validation.valid) {
        toast({
          title: "Upload Error",
          description: validation.error,
          variant: "destructive"
        });
        
        // Log suspicious file upload attempt
        await logSecurityEvent(
          'suspicious_file_upload',
          'file_upload',
          undefined,
          { 
            filename: file.name, 
            file_type: file.type,
            file_size: file.size,
            error: validation.error
          }
        );
        return;
      }

      // Generate secure filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      // Log successful upload
      await logSecurityEvent(
        'file_uploaded',
        'file_upload',
        data.path,
        { 
          original_filename: file.name,
          stored_filename: fileName,
          file_type: file.type,
          file_size: file.size,
          bucket: bucket
        }
      );

      onUploadComplete(publicUrl);
      
      toast({
        title: "Success",
        description: "File uploaded successfully",
      });

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your file",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
      // Clear the input
      event.target.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <Input
        type="file"
        accept={accept}
        onChange={handleFileUpload}
        disabled={uploading}
        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
      />
      {uploading && (
        <div className="text-sm text-gray-500">
          Uploading and validating file...
        </div>
      )}
    </div>
  );
}
