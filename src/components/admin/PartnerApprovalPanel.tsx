import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export function PartnerApprovalPanel() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPartners = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("partners").select("*").eq("status", "pending");
      if (!error) {
        setPartners(data);
      }
      setLoading(false);
    };
    fetchPartners();
  }, []);

  const handleApproval = async (id, status) => {
    // Approve application and create partner
    const { error: approveError } = await supabase.rpc('create_partner_from_application', {
      app_id: id
    });
    if (approveError) {
      setError(t('error.approvePartner', { details: approveError.message }));
      setLoading(false);
      return;
    }
    setPartners(partners.filter((partner) => partner.id !== id));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Pending Partner Approvals</h1>
      {partners.map((partner) => (
        <div key={partner.id}>
          <p>{partner.businessName}</p>
          <Button onClick={() => handleApproval(partner.id, "approved")}>Approve</Button>
          <Button onClick={() => handleApproval(partner.id, "rejected")}>Reject</Button>
        </div>
      ))}
    </div>
  );
}
