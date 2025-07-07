
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
    <div className="bg-blue-50 p-4 sm:p-6 rounded-lg shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">{t('courier.price.title')}</h2>
      </div>
      
      <div className="space-y-4">
        <Button
          type="button"
          onClick={onCalculatePrice}
          disabled={calculatingPrice || !canCalculate}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 min-h-[44px]"
        >
          {calculatingPrice ? t('courier.price.calculating') : t('courier.price.calculate')}
        </Button>
        
        {priceCalculation && (
          <div className="bg-white p-3 sm:p-4 rounded-md border shadow-sm">
            <div className="space-y-2 text-sm sm:text-base">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">{t('courier.price.distance')}</span>
                <span className="font-medium">{priceCalculation.distance.toFixed(2)} km</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">{t('courier.price.baseFee')}</span>
                <span className="font-medium">{formatCurrency(priceCalculation.baseFee)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">{t('courier.price.distanceFee')} ({formatCurrency(0.75)}/km):</span>
                <span className="font-medium">{formatCurrency(priceCalculation.distanceFee)}</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between items-center font-semibold text-base sm:text-lg">
                <span className="text-gray-900">{t('courier.price.total')}</span>
                <span className="text-green-600">{formatCurrency(priceCalculation.totalPrice)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
