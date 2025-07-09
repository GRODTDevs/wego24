import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export default function AdminIssueResolutionPanel() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    supabase.from("order_issues").select("*", { count: "exact" }).order("detected_at", { ascending: false }).then(({ data }) => {
      setIssues(data || []);
      setLoading(false);
    });
  }, []);

  const resolveIssue = async (id, resolution) => {
    await supabase.from("order_issues").update({ status: "resolved", resolution, resolved_at: new Date().toISOString() }).eq("id", id);
    const { data } = await supabase.from("order_issues").select("*").order("detected_at", { ascending: false });
    setIssues(data || []);
  };

  const escalateIssue = async (id) => {
    await supabase.from("order_issues").update({ escalated: true }).eq("id", id);
    const { data } = await supabase.from("order_issues").select("*").order("detected_at", { ascending: false });
    setIssues(data || []);
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Order Issues & Automated Resolution</h2>
      {loading ? <div>Loading issues...</div> : (
        <ul>
          {issues.map(issue => (
            <li key={issue.id} className="border-b py-2">
              <div>Order #{issue.order_id} | Type: {issue.type} | Status: {issue.status}</div>
              <div>Detected: {new Date(issue.detected_at).toLocaleString()}</div>
              <div>Resolution: {issue.resolution || "-"}</div>
              <div>Escalated: {issue.escalated ? "Yes" : "No"}</div>
              <div className="flex gap-2 mt-2">
                {issue.status !== "resolved" && <Button size="sm" onClick={() => resolveIssue(issue.id, prompt("Resolution?", "refund"))}>Resolve</Button>}
                {!issue.escalated && <Button size="sm" variant="destructive" onClick={() => escalateIssue(issue.id)}>Escalate</Button>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
