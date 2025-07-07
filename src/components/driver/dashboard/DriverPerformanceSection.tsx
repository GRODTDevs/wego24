
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { TrendingUp, Clock, Star, Target, Award, Calendar } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface PerformanceData {
  id: string;
  metric_date: string;
  total_deliveries: number;
  successful_deliveries: number;
  cancelled_deliveries: number;
  total_earnings: number;
  customer_rating_average: number;
  on_time_percentage: number;
}

interface DriverPerformanceSectionProps {
  driverId: string;
}

/**
 * Driver Performance Analytics Section
 * 
 * Displays comprehensive performance metrics including:
 * - Delivery statistics
 * - Rating trends
 * - Earnings history
 * - On-time performance
 * - Interactive charts and graphs
 */
export function DriverPerformanceSection({ driverId }: DriverPerformanceSectionProps) {
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    fetchPerformanceData();
  }, [driverId, timeRange]);

  /**
   * Fetches performance data from the database
   */
  const fetchPerformanceData = async () => {
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
      setPerformanceData(data || []);
    } catch (error) {
      console.error("Error fetching performance data:", error);
      toast.error("Failed to load performance data");
    } finally {
      setLoading(false);
    }
  };

  // Calculate summary statistics
  const summaryStats = performanceData.reduce(
    (acc, day) => ({
      totalDeliveries: acc.totalDeliveries + day.total_deliveries,
      totalEarnings: acc.totalEarnings + day.total_earnings,
      avgRating: (acc.avgRating + day.customer_rating_average) / 2,
      avgOnTime: (acc.avgOnTime + day.on_time_percentage) / 2,
      successRate: day.total_deliveries > 0 
        ? ((acc.successfulDeliveries + day.successful_deliveries) / (acc.totalDeliveries + day.total_deliveries)) * 100
        : 0,
      successfulDeliveries: acc.successfulDeliveries + day.successful_deliveries
    }),
    { totalDeliveries: 0, totalEarnings: 0, avgRating: 0, avgOnTime: 0, successRate: 0, successfulDeliveries: 0 }
  );

  // Prepare chart data
  const chartData = performanceData.map(day => ({
    date: new Date(day.metric_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    deliveries: day.total_deliveries,
    earnings: day.total_earnings,
    rating: day.customer_rating_average,
    onTime: day.on_time_percentage
  }));

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

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Total Deliveries</p>
                <p className="text-2xl font-bold">{summaryStats.totalDeliveries}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold">{summaryStats.avgRating.toFixed(1)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold">{summaryStats.successRate.toFixed(0)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">On-Time Rate</p>
                <p className="text-2xl font-bold">{summaryStats.avgOnTime.toFixed(0)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Progress Bars */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Success Rate</span>
              <span>{summaryStats.successRate.toFixed(1)}%</span>
            </div>
            <Progress value={summaryStats.successRate} className="h-2" />
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>On-Time Delivery</span>
              <span>{summaryStats.avgOnTime.toFixed(1)}%</span>
            </div>
            <Progress value={summaryStats.avgOnTime} className="h-2" />
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Customer Rating</span>
              <span>{summaryStats.avgRating.toFixed(1)}/5.0</span>
            </div>
            <Progress value={(summaryStats.avgRating / 5) * 100} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      {chartData.length > 0 && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Delivery Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="deliveries" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    name="Deliveries"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Earnings Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`€${Number(value).toFixed(2)}`, 'Earnings']} />
                  <Bar dataKey="earnings" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </>
      )}

      {performanceData.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Performance Data</h3>
            <p className="text-gray-600">
              Complete some deliveries to see your performance metrics here.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
