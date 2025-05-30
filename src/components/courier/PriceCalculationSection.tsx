
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
    <div className="bg-blue-50 p-6 rounded-lg">
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">{t('courier.price.title')}</h2>
      </div>
      
      <div className="space-y-4">
        <Button
          type="button"
          onClick={onCalculatePrice}
          disabled={calculatingPrice || !canCalculate}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {calculatingPrice ? t('courier.price.calculating') : t('courier.price.calculate')}
        </Button>
        
        {priceCalculation && (
          <div className="bg-white p-4 rounded-md border">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>{t('courier.price.distance')}</span>
                <span>{priceCalculation.distance.toFixed(2)} km</span>
              </div>
              <div className="flex justify-between">
                <span>{t('courier.price.baseFee')}</span>
                <span>{formatCurrency(priceCalculation.baseFee)}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('courier.price.distanceFee')} ({formatCurrency(0.50)}/km):</span>
                <span>{formatCurrency(priceCalculation.distanceFee)}</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between font-semibold text-lg">
                <span>{t('courier.price.total')}</span>
                <span>{formatCurrency(priceCalculation.totalPrice)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
