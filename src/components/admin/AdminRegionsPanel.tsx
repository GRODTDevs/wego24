import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export default function AdminRegionsPanel() {
  const [regions, setRegions] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    supabase.from("regions").select("*").then(({ data }) => {
      setRegions(data || []);
      setLoading(false);
    });
  }, []);

  const addRegion = async () => {
    if (!name.trim()) {
      return;
    }
    await supabase.from("regions").insert({ name });
    setName("");
    const { data } = await supabase.from("regions").select("*");
    setRegions(data || []);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Regions</h2>
      <div className="mb-4 flex gap-2">
        <input
          className="border px-2 py-1 flex-1"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Add new region name..."
        />
        <Button onClick={addRegion}>Add</Button>
      </div>
      {loading ? <div>Loading regions...</div> : (
        <ul>
          {regions.map(region => (
            <li key={region.id} className="border-b py-2 flex justify-between items-center">
              <span>{region.name}</span>
              <span className={region.active ? "text-green-600" : "text-gray-400"}>{region.active ? "Active" : "Inactive"}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
