import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Edit, Trash2 } from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  status: 'available' | 'unavailable' | 'out_of_stock';
  category_id: string;
  image_url: string;
  is_featured: boolean;
  preparation_time: number;
}

interface MenuItemCardProps {
  item: MenuItem;
  onEdit: (item: MenuItem) => void;
  onDelete: (itemId: string) => void;
}

export function MenuItemCard({ item, onEdit, onDelete }: MenuItemCardProps) {
  console.log('[MenuItemCard] props:', { item, onEdit, onDelete });

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{item.name}</h3>
              <span className="text-lg font-bold text-green-600">€{item.price}</span>
              {item.is_featured && (
                <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                  Featured
                </span>
              )}
              <span className={`text-xs px-2 py-1 rounded ${
                item.status === 'available' ? 'bg-green-100 text-green-800' :
                item.status === 'unavailable' ? 'bg-red-100 text-red-800' :
                'bg-orange-100 text-orange-800'
              }`}>
                {item.status.replace('_', ' ')}
              </span>
            </div>
            {item.description && (
              <p className="text-gray-600 text-sm mt-1">{item.description}</p>
            )}
            <p className="text-gray-500 text-xs mt-1">
              Prep time: {item.preparation_time || 15} minutes
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(item)}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(item.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
