import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/contexts/TranslationContext";

interface LocationCardProps {
  name: string;
  businessType: string;
  image: string;
  highlightColor?: "red" | "orange";
}

const gradientStyles = {
  red: "bg-white relative before:absolute before:inset-0 before:bg-gradient-radial before:from-red-100 before:via-orange-50 before:to-transparent before:opacity-80 before:rounded-lg overflow-hidden",
  orange: "bg-white relative before:absolute before:inset-0 before:bg-gradient-radial before:from-orange-100 before:via-red-50 before:to-transparent before:opacity-80 before:rounded-lg overflow-hidden"
};

export function LocationCard({
  name,
  businessType,
  image,
  highlightColor = "red",
}: LocationCardProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const handleClick = () => {
    // Encode for URL safety, but keep readable demo name
    navigate(`/location/${encodeURIComponent(name)}`);
  };

  return (
    <button
      className={`w-full text-left transition-shadow hover:shadow-xl ${gradientStyles[highlightColor]} min-h-[300px] rounded-lg overflow-hidden outline-none focus:ring-2 focus:ring-orange-300`}
      onClick={handleClick}
      aria-label={`View ${name}`}
      type="button"
    >
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
          <div className="text-gray-500 text-sm mb-2">
            {t(`locations.businessTypes.${businessType}`)}
          </div>
        </CardContent>
      </div>
    </button>
  );
}
