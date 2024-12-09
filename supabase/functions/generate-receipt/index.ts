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
    const { receiptData } = await req.json()
    console.log('Received receipt data:', receiptData)

    // Create new PDF document
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Set Thai font
    doc.setFont('helvetica');
    
    // Add clinic logo if available
    // const logoWidth = 50;
    // const logoHeight = 20;
    // doc.addImage(logoBase64, 'PNG', (doc.internal.pageSize.width - logoWidth) / 2, 20, logoWidth, logoHeight);

    // Header
    doc.setFontSize(20);
    doc.text('ใบเสร็จรับเงิน / Receipt', doc.internal.pageSize.width / 2, 30, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text('เฮ้าส์ ออฟ เฮิร์บ เวลเนส คลินิก', doc.internal.pageSize.width / 2, 40, { align: 'center' });
    doc.text('House of Herb Wellness Clinic', doc.internal.pageSize.width / 2, 45, { align: 'center' });
    doc.text('162 ถนนสวนสมเด็จ ต.หน้าเมือง อ.เมือง จ.ฉะเชิงเทรา', doc.internal.pageSize.width / 2, 50, { align: 'center' });
    doc.text('โทร. 0909149946', doc.internal.pageSize.width / 2, 55, { align: 'center' });

    // Receipt details
    const margin = 20;
    doc.text(`เลขที่ / No: ${receiptData.receiptNumber}`, doc.internal.pageSize.width - margin - 50, 70);
    doc.text(`วันที่ / Date: ${format(new Date(receiptData.date), 'd MMMM yyyy', { locale: th })}`, margin, 70);
    doc.text(`ได้รับเงินจาก / Received from: ${receiptData.patientName}`, margin, 80);

    // Table header
    const startY = 90;
    doc.line(margin, startY, doc.internal.pageSize.width - margin, startY);
    doc.text('รายการ / Description', margin, startY + 7);
    doc.text('จำนวนเงิน / Amount', doc.internal.pageSize.width - margin - 40, startY + 7);
    doc.line(margin, startY + 10, doc.internal.pageSize.width - margin, startY + 10);

    // Table content
    let currentY = startY + 20;
    receiptData.items.forEach((item: any) => {
      if (item.amount > 0) {
        doc.text(item.description, margin, currentY);
        doc.text(`${item.amount.toLocaleString('th-TH')} บาท`, doc.internal.pageSize.width - margin - 40, currentY, { align: 'right' });
        currentY += 10;
      }
    });

    // Total
    const totalBoxY = currentY + 10;
    doc.rect(margin, totalBoxY, doc.internal.pageSize.width - (2 * margin), 20);
    doc.text(
      `จำนวนเงินรวมทั้งสิ้น / Total Amount: ${receiptData.totalAmount.toLocaleString('th-TH')} บาท`, 
      doc.internal.pageSize.width / 2, 
      totalBoxY + 13, 
      { align: 'center' }
    );

    // Signature section
    const signatureY = totalBoxY + 50;
    doc.text('ผู้รับเงิน / Received by ............................................', doc.internal.pageSize.width - margin - 70, signatureY);
    doc.text(
      `วันที่ / Date ${format(new Date(), 'd MMMM yyyy', { locale: th })}`,
      doc.internal.pageSize.width - margin - 70,
      signatureY + 10
    );

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