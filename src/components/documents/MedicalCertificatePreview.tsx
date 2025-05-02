
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
  });

  // Add default font
  doc.setFont("helvetica", "normal");

  // Header
  doc.setFontSize(16);
  doc.text('ใบรับรองแพทย์', doc.internal.pageSize.width / 2, 30, { align: 'center' });
  doc.text('MEDICAL CERTIFICATE', doc.internal.pageSize.width / 2, 40, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text('เฮ้าส์ ออฟ เฮิร์บ เวลเนส คลินิก', doc.internal.pageSize.width / 2, 50, { align: 'center' });
  doc.setFont("helvetica", "normal");
  doc.text('เลขที่ใบอนุญาตประกอบกิจการ 24110000168', doc.internal.pageSize.width / 2, 55, { align: 'center' });
  doc.text('162 ถนนสวนสมเด็จ ต.หน้าเมือง อ.เมือง จ.ฉะเชิงเทรา', doc.internal.pageSize.width / 2, 60, { align: 'center' });
  doc.text('โทร. 0909149946', doc.internal.pageSize.width / 2, 65, { align: 'center' });

  // Certificate details
  const margin = 25;
  let currentY = 80;

  // Certificate number
  doc.text(`เลขที่: ${certificateNumber}`, doc.internal.pageSize.width - margin - 50, currentY);
  
  currentY += 15;
  doc.text(`ข้าพเจ้า ${doctorName} ได้ทำการตรวจร่างกาย`, margin, currentY);
  
  currentY += 10;
  doc.text(`นาย/นาง/นางสาว ${patientName}`, margin, currentY);
  
  currentY += 10;
  const visitDateStr = format(visitDate, 'd MMMM yyyy', { locale: th });
  doc.text(`เมื่อวันที่ ${visitDateStr}`, margin, currentY);

  if (diagnosis) {
    currentY += 10;
    doc.text(`ผลการตรวจ/วินิจฉัยโรค: ${diagnosis}`, margin, currentY);
  }

  if (startDate && endDate) {
    currentY += 10;
    const startDateStr = format(startDate, 'd MMMM yyyy', { locale: th });
    doc.text(`ให้หยุดพักตั้งแต่วันที่ ${startDateStr}`, margin, currentY);
    
    currentY += 10;
    const endDateStr = format(endDate, 'd MMMM yyyy', { locale: th });
    doc.text(`ถึงวันที่ ${endDateStr}`, margin, currentY);
    
    if (restDays) {
      currentY += 10;
      doc.text(`รวมเป็นเวลา ${restDays} วัน`, margin, currentY);
    }
  }

  currentY += 10;
  const currentDateStr = format(new Date(), 'd MMMM yyyy', { locale: th });
  doc.text(`ออกให้ ณ วันที่ ${currentDateStr}`, margin, currentY);

  // Signature section
  currentY += 30;
  doc.text('ลงชื่อ ............................................', doc.internal.pageSize.width - margin - 70, currentY);
  
  currentY += 10;
  doc.text(`(${doctorName})`, doc.internal.pageSize.width - margin - 70, currentY);
  
  currentY += 10;
  doc.text('แพทย์ผู้ตรวจ', doc.internal.pageSize.width - margin - 70, currentY);
  
  currentY += 10;
  doc.text('ใบอนุญาตประกอบวิชาชีพเวชกรรมเลขที่ ว.XXXXX', doc.internal.pageSize.width - margin - 70, currentY);

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
