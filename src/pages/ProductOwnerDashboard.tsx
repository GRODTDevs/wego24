
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/contexts/TranslationContext";
import { UserManagement } from "@/components/UserManagement";
import { LocationManagement } from "@/components/LocationManagement";
import { DriverManagement } from "@/components/DriverManagement";
import { BusinessMetrics } from "@/components/dashboard/BusinessMetrics";
import { AdminSetup } from "@/components/user-management/AdminSetup";

export default function ProductOwnerDashboard() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Operations Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage your delivery platform operations</p>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="users">{t('dashboard.tabs.users')}</TabsTrigger>
          <TabsTrigger value="locations">{t('dashboard.tabs.locations')}</TabsTrigger>
          <TabsTrigger value="drivers">{t('dashboard.tabs.drivers')}</TabsTrigger>
          <TabsTrigger value="analytics">{t('dashboard.tabs.analytics')}</TabsTrigger>
          <TabsTrigger value="admin">{t('dashboard.tabs.admin')}</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Manage platform users and their permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UserManagement />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="locations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Location Management</CardTitle>
              <CardDescription>
                Manage restaurants and business locations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LocationManagement />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="drivers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Driver Management</CardTitle>
              <CardDescription>
                Manage delivery drivers and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DriverManagement />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <BusinessMetrics />
        </TabsContent>

        <TabsContent value="admin" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.admin.title')}</CardTitle>
              <CardDescription>
                {t('dashboard.admin.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AdminSetup />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
