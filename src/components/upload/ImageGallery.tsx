
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { FileUpload } from "./FileUpload";
import { X, Plus, Eye } from "lucide-react";

interface GalleryImage {
  id: string;
  url: string;
  caption?: string;
  order: number;
}

interface ImageGalleryProps {
  entityId: string;
  entityType: 'restaurant' | 'menu_item';
  images: GalleryImage[];
  onImagesChange: () => void;
  maxImages?: number;
}

export function ImageGallery({ 
  entityId, 
  entityType, 
  images, 
  onImagesChange,
  maxImages = 10 
}: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageUploaded = (url: string, fileName: string) => {
    // Here you would save to database
    onImagesChange();
  };

  const handleImageRemoved = (imageId: string) => {
    // Here you would remove from database
    onImagesChange();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Image Gallery</h3>
        <span className="text-sm text-gray-500">
          {images.length} / {maxImages} images
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((image) => (
          <div key={image.id} className="relative group">
            <img
              src={image.url}
              alt={image.caption || `Gallery image ${image.order}`}
              className="w-full h-24 object-cover rounded-lg border"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setSelectedImage(image.url)}
                    >
                      <Eye className="w-3 h-3" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <img
                      src={selectedImage || ''}
                      alt="Gallery preview"
                      className="w-full h-auto max-h-[80vh] object-contain"
                    />
                  </DialogContent>
                </Dialog>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleImageRemoved(image.id)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        ))}

        {images.length < maxImages && (
          <div className="border-2 border-dashed border-gray-300 rounded-lg h-24 flex items-center justify-center">
            <FileUpload
              bucketName={`${entityType}-images`}
              folder={`${entityType}/${entityId}/gallery`}
              onFileUploaded={handleImageUploaded}
              onFileRemoved={() => {}}
              uploadType="image"
              showPreview={false}
            />
          </div>
        )}
      </div>
    </div>
  );
}
