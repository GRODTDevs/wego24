
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

interface DriverDocumentsSectionProps {
  driverId: string;
}

export function DriverDocumentsSection({ driverId }: DriverDocumentsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Documents
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 border rounded">
            <span>Driver's License</span>
            <span className="text-green-600 text-sm">Verified</span>
          </div>
          <div className="flex justify-between items-center p-3 border rounded">
            <span>Insurance</span>
            <span className="text-green-600 text-sm">Verified</span>
          </div>
          <div className="flex justify-between items-center p-3 border rounded">
            <span>Vehicle Registration</span>
            <span className="text-green-600 text-sm">Verified</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
