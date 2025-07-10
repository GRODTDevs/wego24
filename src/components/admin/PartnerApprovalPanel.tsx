import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export function PartnerApprovalPanel() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    setLoading(true);
    setError(null);
    // 1. Update application status
    const { error: updateError } = await supabase.from("partner_applications").update({ status }).eq("id", id);
    if (updateError) {
      setError(`Failed to update application status: ${updateError.message}`);
      setLoading(false);
      return;
    }
    // 2. If approved, create partner
    if (status === "approved") {
      const { error: approveError, data: partnerResult } = await supabase.rpc('create_restaurant_from_application', {
        app_id: id // <-- must match the SQL function parameter name
      });
      if (approveError) {
        setError(`Failed to create partner: ${approveError.message}`);
        setLoading(false);
        return;
      }
      if (typeof window !== 'undefined') {
        console.log('[PartnerApprovalPanel] create_partner_from_application result:', partnerResult);
      }
    }
    // 3. Refresh list
    setPartners(partners.filter((partner) => partner.id !== id));
    setLoading(false);
  };
  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Pending Partner Approvals</h1>
      {error && <div style={{ color: "red" }}>{error}</div>}
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

