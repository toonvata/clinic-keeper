
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
      format: 'a4',
      putOnlyUsedFonts: true,
      floatPrecision: 16
    });

    // Setup for better encoding support
    doc.setLanguage("th");
    doc.setFont('helvetica');
    doc.setFontSize(12);

    console.log('Created PDF document with font support');

    // Header - Use English for better compatibility
    doc.setFontSize(20);
    doc.text('RECEIPT', doc.internal.pageSize.width / 2, 30, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('House of Herb Wellness Clinic', doc.internal.pageSize.width / 2, 40, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.text('License No. 24110000168', doc.internal.pageSize.width / 2, 45, { align: 'center' });
    doc.text('162 Suan Somdet Road, Mueang, Chachoengsao', doc.internal.pageSize.width / 2, 50, { align: 'center' });
    doc.text('Tel. 0909149946', doc.internal.pageSize.width / 2, 55, { align: 'center' });

    // Receipt details
    const margin = 20;
    doc.text(`No: ${receiptData.receiptNumber}`, doc.internal.pageSize.width - margin - 50, 75);
    doc.text(`Date: ${format(new Date(receiptData.date), 'd MMMM yyyy')}`, margin, 75);
    doc.text(`Received from: ${receiptData.patientName}`, margin, 85);

    // Table header
    const startY = 95;
    doc.line(margin, startY, doc.internal.pageSize.width - margin, startY);
    doc.text('Description', margin, startY + 7);
    doc.text('Amount', doc.internal.pageSize.width - margin - 40, startY + 7);
    doc.line(margin, startY + 10, doc.internal.pageSize.width - margin, startY + 10);

    // Table content
    let currentY = startY + 20;
    receiptData.items.forEach((item) => {
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
        doc.text(`${item.amount.toLocaleString()} THB`, doc.internal.pageSize.width - margin - 40, currentY, { align: 'right' });
        currentY += 10;
      }
    });

    // Total
    const totalBoxY = currentY + 10;
    doc.rect(margin, totalBoxY, doc.internal.pageSize.width - (2 * margin), 20);
    doc.text(
      `Total Amount: ${receiptData.totalAmount.toLocaleString()} THB`, 
      doc.internal.pageSize.width / 2, 
      totalBoxY + 13, 
      { align: 'center' }
    );

    // Signature section
    const signatureY = totalBoxY + 50;
    doc.text('Received by ............................................', doc.internal.pageSize.width - margin - 70, signatureY);
    doc.text(
      `Date ${format(new Date(), 'd MMMM yyyy')}`,
      doc.internal.pageSize.width - margin - 70,
      signatureY + 10
    );

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
    );
  }
});
