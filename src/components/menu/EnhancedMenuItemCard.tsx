
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit, Trash2, Star, Clock, Users } from "lucide-react";

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
  allergens: string[];
  dietary_info: string[];
  calories: number;
}

interface EnhancedMenuItemCardProps {
  item: MenuItem;
  isSelected: boolean;
  onEdit: (item: MenuItem) => void;
  onDelete: (itemId: string) => void;
  onSelectionChange: (itemId: string, selected: boolean) => void;
}

export function EnhancedMenuItemCard({ 
  item, 
  isSelected, 
  onEdit, 
  onDelete, 
  onSelectionChange 
}: EnhancedMenuItemCardProps) {
  return (
    <Card className={`transition-all ${isSelected ? 'ring-2 ring-orange-500' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) => onSelectionChange(item.id, !!checked)}
          />
          
          {item.image_url && (
            <img
              src={item.image_url}
              alt={item.name}
              className="w-16 h-16 object-cover rounded-lg"
            />
          )}
          
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{item.name}</h3>
                  <span className="text-lg font-bold text-green-600">€{item.price}</span>
                  {item.is_featured && (
                    <div className="flex items-center gap-1 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                      <Star className="w-3 h-3" />
                      Featured
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-4 mt-1">
                  <span className={`text-xs px-2 py-1 rounded ${
                    item.status === 'available' ? 'bg-green-100 text-green-800' :
                    item.status === 'unavailable' ? 'bg-red-100 text-red-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {item.status.replace('_', ' ')}
                  </span>
                  
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    {item.preparation_time || 15} min
                  </div>
                  
                  {item.calories && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Users className="w-3 h-3" />
                      {item.calories} cal
                    </div>
                  )}
                </div>
                
                {item.description && (
                  <p className="text-gray-600 text-sm mt-2">{item.description}</p>
                )}
                
                {(item.allergens?.length > 0 || item.dietary_info?.length > 0) && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {item.dietary_info?.map((diet, index) => (
                      <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {diet}
                      </span>
                    ))}
                    {item.allergens?.map((allergen, index) => (
                      <span key={index} className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                        {allergen}
                      </span>
                    ))}
                  </div>
                )}
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
