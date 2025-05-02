
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { jsPDF } from "jspdf";

interface MedicalCertificatePreviewProps {
  certificateNumber: string;
  doctorName: string;
  patientName: string;
  visitDate: Date;
  startDate?: Date;
  endDate?: Date;
  restDays?: number;
  diagnosis: string;
}

// Add Thai font capability to jsPDF
const addThaiFont = (doc: jsPDF) => {
  // For better Thai support, we'll use a specific encoding
  doc.setFont("helvetica");
  doc.setFontSize(12);
  doc.setLanguage("th");
};

export const generateMedicalCertificatePDF = ({
  certificateNumber,
  doctorName,
  patientName,
  visitDate,
  startDate,
  endDate,
  restDays,
  diagnosis,
}: MedicalCertificatePreviewProps): string => {
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
  doc.setFontSize(16);
  doc.text('MEDICAL CERTIFICATE', doc.internal.pageSize.width / 2, 30, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text('House of Herb Wellness Clinic', doc.internal.pageSize.width / 2, 40, { align: 'center' });
  doc.setFont("helvetica", "normal");
  doc.text('License No. 24110000168', doc.internal.pageSize.width / 2, 45, { align: 'center' });
  doc.text('162 Suan Somdet Road, Mueang, Chachoengsao', doc.internal.pageSize.width / 2, 50, { align: 'center' });
  doc.text('Tel. 0909149946', doc.internal.pageSize.width / 2, 55, { align: 'center' });

  // Certificate details
  const margin = 25;
  let currentY = 70;

  // Certificate number
  doc.text(`Certificate No.: ${certificateNumber}`, doc.internal.pageSize.width - margin - 50, currentY);
  
  currentY += 15;
  doc.text(`This is to certify that Dr. ${doctorName} has examined`, margin, currentY);
  
  currentY += 10;
  doc.text(`Patient: ${patientName}`, margin, currentY);
  
  currentY += 10;
  const visitDateStr = format(visitDate, 'd MMMM yyyy');
  doc.text(`Date of visit: ${visitDateStr}`, margin, currentY);

  if (diagnosis) {
    currentY += 10;
    doc.text(`Diagnosis: ${diagnosis}`, margin, currentY);
  }

  if (startDate && endDate) {
    currentY += 10;
    const startDateStr = format(startDate, 'd MMMM yyyy');
    doc.text(`The patient needs to rest from: ${startDateStr}`, margin, currentY);
    
    currentY += 10;
    const endDateStr = format(endDate, 'd MMMM yyyy');
    doc.text(`Until: ${endDateStr}`, margin, currentY);
    
    if (restDays) {
      currentY += 10;
      doc.text(`Total: ${restDays} day(s)`, margin, currentY);
    }
  }

  currentY += 10;
  const currentDateStr = format(new Date(), 'd MMMM yyyy');
  doc.text(`Issued on: ${currentDateStr}`, margin, currentY);

  // Signature section
  currentY += 30;
  doc.text('Signature: ............................................', doc.internal.pageSize.width - margin - 70, currentY);
  
  currentY += 10;
  doc.text(`(Dr. ${doctorName})`, doc.internal.pageSize.width - margin - 70, currentY);
  
  currentY += 10;
  doc.text('Examining physician', doc.internal.pageSize.width - margin - 70, currentY);
  
  currentY += 10;
  doc.text('Medical License No. W.XXXXX', doc.internal.pageSize.width - margin - 70, currentY);

  // Return the PDF data as base64
  return doc.output('datauristring');
};

const MedicalCertificatePreview = ({
  certificateNumber,
  doctorName,
  patientName,
  visitDate,
  startDate,
  endDate,
  restDays,
  diagnosis,
}: MedicalCertificatePreviewProps) => {
  return (
    <div className="p-8 bg-white">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-2xl font-bold">ใบรับรองแพทย์</h1>
        <h2 className="text-xl">MEDICAL CERTIFICATE</h2>
        <p className="font-bold">เฮ้าส์ ออฟ เฮิร์บ เวลเนส คลินิก</p>
        <p>เลขที่ใบอนุญาตประกอบกิจการ 24110000168</p>
        <p>162 ถนนสวนสมเด็จ ต.หน้าเมือง อ.เมือง จ.ฉะเชิงเทรา</p>
        <p>โทร. 0909149946</p>
      </div>

      <div className="space-y-4">
        <div className="text-right">
          <p>เลขที่: {certificateNumber}</p>
        </div>
        <p>ข้าพเจ้า {doctorName} ได้ทำการตรวจร่างกาย</p>
        <p>นาย/นาง/นางสาว {patientName}</p>
        <p>
          เมื่อวันที่{" "}
          {format(visitDate, "d MMMM yyyy", { locale: th })}
        </p>
        {diagnosis && <p>ผลการตรวจ/วินิจฉัยโรค: {diagnosis}</p>}
        {startDate && endDate && (
          <>
            <p>
              ให้หยุดพักตั้งแต่วันที่{" "}
              {format(startDate, "d MMMM yyyy", { locale: th })}
            </p>
            <p>
              ถึงวันที่ {format(endDate, "d MMMM yyyy", { locale: th })}
            </p>
            {restDays && <p>รวมเป็นเวลา {restDays} วัน</p>}
          </>
        )}
        <p>
          ออกให้ ณ วันที่{" "}
          {format(new Date(), "d MMMM yyyy", { locale: th })}
        </p>
      </div>

      <div className="text-right mt-16 space-y-2">
        <p>ลงชื่อ ............................................</p>
        <p>({doctorName})</p>
        <p>แพทย์ผู้ตรวจ</p>
        <p>ใบอนุญาตประกอบวิชาชีพเวชกรรมเลขที่ ว.XXXXX</p>
      </div>
    </div>
  );
};

export default MedicalCertificatePreview;
