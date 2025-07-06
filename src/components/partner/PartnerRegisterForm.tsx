
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "@/contexts/TranslationContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Building2 } from "lucide-react";
import { BusinessInfoSection } from "./BusinessInfoSection";
import { ContactInfoSection } from "./ContactInfoSection";
import { LocationInfoSection } from "./LocationInfoSection";
import { BusinessDescriptionSection } from "./BusinessDescriptionSection";
import { NextStepsInfo } from "./NextStepsInfo";

export function PartnerRegisterForm() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    businessName: "",
    businessType: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    description: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("You must be logged in to submit an application");
      navigate("/auth");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from("partner_applications")
        .insert({
          user_id: user.id,
          business_name: formData.businessName,
          business_type: formData.businessType,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          postal_code: formData.postalCode,
          description: formData.description
        });

      if (error) throw error;

      toast.success("Partner application submitted successfully! We'll review your application and get back to you soon.");
      navigate("/");
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-white bg-opacity-90 backdrop-blur-sm border-0 shadow-2xl">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-gray-900 text-lg md:text-xl">
          <Building2 className="w-5 h-5 md:w-6 md:h-6" />
          {t('partner.register.form.title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          <BusinessInfoSection formData={formData} setFormData={setFormData} />
          <ContactInfoSection formData={formData} setFormData={setFormData} />
          <LocationInfoSection formData={formData} setFormData={setFormData} />
          <BusinessDescriptionSection formData={formData} setFormData={setFormData} />
          <NextStepsInfo />
          
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-red-500 to-orange-400 hover:from-orange-400 hover:to-red-500 text-sm md:text-base py-2 md:py-3 h-9 md:h-auto"
            disabled={loading}
          >
            {loading ? t('partner.register.submitting') : t('partner.register.submit')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
