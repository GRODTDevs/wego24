
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Edit2, Trash2, Plus, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  vehicleType: string;
  status: "active" | "inactive" | "suspended";
  commission: number;
  totalDeliveries: number;
  earnings: number;
  rating: number;
}

export function DriverManagement() {
  const { toast } = useToast();
  const [drivers, setDrivers] = useState<Driver[]>([
    {
      id: "1",
      name: "Mike Johnson",
      email: "mike@example.com",
      phone: "+1234567890",
      licenseNumber: "DL123456789",
      vehicleType: "Motorcycle",
      status: "active",
      commission: 20,
      totalDeliveries: 156,
      earnings: 2340,
      rating: 4.8
    },
    {
      id: "2",
      name: "Sarah Wilson",
      email: "sarah@example.com",
      phone: "+1234567891",
      licenseNumber: "DL987654321",
      vehicleType: "Car",
      status: "active",
      commission: 18,
      totalDeliveries: 203,
      earnings: 3650,
      rating: 4.9
    },
    {
      id: "3",
      name: "Tom Brown",
      email: "tom@example.com",
      phone: "+1234567892",
      licenseNumber: "DL555666777",
      vehicleType: "Bicycle",
      status: "inactive",
      commission: 25,
      totalDeliveries: 89,
      earnings: 1780,
      rating: 4.5
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [driverForm, setDriverForm] = useState({
    name: "",
    email: "",
    phone: "",
    licenseNumber: "",
    vehicleType: "",
    status: "active" as "active" | "inactive" | "suspended",
    commission: 20
  });

  const filteredDrivers = drivers.filter(driver =>
    driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddDriver = () => {
    setEditingDriver(null);
    setDriverForm({
      name: "",
      email: "",
      phone: "",
      licenseNumber: "",
      vehicleType: "",
      status: "active",
      commission: 20
    });
    setIsDialogOpen(true);
  };

  const handleEditDriver = (driver: Driver) => {
    setEditingDriver(driver);
    setDriverForm({
      name: driver.name,
      email: driver.email,
      phone: driver.phone,
      licenseNumber: driver.licenseNumber,
      vehicleType: driver.vehicleType,
      status: driver.status,
      commission: driver.commission
    });
    setIsDialogOpen(true);
  };

  const handleSaveDriver = () => {
    if (editingDriver) {
      setDrivers(drivers.map(driver =>
        driver.id === editingDriver.id
          ? { ...driver, ...driverForm }
          : driver
      ));
      toast({ title: "Driver updated successfully" });
    } else {
      const newDriver: Driver = {
        id: Date.now().toString(),
        ...driverForm,
        totalDeliveries: 0,
        earnings: 0,
        rating: 0
      };
      setDrivers([...drivers, newDriver]);
      toast({ title: "Driver added successfully" });
    }
    setIsDialogOpen(false);
  };

  const handleDeleteDriver = (id: string) => {
    setDrivers(drivers.filter(driver => driver.id !== id));
    toast({ title: "Driver deleted successfully" });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "inactive": return "bg-gray-100 text-gray-800";
      case "suspended": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Driver Management</CardTitle>
          <Button onClick={handleAddDriver} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Driver
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search drivers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Commission (%)</TableHead>
              <TableHead>Deliveries</TableHead>
              <TableHead>Earnings</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDrivers.map((driver) => (
              <TableRow key={driver.id}>
                <TableCell className="font-medium">{driver.name}</TableCell>
                <TableCell>{driver.email}</TableCell>
                <TableCell>{driver.phone}</TableCell>
                <TableCell>{driver.vehicleType}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(driver.status)}>
                    {driver.status}
                  </Badge>
                </TableCell>
                <TableCell>{driver.commission}%</TableCell>
                <TableCell>{driver.totalDeliveries}</TableCell>
                <TableCell>${driver.earnings.toLocaleString()}</TableCell>
                <TableCell>{driver.rating > 0 ? driver.rating.toFixed(1) : "N/A"}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditDriver(driver)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteDriver(driver.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingDriver ? "Edit Driver" : "Add New Driver"}
              </DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={driverForm.name}
                  onChange={(e) => setDriverForm({ ...driverForm, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={driverForm.email}
                  onChange={(e) => setDriverForm({ ...driverForm, email: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Phone</label>
                <Input
                  value={driverForm.phone}
                  onChange={(e) => setDriverForm({ ...driverForm, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">License Number</label>
                <Input
                  value={driverForm.licenseNumber}
                  onChange={(e) => setDriverForm({ ...driverForm, licenseNumber: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Vehicle Type</label>
                <select
                  value={driverForm.vehicleType}
                  onChange={(e) => setDriverForm({ ...driverForm, vehicleType: e.target.value })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select Vehicle</option>
                  <option value="Bicycle">Bicycle</option>
                  <option value="Motorcycle">Motorcycle</option>
                  <option value="Car">Car</option>
                  <option value="Van">Van</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Status</label>
                <select
                  value={driverForm.status}
                  onChange={(e) => setDriverForm({ ...driverForm, status: e.target.value as "active" | "inactive" | "suspended" })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium">Commission (%)</label>
                <Input
                  type="number"
                  value={driverForm.commission}
                  onChange={(e) => setDriverForm({ ...driverForm, commission: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveDriver}>
                {editingDriver ? "Update" : "Add"} Driver
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
