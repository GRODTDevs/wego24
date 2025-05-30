import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Car, Edit2, Trash2, Plus, Fuel } from "lucide-react";

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  color: string;
  isActive: boolean;
}

interface Expense {
  id: string;
  vehicleId: string;
  type: "fuel" | "maintenance" | "insurance" | "other";
  amount: number;
  description: string;
  date: string;
  mileage?: number;
}

export function VehicleManagement() {
  const { toast } = useToast();
  
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    {
      id: "1",
      make: "Toyota",
      model: "Corolla",
      year: 2020,
      licensePlate: "ABC-123",
      color: "White",
      isActive: true
    }
  ]);

  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: "1",
      vehicleId: "1",
      type: "fuel",
      amount: 45.50,
      description: "Full tank",
      date: "2024-01-15",
      mileage: 25000
    }
  ]);

  const [isVehicleDialogOpen, setIsVehicleDialogOpen] = useState(false);
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>("");

  const [vehicleForm, setVehicleForm] = useState({
    make: "",
    model: "",
    year: new Date().getFullYear(),
    licensePlate: "",
    color: "",
    isActive: true
  });

  const [expenseForm, setExpenseForm] = useState({
    vehicleId: "",
    type: "fuel" as "fuel" | "maintenance" | "insurance" | "other",
    amount: 0,
    description: "",
    date: new Date().toISOString().split('T')[0],
    mileage: 0
  });

  const handleSaveVehicle = () => {
    if (!vehicleForm.make || !vehicleForm.model || !vehicleForm.licensePlate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (editingVehicle) {
      setVehicles(prev => prev.map(v => 
        v.id === editingVehicle.id 
          ? { ...editingVehicle, ...vehicleForm }
          : v
      ));
      toast({
        title: "Success",
        description: "Vehicle updated successfully"
      });
    } else {
      const newVehicle: Vehicle = {
        id: Date.now().toString(),
        ...vehicleForm
      };
      setVehicles(prev => [...prev, newVehicle]);
      toast({
        title: "Success",
        description: "Vehicle added successfully"
      });
    }

    setIsVehicleDialogOpen(false);
    setEditingVehicle(null);
    setVehicleForm({
      make: "",
      model: "",
      year: new Date().getFullYear(),
      licensePlate: "",
      color: "",
      isActive: true
    });
  };

  const handleSaveExpense = () => {
    if (!expenseForm.vehicleId || !expenseForm.description || expenseForm.amount <= 0) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (editingExpense) {
      setExpenses(prev => prev.map(e => 
        e.id === editingExpense.id 
          ? { ...editingExpense, ...expenseForm }
          : e
      ));
      toast({
        title: "Success",
        description: "Expense updated successfully"
      });
    } else {
      const newExpense: Expense = {
        id: Date.now().toString(),
        ...expenseForm
      };
      setExpenses(prev => [...prev, newExpense]);
      toast({
        title: "Success",
        description: "Expense added successfully"
      });
    }

    setIsExpenseDialogOpen(false);
    setEditingExpense(null);
    setExpenseForm({
      vehicleId: "",
      type: "fuel",
      amount: 0,
      description: "",
      date: new Date().toISOString().split('T')[0],
      mileage: 0
    });
  };

  const handleDeleteVehicle = (id: string) => {
    setVehicles(prev => prev.filter(v => v.id !== id));
    setExpenses(prev => prev.filter(e => e.vehicleId !== id));
    toast({
      title: "Success",
      description: "Vehicle deleted successfully"
    });
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
    toast({
      title: "Success",
      description: "Expense deleted successfully"
    });
  };

  const openVehicleDialog = (vehicle?: Vehicle) => {
    if (vehicle) {
      setEditingVehicle(vehicle);
      setVehicleForm({
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        licensePlate: vehicle.licensePlate,
        color: vehicle.color,
        isActive: vehicle.isActive
      });
    } else {
      setEditingVehicle(null);
      setVehicleForm({
        make: "",
        model: "",
        year: new Date().getFullYear(),
        licensePlate: "",
        color: "",
        isActive: true
      });
    }
    setIsVehicleDialogOpen(true);
  };

  const openExpenseDialog = (expense?: Expense, vehicleId?: string) => {
    if (expense) {
      setEditingExpense(expense);
      setExpenseForm({
        vehicleId: expense.vehicleId,
        type: expense.type,
        amount: expense.amount,
        description: expense.description,
        date: expense.date,
        mileage: expense.mileage || 0
      });
    } else {
      setEditingExpense(null);
      setExpenseForm({
        vehicleId: vehicleId || "",
        type: "fuel",
        amount: 0,
        description: "",
        date: new Date().toISOString().split('T')[0],
        mileage: 0
      });
    }
    setIsExpenseDialogOpen(true);
  };

  const getExpenseTypeColor = (type: string) => {
    const colors = {
      fuel: "bg-blue-100 text-blue-800",
      maintenance: "bg-red-100 text-red-800",
      insurance: "bg-green-100 text-green-800",
      other: "bg-gray-100 text-gray-800"
    };
    return colors[type as keyof typeof colors] || colors.other;
  };

  const getVehicleExpenses = (vehicleId: string) => {
    return expenses.filter(e => e.vehicleId === vehicleId);
  };

  const getTotalExpenses = (vehicleId: string) => {
    return getVehicleExpenses(vehicleId).reduce((sum, expense) => sum + expense.amount, 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Vehicle Management</h2>
        <Button onClick={() => openVehicleDialog()}>
          <Plus className="w-4 h-4 mr-2" />
          Add Vehicle
        </Button>
      </div>

      <div className="grid gap-6">
        {vehicles.map(vehicle => (
          <Card key={vehicle.id} className="border border-orange-200">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <Car className="w-6 h-6 text-orange-500" />
                  <div>
                    <CardTitle className="text-lg">
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                      {vehicle.licensePlate} • {vehicle.color}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={vehicle.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                    {vehicle.isActive ? "Active" : "Inactive"}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openVehicleDialog(vehicle)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteVehicle(vehicle.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-sm text-gray-600">Total Expenses</p>
                  <p className="text-xl font-semibold">€{getTotalExpenses(vehicle.id).toFixed(2)}</p>
                </div>
                <Button
                  onClick={() => openExpenseDialog(undefined, vehicle.id)}
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Expense
                </Button>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-gray-700">Recent Expenses</h4>
                {getVehicleExpenses(vehicle.id).slice(0, 3).map(expense => (
                  <div key={expense.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      <Badge className={getExpenseTypeColor(expense.type)}>
                        {expense.type}
                      </Badge>
                      <span className="text-sm">{expense.description}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">€{expense.amount.toFixed(2)}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openExpenseDialog(expense)}
                      >
                        <Edit2 className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteExpense(expense.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Vehicle Dialog */}
      <Dialog open={isVehicleDialogOpen} onOpenChange={setIsVehicleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingVehicle ? "Edit Vehicle" : "Add New Vehicle"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="make">Make *</Label>
                <Input
                  id="make"
                  value={vehicleForm.make}
                  onChange={(e) => setVehicleForm(prev => ({ ...prev, make: e.target.value }))}
                  placeholder="Toyota, Honda, etc."
                />
              </div>
              <div>
                <Label htmlFor="model">Model *</Label>
                <Input
                  id="model"
                  value={vehicleForm.model}
                  onChange={(e) => setVehicleForm(prev => ({ ...prev, model: e.target.value }))}
                  placeholder="Corolla, Civic, etc."
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  value={vehicleForm.year}
                  onChange={(e) => setVehicleForm(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                />
              </div>
              <div>
                <Label htmlFor="color">Color</Label>
                <Input
                  id="color"
                  value={vehicleForm.color}
                  onChange={(e) => setVehicleForm(prev => ({ ...prev, color: e.target.value }))}
                  placeholder="White, Black, etc."
                />
              </div>
            </div>
            <div>
              <Label htmlFor="licensePlate">License Plate *</Label>
              <Input
                id="licensePlate"
                value={vehicleForm.licensePlate}
                onChange={(e) => setVehicleForm(prev => ({ ...prev, licensePlate: e.target.value }))}
                placeholder="ABC-123"
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                checked={vehicleForm.isActive}
                onChange={(e) => setVehicleForm(prev => ({ ...prev, isActive: e.target.checked }))}
              />
              <Label htmlFor="isActive">Active Vehicle</Label>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsVehicleDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveVehicle}>
                {editingVehicle ? "Update" : "Add"} Vehicle
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Expense Dialog */}
      <Dialog open={isExpenseDialogOpen} onOpenChange={setIsExpenseDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingExpense ? "Edit Expense" : "Add New Expense"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="expenseVehicle">Vehicle *</Label>
              <select
                id="expenseVehicle"
                className="w-full p-2 border rounded"
                value={expenseForm.vehicleId}
                onChange={(e) => setExpenseForm(prev => ({ ...prev, vehicleId: e.target.value }))}
              >
                <option value="">Select a vehicle</option>
                {vehicles.map(vehicle => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.year} {vehicle.make} {vehicle.model} ({vehicle.licensePlate})
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expenseType">Type *</Label>
                <select
                  id="expenseType"
                  className="w-full p-2 border rounded"
                  value={expenseForm.type}
                  onChange={(e) => setExpenseForm(prev => ({ ...prev, type: e.target.value as any }))}
                >
                  <option value="fuel">Fuel</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="insurance">Insurance</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <Label htmlFor="expenseAmount">Amount (€) *</Label>
                <Input
                  id="expenseAmount"
                  type="number"
                  step="0.01"
                  value={expenseForm.amount}
                  onChange={(e) => setExpenseForm(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="expenseDescription">Description *</Label>
              <Input
                id="expenseDescription"
                value={expenseForm.description}
                onChange={(e) => setExpenseForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Full tank, oil change, etc."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expenseDate">Date</Label>
                <Input
                  id="expenseDate"
                  type="date"
                  value={expenseForm.date}
                  onChange={(e) => setExpenseForm(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="expenseMileage">Mileage (optional)</Label>
                <Input
                  id="expenseMileage"
                  type="number"
                  value={expenseForm.mileage}
                  onChange={(e) => setExpenseForm(prev => ({ ...prev, mileage: parseInt(e.target.value) || 0 }))}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsExpenseDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveExpense}>
                {editingExpense ? "Update" : "Add"} Expense
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
