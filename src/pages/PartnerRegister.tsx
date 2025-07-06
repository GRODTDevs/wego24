
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useTranslation } from "@/contexts/TranslationContext";
import { PartnerRegisterForm } from "@/components/partner/PartnerRegisterForm";

export default function PartnerRegister() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main 
        className="flex-1 py-6 md:py-12 relative bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('/lovable-uploads/363cf1fe-e5d2-4476-ade0-61691f9e5f58.png')` }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        
        <div className="max-w-2xl mx-auto px-4 relative z-10">
          <div className="text-center mb-4 md:mb-8">
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 md:mb-4">
              {t('partner.register.title')}
            </h1>
            <p className="text-white text-sm md:text-lg">
              {t('partner.register.subtitle')}
            </p>
          </div>

          <PartnerRegisterForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
