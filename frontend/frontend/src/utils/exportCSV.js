import { saveAs } from "file-saver";

export function exportSettlementsCSV(settlements) {
  if (!settlements.length) return;

  const headers = [
    "Settlement ID",
    "Order ID",
    "Vendor",
    "Amount",
    "Status",
    "Created At",
  ];

  const rows = settlements.map((item) => [
    item.id,
    item.order_id,
    item.vendor_name,
    item.amount,
    item.status,
    new Date(item.created_at).toLocaleString(),
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  saveAs(blob, "settlements.csv");
}