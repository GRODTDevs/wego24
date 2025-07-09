import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/admin/Breadcrumbs";

export function PartnersManagementPanel() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchPartners = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("partners").select("id, name, email, address, is_demo, created_at");
      if (error) {
        setError(error.message);
      } else {
        setPartners(data);
      }
      setLoading(false);
    };
    fetchPartners();
  }, []);

  const filteredPartners = partners.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <Breadcrumbs />
      <h1 className="text-2xl font-bold mb-4">Partners Management</h1>
      <input
        type="text"
        placeholder="Search by name or email"
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="mb-4 p-2 border rounded w-full max-w-md"
      />
      {loading ? (
        <div>Loading partners...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <table className="w-full border mt-2">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Address</th>
              <th className="p-2 border">Created</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPartners.map((partner) => (
              <tr key={partner.id}>
                <td className="p-2 border">{partner.name}</td>
                <td className="p-2 border">{partner.email}</td>
                <td className="p-2 border">{partner.address}</td>
                <td className="p-2 border">{partner.created_at?.slice(0,10)}</td>
                <td className="p-2 border">
                  <Button size="sm" variant="outline">View</Button>
                  {/* Add more actions as needed */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
