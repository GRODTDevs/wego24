
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, Eye, Clock, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

type PartnerApplication = Tables<"partner_applications">;

export function PartnerApplications() {
  const { toast } = useToast();
  const [applications, setApplications] = useState<PartnerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<PartnerApplication | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from("partner_applications")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast({
        title: "Error",
        description: "Failed to fetch partner applications",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (application: PartnerApplication) => {
    setActionLoading(true);
    try {
      // Update application status to approved
      const { error: updateError } = await supabase
        .from("partner_applications")
        .update({
          status: "approved",
          reviewed_at: new Date().toISOString()
        })
        .eq("id", application.id);

      if (updateError) throw updateError;

      // Create restaurant from application
      const { error: createError } = await supabase
        .rpc("create_restaurant_from_application", {
          application_id: application.id
        });

      if (createError) throw createError;

      toast({
        title: "Application Approved",
        description: "Partner application approved and restaurant account created successfully"
      });

      fetchApplications();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error approving application:", error);
      toast({
        title: "Error",
        description: "Failed to approve application",
        variant: "destructive"
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (application: PartnerApplication) => {
    if (!rejectionReason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for rejection",
        variant: "destructive"
      });
      return;
    }

    setActionLoading(true);
    try {
      const { error } = await supabase
        .from("partner_applications")
        .update({
          status: "rejected",
          reviewed_at: new Date().toISOString(),
          rejection_reason: rejectionReason
        })
        .eq("id", application.id);

      if (error) throw error;

      toast({
        title: "Application Rejected",
        description: "Partner application has been rejected"
      });

      fetchApplications();
      setIsDialogOpen(false);
      setRejectionReason("");
    } catch (error) {
      console.error("Error rejecting application:", error);
      toast({
        title: "Error",
        description: "Failed to reject application",
        variant: "destructive"
      });
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="w-5 h-5" />
          Partner Applications
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {applications.length === 0 ? (
          <div className="text-center py-8">
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Yet</h3>
            <p className="text-gray-600">Partner applications will appear here when submitted.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Business Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Applied</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell className="font-medium">{application.business_name}</TableCell>
                  <TableCell>{application.business_type}</TableCell>
                  <TableCell>{application.email}</TableCell>
                  <TableCell>{application.city}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(application.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(application.status)}
                        {application.status}
                      </div>
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(application.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedApplication(application);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Review
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Review Partner Application</DialogTitle>
            </DialogHeader>
            {selectedApplication && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="font-semibold">Business Name</Label>
                    <p>{selectedApplication.business_name}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Business Type</Label>
                    <p>{selectedApplication.business_type}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Email</Label>
                    <p>{selectedApplication.email}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Phone</Label>
                    <p>{selectedApplication.phone || "Not provided"}</p>
                  </div>
                </div>

                <div>
                  <Label className="font-semibold">Address</Label>
                  <p>{selectedApplication.address}</p>
                  <p>{selectedApplication.city} {selectedApplication.postal_code}</p>
                </div>

                {selectedApplication.description && (
                  <div>
                    <Label className="font-semibold">Description</Label>
                    <p className="text-sm text-gray-600 mt-1">{selectedApplication.description}</p>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Label className="font-semibold">Status:</Label>
                  <Badge className={getStatusColor(selectedApplication.status)}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(selectedApplication.status)}
                      {selectedApplication.status}
                    </div>
                  </Badge>
                </div>

                {selectedApplication.status === "rejected" && selectedApplication.rejection_reason && (
                  <div>
                    <Label className="font-semibold">Rejection Reason</Label>
                    <p className="text-sm text-red-600 mt-1">{selectedApplication.rejection_reason}</p>
                  </div>
                )}

                {selectedApplication.status === "pending" && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="rejectionReason">Rejection Reason (if rejecting)</Label>
                      <Textarea
                        id="rejectionReason"
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Provide a reason if rejecting this application..."
                        rows={3}
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                        disabled={actionLoading}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleReject(selectedApplication)}
                        disabled={actionLoading}
                      >
                        {actionLoading ? "Processing..." : "Reject"}
                      </Button>
                      <Button
                        onClick={() => handleApprove(selectedApplication)}
                        className="bg-green-600 hover:bg-green-700"
                        disabled={actionLoading}
                      >
                        {actionLoading ? "Processing..." : "Approve"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
