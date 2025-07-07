
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";

interface DriverProfileSectionProps {
  driverData: any;
  onUpdate: () => void;
}

export function DriverProfileSection({ driverData, onUpdate }: DriverProfileSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Driver Profile
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium">Name</p>
            <p className="text-gray-600">{driverData?.first_name || 'N/A'} {driverData?.last_name || ''}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Email</p>
            <p className="text-gray-600">{driverData?.email || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Vehicle Type</p>
            <p className="text-gray-600">{driverData?.vehicle_type || 'N/A'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
