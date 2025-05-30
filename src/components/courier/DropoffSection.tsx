
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin } from "lucide-react";
import { useTranslation } from "@/contexts/TranslationContext";

interface DropoffSectionProps {
  formData: {
    dropoffLocation: string;
    dropoffDate: string;
    dropoffTime: string;
  };
  onInputChange: (field: string, value: string) => void;
}

export function DropoffSection({ formData, onInputChange }: DropoffSectionProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="w-5 h-5 text-red-500" />
        <h2 className="text-xl font-semibold text-gray-900">{t('courier.dropoff.title')}</h2>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="dropoffLocation">{t('courier.dropoff.location')} *</Label>
          <Input
            id="dropoffLocation"
            placeholder={t('courier.dropoff.locationPlaceholder')}
            value={formData.dropoffLocation}
            onChange={(e) => onInputChange("dropoffLocation", e.target.value)}
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="dropoffDate">{t('courier.dropoff.date')}</Label>
            <Input
              id="dropoffDate"
              type="date"
              value={formData.dropoffDate}
              onChange={(e) => onInputChange("dropoffDate", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="dropoffTime">{t('courier.dropoff.time')}</Label>
            <Input
              id="dropoffTime"
              type="time"
              value={formData.dropoffTime}
              onChange={(e) => onInputChange("dropoffTime", e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
