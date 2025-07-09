
import SecureAdminPartnerApiKeysPanel from "./SecureAdminPartnerApiKeysPanel";

interface AdminPartnerApiKeysPanelProps {
  partnerId: string;
}

export default function AdminPartnerApiKeysPanel({ partnerId }: AdminPartnerApiKeysPanelProps) {
  return <SecureAdminPartnerApiKeysPanel partnerId={partnerId} />;
}
