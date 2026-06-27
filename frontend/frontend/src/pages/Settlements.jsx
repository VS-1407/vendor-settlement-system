import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
    getSettlements,
    getPendingSettlements,
    getSuccessfulSettlements,
    getFailedSettlements,
    paySettlement
} from "../services/settlementApi";
import SettlementDetailsModal from "../components/SettlementDetailsModal";
import SettlementCharts from "../components/SettlementCharts";
import { exportSettlementsCSV } from "../utils/exportCSV";
import { exportSettlementsExcel } from "../utils/exportExcel";
import { exportSettlementsPDF } from "../utils/exportPDF";
import { getSettlementsByDate } from "../services/settlementApi";

export default function Settlements() {
  const [settlements, setSettlements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedSettlement, setSelectedSettlement] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [filter, setFilter] = useState("All");
  const [stats, setStats] = useState({
  total: 0,
  pending: 0,
  success: 0,
  failed: 0,
  paid: 0,
  });
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortField, setSortField] = useState("id");
  const [sortDirection, setSortDirection] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchSettlements();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filter]);

  async function fetchSettlements() {
    try {
      setLoading(true);

      const data = await getSettlements();

      setSettlements(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch settlements");
    } finally {
      setLoading(false);
    }
  }

  const filteredSettlements = settlements.filter((settlement) => {
    return (
      settlement.id.toString().includes(search) ||
      settlement.status?.toLowerCase().includes(search.toLowerCase()) ||
      settlement.vendor_name?.toLowerCase().includes(search.toLowerCase()) ||
      settlement.amount?.toString().includes(search)
    );
  });

  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;

  const currentSettlements = filteredSettlements.slice(
      indexOfFirst,
      indexOfLast
  );

  const totalPages = Math.ceil(
      filteredSettlements.length / rowsPerPage
  );

  async function handleFilter(type) {

    setFilter(type);

    try {

        let data = [];

        if (type === "Pending") {
            data = await getPendingSettlements();
        }

        else if (type === "Success") {
            data = await getSuccessfulSettlements();
        }

        else if (type === "Failed") {
            data = await getFailedSettlements();
        }

        else {
            data = await getSettlements();
        }

        setSettlements(data);
        setStats({
        total: data.length,
        pending: data.filter((s) => s.status === "Pending").length,
        success: data.filter((s) => s.status === "Success").length,
        failed: data.filter((s) => s.status === "Failed").length,
        paid: data.filter((s) => s.status === "Paid").length,
        });

    } catch (error) {

        console.error(error);
        toast.error("Unable to load settlements.");

    }

}

async function handleDateFilter() {
    if (!startDate || !endDate) {
        toast.error("Please select both dates");
        return;
    }

    try {
        const data = await getSettlementsByDate(
            startDate,
            endDate
        );

        setSettlements(data);

        setStats({
            total: data.length,
            pending: data.filter(s => s.status === "Pending").length,
            success: data.filter(s => s.status === "Success").length,
            failed: data.filter(s => s.status === "Failed").length,
            paid: data.filter(s => s.status === "Paid").length,
        });

    } catch (err) {
        toast.error("Unable to filter settlements");
    }
}

function handleSort(field) {

    let direction = "asc";

    if (
        sortField === field &&
        sortDirection === "asc"
    ) {
        direction = "desc";
    }

    setSortField(field);
    setSortDirection(direction);

    const sorted = [...settlements].sort((a, b) => {

        let valueA = a[field];
        let valueB = b[field];

        if (field === "vendor_name") {
            valueA = (valueA || "").toLowerCase();
            valueB = (valueB || "").toLowerCase();
        }

        if (field === "created_at") {
            valueA = new Date(valueA);
            valueB = new Date(valueB);
        }

        if (valueA < valueB)
            return direction === "asc" ? -1 : 1;

        if (valueA > valueB)
            return direction === "asc" ? 1 : -1;

        return 0;
    });

    setSettlements(sorted);
}

  return (
  <main className="p-8">

    {/* Header */}

    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">

      <div>
        <h1 className="text-3xl font-bold">
          Settlements
        </h1>

        <p className="text-gray-500">
          Manage vendor settlements
        </p>
      </div>

      <input
        type="text"
        placeholder="🔍 Search settlements..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border rounded-xl px-4 py-3 w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={() => exportSettlementsCSV(filteredSettlements)}
        className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl"
      >
        Export CSV
      </button>

      <button
          onClick={() =>
              exportSettlementsExcel(filteredSettlements)
          }
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl"
      >
          Export Excel
      </button>

      <button
        onClick={() =>
          exportSettlementsPDF(filteredSettlements)
        }
        className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-xl"
      >
        Export PDF
      </button>

    </div>

    {/* Stats */}

    <div className="grid grid-cols-1 md:grid-cols-5 gap-5 mb-8">

      <div className="bg-white shadow rounded-xl p-5">
        <h3 className="text-gray-500 text-sm">Total</h3>
        <p className="text-3xl font-bold">{stats.total}</p>
      </div>

      <div className="bg-yellow-50 shadow rounded-xl p-5">
        <h3 className="text-yellow-700 text-sm">Pending</h3>
        <p className="text-3xl font-bold text-yellow-700">
          {stats.pending}
        </p>
      </div>

      <div className="bg-green-50 shadow rounded-xl p-5">
        <h3 className="text-green-700 text-sm">Success</h3>
        <p className="text-3xl font-bold text-green-700">
          {stats.success}
        </p>
      </div>

      <div className="bg-red-50 shadow rounded-xl p-5">
        <h3 className="text-red-700 text-sm">Failed</h3>
        <p className="text-3xl font-bold text-red-700">
          {stats.failed}
        </p>
      </div>

      <div className="bg-blue-50 shadow rounded-xl p-5">
        <h3 className="text-blue-700 text-sm">Paid</h3>
        <p className="text-3xl font-bold text-blue-700">
          {stats.paid}
        </p>
      </div>

    </div>

    {/* Charts */}
    
    <SettlementCharts stats={stats} />

    {/* Filters */}

    <div className="flex flex-wrap gap-3 mb-6">

      <button
        onClick={() => handleFilter("All")}
        className={`px-4 py-2 rounded-lg ${
          filter === "All"
            ? "bg-blue-600 text-white"
            : "bg-gray-200"
        }`}
      >
        All
      </button>

      <button
        onClick={() => handleFilter("Pending")}
        className={`px-4 py-2 rounded-lg ${
          filter === "Pending"
            ? "bg-yellow-500 text-white"
            : "bg-gray-200"
        }`}
      >
        Pending
      </button>

      <button
        onClick={() => handleFilter("Success")}
        className={`px-4 py-2 rounded-lg ${
          filter === "Success"
            ? "bg-green-600 text-white"
            : "bg-gray-200"
        }`}
      >
        Success
      </button>

      <button
        onClick={() => handleFilter("Failed")}
        className={`px-4 py-2 rounded-lg ${
          filter === "Failed"
            ? "bg-red-600 text-white"
            : "bg-gray-200"
        }`}
      >
        Failed
      </button>

    </div>
    <div className="flex flex-wrap items-center gap-4 mb-6">

        <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded-lg px-3 py-2"
        />

        <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded-lg px-3 py-2"
        />

        <button
            onClick={handleDateFilter}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg"
        >
            Filter
        </button>

        <button
            onClick={fetchSettlements}
            className="bg-gray-600 hover:bg-gray-700 text-white px-5 py-2 rounded-lg"
        >
            Reset
        </button>

    </div>

    {/* Table */}

    <div className="bg-white rounded-2xl shadow overflow-x-auto">

      <table className="w-full">

        <thead className="bg-gray-100">

          <tr>

            <th
                onClick={() => handleSort("id")}
                className="cursor-pointer p-4 text-left hover:text-blue-600"
            >
                ID {sortField === "id" && (sortDirection === "asc" ? "↑" : "↓")}
            </th>            
            <th
                onClick={() => handleSort("order_id")}
                className="cursor-pointer p-4 text-left hover:text-blue-600"
            >
                Order ID {sortField === "order_id" && (sortDirection === "asc" ? "↑" : "↓")}
            </th>
            <th
                onClick={() => handleSort("vendor_name")}
                className="cursor-pointer p-4 text-left hover:text-blue-600"
            >
                Vendor {sortField === "vendor_name" && (sortDirection === "asc" ? "↑" : "↓")}
            </th>
            <th
                onClick={() => handleSort("amount")}
                className="cursor-pointer p-4 text-left hover:text-blue-600"
            >
                Amount {sortField === "amount" && (sortDirection === "asc" ? "↑" : "↓")}
            </th>
            <th
                onClick={() => handleSort("status")}
                className="cursor-pointer p-4 text-left hover:text-blue-600"
            >
                Status {sortField === "status" && (sortDirection === "asc" ? "↑" : "↓")}
            </th>
            <th
                onClick={() => handleSort("created_at")}
                className="cursor-pointer p-4 text-left hover:text-blue-600"
            >
                Created {sortField === "created_at" && (sortDirection === "asc" ? "↑" : "↓")}
            </th>            
            <th 
            onClick={() => handleSort("actions")}
                className="cursor-pointer p-4 text-left hover:text-blue-600"
            >
                Actions {sortField === "actions" && (sortDirection === "asc" ? "↑" : "↓")}
            </th>            

          </tr>

        </thead>

        <tbody>

          {loading ? (

            <tr>
              <td colSpan="7" className="text-center p-8">
                Loading...
              </td>
            </tr>

          ) : filteredSettlements.length === 0 ? (

            <tr>
              <td colSpan="7" className="text-center p-8 text-gray-500">
                No Settlements Found
              </td>
            </tr>

          ) : (

            currentSettlements.map((settlement) => (

              <tr
                key={settlement.id}
                className="border-t hover:bg-gray-50"
              >

                <td className="p-4">
                  #{settlement.id}
                </td>

                <td className="p-4">
                  #{settlement.order_id}
                </td>

                <td className="p-4">
                  {settlement.vendor_name || "-"}
                </td>

                <td className="p-4">
                  ₹{Number(settlement.amount).toLocaleString()}
                </td>

                <td className="p-4">

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      settlement.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : settlement.status === "Success"
                        ? "bg-green-100 text-green-700"
                        : settlement.status === "Failed"
                        ? "bg-red-100 text-red-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {settlement.status}
                  </span>

                </td>

                <td className="p-4">
                  {new Date(settlement.created_at).toLocaleDateString()}
                </td>

                <td className="p-4">

                  <div className="flex justify-center gap-2">

                    <button
                      onClick={() => {
                        setSelectedSettlement(settlement);
                        setOpenModal(true);
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                    >
                      View
                    </button>

                    {settlement.status !== "Paid" && (

                      <button
                        onClick={async () => {
                                try {
                                    await paySettlement(settlement.id);

                                    toast.success("Settlement Paid Successfully");

                                    fetchSettlements(); // Refresh the table and stats
                                } catch (error) {
                                    console.error(error);
                                    toast.error("Failed to pay settlement");
                                }
                          }} 
                         className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                      >
                        Pay
                      </button>

                    )}

                  </div>

                </td>

              </tr>

            ))

          )}

        </tbody>

      </table>

    </div>

    <p className="text-gray-500">

        Showing

        {" "}

        {filteredSettlements.length === 0
            ? 0
            : indexOfFirst + 1}

        -

        {Math.min(
            indexOfLast,
            filteredSettlements.length
        )}

        {" "}of{" "}

        {filteredSettlements.length}

        settlements

    </p>

    {/* Rows Per Page */}

    <div className="flex items-center gap-3">

        <span>Rows:</span>

        <select
            value={rowsPerPage}
            onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
            }}
            className="border rounded-lg px-3 py-2"
        >

            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>

        </select>

    </div>

    {/* Previous / Next */}

    <div className="flex items-center gap-3">

        <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
        >
            Previous
        </button>

        <span>
            Page {currentPage} of {totalPages}
        </span>

        <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
            Next
        </button>

    </div>

    <SettlementDetailsModal
      open={openModal}
      settlement={selectedSettlement}
      onClose={() => {
        setOpenModal(false);
        setSelectedSettlement(null);
      }}
    />

  </main>
);
}