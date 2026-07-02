import { useState } from "react";
import { toast } from "react-toastify";
import { createOrder } from "../services/orderApi";

export default function AddOrderModal({
  open,
  onClose,
  onSuccess,
}) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  async function handleSubmit(e) {
    e.preventDefault();

    if (!amount || Number(amount) <= 0) {
      toast.error("Enter a valid amount");
      return;
    }

    try {
      setLoading(true);

      await createOrder(Number(amount));

      toast.success("Order created successfully");

      setAmount("");

      if (onSuccess) {
        await onSuccess();
      }

      onClose();

    } catch (err) {
      console.error(err);
      toast.error("Failed to create order");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white rounded-2xl shadow-xl w-[420px] p-8">

        <h2 className="text-2xl font-bold mb-6">
          Create Order
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <input
            type="number"
            placeholder="Enter Order Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />

          <div className="flex justify-end gap-3">

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
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? "Creating..." : "Create Order"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}