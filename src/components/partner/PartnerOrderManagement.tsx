import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSystemSettings } from "@/contexts/SystemSettingsContext";

const PartnerOrderManagement = () => {
  const { settings } = useSystemSettings();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    supabase
      .from("orders")
      .select(
        "id, status, total, created_at, customer:customer_id(name), driver:driver_id(name), commission"
      )
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) setError(error.message);
        setOrders(data || []);
        setLoading(false);
      });
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setLoading(true);
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);
    if (error) setError(error.message);
    else {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    }
    setLoading(false);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Order Management</h2>
      {loading ? (
        <div>Loading orders...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <table className="min-w-full border">
          <thead>
            <tr>
              <th>ID</th>
              <th>Status</th>
              <th>Total</th>
              <th>Customer</th>
              <th>Driver</th>
              <th>Commission</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.status}</td>
                <td>{order.total}</td>
                <td>{order.customer?.name}</td>
                <td>{order.driver?.name || "Unassigned"}</td>
                <td>
                  {order.commission ?? settings?.commission_rate ?? "-"}
                </td>
                <td>{new Date(order.created_at).toLocaleString()}</td>
                <td>
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order.id, e.target.value)
                    }
                  >
                    <option value="pending">Pending</option>
                    <option value="accepted">Accepted</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PartnerOrderManagement;