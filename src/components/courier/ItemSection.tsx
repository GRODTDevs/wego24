
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Package } from "lucide-react";
import { useTranslation } from "@/contexts/TranslationContext";

interface ItemSectionProps {
  formData: {
    itemDescription: string;
    itemSize: string;
    itemWeight: string;
  };
  onInputChange: (field: string, value: string) => void;
}

export function ItemSection({ formData, onInputChange }: ItemSectionProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <div className="flex items-center gap-2 mb-4">
        <Package className="w-5 h-5 text-orange-500" />
        <h2 className="text-xl font-semibold text-gray-900">{t('courier.item.title')}</h2>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="itemDescription">{t('courier.item.description')} *</Label>
          <Textarea
            id="itemDescription"
            placeholder={t('courier.item.descriptionPlaceholder')}
            value={formData.itemDescription}
            onChange={(e) => onInputChange("itemDescription", e.target.value)}
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="itemSize">{t('courier.item.size')}</Label>
            <Input
              id="itemSize"
              placeholder={t('courier.item.sizePlaceholder')}
              value={formData.itemSize}
              onChange={(e) => onInputChange("itemSize", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="itemWeight">{t('courier.item.weight')}</Label>
            <Input
              id="itemWeight"
              placeholder={t('courier.item.weightPlaceholder')}
              value={formData.itemWeight}
              onChange={(e) => onInputChange("itemWeight", e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
