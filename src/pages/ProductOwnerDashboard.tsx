
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { UserManagement } from "@/components/UserManagement";
import { LocationManagement } from "@/components/LocationManagement";
import { DriverManagement } from "@/components/DriverManagement";
import { CommissionManagement } from "@/components/CommissionManagement";
import { SuperuserCreation } from "@/components/SuperuserCreation";
import { PartnerApplications } from "@/components/PartnerApplications";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useTranslation } from "@/contexts/TranslationContext";
import { formatCurrency } from "@/lib/currency";

const mockStats = {
  totalOrders: 1245,
  totalRevenue: 45670,
  activeLocations: 28,
  activeDrivers: 15,
  totalUsers: 523
};

const mockOrderData = [
  { month: "Jan", orders: 120, revenue: 3400 },
  { month: "Feb", orders: 150, revenue: 4200 },
  { month: "Mar", orders: 180, revenue: 5100 },
  { month: "Apr", orders: 220, revenue: 6200 },
  { month: "May", orders: 250, revenue: 7100 },
  { month: "Jun", orders: 280, revenue: 8000 }
];

export default function ProductOwnerDashboard() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <ProtectedRoute requireAdmin={true}>
        <main className="flex-1 bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('dashboard.title')}</h1>
            
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">{t('dashboard.stats.totalOrders')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockStats.totalOrders.toLocaleString()}</div>
                  <Badge variant="secondary" className="mt-1">+12% {t('dashboard.stats.fromLastMonth')}</Badge>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">{t('dashboard.stats.totalRevenue')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(mockStats.totalRevenue)}</div>
                  <Badge variant="secondary" className="mt-1">+8% {t('dashboard.stats.fromLastMonth')}</Badge>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">{t('dashboard.stats.activeLocations')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockStats.activeLocations}</div>
                  <Badge variant="secondary" className="mt-1">+3 {t('dashboard.stats.newThisMonth')}</Badge>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">{t('dashboard.stats.activeDrivers')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockStats.activeDrivers}</div>
                  <Badge variant="secondary" className="mt-1">+2 {t('dashboard.stats.newThisMonth')}</Badge>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">{t('dashboard.stats.totalUsers')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockStats.totalUsers}</div>
                  <Badge variant="secondary" className="mt-1">+45 {t('dashboard.stats.newThisMonth')}</Badge>
                </CardContent>
              </Card>
            </div>

            {/* Revenue Chart */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>{t('dashboard.chart.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={mockOrderData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'revenue' ? formatCurrency(Number(value)) : value,
                        name === 'revenue' ? t('dashboard.chart.revenue') : t('dashboard.chart.orders')
                      ]}
                    />
                    <Bar dataKey="revenue" fill="#8884d8" name={t('dashboard.chart.revenue')} />
                    <Bar dataKey="orders" fill="#82ca9d" name={t('dashboard.chart.orders')} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Management Tabs */}
            <Tabs defaultValue="users" className="space-y-6">
              <TabsList className="grid grid-cols-7 w-full">
                <TabsTrigger value="users">{t('dashboard.tabs.users')}</TabsTrigger>
                <TabsTrigger value="locations">{t('dashboard.tabs.locations')}</TabsTrigger>
                <TabsTrigger value="partners">Partners</TabsTrigger>
                <TabsTrigger value="drivers">{t('dashboard.tabs.drivers')}</TabsTrigger>
                <TabsTrigger value="commissions">{t('dashboard.tabs.commissions')}</TabsTrigger>
                <TabsTrigger value="analytics">{t('dashboard.tabs.analytics')}</TabsTrigger>
                <TabsTrigger value="admin">{t('dashboard.tabs.admin')}</TabsTrigger>
              </TabsList>

              <TabsContent value="users">
                <UserManagement />
              </TabsContent>

              <TabsContent value="locations">
                <LocationManagement />
              </TabsContent>

              <TabsContent value="partners">
                <PartnerApplications />
              </TabsContent>

              <TabsContent value="drivers">
                <DriverManagement />
              </TabsContent>

              <TabsContent value="commissions">
                <CommissionManagement />
              </TabsContent>

              <TabsContent value="analytics">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('dashboard.analytics.title')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{t('dashboard.analytics.comingSoon')}</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="admin">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t('dashboard.admin.title')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-6">{t('dashboard.admin.description')}</p>
                      <SuperuserCreation />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </ProtectedRoute>
      <Footer />
    </div>
  );
}
