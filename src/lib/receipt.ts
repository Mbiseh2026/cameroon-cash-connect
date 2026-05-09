import jsPDF from "jspdf";

export interface ReceiptData {
  title: string;
  reference: string;
  rows: { label: string; value: string }[];
  amount: string;
  footer?: string;
}

export const downloadReceipt = (data: ReceiptData) => {
  const doc = new jsPDF({ unit: "pt", format: "a5" });
  const w = doc.internal.pageSize.getWidth();

  // Header band
  doc.setFillColor(30, 58, 138); // navy
  doc.rect(0, 0, w, 70, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("Eduvest", 24, 32);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("Financial identity for Africa", 24, 50);

  // Title
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(data.title, 24, 100);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Reference: ${data.reference}`, 24, 118);
  doc.text(`Date: ${new Date().toLocaleString()}`, 24, 132);

  // Amount card
  doc.setFillColor(34, 197, 94);
  doc.roundedRect(24, 150, w - 48, 60, 8, 8, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text("Amount", 40, 175);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text(data.amount, 40, 200);

  // Rows
  let y = 240;
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  data.rows.forEach((r) => {
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(r.label, 24, y);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text(r.value, w - 24, y, { align: "right" });
    y += 22;
  });

  // Footer
  doc.setDrawColor(220, 220, 220);
  doc.line(24, y + 10, w - 24, y + 10);
  doc.setFont("helvetica", "italic");
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text(
    data.footer || "This payment has been recorded on your Eduvest Trust Score.",
    24,
    y + 28,
    { maxWidth: w - 48 }
  );

  doc.save(`${data.title.replace(/\s+/g, "_")}_${data.reference}.pdf`);
};

export const genRef = (prefix = "EV") =>
  `${prefix}-${Date.now().toString(36).toUpperCase()}`;
