
import { useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useTranslation } from "@/contexts/TranslationContext";
import { CheckCircle, ArrowLeft, Truck } from "lucide-react";

const CourierSuccess = () => {
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  const sessionId = searchParams.get('session_id');

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      
      <main className="flex-1 px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {t('courierSuccess.title')}
          </h1>
          
          <p className="text-lg text-gray-600 mb-6">
            {t('courierSuccess.description')}
          </p>

          <div className="bg-green-50 p-6 rounded-lg mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Truck className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-semibold text-green-800">{t('courierSuccess.nextSteps')}</h2>
            </div>
            
            <div className="text-left space-y-3 text-green-700">
              <p>{t('courierSuccess.step1')}</p>
              <p>{t('courierSuccess.step2')}</p>
              <p>{t('courierSuccess.step3')}</p>
              <p>{t('courierSuccess.step4')}</p>
            </div>
          </div>

          {sessionId && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-gray-600">
                <strong>{t('courierSuccess.referenceId')}</strong> {sessionId}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {t('courierSuccess.keepRecord')}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button className="bg-gradient-to-r from-red-500 to-orange-400 hover:from-orange-400 hover:to-red-500 text-white flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                {t('courierSuccess.backToHome')}
              </Button>
            </Link>
            
            <Link to="/courier-request">
              <Button variant="outline" className="flex items-center gap-2">
                <Truck className="w-4 h-4" />
                {t('courierSuccess.bookAnother')}
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CourierSuccess;
