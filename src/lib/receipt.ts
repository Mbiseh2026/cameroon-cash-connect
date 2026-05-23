import jsPDF from "jspdf";

export interface ReceiptData {
  title: string;
  reference: string;
  rows: { label: string; value: string }[];
  amount: string;
  footer?: string;
  logoUrl?: string;       // optional data URL or PNG/JPEG URL for org logo
  organization?: string;  // e.g. school name shown alongside logo
}

const loadImage = (url: string): Promise<string> =>
  new Promise((resolve, reject) => {
    if (url.startsWith("data:")) return resolve(url);
    fetch(url)
      .then((r) => r.blob())
      .then((b) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(b);
      })
      .catch(reject);
  });

export const downloadReceipt = async (data: ReceiptData) => {
  const doc = new jsPDF({ unit: "pt", format: "a5" });
  const w = doc.internal.pageSize.getWidth();

  // Header band
  doc.setFillColor(30, 58, 138);
  doc.rect(0, 0, w, 70, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("Eduvest", 24, 32);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("Financial identity for Africa", 24, 50);

  // Optional organisation logo at top-right
  let topY = 100;
  if (data.logoUrl) {
    try {
      const dataUrl = await loadImage(data.logoUrl);
      doc.addImage(dataUrl, "PNG", w - 70, 12, 48, 48, undefined, "FAST");
    } catch { /* ignore */ }
  }
  if (data.organization) {
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(data.organization, 24, topY);
    topY += 18;
  }

  // Title
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(data.title, 24, topY);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Reference: ${data.reference}`, 24, topY + 18);
  doc.text(`Date: ${new Date().toLocaleString()}`, 24, topY + 32);

  // Amount card
  const amtY = topY + 50;
  doc.setFillColor(34, 197, 94);
  doc.roundedRect(24, amtY, w - 48, 60, 8, 8, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text("Amount", 40, amtY + 25);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text(data.amount, 40, amtY + 50);

  // Rows
  let y = amtY + 90;
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

  doc.setDrawColor(220, 220, 220);
  doc.line(24, y + 10, w - 24, y + 10);
  doc.setFont("helvetica", "italic");
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text(
    data.footer || "This payment has been recorded on your Eduvest Trust Score.",
    24, y + 28, { maxWidth: w - 48 }
  );

  doc.save(`${data.title.replace(/\s+/g, "_")}_${data.reference}.pdf`);
};

export const genRef = (prefix = "EV") =>
  `${prefix}-${Date.now().toString(36).toUpperCase()}`;
