
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "@/contexts/TranslationContext";
import { MapPin } from "lucide-react";

interface LocationInfoSectionProps {
  formData: {
    businessName: string;
    businessType: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    description: string;
  };
  setFormData: (data: any) => void;
}

export function LocationInfoSection({ formData, setFormData }: LocationInfoSectionProps) {
  const { t } = useTranslation();

  return (
    <>
      <div className="space-y-1 md:space-y-2">
        <Label htmlFor="address" className="flex items-center gap-2 text-gray-900 text-sm md:text-base font-medium">
          <MapPin className="w-3 h-3 md:w-4 md:h-4" />
          {t('partner.register.businessAddress')} {t('partner.register.required')}
        </Label>
        <Input
          id="address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          required
          placeholder={t('partner.register.businessAddressPlaceholder')}
          className="text-sm md:text-base h-9 md:h-10"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        <div className="space-y-1 md:space-y-2">
          <Label htmlFor="city" className="text-gray-900 text-sm md:text-base font-medium">
            {t('partner.register.city')} {t('partner.register.required')}
          </Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            required
            placeholder={t('partner.register.cityPlaceholder')}
            className="text-sm md:text-base h-9 md:h-10"
          />
        </div>
        
        <div className="space-y-1 md:space-y-2">
          <Label htmlFor="postalCode" className="text-gray-900 text-sm md:text-base font-medium">
            {t('partner.register.postalCode')}
          </Label>
          <Input
            id="postalCode"
            value={formData.postalCode}
            onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
            placeholder={t('partner.register.postalCodePlaceholder')}
            className="text-sm md:text-base h-9 md:h-10"
          />
        </div>
      </div>
    </>
  );
}
