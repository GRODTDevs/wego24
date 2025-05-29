
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Users, UserPlus, Mail, Phone, Edit, Trash2 } from "lucide-react";

interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "Manager" | "Chef" | "Server" | "Cashier";
  status: "Active" | "Inactive";
  joinDate: string;
}

export function StaffManagement() {
  const [staff, setStaff] = useState<StaffMember[]>([
    {
      id: "STF-001",
      name: "Sarah Johnson",
      email: "sarah@bellaitalia.com",
      phone: "+1 (555) 123-4568",
      role: "Manager",
      status: "Active",
      joinDate: "2024-01-15"
    },
    {
      id: "STF-002",
      name: "Luigi Bianchi",
      email: "luigi@bellaitalia.com",
      phone: "+1 (555) 123-4569",
      role: "Chef",
      status: "Active",
      joinDate: "2024-02-01"
    },
    {
      id: "STF-003",
      name: "Maria Garcia",
      email: "maria@bellaitalia.com",
      phone: "+1 (555) 123-4570",
      role: "Server",
      status: "Active",
      joinDate: "2024-03-10"
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newStaff, setNewStaff] = useState({
    name: "",
    email: "",
    phone: "",
    role: "" as StaffMember["role"] | "",
  });

  const handleAddStaff = () => {
    if (newStaff.name && newStaff.email && newStaff.role) {
      const staffMember: StaffMember = {
        id: `STF-${String(staff.length + 1).padStart(3, '0')}`,
        name: newStaff.name,
        email: newStaff.email,
        phone: newStaff.phone,
        role: newStaff.role as StaffMember["role"],
        status: "Active",
        joinDate: new Date().toISOString().split('T')[0]
      };
      
      setStaff([...staff, staffMember]);
      setNewStaff({ name: "", email: "", phone: "", role: "" });
      setShowAddForm(false);
    }
  };

  const handleRemoveStaff = (id: string) => {
    setStaff(staff.filter(member => member.id !== id));
  };

  const toggleStaffStatus = (id: string) => {
    setStaff(staff.map(member => 
      member.id === id 
        ? { ...member, status: member.status === "Active" ? "Inactive" : "Active" }
        : member
    ));
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "Manager": return "bg-purple-100 text-purple-800";
      case "Chef": return "bg-orange-100 text-orange-800";
      case "Server": return "bg-blue-100 text-blue-800";
      case "Cashier": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    return status === "Active" 
      ? "bg-green-100 text-green-800" 
      : "bg-red-100 text-red-800";
  };

  return (
    <div className="space-y-6">
      <section className="bg-orange-50 rounded-xl shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-orange-600 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Staff Management
          </h2>
          <Button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Add Staff Member
          </Button>
        </div>

        {showAddForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Add New Staff Member</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="staffName">Name</Label>
                  <Input
                    id="staffName"
                    value={newStaff.name}
                    onChange={(e) => setNewStaff({...newStaff, name: e.target.value})}
                    placeholder="Enter staff name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="staffEmail">Email</Label>
                  <Input
                    id="staffEmail"
                    type="email"
                    value={newStaff.email}
                    onChange={(e) => setNewStaff({...newStaff, email: e.target.value})}
                    placeholder="Enter email address"
                  />
                </div>
                
                <div>
                  <Label htmlFor="staffPhone">Phone</Label>
                  <Input
                    id="staffPhone"
                    value={newStaff.phone}
                    onChange={(e) => setNewStaff({...newStaff, phone: e.target.value})}
                    placeholder="Enter phone number"
                  />
                </div>
                
                <div>
                  <Label htmlFor="staffRole">Role</Label>
                  <Select value={newStaff.role} onValueChange={(value) => setNewStaff({...newStaff, role: value as StaffMember["role"]})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Manager">Manager</SelectItem>
                      <SelectItem value="Chef">Chef</SelectItem>
                      <SelectItem value="Server">Server</SelectItem>
                      <SelectItem value="Cashier">Cashier</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button onClick={handleAddStaff} className="bg-green-600 text-white">
                  Add Staff Member
                </Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Current Staff ({staff.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staff.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="w-3 h-3" />
                          {member.email}
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="w-3 h-3" />
                          {member.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getRoleBadgeColor(member.role)}>
                        {member.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeColor(member.status)}>
                        {member.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{member.joinDate}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleStaffStatus(member.id)}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRemoveStaff(member.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
