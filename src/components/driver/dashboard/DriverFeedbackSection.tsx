import React, { useEffect, useState } from "react";
import { Reviews } from "@/integrations/supabase/database.types";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

interface DriverFeedbackSectionProps {
  driverId: string;
}

export const DriverFeedbackSection: React.FC<DriverFeedbackSectionProps> = ({ driverId }) => {
  const [feedback, setFeedback] = useState<Reviews[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!driverId) { setLoading(false); return; }
    fetchFeedback();
  }, [driverId]);

  const fetchFeedback = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("driver_id", driverId)
      .order("created_at", { ascending: false });
    if (!error && data) { setFeedback(data); }
    setLoading(false);
  };

  if (loading) {
    return <div className="p-4">Loading feedback...</div>;
  }

  return (
    <div className="p-4 bg-white rounded shadow border border-gray-100">
      <h2 className="text-lg font-semibold mb-2">Driver Feedback</h2>
      {feedback.length === 0 ? (
        <p className="text-gray-600">No feedback yet for this driver.</p>
      ) : (
        <div className="space-y-3">
          {feedback.map((review) => (
            <Card key={review.id} className="border border-gray-200">
              <CardContent className="flex flex-col gap-1 p-3">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <span className="font-semibold">{review.rating}/5</span>
                  <span className="text-xs text-gray-400 ml-2">{review.created_at ? new Date(review.created_at).toLocaleDateString() : ''}</span>
                </div>
                {review.comment && <div className="text-gray-700 text-sm mt-1">{review.comment}</div>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
