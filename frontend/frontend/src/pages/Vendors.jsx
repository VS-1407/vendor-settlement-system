import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
  getVendors,
  deleteVendor,
} from "../services/vendorApi";

import AddVendorModal from "../components/AddVendorModal";
import { useDashboard } from "../context/DashboardContext";


export default function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [search, setSearch] = useState("");
  const { refresh } = useDashboard();


  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const vendorsPerPage = 10;

  useEffect(() => {
    fetchVendors();
  }, []);

  async function fetchVendors() {
    try {
      setLoading(true);

      const data = await getVendors();
      setVendors(data);
    } catch (error) {
      console.error("Error fetching vendors:", error);
      toast.error("Failed to fetch vendors");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this vendor?"
    );

    if (!confirmDelete) return;

    try {
      await deleteVendor(id);

      await fetchVendors();


      refresh(); // Refresh the dashboard data after deleting a vendor

      toast.success("Vendor deleted successfully");

    } catch (error) {
      console.error(error);
      toast.error("Failed to delete vendor");
    }
  }

  // Search
  const filteredVendors = vendors.filter((vendor) =>
    (vendor.name || "")
      .toLowerCase()
      .includes(search.toLowerCase()) ||
    (vendor.email || "")
      .toLowerCase()
      .includes(search.toLowerCase()) ||
    (vendor.account_id || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // Reset page when searching
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // Pagination calculations
  const indexOfLastVendor = currentPage * vendorsPerPage;
  const indexOfFirstVendor = indexOfLastVendor - vendorsPerPage;

  const currentVendors = filteredVendors.slice(
    indexOfFirstVendor,
    indexOfLastVendor
  );

  const totalPages = Math.ceil(
    filteredVendors.length / vendorsPerPage
  );

  return (
    <>
      <main className="p-8">

        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">

          <div>
            <h1 className="text-3xl font-bold">
              Vendors
            </h1>

            <p className="text-gray-500">
              Manage all registered vendors
            </p>
          </div>

          <input
            type="text"
            placeholder="🔍 Search by name, email or account ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-xl px-4 py-3 w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={() => {
              setSelectedVendor(null);
              setOpenModal(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl transition"
          >
            + Add Vendor
          </button>

        </div>

        <div className="bg-white rounded-2xl shadow overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left">ID</th>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Account ID</th>
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

              ) : filteredVendors.length === 0 ? (

                <tr>
                  <td
                    colSpan="5"
                    className="text-center p-8 text-gray-500"
                  >
                    No matching vendors found
                  </td>
                </tr>

              ) : (

                currentVendors.map((vendor) => (

                  <tr
                    key={vendor.id}
                    className="border-t hover:bg-gray-50 transition"
                  >

                    <td className="p-4">{vendor.id}</td>

                    <td className="p-4 font-medium">
                      {vendor.name}
                    </td>

                    <td className="p-4">
                      {vendor.email}
                    </td>

                    <td className="p-4">
                      {vendor.account_id}
                    </td>

                    <td className="p-4">

                      <div className="flex justify-center gap-2">

                        <button
                          onClick={() => {
                            setSelectedVendor(vendor);
                            setOpenModal(true);
                          }}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(vendor.id)}
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

        </div>

        {/* Pagination */}

        {!loading && filteredVendors.length > 0 && (

          <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">

            <p className="text-gray-600">

              Showing {indexOfFirstVendor + 1} -

              {Math.min(indexOfLastVendor, filteredVendors.length)}

              {" "}of {filteredVendors.length} vendors

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

      </main>

      <AddVendorModal
        open={openModal}
        vendor={selectedVendor}
        onClose={() => {
          setOpenModal(false);
          setSelectedVendor(null);
        }}
        onSuccess={()=> {
         fetchVendors();
         refresh(); // Refresh the dashboard data after adding or editing a vendor
        }}
      />

    </>
  );
}