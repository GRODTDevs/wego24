
import { Button } from "@/components/ui/button";
import { X, Trash } from "lucide-react";

interface CartItem {
  title: string;
  price: number;
  quantity: number;
}

interface OrderCartProps {
  open: boolean;
  items: CartItem[];
  onUpdateQty: (title: string, newQty: number) => void;
  onRemove: (title: string) => void;
  onClose: () => void;
  onCheckout: () => void;
}

export function OrderCart({ open, items, onUpdateQty, onRemove, onClose, onCheckout }: OrderCartProps) {
  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex justify-end">
      <div className="w-full max-w-sm bg-white h-full shadow-xl flex flex-col animate-slide-in-right">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="text-lg font-bold text-orange-500">Your Order</h3>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close cart">
            <X />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {items.length === 0 ? (
            <div className="text-gray-500 text-center mt-10">No items in cart yet.</div>
          ) : (
            <ul className="space-y-3">
              {items.map(item => (
                <li key={item.title} className="flex items-center justify-between gap-2 border-b pb-2 last:border-0 last:pb-0">
                  <div>
                    <div className="font-medium">{item.title}</div>
                    <div className="text-gray-400 text-xs">x{item.quantity}</div>
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className="font-semibold">€{(item.price * item.quantity).toFixed(2)}</span>
                    <Button size="icon" variant="ghost" onClick={() => onUpdateQty(item.title, item.quantity - 1)} disabled={item.quantity <= 1}>
                      <Minus />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => onUpdateQty(item.title, item.quantity + 1)}>
                      <Plus />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => onRemove(item.title)}>
                      <Trash className="text-destructive" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="p-4 border-t flex flex-col gap-3">
          <div className="flex justify-between text-base font-bold">
            <span>Total</span>
            <span>€{total.toFixed(2)}</span>
          </div>
          <Button className="w-full bg-gradient-to-r from-orange-400 to-red-400 text-white" onClick={onCheckout} disabled={items.length === 0}>
            Checkout
          </Button>
        </div>
      </div>
    </div>
  );
}
