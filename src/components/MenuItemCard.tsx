import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { formatCurrency } from "@/lib/currency";

interface MenuItemCardProps {
  title: string;
  description: string;
  price: number;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
}

export function MenuItemCard({ title, description, price, quantity, onAdd, onRemove }: MenuItemCardProps) {
  console.log('[MenuItemCard] props:', { title, description, price, quantity, onAdd, onRemove });

  return (
    <div className="flex flex-col gap-1 border-b last:border-b-0 pb-3 last:pb-0 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <span className="font-semibold text-gray-900">{title}</span>
          <span className="ml-3 text-gray-500 text-sm">{description}</span>
        </div>
        <span className="font-medium text-orange-500">{formatCurrency(price)}</span>
      </div>
      <div className="flex gap-2 items-center mt-2">
        <Button size="icon" variant="outline" onClick={onRemove} disabled={quantity === 0} aria-label="Remove">
          <Minus className="text-orange-400" />
        </Button>
        <span className="font-semibold">{quantity}</span>
        <Button size="icon" variant="outline" onClick={onAdd} aria-label="Add">
          <Plus className="text-red-400" />
        </Button>
      </div>
    </div>
  );
}
