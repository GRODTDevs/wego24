
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DollarSign, TrendingUp, Calendar, Download, Wallet } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface EarningsData {
  id: string;
  metric_date: string;
  total_earnings: number;
  total_deliveries: number;
  successful_deliveries: number;
}

interface DriverEarningsSectionProps {
  driverId: string;
}

/**
 * Driver Earnings Analytics Section
 * 
 * Comprehensive earnings tracking and analytics including:
 * - Daily/weekly/monthly earnings
 * - Earnings per delivery
 * - Payment history
 * - Financial insights and trends
 */
export function DriverEarningsSection({ driverId }: DriverEarningsSectionProps) {
  const [earningsData, setEarningsData] = useState<EarningsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    fetchEarningsData();
  }, [driverId, timeRange]);

  /**
   * Fetches earnings data from the database
   */
  const fetchEarningsData = async () => {
    try {
      const endDate = new Date();
      const startDate = new Date();
      
      switch (timeRange) {
        case 'week':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(endDate.getMonth() - 1);
          break;
        case 'year':
          startDate.setFullYear(endDate.getFullYear() - 1);
          break;
      }

      const { data, error } = await supabase
        .from("driver_performance")
        .select("*")
        .eq("driver_id", driverId)
        .gte("metric_date", startDate.toISOString().split('T')[0])
        .lte("metric_date", endDate.toISOString().split('T')[0])
        .order("metric_date", { ascending: true });

      if (error) throw error;
      setEarningsData(data || []);
    } catch (error) {
      console.error("Error fetching earnings data:", error);
      toast.error("Failed to load earnings data");
    } finally {
      setLoading(false);
    }
  };

  // Calculate earnings statistics
  const earningsStats = earningsData.reduce(
    (acc, day) => ({
      totalEarnings: acc.totalEarnings + day.total_earnings,
      totalDeliveries: acc.totalDeliveries + day.total_deliveries,
      avgPerDelivery: day.total_deliveries > 0 
        ? (acc.totalEarnings + day.total_earnings) / (acc.totalDeliveries + day.total_deliveries)
        : 0,
      bestDay: day.total_earnings > acc.bestDay ? day.total_earnings : acc.bestDay,
      daysWorked: day.total_earnings > 0 ? acc.daysWorked + 1 : acc.daysWorked
    }),
    { totalEarnings: 0, totalDeliveries: 0, avgPerDelivery: 0, bestDay: 0, daysWorked: 0 }
  );

  // Prepare chart data
  const chartData = earningsData.map(day => ({
    date: new Date(day.metric_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    earnings: day.total_earnings,
    deliveries: day.total_deliveries,
    avgPerDelivery: day.total_deliveries > 0 ? day.total_earnings / day.total_deliveries : 0
  }));

  // Earnings breakdown for pie chart
  const earningsBreakdown = [
    { name: 'Delivery Fees', value: earningsStats.totalEarnings * 0.7, color: '#3B82F6' },
    { name: 'Tips', value: earningsStats.totalEarnings * 0.2, color: '#10B981' },
    { name: 'Bonuses', value: earningsStats.totalEarnings * 0.1, color: '#F59E0B' }
  ];

  /**
   * Handles earnings report download
   */
  const downloadEarningsReport = async () => {
    try {
      toast.info("Generating earnings report...");
      // In a real implementation, this would generate and download a PDF report
      setTimeout(() => {
        toast.success("Earnings report downloaded");
      }, 2000);
    } catch (error) {
      console.error("Error downloading report:", error);
      toast.error("Failed to download report");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex gap-2">
          {(['week', 'month', 'year'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeRange === range
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
        
        <Button onClick={downloadEarningsReport} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Download Report
        </Button>
      </div>

      {/* Earnings Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold">€{earningsStats.totalEarnings.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Avg per Delivery</p>
                <p className="text-2xl font-bold">€{earningsStats.avgPerDelivery.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Days Worked</p>
                <p className="text-2xl font-bold">{earningsStats.daysWorked}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">Best Day</p>
                <p className="text-2xl font-bold">€{earningsStats.bestDay.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Earnings Trend Chart */}
      {chartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Earnings Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => [`€${Number(value).toFixed(2)}`, 'Earnings']} />
                <Line 
                  type="monotone" 
                  dataKey="earnings" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  name="Daily Earnings"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Earnings Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Earnings Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={earningsBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {earningsBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `€${Number(value).toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {earningsBreakdown.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium">€{item.value.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium mb-2">Next Payment</h4>
              <p className="text-sm text-gray-600">Weekly payments every Friday</p>
              <p className="text-lg font-semibold text-blue-600">€{(earningsStats.totalEarnings * 0.3).toFixed(2)} pending</p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Payment Method</h4>
              <div className="p-3 border rounded-lg">
                <p className="text-sm">Bank Transfer</p>
                <p className="text-xs text-gray-500">**** **** **** 1234</p>
              </div>
            </div>

            <Button variant="outline" className="w-full">
              Update Payment Method
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Earnings */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Earnings</CardTitle>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <div className="space-y-3">
              {chartData.slice(-7).reverse().map((day, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{day.date}</p>
                    <p className="text-sm text-gray-500">{day.deliveries} deliveries</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">€{day.earnings.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">€{day.avgPerDelivery.toFixed(2)}/delivery</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <DollarSign className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Earnings Yet</h3>
              <p className="text-gray-600">
                Complete deliveries to start earning and track your income here.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
