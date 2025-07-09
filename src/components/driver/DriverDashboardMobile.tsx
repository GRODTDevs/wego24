import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { useSystemSettings } from "@/contexts/SystemSettingsContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import SupportChat from "@/components/support/SupportChat";
import { useAuth } from "@/contexts/AuthContext";

interface DriverDashboardMobileProps {
  user: User | null;
}

export default function DriverDashboardMobile({ user }: DriverDashboardMobileProps) {
  const { settings } = useSystemSettings();
  const [current, setCurrent] = useState("jobs");
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch jobs assigned to driver
  useEffect(() => {
    if (!user) {
      return;
    }
    setLoading(true);
    supabase
      .from("orders")
      .select("*", { count: "exact" })
      .eq("driver_id", user.id)
      .in("status", ["assigned", "in_progress", "pending", "scheduled"])
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setJobs(data || []);
        setLoading(false);
      });
  }, [user]);

  // Update driver location for live tracking
  useEffect(() => {
    if (!user || !selectedJob) {
      return;
    }
    if (!settings.enable_live_tracking) {
      return;
    }
    const geo = navigator.geolocation;
    let watchId;
    if (geo) {
      watchId = geo.watchPosition((pos) => {
        supabase.from("driver_locations").upsert({
          driver_id: user.id,
          order_id: selectedJob.id,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      });
    }
    return () => { if (geo && watchId) {
                     geo.clearWatch(watchId);
                   } };
  }, [user, selectedJob, settings.enable_live_tracking]);

  // Job details view
  const JobDetails = ({ job }) => (
    <div className="p-4">
      <Button onClick={() => setSelectedJob(null)} size="sm">Back to Jobs</Button>
      <h3 className="text-lg font-bold mt-2 mb-1">Order #{job.id}</h3>
      <div>Status: {job.status}</div>
      <div>Pickup: {job.pickup_location}</div>
      <div>Dropoff: {job.dropoff_location}</div>
      <div>Customer: {job.customer_name}</div>
      <div>Placed: {new Date(job.created_at).toLocaleString()}</div>
      <div className="my-2">
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(job.dropoff_location)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >Navigate to Dropoff</a>
      </div>
      <SupportChat orderId={job.id} />
    </div>
  );

  // Profile view
  const Profile = () => (
    <div className="p-4">
      <h3 className="text-lg font-bold mb-2">Driver Profile</h3>
      <div>Email: {user.email}</div>
      {/* Add more profile info/settings as needed */}
    </div>
  );

  // Main jobs list
  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <header className="bg-red-600 text-white py-3 px-4 flex items-center justify-between">
        <span className="font-bold text-lg">WeGo Driver</span>
      </header>
      {current === "jobs" && (
        <div className="p-4">
          <h2 className="text-xl font-bold mb-2">My Jobs</h2>
          {loading ? <div>Loading...</div> : jobs.length === 0 ? <div>No jobs assigned.</div> : (
            <ul>
              {jobs.map((job) => (
                <li key={job.id} className="border-b py-2 flex justify-between items-center">
                  <div>
                    <div>Order #{job.id} - {job.status}</div>
                    <div className="text-xs text-gray-500">{job.pickup_location} → {job.dropoff_location}</div>
                  </div>
                  <Button size="sm" onClick={() => setSelectedJob(job)}>Details</Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      {current === "chat" && <SupportChat />}
      {current === "profile" && <Profile />}
      {selectedJob && <JobDetails job={selectedJob} />}
      <DriverMobileNav current={current} setCurrent={setCurrent} />
    </div>
  );
}

function DriverMobileNav({ current, setCurrent }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2 z-50 sm:hidden">
      <Button variant={current === "jobs" ? "default" : "ghost"} onClick={() => setCurrent("jobs")}>Jobs</Button>
      <Button variant={current === "chat" ? "default" : "ghost"} onClick={() => setCurrent("chat")}>Chat</Button>
      <Button variant={current === "profile" ? "default" : "ghost"} onClick={() => setCurrent("profile")}>Profile</Button>
    </nav>
  );
}
