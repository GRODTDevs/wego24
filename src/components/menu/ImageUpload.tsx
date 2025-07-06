
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload, X, Image as ImageIcon } from "lucide-react";

interface ImageUploadProps {
  currentImageUrl?: string;
  onImageUploaded: (url: string) => void;
  onImageRemoved: () => void;
}

export function ImageUpload({ currentImageUrl, onImageUploaded, onImageRemoved }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);

  const uploadImage = async (file: File) => {
    try {
      setUploading(true);
      
      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `menu-items/${fileName}`;

      // Upload file
      const { error: uploadError } = await supabase.storage
        .from('menu-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase.storage
        .from('menu-images')
        .getPublicUrl(filePath);

      const imageUrl = data.publicUrl;
      setPreviewUrl(imageUrl);
      onImageUploaded(imageUrl);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    uploadImage(file);
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    onImageRemoved();
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">Menu Item Image</label>
      
      {previewUrl ? (
        <div className="relative inline-block">
          <img
            src={previewUrl}
            alt="Menu item preview"
            className="w-32 h-32 object-cover rounded-lg border"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
            onClick={handleRemoveImage}
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      ) : (
        <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
          <ImageIcon className="w-8 h-8 text-gray-400" />
        </div>
      )}

      <div>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          id="image-upload"
          disabled={uploading}
        />
        <label htmlFor="image-upload">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={uploading}
            asChild
          >
            <span className="cursor-pointer">
              <Upload className="w-4 h-4 mr-2" />
              {uploading ? 'Uploading...' : 'Upload Image'}
            </span>
          </Button>
        </label>
      </div>
    </div>
  );
}
