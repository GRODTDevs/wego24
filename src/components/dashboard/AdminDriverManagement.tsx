import React, { useEffect, useState } from "react";
import { Drivers, DriverEarnings, Reviews } from "@/integrations/supabase/database.types";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";

export function AdminDriverManagement() {
  const [drivers, setDrivers] = useState<Drivers[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<Drivers | null>(null);
  const [earnings, setEarnings] = useState<DriverEarnings[]>([]);
  const [feedback, setFeedback] = useState<Reviews[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("drivers").select("*").order("created_at", { ascending: false });
    if (!error && data) setDrivers(data);
    setLoading(false);
  };

  const selectDriver = async (driver: Drivers) => {
    setSelectedDriver(driver);
    setLoading(true);
    const [earningsRes, feedbackRes] = await Promise.all([
      supabase.from("driver_earnings").select("*").eq("driver_id", driver.id).order("created_at", { ascending: false }),
      supabase.from("reviews").select("*").eq("driver_id", driver.id).order("created_at", { ascending: false })
    ]);
    if (!earningsRes.error && earningsRes.data) setEarnings(earningsRes.data);
    if (!feedbackRes.error && feedbackRes.data) setFeedback(feedbackRes.data);
    setLoading(false);
  };

  const approveDriver = async (driver: Drivers) => {
    const { error } = await supabase.from("drivers").update({ registration_status: "approved", is_active: true }).eq("id", driver.id);
    if (!error) {
      toast.success("Driver approved");
      fetchDrivers();
    } else {
      toast.error("Failed to approve driver");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Driver Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Drivers</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div>Loading...</div>
              ) : (
                <ul className="divide-y">
                  {drivers.map(driver => (
                    <li key={driver.id} className="py-2 flex items-center justify-between">
                      <div>
                        <span className="font-semibold">{driver.first_name} {driver.last_name}</span>
                        <span className="ml-2 text-xs text-gray-500">{driver.email}</span>
                        <Badge variant={driver.registration_status === 'approved' ? 'default' : 'secondary'} className="ml-2">
                          {driver.registration_status || 'pending'}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => selectDriver(driver)}>View</Button>
                        {driver.registration_status !== 'approved' && (
                          <Button size="sm" onClick={() => approveDriver(driver)}>Approve</Button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="col-span-2">
          {selectedDriver ? (
            <Card>
              <CardHeader>
                <CardTitle>Driver Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="font-bold text-lg">{selectedDriver.first_name} {selectedDriver.last_name}</div>
                  <div className="text-gray-600">{selectedDriver.email}</div>
                  <div className="text-sm text-gray-500">Vehicle: {selectedDriver.vehicle_type}</div>
                  <div className="text-sm text-gray-500">Status: <Badge variant={selectedDriver.is_active ? 'default' : 'secondary'}>{selectedDriver.is_active ? 'Active' : 'Inactive'}</Badge></div>
                  <div className="text-sm text-gray-500">Registration: <Badge variant={selectedDriver.registration_status === 'approved' ? 'default' : 'secondary'}>{selectedDriver.registration_status || 'pending'}</Badge></div>
                </div>
                <Tabs defaultValue="earnings" className="w-full">
                  <TabsList className="grid grid-cols-2 mb-4">
                    <TabsTrigger value="earnings">Earnings</TabsTrigger>
                    <TabsTrigger value="feedback">Feedback</TabsTrigger>
                  </TabsList>
                  <TabsContent value="earnings">
                    <h3 className="font-semibold mb-2">Earnings</h3>
                    {earnings.length === 0 ? <div className="text-gray-500">No earnings yet.</div> : (
                      <ul className="divide-y">
                        {earnings.map(e => (
                          <li key={e.id} className="py-2 flex justify-between">
                            <span>{e.created_at ? new Date(e.created_at).toLocaleDateString() : ''}</span>
                            <span className="font-semibold">€{e.amount.toFixed(2)}</span>
                            <span className="text-xs text-gray-500">{e.payout_requested ? (e.payout_approved ? 'Paid' : 'Requested') : 'Not requested'}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </TabsContent>
                  <TabsContent value="feedback">
                    <h3 className="font-semibold mb-2">Feedback</h3>
                    {feedback.length === 0 ? <div className="text-gray-500">No feedback yet.</div> : (
                      <ul className="divide-y">
                        {feedback.map(f => (
                          <li key={f.id} className="py-2">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{f.rating}/5</span>
                              <span className="text-xs text-gray-400">{f.created_at ? new Date(f.created_at).toLocaleDateString() : ''}</span>
                            </div>
                            {f.comment && <div className="text-gray-700 text-sm mt-1">{f.comment}</div>}
                          </li>
                        ))}
                      </ul>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <div className="text-gray-500 text-center mt-12">Select a driver to view details</div>
          )}
        </div>
      </div>
    </div>
  );
}
