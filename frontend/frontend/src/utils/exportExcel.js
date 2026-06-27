import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export function exportSettlementsExcel(settlements) {
  if (!settlements.length) return;

  const data = settlements.map((item) => ({
    "Settlement ID": item.id,
    "Order ID": item.order_id,
    Vendor: item.vendor_name || "-",
    Amount: item.amount,
    Status: item.status,
    "Created At": new Date(item.created_at).toLocaleString(),
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Settlements"
  );

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const blob = new Blob([excelBuffer], {
    type:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(blob, "settlements.xlsx");
}