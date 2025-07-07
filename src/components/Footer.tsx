import { useTranslation } from "@/contexts/TranslationContext";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="w-full bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/999acc8c-4528-415a-85a4-1de255e2fce5.png" 
              alt="WeGo Logo" 
              className="h-8 w-auto"
            />
            <span className="text-xs font-semibold text-red-500 italic tracking-widest uppercase bg-red-50 px-2 py-1 rounded">{t('footer.beta')}</span>
          </div>
          <div className="text-sm text-gray-600">
            {t('footer.rights')}
          </div>
        </div>
      </div>
    </footer>
  );
}
