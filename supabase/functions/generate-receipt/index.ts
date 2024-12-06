import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { jsPDF } from "https://esm.sh/jspdf@2.5.1"
import { format } from "https://esm.sh/date-fns@2.30.0"
import { th } from "https://esm.sh/date-fns@2.30.0/locale"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { receiptData } = await req.json()
    console.log('Received receipt data:', receiptData)

    // Create new PDF document
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Set font
    doc.setFont('helvetica');
    
    // Header
    doc.setFontSize(20);
    doc.text('ใบเสร็จรับเงิน', 105, 20, { align: 'center' });
    doc.setFontSize(16);
    doc.text('Receipt', 105, 30, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text('เฮ้าส์ ออฟ เฮิร์บ เวลเนส คลินิก', 105, 40, { align: 'center' });
    doc.text('162 ถนนสวนสมเด็จ ต.หน้าเมือง อ.เมือง จ.ฉะเชิงเทรา', 105, 45, { align: 'center' });
    doc.text('โทร. 0909149946', 105, 50, { align: 'center' });

    // Receipt details
    doc.text(`เลขที่: ${receiptData.receiptNumber}`, 170, 60, { align: 'right' });
    doc.text(`วันที่: ${format(new Date(receiptData.date), 'd MMMM yyyy', { locale: th })}`, 20, 70);
    doc.text(`ได้รับเงินจาก: ${receiptData.patientName}`, 20, 80);

    // Table header
    doc.line(20, 90, 190, 90);
    doc.text('รายการ', 20, 95);
    doc.text('จำนวนเงิน', 170, 95, { align: 'right' });
    doc.line(20, 100, 190, 100);

    // Table content
    let yPos = 110;
    receiptData.items.forEach((item) => {
      if (item.amount > 0) {
        doc.text(item.description, 20, yPos);
        doc.text(`${item.amount.toLocaleString('th-TH')} บาท`, 170, yPos, { align: 'right' });
        yPos += 10;
      }
    });

    // Total
    doc.rect(20, yPos, 170, 20);
    doc.text(`จำนวนเงินรวมทั้งสิ้น: ${receiptData.totalAmount.toLocaleString('th-TH')} บาท`, 105, yPos + 10, { align: 'center' });

    // Signature
    doc.text('ผู้รับเงิน ............................................', 170, yPos + 50, { align: 'right' });
    doc.text(`วันที่ ${format(new Date(), 'd MMMM yyyy', { locale: th })}`, 170, yPos + 60, { align: 'right' });

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
    console.error('Error generating receipt:', error);
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