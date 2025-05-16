
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { jsPDF } from "https://esm.sh/jspdf@2.5.1"
import { format } from "https://esm.sh/date-fns@2.30.0"
import { th } from "https://esm.sh/date-fns@2.30.0/locale"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { certificateData } = await req.json()
    console.log('Received certificate data:', certificateData)

    // Create new PDF document
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      putOnlyUsedFonts: true,
      floatPrecision: 16
    });

    // Setup for better encoding support
    doc.setLanguage("th");
    doc.setFont('helvetica');
    doc.setFontSize(12);

    console.log('Created PDF document with font support');

    // Header
    doc.setFontSize(16);
    doc.text('MEDICAL CERTIFICATE', doc.internal.pageSize.width / 2, 20, { align: 'center' });
    doc.text('ใบรับรองแพทย์', doc.internal.pageSize.width / 2, 30, { align: 'center' });
    
    doc.setFontSize(12);
    // Certificate number
    doc.text(`เลขที่ ${certificateData.certificateNumber}`, doc.internal.pageSize.width / 2, 40, { align: 'center' });
    
    const margin = 20;
    let currentY = 50;

    // Doctor information with license number
    doc.text(`ข้าพเจ้า ${certificateData.doctorName} ผู้ประกอบวิชาชีพแพทย์แผนไทยประยุกต์ ใบอนุญาตเลขที่ ${certificateData.doctorLicenseNumber || "พทป.2381"}`, margin, currentY);
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
    doc.text(`ชื่อ-นามสกุล ${certificateData.patientName}`, margin, currentY);
    
    if (certificateData.patientAge) {
      doc.text(`อายุ ${certificateData.patientAge} ปี`, doc.internal.pageSize.width - margin - 40, currentY);
    }
    
    if (certificateData.patientIdNumber) {
      currentY += 10;
      doc.text(`บัตรประจำตัวประชาชน ${certificateData.patientIdNumber}`, margin, currentY);
    }
    
    if (certificateData.patientAddress) {
      currentY += 10;
      doc.text(`ที่อยู่ ${certificateData.patientAddress}`, margin, currentY);
    }
    
    currentY += 10;
    doc.text(`ณ สถานที่ตรวจ เฮ้าส์ ออฟ เฮิร์บ เวลเนส สหคลินิก 162 ถนนสวนสมเด็จ ต.หน้าเมือง อ.เมือง จ.ฉะเชิงเทรา`, margin, currentY);
    
    currentY += 10;
    const visitDate = format(new Date(certificateData.visitDate), 'd MMMM yyyy');
    doc.text(`เมื่อวันที่ ${visitDate}`, margin, currentY);
    
    currentY += 15;
    doc.text(`จากการตรวจร่างกายของผู้มีรายชื่อดังกล่าวข้างต้น ขอให้ความเห็นดังต่อไปนี้`, margin, currentY);

    // Diagnosis
    if (certificateData.diagnosis) {
      currentY += 10;
      doc.text(`ผลการตรวจ / วินิจฉัยโรค ${certificateData.diagnosis}`, margin, currentY);
    }

    // Add rest period information
    if (certificateData.startDate && certificateData.endDate && certificateData.restDays) {
      currentY += 10;
      const startDateStr = format(new Date(certificateData.startDate), 'd MMMM yyyy');
      const endDateStr = format(new Date(certificateData.endDate), 'd MMMM yyyy');
      doc.text(`วันที่เริ่มหยุดพัก ${startDateStr} ถึงวันที่ ${endDateStr} เป็นเวลา ${certificateData.restDays} วัน`, margin, currentY);
    }

    currentY += 10;
    doc.text(`สรุปความเห็น ได้มาพบแพทย์ทำการรักษาจริง`, margin, currentY);

    const currentDate = format(new Date(), 'd MMMM yyyy');
    currentY += 10;
    doc.text(`ใบรับรองแพทย์นี้ออกให้ ณ วันที่ ${currentDate}`, margin, currentY);
    
    currentY += 10;
    doc.text(`ขอรับรองว่าข้อความข้างต้นเป็นความจริง`, margin, currentY);

    // Signatures
    currentY += 30;
    doc.text(`ลงชื่อ ............................................แพทย์ผู้ตรวจ`, doc.internal.pageSize.width - margin - 100, currentY);
    
    currentY += 10;
    doc.text(`${certificateData.doctorName}`, doc.internal.pageSize.width - margin - 80, currentY);
    
    currentY += 30;
    doc.text(`ลงชื่อ ............................................ผู้มารับการตรวจ`, margin, currentY);

    console.log('Generating PDF...');

    // Convert PDF to base64
    const pdfOutput = doc.output('arraybuffer');
    const base64Pdf = btoa(String.fromCharCode(...new Uint8Array(pdfOutput)));
    console.log('PDF generated successfully');

    return new Response(
      JSON.stringify({ pdf: base64Pdf }),
      { 
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error generating medical certificate:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }, 
        status: 500 
      }
    );
  }
});
