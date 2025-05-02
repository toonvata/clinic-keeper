
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { convertToThaiText } from "@/utils/thaiNumberToText";
import { jsPDF } from "jspdf";

interface ReceiptItem {
  description: string;
  amount: number;
}

interface ReceiptPreviewProps {
  receiptNumber: string;
  patientName: string;
  date: Date;
  items: ReceiptItem[];
  totalAmount: number;
}

// Add Thai font capability to jsPDF
const addThaiFont = (doc: jsPDF) => {
  // For better Thai support, we'll use a specific encoding
  doc.setFont("helvetica");
  doc.setFontSize(12);
  doc.setLanguage("th");
};

export const generateReceiptPDF = ({
  receiptNumber,
  patientName,
  date,
  items,
  totalAmount,
}: ReceiptPreviewProps): string => {
  // Create new PDF document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    putOnlyUsedFonts: true,
    floatPrecision: 16
  });

  // Add Thai font capability
  addThaiFont(doc);

  // Header
  doc.setFontSize(20);
  doc.text('ใบเสร็จรับเงิน / RECEIPT', doc.internal.pageSize.width / 2, 30, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text('House of Herb Wellness Clinic', doc.internal.pageSize.width / 2, 40, { align: 'center' });
  doc.setFont("helvetica", "normal");
  doc.text('License No. 24110000168', doc.internal.pageSize.width / 2, 45, { align: 'center' });
  doc.text('162 Suan Somdet Road, Mueang, Chachoengsao', doc.internal.pageSize.width / 2, 50, { align: 'center' });
  doc.text('Tel. 0909149946', doc.internal.pageSize.width / 2, 55, { align: 'center' });

  // Receipt details
  const margin = 20;
  doc.text(`No: ${receiptNumber}`, doc.internal.pageSize.width - margin - 50, 70);
  
  const dateStr = format(date, 'd MMMM yyyy');
  doc.text(`Date: ${dateStr}`, margin, 70);
  doc.text(`Received from: ${patientName}`, margin, 80);

  // Table header
  const startY = 90;
  doc.line(margin, startY, doc.internal.pageSize.width - margin, startY);
  doc.text('Description', margin, startY + 7);
  doc.text('Amount', doc.internal.pageSize.width - margin - 40, startY + 7);
  doc.line(margin, startY + 10, doc.internal.pageSize.width - margin, startY + 10);

  // Table content
  let currentY = startY + 20;
  items.forEach((item) => {
    if (item.amount > 0) {
      // For descriptions, use English equivalents
      let description = item.description;
      if (item.description === "ค่าบริการทางการแพทย์") {
        description = "Medical Service Fee";
      } else if (item.description === "ค่าหัตถการเพื่อการรักษา") {
        description = "Treatment Procedure Fee";
      } else if (item.description === "ค่ายาและเวชภัณฑ์") {
        description = "Medication and Medical Supplies";
      }
      
      doc.text(description, margin, currentY);
      doc.text(`${item.amount.toLocaleString()} THB`, doc.internal.pageSize.width - margin - 10, currentY, { align: 'right' });
      currentY += 10;
    }
  });

  // Total
  const totalBoxY = currentY + 10;
  doc.rect(margin, totalBoxY, doc.internal.pageSize.width - (2 * margin), 20);
  doc.text(
    `Total Amount: ${totalAmount.toLocaleString()} THB`, 
    doc.internal.pageSize.width / 2, 
    totalBoxY + 13, 
    { align: 'center' }
  );

  // Signature section
  const signatureY = totalBoxY + 50;
  doc.text('Received by ............................................', doc.internal.pageSize.width - margin - 70, signatureY);
  
  const currentDateStr = format(new Date(), 'd MMMM yyyy');
  doc.text(
    `Date ${currentDateStr}`,
    doc.internal.pageSize.width - margin - 70,
    signatureY + 10
  );

  // Return the PDF data as base64
  return doc.output('datauristring');
};

const ReceiptPreview = ({
  receiptNumber,
  patientName,
  date,
  items,
  totalAmount,
}: ReceiptPreviewProps) => {
  return (
    <div className="p-8 bg-white min-h-[29.7cm] w-[21cm] mx-auto">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-2xl font-bold">ใบเสร็จรับเงิน / RECEIPT</h1>
        <p className="font-bold">เฮ้าส์ ออฟ เฮิร์บ เวลเนส คลินิก</p>
        <p>เลขที่ใบอนุญาตประกอบกิจการ 24110000168</p>
        <p>House of Herb Wellness Clinic</p>
        <p>162 ถนนสวนสมเด็จ ต.หน้าเมือง อ.เมือง จ.ฉะเชิงเทรา</p>
        <p>โทร. 0909149946</p>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between">
          <p>วันที่ / Date: {format(date, "d MMMM yyyy", { locale: th })}</p>
          <p>เลขที่ / No: {receiptNumber}</p>
        </div>
        <p>ได้รับเงินจาก / Received from: {patientName}</p>

        <table className="w-full mt-4">
          <thead>
            <tr className="border-y border-black">
              <th className="text-left py-2">รายการ / Description</th>
              <th className="text-right py-2">จำนวนเงิน / Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              item.amount > 0 && (
                <tr key={index} className="border-b">
                  <td className="py-2">{item.description}</td>
                  <td className="text-right py-2">
                    {item.amount.toLocaleString("th-TH")} บาท
                  </td>
                </tr>
              )
            ))}
          </tbody>
        </table>

        <div className="border p-4 mt-4">
          <p className="text-center">จำนวนเงินรวมทั้งสิ้น / Total Amount: {totalAmount.toLocaleString("th-TH")} บาท</p>
          <p className="text-center mt-2">({convertToThaiText(totalAmount)})</p>
        </div>
      </div>

      <div className="text-right mt-16 space-y-2">
        <p>ผู้รับเงิน / Received by ............................................</p>
        <p>วันที่ / Date {format(new Date(), "d MMMM yyyy", { locale: th })}</p>
      </div>
    </div>
  );
};

export default ReceiptPreview;
