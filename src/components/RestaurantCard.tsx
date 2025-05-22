
import { Card, CardContent, CardTitle } from "@/components/ui/card";

interface RestaurantCardProps {
  name: string;
  cuisine: string;
  image: string;
  highlightColor?: "red" | "orange";
}

const gradientStyles = {
  red: "bg-white relative before:absolute before:inset-0 before:bg-gradient-radial before:from-red-100 before:via-orange-50 before:to-transparent before:opacity-80 before:rounded-lg overflow-hidden",
  orange: "bg-white relative before:absolute before:inset-0 before:bg-gradient-radial before:from-orange-100 before:via-red-50 before:to-transparent before:opacity-80 before:rounded-lg overflow-hidden"
};

export function RestaurantCard({
  name,
  cuisine,
  image,
  highlightColor = "red",
}: RestaurantCardProps) {
  return (
    <Card className={`transition-shadow hover:shadow-xl ${gradientStyles[highlightColor]} min-h-[300px]`}>
      <div className="relative z-10">
        <img
          src={image}
          alt={name}
          className="w-full h-40 object-cover rounded-t-lg"
        />
        <CardContent className="pt-4">
          <CardTitle className={`mb-1 font-semibold text-lg ${highlightColor === "red" ? "text-red-600" : "text-orange-600"}`}>
            {name}
          </CardTitle>
          <div className="text-gray-500 text-sm mb-2">{cuisine}</div>
        </CardContent>
      </div>
    </Card>
  );
}
