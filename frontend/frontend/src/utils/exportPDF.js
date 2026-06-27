import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function exportSettlementsPDF(settlements) {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Vendor Settlement Report", 14, 20);

  doc.setFontSize(11);
  doc.text(
    `Generated on: ${new Date().toLocaleString()}`,
    14,
    28
  );

  const tableData = settlements.map((item) => [
    item.id,
    item.order_id,
    item.vendor_name || "-",
    `₹${item.amount}`,
    item.status,
    new Date(item.created_at).toLocaleDateString(),
  ]);

  autoTable(doc, {
    startY: 35,
    head: [[
      "Settlement ID",
      "Order ID",
      "Vendor",
      "Amount",
      "Status",
      "Created"
    ]],
    body: tableData,
    styles: {
      fontSize: 10,
    },
    headStyles: {
      fillColor: [37, 99, 235], // Blue header
      textColor: [255, 255, 255],
    },
  });

  doc.save("Settlement_Report.pdf");
}