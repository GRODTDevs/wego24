
import { FileUpload } from "./FileUpload";

interface RestaurantImageUploadProps {
  restaurantId: string;
  currentImageUrl?: string;
  onImageUploaded: (url: string) => void;
  onImageRemoved: () => void;
  imageType: 'main' | 'banner' | 'gallery';
}

export function RestaurantImageUpload({ 
  restaurantId,
  currentImageUrl, 
  onImageUploaded, 
  onImageRemoved,
  imageType
}: RestaurantImageUploadProps) {
  const getLabel = () => {
    switch (imageType) {
      case 'main':
        return 'Restaurant Main Image';
      case 'banner':
        return 'Restaurant Banner';
      case 'gallery':
        return 'Gallery Image';
      default:
        return 'Restaurant Image';
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">{getLabel()}</label>
      <FileUpload
        bucketName="restaurant-images"
        folder={`restaurants/${restaurantId}/${imageType}`}
        currentFileUrl={currentImageUrl}
        onFileUploaded={(url) => onImageUploaded(url)}
        onFileRemoved={onImageRemoved}
        uploadType="image"
        maxSize={10}
        showPreview={true}
      />
    </div>
  );
}
