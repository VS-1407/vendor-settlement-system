import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AddOrderModal from "../components/AddOrderModal";

import {
  getOrders,
  completeOrder,
  deleteOrder,
} from "../services/orderApi";
import { useDashboard } from "../context/DashboardContext";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [search, setSearch] = useState("");
  const { refresh } = useDashboard();
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
  setCurrentPage(1);
  }, [search]);

  async function fetchOrders() {
    try {
      setLoading(true);

      const data = await getOrders();

      setOrders(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  }

  async function handleComplete(id) {
    try {
      await completeOrder(id);

      await fetchOrders();

      
      refresh(); // Refresh the dashboard data after completing an order

      toast.success("Order completed successfully");

    } catch (error) {
      console.error(error);
      toast.error("Failed to complete order");
    }
  }

  async function handleDelete(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this order?"
    );

    if (!confirmDelete) return;

    try {
      await deleteOrder(id);

      await fetchOrders();

      
      refresh(); // Refresh the dashboard data after deleting an order

      toast.success("Order deleted successfully");

      
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete order");
    }
  }

  // Live Search
  const filteredOrders = orders.filter((order) =>
    String(order.id).includes(search) ||
    (order.status ||"")
      .toLowerCase()
      .includes(search.toLowerCase()) ||
      String(order.amount).includes(search)
  );
  const indexOfLastOrder = currentPage * ordersPerPage;

  const indexOfFirstOrder =
    indexOfLastOrder - ordersPerPage;

  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );

  const totalPages = Math.ceil(
    filteredOrders.length / ordersPerPage
  );

  return (
    <>
      <main className="p-8">

        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">

          <div>
            <h1 className="text-3xl font-bold">
              Orders
            </h1>

            <p className="text-gray-500">
              Manage all customer orders
            </p>
          </div>

          <input
            type="text"
            placeholder="🔍 Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-xl px-4 py-3 w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={() => setOpenModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl transition"
          >
            + New Order
          </button>

        </div>

        <div className="bg-white rounded-2xl shadow overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-100">

              <tr>
                <th className="p-4 text-left">ID</th>
                <th className="p-4 text-left">Amount</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Created</th>
                <th className="p-4 text-center">Actions</th>
              </tr>

            </thead>

            <tbody>

              {loading ? (

                <tr>
                  <td
                    colSpan="5"
                    className="text-center p-8"
                  >
                    Loading...
                  </td>
                </tr>

              ) : filteredOrders.length === 0 ? (

                <tr>
                  <td
                    colSpan="5"
                    className="text-center p-8 text-gray-500"
                  >
                    No Orders Found
                  </td>
                </tr>

              ) : (

                currentOrders.map((order) => (

                  <tr
                    key={order.id}
                    className="border-t hover:bg-gray-50 transition"
                  >

                    <td className="p-4">
                      #{order.id}
                    </td>

                    <td className="p-4">
                      ₹{Number(order.amount).toLocaleString()}
                    </td>

                    <td className="p-4">

                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          order.status === "Completed"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {order.status}
                      </span>

                    </td>

                    <td className="p-4">
                      {order.created_at
                        ? new Date(order.created_at).toLocaleString()
                        : "-"}
                    </td>

                    <td className="p-4">

                      <div className="flex justify-center gap-2">

                        <button
                          onClick={() => handleComplete(order.id)}
                          disabled={order.status === "Completed"}
                          className={`px-4 py-2 rounded-lg text-white transition ${
                            order.status === "Completed"
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-green-600 hover:bg-green-700"
                          }`}
                        >
                          {order.status === "Completed"
                            ? "Completed"
                            : "Complete"}
                        </button>

                        <button
                          onClick={() => handleDelete(order.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
                        >
                          Delete
                        </button>

                      </div>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>
          {!loading && filteredOrders.length > 0 && (

          <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">

            <p className="text-gray-600">

              Showing {indexOfFirstOrder + 1} -

              {Math.min(indexOfLastOrder, filteredOrders.length)}

              {" "}of {filteredOrders.length} orders

            </p>

            <div className="flex gap-2">

              <button
                disabled={currentPage === 1}
                onClick={() =>
                  setCurrentPage((prev) => prev - 1)
                }
                className="px-4 py-2 rounded-lg border disabled:opacity-50"
              >
                Previous
              </button>

              {Array.from(
                { length: totalPages },
                (_, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      setCurrentPage(index + 1)
                    }
                    className={`px-4 py-2 rounded-lg ${
                      currentPage === index + 1
                        ? "bg-blue-600 text-white"
                        : "border"
                    }`}
                  >
                    {index + 1}
                  </button>
                )
              )}

              <button
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((prev) => prev + 1)
                }
                className="px-4 py-2 rounded-lg border disabled:opacity-50"
              >
                Next
              </button>

            </div>

          </div>

        )}

        </div>

      </main>

      <AddOrderModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSuccess={() => {
          fetchorders();
          refresh(); // Refresh the dashboard data after adding a new order
        }}
      />
    </>
  );
}