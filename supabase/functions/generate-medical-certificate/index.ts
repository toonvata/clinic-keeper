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

    // Create new PDF document (A4 size)
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Set Thai font
    doc.setFont('helvetica');
    
    // Header
    doc.setFontSize(20);
    doc.text('ใบรับรองแพทย์', doc.internal.pageSize.width / 2, 30, { align: 'center' });
    doc.setFontSize(16);
    doc.text('Medical Certificate', doc.internal.pageSize.width / 2, 40, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text('เฮ้าส์ ออฟ เฮิร์บ เวลเนส คลินิก', doc.internal.pageSize.width / 2, 50, { align: 'center' });
    doc.text('House of Herb Wellness Clinic', doc.internal.pageSize.width / 2, 55, { align: 'center' });
    doc.text('162 ถนนสวนสมเด็จ ต.หน้าเมือง อ.เมือง จ.ฉะเชิงเทรา', doc.internal.pageSize.width / 2, 60, { align: 'center' });
    doc.text('โทร. 0909149946', doc.internal.pageSize.width / 2, 65, { align: 'center' });

    // Certificate details
    const margin = 25;
    let currentY = 80;

    // Certificate number
    doc.text(`เลขที่ / No: ${certificateData.certificateNumber}`, doc.internal.pageSize.width - margin - 50, currentY);
    
    currentY += 15;
    doc.text(`ข้าพเจ้า ${certificateData.doctorName} ได้ทำการตรวจร่างกาย`, margin, currentY);
    
    currentY += 10;
    doc.text(`นาย/นาง/นางสาว ${certificateData.patientName}`, margin, currentY);
    
    currentY += 10;
    doc.text(`เมื่อวันที่ ${format(new Date(certificateData.visitDate), 'd MMMM yyyy', { locale: th })}`, margin, currentY);

    if (certificateData.diagnosis) {
      currentY += 10;
      doc.text(`ผลการตรวจ/วินิจฉัยโรค: ${certificateData.diagnosis}`, margin, currentY);
    }

    if (certificateData.startDate && certificateData.endDate) {
      currentY += 10;
      doc.text(`ให้หยุดพักตั้งแต่วันที่ ${format(new Date(certificateData.startDate), 'd MMMM yyyy', { locale: th })}`, margin, currentY);
      
      currentY += 10;
      doc.text(`ถึงวันที่ ${format(new Date(certificateData.endDate), 'd MMMM yyyy', { locale: th })}`, margin, currentY);
      
      if (certificateData.restDays) {
        currentY += 10;
        doc.text(`รวมเป็นเวลา ${certificateData.restDays} วัน`, margin, currentY);
      }
    }

    currentY += 10;
    doc.text(`ออกให้ ณ วันที่ ${format(new Date(), 'd MMMM yyyy', { locale: th })}`, margin, currentY);

    // Signature section
    currentY += 30;
    doc.text('ลงชื่อ ............................................', doc.internal.pageSize.width - margin - 70, currentY);
    
    currentY += 10;
    doc.text(`(${certificateData.doctorName})`, doc.internal.pageSize.width - margin - 70, currentY);
    
    currentY += 10;
    doc.text('แพทย์ผู้ตรวจ', doc.internal.pageSize.width - margin - 70, currentY);
    
    currentY += 10;
    doc.text('ใบอนุญาตประกอบวิชาชีพเวชกรรมเลขที่ ว.XXXXX', doc.internal.pageSize.width - margin - 70, currentY);

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
    )
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
    )
  }
})