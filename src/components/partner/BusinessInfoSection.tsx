
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from "@/contexts/TranslationContext";

interface BusinessInfoSectionProps {
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

export function BusinessInfoSection({ formData, setFormData }: BusinessInfoSectionProps) {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
      <div className="space-y-1 md:space-y-2">
        <Label htmlFor="businessName" className="text-gray-900 text-sm md:text-base font-medium">
          {t('partner.register.businessName')} {t('partner.register.required')}
        </Label>
        <Input
          id="businessName"
          value={formData.businessName}
          onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
          required
          placeholder={t('partner.register.businessNamePlaceholder')}
          className="text-sm md:text-base h-9 md:h-10"
        />
      </div>
      
      <div className="space-y-1 md:space-y-2">
        <Label htmlFor="businessType" className="text-gray-900 text-sm md:text-base font-medium">
          {t('partner.register.businessType')} {t('partner.register.required')}
        </Label>
        <Select
          value={formData.businessType}
          onValueChange={(value) => setFormData({ ...formData, businessType: value })}
          required
        >
          <SelectTrigger className="text-sm md:text-base h-9 md:h-10">
            <SelectValue placeholder={t('partner.register.selectBusinessType')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="restaurant">{t('locations.businessTypes.restaurant')}</SelectItem>
            <SelectItem value="cafe">{t('locations.businessTypes.cafe')}</SelectItem>
            <SelectItem value="bakery">{t('locations.businessTypes.bakery')}</SelectItem>
            <SelectItem value="fast_food">{t('locations.businessTypes.fastFood')}</SelectItem>
            <SelectItem value="grocery">{t('locations.businessTypes.grocery')}</SelectItem>
            <SelectItem value="pharmacy">{t('locations.businessTypes.pharmacy')}</SelectItem>
            <SelectItem value="retail">{t('locations.businessTypes.retail')}</SelectItem>
            <SelectItem value="other">{t('locations.businessTypes.other')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
