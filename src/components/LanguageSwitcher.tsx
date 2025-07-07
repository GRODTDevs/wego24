
import { useTranslation } from '@/contexts/TranslationContext';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useTranslation();

  const getLanguageDisplay = (lang: string) => {
    switch (lang) {
      case 'en': return 'EN';
      case 'es': return 'ES';
      case 'fr': return 'FR';
      default: return 'EN';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="text-gray-700 hover:text-gray-900 hover:bg-gray-100">
          <Globe className="h-4 w-4 mr-2" />
          {getLanguageDisplay(language)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setLanguage('en')}>
          English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage('es')}>
          Español
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage('fr')}>
          Français
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
