
import { FileUpload } from "./FileUpload";

interface ProfilePictureUploadProps {
  currentAvatarUrl?: string;
  onAvatarUploaded: (url: string) => void;
  onAvatarRemoved: () => void;
}

export function ProfilePictureUpload({ 
  currentAvatarUrl, 
  onAvatarUploaded, 
  onAvatarRemoved 
}: ProfilePictureUploadProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">Profile Picture</label>
      <FileUpload
        bucketName="avatars"
        folder="profiles"
        currentFileUrl={currentAvatarUrl}
        onFileUploaded={(url) => onAvatarUploaded(url)}
        onFileRemoved={onAvatarRemoved}
        uploadType="avatar"
        maxSize={2}
        showPreview={true}
      />
    </div>
  );
}
