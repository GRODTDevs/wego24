import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "@/contexts/TranslationContext";

export function AdminDriverManagement() {
  const { t } = useTranslation();
  const [availability, setAvailability] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Fetch all driver availability
      const { data: availData } = await supabase
        .from("driver_availability")
        .select("*, drivers(name, email)");
      setAvailability(availData || []);
      // Fetch all driver feedback
      const { data: feedbackData } = await supabase
        .from("driver_feedback")
        .select("*, drivers(name, email)")
        .order("created_at", { ascending: false });
      setFeedback(feedbackData || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <div>{t("dashboard.loading")}</div>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">{t("dashboard.driverSchedules")}</h2>
      <table className="w-full mb-8">
        <thead>
          <tr>
            <th>{t("dashboard.driver")}</th>
            <th>{t("dashboard.dayOfWeek")}</th>
            <th>{t("dashboard.startTime")}</th>
            <th>{t("dashboard.endTime")}</th>
          </tr>
        </thead>
        <tbody>
          {availability.map((a) => (
            <tr key={a.id}>
              <td>{a.drivers?.name || a.driver_id}</td>
              <td>{a.day_of_week}</td>
              <td>{a.start_time}</td>
              <td>{a.end_time}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2 className="text-xl font-bold mb-4">{t("dashboard.driverFeedback")}</h2>
      <table className="w-full">
        <thead>
          <tr>
            <th>{t("dashboard.driver")}</th>
            <th>{t("dashboard.rating")}</th>
            <th>{t("dashboard.comment")}</th>
            <th>{t("dashboard.date")}</th>
          </tr>
        </thead>
        <tbody>
          {feedback.map((f) => (
            <tr key={f.id}>
              <td>{f.drivers?.name || f.driver_id}</td>
              <td>{f.rating}</td>
              <td>{f.comment}</td>
              <td>{new Date(f.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
