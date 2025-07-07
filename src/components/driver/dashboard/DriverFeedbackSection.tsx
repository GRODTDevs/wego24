import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

export function DriverFeedbackSection({ driverId }: { driverId: string }) {
  const [feedback, setFeedback] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFeedback();
    // eslint-disable-next-line
  }, [driverId]);

  const fetchFeedback = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("driver_feedback")
        .select("*")
        .eq("driver_id", driverId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      setFeedback(data || []);
    } catch (err) {
      setError("Failed to load feedback");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Feedback</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : feedback.length === 0 ? (
          <div className="text-gray-500">No feedback yet.</div>
        ) : (
          <ul className="space-y-4">
            {feedback.map((fb) => (
              <li key={fb.id} className="border-b pb-2">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-yellow-600">{fb.rating}★</span>
                  <span className="text-xs text-gray-400">{new Date(fb.created_at).toLocaleString()}</span>
                </div>
                <div className="text-gray-700">{fb.comment || "No comment"}</div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
