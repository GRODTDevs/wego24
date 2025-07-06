
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useTranslation } from "@/contexts/TranslationContext";
import { FileText } from "lucide-react";

interface BusinessDescriptionSectionProps {
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

export function BusinessDescriptionSection({ formData, setFormData }: BusinessDescriptionSectionProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-1 md:space-y-2">
      <Label htmlFor="description" className="flex items-center gap-2 text-gray-900 text-sm md:text-base font-medium">
        <FileText className="w-3 h-3 md:w-4 md:h-4" />
        {t('partner.register.businessDescription')}
      </Label>
      <Textarea
        id="description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        placeholder={t('partner.register.businessDescriptionPlaceholder')}
        rows={3}
        className="text-sm md:text-base min-h-[60px] md:min-h-[80px]"
      />
    </div>
  );
}
