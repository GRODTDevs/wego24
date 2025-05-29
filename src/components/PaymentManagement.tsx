
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar, Download, CreditCard, TrendingUp, DollarSign, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Payment {
  id: string;
  orderId: string;
  customer: string;
  amount: string;
  paymentMethod: string;
  status: string;
  date: string;
  time: string;
}

const demoPayments: Payment[] = [
  {
    id: "PAY-001",
    orderId: "ORD-4001",
    customer: "Alice Johnson",
    amount: "€18.80",
    paymentMethod: "Card",
    status: "Completed",
    date: "2024-01-15",
    time: "12:41"
  },
  {
    id: "PAY-002",
    orderId: "ORD-4002",
    customer: "Carlos Rivera",
    amount: "€13.50",
    paymentMethod: "Cash",
    status: "Completed",
    date: "2024-01-15",
    time: "12:44"
  },
  {
    id: "PAY-003",
    orderId: "ORD-4003",
    customer: "Sophie Martin",
    amount: "€23.00",
    paymentMethod: "Card",
    status: "Pending",
    date: "2024-01-14",
    time: "12:52"
  },
  {
    id: "PAY-004",
    orderId: "ORD-4004",
    customer: "John Smith",
    amount: "€31.20",
    paymentMethod: "Card",
    status: "Completed",
    date: "2024-01-14",
    time: "13:15"
  },
  {
    id: "PAY-005",
    orderId: "ORD-4005",
    customer: "Emma Wilson",
    amount: "€27.90",
    paymentMethod: "Digital Wallet",
    status: "Completed",
    date: "2024-01-13",
    time: "14:30"
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Completed":
      return "bg-green-100 text-green-800";
    case "Pending":
      return "bg-yellow-100 text-yellow-800";
    case "Failed":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export function PaymentManagement() {
  const [payments, setPayments] = useState(demoPayments);
  const [filterPeriod, setFilterPeriod] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const handleExport = () => {
    console.log("Exporting payment data...");
    // Implementation for exporting payment data
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.orderId.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;

    const paymentDate = new Date(payment.date);
    const now = new Date();
    
    switch (filterPeriod) {
      case "today":
        return paymentDate.toDateString() === now.toDateString();
      case "week":
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return paymentDate >= weekAgo;
      case "month":
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return paymentDate >= monthAgo;
      case "year":
        const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        return paymentDate >= yearAgo;
      default:
        return true;
    }
  });

  const totalRevenue = filteredPayments
    .filter(p => p.status === "Completed")
    .reduce((sum, payment) => sum + parseFloat(payment.amount.replace("€", "")), 0);

  const pendingAmount = filteredPayments
    .filter(p => p.status === "Pending")
    .reduce((sum, payment) => sum + parseFloat(payment.amount.replace("€", "")), 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">€{totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              From {filteredPayments.filter(p => p.status === "Completed").length} completed payments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">€{pendingAmount.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              From {filteredPayments.filter(p => p.status === "Pending").length} pending payments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredPayments.length}</div>
            <p className="text-xs text-muted-foreground">
              In selected period
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Input
              placeholder="Search by customer or order ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 max-w-sm"
            />

            <Button
              onClick={handleExport}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>

          {/* Payments Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payment ID</TableHead>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date & Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No payments found for the selected criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{payment.id}</TableCell>
                      <TableCell>{payment.orderId}</TableCell>
                      <TableCell>{payment.customer}</TableCell>
                      <TableCell className="font-semibold">{payment.amount}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          {payment.paymentMethod}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(payment.status)}>
                          {payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{payment.date} at {payment.time}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
