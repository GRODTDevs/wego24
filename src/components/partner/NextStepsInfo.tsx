
import { useTranslation } from "@/contexts/TranslationContext";

export function NextStepsInfo() {
  const { t } = useTranslation();

  return (
    <div className="bg-blue-50 p-3 md:p-4 rounded-lg">
      <h3 className="font-semibold text-blue-900 mb-1 md:mb-2 text-sm md:text-base">
        {t('partner.register.nextSteps')}
      </h3>
      <ul className="text-xs md:text-sm text-blue-800 space-y-0.5 md:space-y-1">
        <li>{t('partner.register.step1')}</li>
        <li>{t('partner.register.step2')}</li>
        <li>{t('partner.register.step3')}</li>
        <li>{t('partner.register.step4')}</li>
      </ul>
    </div>
  );
}
