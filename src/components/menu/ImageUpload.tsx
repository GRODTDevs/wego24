
import { FileUpload } from "../upload/FileUpload";

interface ImageUploadProps {
  currentImageUrl?: string;
  onImageUploaded: (url: string) => void;
  onImageRemoved: () => void;
}

export function ImageUpload({ currentImageUrl, onImageUploaded, onImageRemoved }: ImageUploadProps) {
  return (
    <FileUpload
      bucketName="menu-images"
      folder="menu-items"
      currentFileUrl={currentImageUrl}
      onFileUploaded={(url) => onImageUploaded(url)}
      onFileRemoved={onImageRemoved}
      uploadType="image"
      maxSize={5}
      showPreview={true}
    />
  );
}
