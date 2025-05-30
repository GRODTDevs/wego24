
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Edit2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CommissionRule {
  id: string;
  name: string;
  type: "driver" | "restaurant";
  category: string;
  rate: number;
  minAmount?: number;
  maxAmount?: number;
  isActive: boolean;
}

export function CommissionManagement() {
  const { toast } = useToast();
  const [commissionRules, setCommissionRules] = useState<CommissionRule[]>([
    {
      id: "1",
      name: "Standard Driver Commission",
      type: "driver",
      category: "All Orders",
      rate: 20,
      isActive: true
    },
    {
      id: "2",
      name: "Premium Driver Commission",
      type: "driver",
      category: "Premium Orders",
      rate: 25,
      minAmount: 50,
      isActive: true
    },
    {
      id: "3",
      name: "Standard Restaurant Commission",
      type: "restaurant",
      category: "All Orders",
      rate: 15,
      isActive: true
    },
    {
      id: "4",
      name: "High Volume Restaurant",
      type: "restaurant",
      category: "High Volume",
      rate: 12,
      minAmount: 1000,
      isActive: true
    },
    {
      id: "5",
      name: "New Restaurant Promotion",
      type: "restaurant",
      category: "New Partners",
      rate: 8,
      maxAmount: 500,
      isActive: false
    }
  ]);

  const [editingRule, setEditingRule] = useState<string | null>(null);
  const [tempRules, setTempRules] = useState<CommissionRule[]>([]);

  const driverRules = commissionRules.filter(rule => rule.type === "driver");
  const restaurantRules = commissionRules.filter(rule => rule.type === "restaurant");

  const handleEditRule = (ruleId: string) => {
    setEditingRule(ruleId);
    setTempRules([...commissionRules]);
  };

  const handleSaveRule = (ruleId: string) => {
    const updatedRule = tempRules.find(rule => rule.id === ruleId);
    if (updatedRule) {
      setCommissionRules(commissionRules.map(rule =>
        rule.id === ruleId ? updatedRule : rule
      ));
      toast({ title: "Commission rule updated successfully" });
    }
    setEditingRule(null);
  };

  const handleCancelEdit = () => {
    setEditingRule(null);
    setTempRules([]);
  };

  const updateTempRule = (ruleId: string, field: keyof CommissionRule, value: any) => {
    setTempRules(tempRules.map(rule =>
      rule.id === ruleId ? { ...rule, [field]: value } : rule
    ));
  };

  const toggleRuleStatus = (ruleId: string) => {
    setCommissionRules(commissionRules.map(rule =>
      rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule
    ));
    toast({ title: "Commission rule status updated" });
  };

  const renderRuleTable = (rules: CommissionRule[], type: "driver" | "restaurant") => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Rule Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Rate (%)</TableHead>
          <TableHead>Min Amount</TableHead>
          <TableHead>Max Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rules.map((rule) => {
          const isEditing = editingRule === rule.id;
          const currentRule = isEditing ? tempRules.find(r => r.id === rule.id) || rule : rule;

          return (
            <TableRow key={rule.id}>
              <TableCell className="font-medium">
                {isEditing ? (
                  <Input
                    value={currentRule.name}
                    onChange={(e) => updateTempRule(rule.id, "name", e.target.value)}
                  />
                ) : (
                  rule.name
                )}
              </TableCell>
              <TableCell>
                {isEditing ? (
                  <Input
                    value={currentRule.category}
                    onChange={(e) => updateTempRule(rule.id, "category", e.target.value)}
                  />
                ) : (
                  rule.category
                )}
              </TableCell>
              <TableCell>
                {isEditing ? (
                  <Input
                    type="number"
                    value={currentRule.rate}
                    onChange={(e) => updateTempRule(rule.id, "rate", Number(e.target.value))}
                    className="w-20"
                  />
                ) : (
                  `${rule.rate}%`
                )}
              </TableCell>
              <TableCell>
                {isEditing ? (
                  <Input
                    type="number"
                    value={currentRule.minAmount || ""}
                    onChange={(e) => updateTempRule(rule.id, "minAmount", e.target.value ? Number(e.target.value) : undefined)}
                    className="w-24"
                    placeholder="None"
                  />
                ) : (
                  rule.minAmount ? `$${rule.minAmount}` : "None"
                )}
              </TableCell>
              <TableCell>
                {isEditing ? (
                  <Input
                    type="number"
                    value={currentRule.maxAmount || ""}
                    onChange={(e) => updateTempRule(rule.id, "maxAmount", e.target.value ? Number(e.target.value) : undefined)}
                    className="w-24"
                    placeholder="None"
                  />
                ) : (
                  rule.maxAmount ? `$${rule.maxAmount}` : "None"
                )}
              </TableCell>
              <TableCell>
                <Badge
                  className={rule.isActive ? "bg-green-100 text-green-800 cursor-pointer" : "bg-red-100 text-red-800 cursor-pointer"}
                  onClick={() => toggleRuleStatus(rule.id)}
                >
                  {rule.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell>
                {isEditing ? (
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleSaveRule(rule.id)}>
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditRule(rule.id)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Commission Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {driverRules.filter(r => r.isActive).length}
              </div>
              <div className="text-sm text-gray-600">Active Driver Rules</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {restaurantRules.filter(r => r.isActive).length}
              </div>
              <div className="text-sm text-gray-600">Active Restaurant Rules</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {driverRules.reduce((sum, rule) => rule.isActive ? sum + rule.rate : sum, 0) / driverRules.filter(r => r.isActive).length || 0}%
              </div>
              <div className="text-sm text-gray-600">Avg Driver Commission</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {restaurantRules.reduce((sum, rule) => rule.isActive ? sum + rule.rate : sum, 0) / restaurantRules.filter(r => r.isActive).length || 0}%
              </div>
              <div className="text-sm text-gray-600">Avg Restaurant Commission</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="drivers" className="space-y-4">
        <TabsList>
          <TabsTrigger value="drivers">Driver Commissions</TabsTrigger>
          <TabsTrigger value="restaurants">Restaurant Commissions</TabsTrigger>
        </TabsList>

        <TabsContent value="drivers">
          <Card>
            <CardHeader>
              <CardTitle>Driver Commission Rules</CardTitle>
              <p className="text-sm text-gray-600">
                Manage commission rates payable to drivers based on different criteria
              </p>
            </CardHeader>
            <CardContent>
              {renderRuleTable(driverRules, "driver")}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="restaurants">
          <Card>
            <CardHeader>
              <CardTitle>Restaurant Commission Rules</CardTitle>
              <p className="text-sm text-gray-600">
                Manage commission rates payable by restaurants based on different criteria
              </p>
            </CardHeader>
            <CardContent>
              {renderRuleTable(restaurantRules, "restaurant")}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
