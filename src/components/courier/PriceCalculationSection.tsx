import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";
import { formatCurrency } from "@/lib/currency";
import { useTranslation } from "@/contexts/TranslationContext";

interface PriceCalculation {
  distance: number;
  totalPrice: number;
  baseFee: number;
  distanceFee: number;
}

interface PriceCalculationSectionProps {
  priceCalculation: PriceCalculation | null;
  calculatingPrice: boolean;
  canCalculate: boolean;
  onCalculatePrice: () => void;
}

export function PriceCalculationSection({ 
  priceCalculation, 
  calculatingPrice, 
  canCalculate, 
  onCalculatePrice 
}: PriceCalculationSectionProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-blue-50 p-4 rounded-lg mt-4">
      <h3 className="font-bold text-blue-700 mb-2 flex items-center gap-2">
        <span role="img" aria-label="calculator">🧮</span>
        {t('courierRequest.calculation.title')}
      </h3>
      <Button
        type="button"
        onClick={onCalculatePrice}
        disabled={!canCalculate || calculatingPrice}
        className="mb-2"
      >
        {calculatingPrice ? t('courierRequest.calculation.calculating') : t('courierRequest.calculation.calculate')}
      </Button>
      {priceCalculation && (
        <div className="mt-2 text-blue-900">
          <div>{t('courierRequest.calculation.baseFee')}: {priceCalculation.baseFee.toFixed(2)} €</div>
          <div>{t('courierRequest.calculation.distanceFee')}: {priceCalculation.distanceFee.toFixed(2)} €</div>
          <div>{t('courierRequest.calculation.total')}: <b>{priceCalculation.totalPrice.toFixed(2)} €</b></div>
        </div>
      )}
    </div>
  );
}
