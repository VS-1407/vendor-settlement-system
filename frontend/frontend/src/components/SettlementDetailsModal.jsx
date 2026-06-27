export default function SettlementDetailsModal({
  open,
  settlement,
  onClose,
}) {
  if (!open || !settlement) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            Settlement Details
          </h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black text-xl"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">

          <div className="flex justify-between">
            <span className="font-semibold">Settlement ID</span>
            <span>#{settlement.id}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-semibold">Order ID</span>
            <span>#{settlement.order_id}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-semibold">Vendor ID</span>
            <span>{settlement.vendor_id}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-semibold">Amount</span>
            <span>₹{Number(settlement.amount).toLocaleString()}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-semibold">Status</span>

            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                settlement.status === "Completed"
                  ? "bg-green-100 text-green-700"
                  : settlement.status === "Processing"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {settlement.status}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="font-semibold">Created At</span>

            <span>
              {settlement.created_at
                ? new Date(settlement.created_at).toLocaleString()
                : "-"}
            </span>
          </div>

        </div>

        <div className="mt-8 text-right">
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}