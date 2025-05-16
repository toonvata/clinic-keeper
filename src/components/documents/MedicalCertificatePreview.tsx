
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { jsPDF } from "jspdf";

interface MedicalCertificatePreviewProps {
  certificateNumber: string;
  doctorName: string;
  doctorLicenseNumber: string;
  patientName: string;
  visitDate: Date;
  startDate?: Date;
  endDate?: Date;
  restDays?: number;
  diagnosis: string;
  patientIdNumber?: string;
  patientAddress?: string;
  patientAge?: number;
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
  doctorLicenseNumber,
  patientName,
  visitDate,
  startDate,
  endDate,
  restDays,
  diagnosis,
  patientIdNumber,
  patientAddress,
  patientAge,
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
  doc.text('MEDICAL CERTIFICATE', doc.internal.pageSize.width / 2, 20, { align: 'center' });
  doc.text('ใบรับรองแพทย์', doc.internal.pageSize.width / 2, 30, { align: 'center' });
  
  doc.setFontSize(12);
  // Certificate number
  doc.text(`เลขที่ ${certificateNumber}`, doc.internal.pageSize.width / 2, 40, { align: 'center' });
  
  const margin = 20;
  let currentY = 50;

  // Doctor information with license number
  doc.text(`ข้าพเจ้า ${doctorName} ผู้ประกอบวิชาชีพแพทย์แผนไทยประยุกต์ ใบอนุญาตเลขที่ ${doctorLicenseNumber}`, margin, currentY);
  currentY += 10;
  doc.text(`เฮ้าส์ ออฟ เฮิร์บ เวลเนส สหคลินิก เลขที่ใบอนุญาตประกอบกิจการ 24110000168`, margin, currentY);
  currentY += 10;
  doc.text(`ที่อยู่ 162 ถนนสวนสมเด็จ ต.หน้าเมือง อ.เมือง จ.ฉะเชิงเทรา โทร.0909149946`, margin, currentY);
  
  currentY += 15;
  doc.text(`หนังสือรับรองฉบับนี้ขอรับรองว่า`, margin, currentY);
  currentY += 10;
  doc.text(`ข้าพเจ้าได้ทำการตรวจร่างกาย บุคคลดังต่อไปนี้`, margin, currentY);

  // Patient information
  currentY += 10;
  doc.text(`ชื่อ-นามสกุล ${patientName}`, margin, currentY);
  
  if (patientAge) {
    doc.text(`อายุ ${patientAge} ปี`, doc.internal.pageSize.width - margin - 40, currentY);
  }
  
  if (patientIdNumber) {
    currentY += 10;
    doc.text(`บัตรประจำตัวประชาชน ${patientIdNumber}`, margin, currentY);
  }
  
  if (patientAddress) {
    currentY += 10;
    doc.text(`ที่อยู่ ${patientAddress}`, margin, currentY);
  }
  
  currentY += 10;
  doc.text(`ณ สถานที่ตรวจ เฮ้าส์ ออฟ เฮิร์บ เวลเนส สหคลินิก 162 ถนนสวนสมเด็จ ต.หน้าเมือง อ.เมือง จ.ฉะเชิงเทรา`, margin, currentY);
  
  currentY += 10;
  const visitDateStr = format(visitDate, 'd MMMM yyyy');
  doc.text(`เมื่อวันที่ ${visitDateStr}`, margin, currentY);
  
  currentY += 15;
  doc.text(`จากการตรวจร่างกายของผู้มีรายชื่อดังกล่าวข้างต้น ขอให้ความเห็นดังต่อไปนี้`, margin, currentY);

  // Diagnosis
  if (diagnosis) {
    currentY += 10;
    doc.text(`ผลการตรวจ / วินิจฉัยโรค ${diagnosis}`, margin, currentY);
  }

  // Add rest period information
  if (startDate && endDate && restDays) {
    currentY += 10;
    const startDateStr = format(startDate, 'd MMMM yyyy');
    const endDateStr = format(endDate, 'd MMMM yyyy');
    doc.text(`วันที่เริ่มหยุดพัก ${startDateStr} ถึงวันที่ ${endDateStr} เป็นเวลา ${restDays} วัน`, margin, currentY);
  }

  currentY += 10;
  doc.text(`สรุปความเห็น ได้มาพบแพทย์ทำการรักษาจริง`, margin, currentY);

