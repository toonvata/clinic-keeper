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

    // Use default font since we can't reliably load Thai fonts in Edge Function
    doc.setFont('helvetica');
    
    // Header
    doc.setFontSize(20);
    doc.text('Medical Certificate', doc.internal.pageSize.width / 2, 30, { align: 'center' });
    doc.setFontSize(16);
    doc.text('House of Herb Wellness Clinic', doc.internal.pageSize.width / 2, 40, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text('162 Suansomdet Road, Na Mueang, Mueang, Chachoengsao', doc.internal.pageSize.width / 2, 50, { align: 'center' });
    doc.text('Tel. 0909149946', doc.internal.pageSize.width / 2, 55, { align: 'center' });

    // Certificate details
    const margin = 25;
    let currentY = 80;

    // Certificate number
    doc.text(`Certificate No: ${certificateData.certificateNumber}`, doc.internal.pageSize.width - margin - 50, currentY);
    
    currentY += 15;
    doc.text(`Doctor: ${certificateData.doctorName}`, margin, currentY);
    
    currentY += 10;
    doc.text(`Patient: ${certificateData.patientName}`, margin, currentY);
    
    currentY += 10;
    doc.text(`Visit Date: ${format(new Date(certificateData.visitDate), 'dd/MM/yyyy')}`, margin, currentY);

    if (certificateData.diagnosis) {
      currentY += 10;
      doc.text(`Diagnosis: ${certificateData.diagnosis}`, margin, currentY);
    }

    if (certificateData.startDate && certificateData.endDate) {
      currentY += 10;
      doc.text(`Rest Period: ${format(new Date(certificateData.startDate), 'dd/MM/yyyy')}`, margin, currentY);
      
      currentY += 10;
      doc.text(`To: ${format(new Date(certificateData.endDate), 'dd/MM/yyyy')}`, margin, currentY);
      
      if (certificateData.restDays) {
        currentY += 10;
        doc.text(`Total: ${certificateData.restDays} days`, margin, currentY);
      }
    }

    currentY += 10;
    doc.text(`Issue Date: ${format(new Date(), 'dd/MM/yyyy')}`, margin, currentY);

    // Signature section
    currentY += 30;
    doc.text('Signature: ............................................', doc.internal.pageSize.width - margin - 70, currentY);
    
    currentY += 10;
    doc.text(`(${certificateData.doctorName})`, doc.internal.pageSize.width - margin - 70, currentY);
    
    currentY += 10;
    doc.text('Medical Doctor', doc.internal.pageSize.width - margin - 70, currentY);
    
    currentY += 10;
    doc.text('Medical License No. XXXXX', doc.internal.pageSize.width - margin - 70, currentY);

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