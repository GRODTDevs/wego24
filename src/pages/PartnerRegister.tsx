
import { useTranslation } from "@/contexts/TranslationContext";
import { PartnerRegisterForm } from "@/components/partner/PartnerRegisterForm";

const PartnerRegister = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('partner.register.title')}
            </h1>
            <p className="text-lg text-gray-600">
              {t('partner.register.subtitle')}
            </p>
          </div>
          <PartnerRegisterForm />
        </div>
      </div>
    </div>
  );
};

export default PartnerRegister;
