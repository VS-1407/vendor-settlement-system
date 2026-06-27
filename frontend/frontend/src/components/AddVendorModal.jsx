import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  addVendor,
  updateVendor,
} from "../services/vendorApi";

export default function AddVendorModal({
  open,
  onClose,
  onSuccess,
  vendor,
}) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    account_id: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (vendor) {
      setForm({
        name: vendor.name,
        email: vendor.email,
        account_id: vendor.account_id,
      });
    } else {
      setForm({
        name: "",
        email: "",
        account_id: "",
      });
    }
  }, [vendor, open]);

  if (!open) return null;

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);

      if (vendor) {
        await updateVendor(vendor.id, form);
        toast.success("Vendor updated successfully");
      } else {
        await addVendor(form);
        toast.success("Vendor added successfully");
      }

      onSuccess();

      onClose();

      setForm({
        name: "",
        email: "",
        account_id: "",
      });

    } catch (error) {
      console.error(error);

      toast.error(
        vendor
          ? "Failed to update vendor"
          : "Failed to add vendor"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

      <div className="bg-white rounded-2xl w-[450px] p-8 shadow-2xl">

        <h2 className="text-2xl font-bold mb-6">
          {vendor ? "Edit Vendor" : "Add Vendor"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <input
            type="text"
            placeholder="Vendor Name"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
            className="w-full border rounded-xl p-3"
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
            className="w-full border rounded-xl p-3"
            required
          />

          <input
            type="text"
            placeholder="Account ID"
            value={form.account_id}
            onChange={(e) =>
              setForm({
                ...form,
                account_id: e.target.value,
              })
            }
            className="w-full border rounded-xl p-3"
            required
          />

          <div className="flex justify-end gap-3 pt-4">

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
            >
              {loading
                ? vendor
                  ? "Updating..."
                  : "Saving..."
                : vendor
                ? "Update Vendor"
                : "Save Vendor"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}