import { useState } from "react";
import { useTranslation } from "@/contexts/TranslationContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Building2, Mail, Phone, MapPin, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export function PartnerRegisterForm() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    businessName: "",
    businessType: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const { error: dbError } = await supabase.from("partners").insert([formData]);
      if (dbError) {
        setError(t("error.general"));
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError(t("error.network"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-white bg-opacity-90 backdrop-blur-sm border-0 shadow-2xl">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-gray-900 text-lg md:text-xl">
          <Building2 className="w-5 h-5 md:w-6 md:h-6" />
          {t('partner.register.form.title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <div className="space-y-1 md:space-y-2">
              <Label htmlFor="businessName" className="text-gray-900 text-sm md:text-base font-medium">{t('partner.register.businessName')} {t('partner.register.required')}</Label>
              <Input
                id="businessName"
                value={formData.businessName}
                onChange={e => setFormData({ ...formData, businessName: e.target.value })}
                required
                placeholder={t('partner.register.businessNamePlaceholder')}
                className="text-sm md:text-base h-9 md:h-10"
              />
            </div>
            <div className="space-y-1 md:space-y-2">
              <Label htmlFor="businessType" className="text-gray-900 text-sm md:text-base font-medium">{t('partner.register.businessType')} {t('partner.register.required')}</Label>
              <Select
                value={formData.businessType}
                onValueChange={value => setFormData({ ...formData, businessType: value })}
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
                onChange={e => setFormData({ ...formData, email: e.target.value })}
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
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+34"
                className="text-sm md:text-base h-9 md:h-10"
              />
            </div>
          </div>
          <div className="space-y-1 md:space-y-2">
            <Label htmlFor="address" className="flex items-center gap-2 text-gray-900 text-sm md:text-base font-medium">
              <MapPin className="w-3 h-3 md:w-4 md:h-4" />
              {t('partner.register.businessAddress')} {t('partner.register.required')}
            </Label>
            <Input
              id="address"
              value={formData.address}
              onChange={e => setFormData({ ...formData, address: e.target.value })}
              required
              placeholder={t('partner.register.businessAddressPlaceholder')}
              className="text-sm md:text-base h-9 md:h-10"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <div className="space-y-1 md:space-y-2">
              <Label htmlFor="city" className="text-gray-900 text-sm md:text-base font-medium">{t('partner.register.city')} {t('partner.register.required')}</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={e => setFormData({ ...formData, city: e.target.value })}
                required
                placeholder={t('partner.register.cityPlaceholder')}
                className="text-sm md:text-base h-9 md:h-10"
              />
            </div>
            <div className="space-y-1 md:space-y-2">
              <Label htmlFor="postalCode" className="text-gray-900 text-sm md:text-base font-medium">{t('partner.register.postalCode')}</Label>
              <Input
                id="postalCode"
                value={formData.postalCode}
                onChange={e => setFormData({ ...formData, postalCode: e.target.value })}
                placeholder={t('partner.register.postalCodePlaceholder')}
                className="text-sm md:text-base h-9 md:h-10"
              />
            </div>
          </div>
          <div className="space-y-1 md:space-y-2">
            <Label htmlFor="description" className="flex items-center gap-2 text-gray-900 text-sm md:text-base font-medium">
              <FileText className="w-3 h-3 md:w-4 md:h-4" />
              {t('partner.register.businessDescription')}
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder={t('partner.register.businessDescriptionPlaceholder')}
              rows={3}
              className="text-sm md:text-base min-h-[60px] md:min-h-[80px]"
            />
          </div>
          <div className="bg-blue-50 p-3 md:p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-1 md:mb-2 text-sm md:text-base">{t('partner.register.nextSteps')}</h3>
            <ul className="text-xs md:text-sm text-blue-800 space-y-0.5 md:space-y-1">
              <li>{t('partner.register.step1')}</li>
              <li>{t('partner.register.step2')}</li>
              <li>{t('partner.register.step3')}</li>
              <li>{t('partner.register.step4')}</li>
            </ul>
          </div>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-red-500 to-orange-400 hover:from-orange-400 hover:to-red-500 text-sm md:text-base py-2 md:py-3 h-9 md:h-auto"
            disabled={loading}
          >
            {loading ? t('partner.register.submitting') : t('partner.register.submit')}
          </Button>
          {success && <div className="text-green-600 text-center font-semibold mt-4">{t('success.saved')}</div>}
          {error && <div className="text-red-600 text-center font-semibold mt-4">{error}</div>}
        </form>
      </CardContent>
    </Card>
  );
}
