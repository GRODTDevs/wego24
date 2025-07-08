import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

// Commission Tracking
// - CommissionManagement: Flexible commission rules for drivers and restaurants, admin UI for managing rates, real-time calculation and reporting, editable/toggleable rules in UI

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
                  rule.minAmount ? `€${rule.minAmount}` : "None"
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
                  rule.maxAmount ? `€${rule.maxAmount}` : "None"
                )}
              </TableCell>
              <TableCell>
                <span className={rule.isActive ? "text-green-600" : "text-gray-400"}>
                  {rule.isActive ? "Active" : "Inactive"}
                </span>
              </TableCell>
              <TableCell>
                {isEditing ? (
                  <>
                    <Button size="sm" onClick={() => handleSaveRule(rule.id)} className="mr-2">Save</Button>
                    <Button size="sm" variant="outline" onClick={handleCancelEdit}>Cancel</Button>
                  </>
                ) : (
                  <>
                    <Button size="sm" variant="outline" onClick={() => handleEditRule(rule.id)} className="mr-2">Edit</Button>
                    <Button size="sm" variant="outline" onClick={() => toggleRuleStatus(rule.id)}>{rule.isActive ? "Disable" : "Enable"}</Button>
                  </>
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
          <CardTitle>Driver Commission Rules</CardTitle>
        </CardHeader>
        <CardContent>
          {renderRuleTable(driverRules, "driver")}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Restaurant Commission Rules</CardTitle>
        </CardHeader>
        <CardContent>
          {renderRuleTable(restaurantRules, "restaurant")}
        </CardContent>
      </Card>
    </div>
  );
}
