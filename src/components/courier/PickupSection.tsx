
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin } from "lucide-react";
import { useTranslation } from "@/contexts/TranslationContext";

interface PickupSectionProps {
  formData: {
    pickupLocation: string;
    pickupDate: string;
    pickupTime: string;
  };
  onInputChange: (field: string, value: string) => void;
}

export function PickupSection({ formData, onInputChange }: PickupSectionProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="w-5 h-5 text-blue-500" />
        <h2 className="text-xl font-semibold text-gray-900">{t('courier.pickup.title')}</h2>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="pickupLocation">{t('courier.pickup.location')} *</Label>
          <Input
            id="pickupLocation"
            placeholder={t('courier.pickup.locationPlaceholder')}
            value={formData.pickupLocation}
            onChange={(e) => onInputChange("pickupLocation", e.target.value)}
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="pickupDate">{t('courier.pickup.date')}</Label>
            <Input
              id="pickupDate"
              type="date"
              value={formData.pickupDate}
              onChange={(e) => onInputChange("pickupDate", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="pickupTime">{t('courier.pickup.time')}</Label>
            <Input
              id="pickupTime"
              type="time"
              value={formData.pickupTime}
              onChange={(e) => onInputChange("pickupTime", e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
