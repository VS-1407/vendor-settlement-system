import { useEffect, useState } from "react";
import api from "../services/api";

export default function RecentOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get("/recent-orders");
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-xl font-bold mb-6">Recent Orders</h2>

      <table className="w-full">
        <thead>
          <tr className="border-b text-left">
            <th className="py-3">Order ID</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr
              key={order.id}
              className="border-b hover:bg-gray-50 transition"
            >
              <td className="py-3">{order.id}</td>

              <td>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : order.status === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {order.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}