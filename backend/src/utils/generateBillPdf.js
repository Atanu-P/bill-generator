const PDFDocument = require("pdfkit");

async function generateBillPdf(bill) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 40 });
      let buffers = [];

      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // Header
      doc.fontSize(20).text("Bill Receipt", { align: "center" });
      doc.moveDown();
      doc.fontSize(12).text(`Customer Name: ${bill.customerName}`);
      doc.text(`Bill ID: ${bill._id}`);
      doc.text(`Date: ${bill.createdAt.toLocaleString()}`);
      doc.moveDown();

      // Table Header
      doc.fontSize(12).text("Items:", { underline: true });
      doc.moveDown(0.5);

      // Table Columns
      doc.font("Helvetica-Bold");
      doc.text("Name", 50, doc.y, { continued: true, width: 100 });
      doc.text("Qty", 150, doc.y, { continued: true, width: 50 });
      doc.text("Price", 200, doc.y, { continued: true, width: 60 });
      doc.text("Discount", 260, doc.y, { continued: true, width: 70 });
      doc.text("Total", 330, doc.y, { width: 70 });
      doc.font("Helvetica");
      doc.moveDown(0.5);

      // Table Rows
      bill.items.forEach((item) => {
        doc.text(item.name, 50, doc.y, { continued: true, width: 100 });
        doc.text(item.quantity, 150, doc.y, { continued: true, width: 50 });
        doc.text(item.price.toFixed(2), 200, doc.y, { continued: true, width: 60 });
        doc.text(`${item.discount || 0}%`, 260, doc.y, { continued: true, width: 70 });
        doc.text(item.sellingPrice.toFixed(2), 330, doc.y, { width: 70 });
      });

      doc.moveDown();
      doc.font("Helvetica-Bold");
      doc.text(`Total Items: ${bill.totalItems}`);
      doc.text(`Total Amount: ₹${bill.totalAmount.toFixed(2)}`);
      doc.font("Helvetica");

      doc.end();
    } catch (err) {
      console.error("generating PDF:", err);
      reject(err);
    }
  });
}

module.exports = generateBillPdf;