  const currentDateStr = format(new Date(), 'd MMMM yyyy');
  currentY += 10;
  doc.text(`ใบรับรองแพทย์นี้ออกให้ ณ วันที่ ${currentDateStr}`, margin, currentY);
  
  currentY += 10;
  doc.text(`ขอรับรองว่าข้อความข้างต้นเป็นความจริง`, margin, currentY);

  // Signatures
  currentY += 30;
  doc.text(`ลงชื่อ ............................................แพทย์ผู้ตรวจ`, doc.internal.pageSize.width - margin - 100, currentY);
  
  currentY += 10;
  doc.text(`${doctorName}`, doc.internal.pageSize.width - margin - 80, currentY);
  
  currentY += 30;
  doc.text(`ลงชื่อ ............................................ผู้มารับการตรวจ`, margin, currentY);

  // Return the PDF data as base64
  return doc.output('datauristring');
};

const MedicalCertificatePreview = ({
  certificateNumber,
  doctorName,
  doctorLicenseNumber,
  patientName,
  visitDate,
  startDate,
  endDate,
  restDays,
  diagnosis,
  patientIdNumber,
  patientAddress,
  patientAge,
}: MedicalCertificatePreviewProps) => {
  return (
    <div className="p-8 bg-white">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-2xl font-bold">ใบรับรองแพทย์</h1>
        <h2 className="text-xl">MEDICAL CERTIFICATE</h2>
        <p>เลขที่: {certificateNumber}</p>
      </div>

      <div className="space-y-1">
        <p>ข้าพเจ้า {doctorName} ผู้ประกอบวิชาชีพแพทย์แผนไทยประยุกต์ ใบอนุญาตเลขที่ {doctorLicenseNumber}</p>
        <p>เฮ้าส์ ออฟ เฮิร์บ เวลเนส สหคลินิก เลขที่ใบอนุญาตประกอบกิจการ 24110000168</p>
        <p>ที่อยู่ 162 ถนนสวนสมเด็จ ต.หน้าเมือง อ.เมือง จ.ฉะเชิงเทรา โทร.0909149946</p>
        <p className="mt-4">หนังสือรับรองฉบับนี้ขอรับรองว่า</p>
        <p>ข้าพเจ้าได้ทำการตรวจร่างกาย บุคคลดังต่อไปนี้</p>
        <div className="flex">
          <p className="flex-1">ชื่อ-นามสกุล {patientName}</p>
          {patientAge && <p>อายุ {patientAge} ปี</p>}
        </div>
        {patientIdNumber && <p>บัตรประจำตัวประชาชน {patientIdNumber}</p>}
        {patientAddress && <p>ที่อยู่ {patientAddress}</p>}
        <p>ณ สถานที่ตรวจ เฮ้าส์ ออฟ เฮิร์บ เวลเนส สหคลินิก 162 ถนนสวนสมเด็จ ต.หน้าเมือง อ.เมือง จ.ฉะเชิงเทรา</p>
        <p>
          เมื่อวันที่{" "}
          {format(visitDate, "d MMMM yyyy", { locale: th })}
        </p>

        <p className="mt-4">จากการตรวจร่างกายของผู้มีรายชื่อดังกล่าวข้างต้น ขอให้ความเห็นดังต่อไปนี้</p>
        {diagnosis && <p>ผลการตรวจ / วินิจฉัยโรค: {diagnosis}</p>}
        
        {/* Add rest period information */}
        {startDate && endDate && restDays && (
          <p>
            วันที่เริ่มหยุดพัก {format(startDate, "d MMMM yyyy", { locale: th })} 
            ถึงวันที่ {format(endDate, "d MMMM yyyy", { locale: th })} 
            เป็นเวลา {restDays} วัน
          </p>
        )}
        
        <p>สรุปความเห็น ได้มาพบแพทย์ทำการรักษาจริง</p>
        <p>
          ใบรับรองแพทย์นี้ออกให้ ณ วันที่{" "}
          {format(new Date(), "d MMMM yyyy", { locale: th })}
        </p>
        <p>ขอรับรองว่าข้อความข้างต้นเป็นความจริง</p>
      </div>

      <div className="text-right mt-16 space-y-1">
        <p>ลงชื่อ ............................................แพทย์ผู้ตรวจ</p>
        <p className="mr-20">({doctorName})</p>
      </div>

      <div className="mt-16 space-y-1">
        <p>ลงชื่อ ............................................ผู้มารับการตรวจ</p>
      </div>
    </div>
  );
};

export default MedicalCertificatePreview;
