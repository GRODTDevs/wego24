
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "@/contexts/TranslationContext";
import { Mail, Phone } from "lucide-react";

interface ContactInfoSectionProps {
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

export function ContactInfoSection({ formData, setFormData }: ContactInfoSectionProps) {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
      <div className="space-y-1 md:space-y-2">
        <Label htmlFor="email" className="flex items-center gap-2 text-gray-900 text-sm md:text-base font-medium">
          <Mail className="w-3 h-3 md:w-4 md:h-4" />
          {t('partner.register.contactEmail')} {t('partner.register.required')}
        </Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          placeholder={t('partner.register.contactEmailPlaceholder')}
          className="text-sm md:text-base h-9 md:h-10"
        />
      </div>
      
      <div className="space-y-1 md:space-y-2">
        <Label htmlFor="phone" className="flex items-center gap-2 text-gray-900 text-sm md:text-base font-medium">
          <Phone className="w-3 h-3 md:w-4 md:h-4" />
          {t('partner.register.phoneNumber')}
        </Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="+34"
          className="text-sm md:text-base h-9 md:h-10"
        />
      </div>
    </div>
  );
}
