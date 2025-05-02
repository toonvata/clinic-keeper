
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

    // Header - Use English for better compatibility
    doc.setFontSize(16);
    doc.text('MEDICAL CERTIFICATE', doc.internal.pageSize.width / 2, 30, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('House of Herb Wellness Clinic', doc.internal.pageSize.width / 2, 40, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.text('License No. 24110000168', doc.internal.pageSize.width / 2, 45, { align: 'center' });
    doc.text('162 Suan Somdet Road, Mueang, Chachoengsao', doc.internal.pageSize.width / 2, 50, { align: 'center' });
    doc.text('Tel. 0909149946', doc.internal.pageSize.width / 2, 55, { align: 'center' });

    // Certificate details
    const margin = 25;
    let currentY = 70;

    // Certificate number
    doc.text(`Certificate No.: ${certificateData.certificateNumber}`, doc.internal.pageSize.width - margin - 50, currentY);
    
    currentY += 15;
    doc.text(`This is to certify that Dr. ${certificateData.doctorName} has examined`, margin, currentY);
    
    currentY += 10;
    doc.text(`Patient: ${certificateData.patientName}`, margin, currentY);
    
    currentY += 10;
    const visitDate = format(new Date(certificateData.visitDate), 'd MMMM yyyy');
    doc.text(`Date of visit: ${visitDate}`, margin, currentY);

    if (certificateData.diagnosis) {
      currentY += 10;
      doc.text(`Diagnosis: ${certificateData.diagnosis}`, margin, currentY);
    }

    if (certificateData.startDate && certificateData.endDate) {
      currentY += 10;
      const startDate = format(new Date(certificateData.startDate), 'd MMMM yyyy');
      doc.text(`The patient needs to rest from: ${startDate}`, margin, currentY);
      
      currentY += 10;
      const endDate = format(new Date(certificateData.endDate), 'd MMMM yyyy');
      doc.text(`Until: ${endDate}`, margin, currentY);
      
      if (certificateData.restDays) {
        currentY += 10;
        doc.text(`Total: ${certificateData.restDays} day(s)`, margin, currentY);
      }
    }

    currentY += 10;
    const currentDate = format(new Date(), 'd MMMM yyyy');
    doc.text(`Issued on: ${currentDate}`, margin, currentY);

    // Signature section
    currentY += 30;
    doc.text('Signature: ............................................', doc.internal.pageSize.width - margin - 70, currentY);
    
    currentY += 10;
    doc.text(`(Dr. ${certificateData.doctorName})`, doc.internal.pageSize.width - margin - 70, currentY);
    
    currentY += 10;
    doc.text('Examining physician', doc.internal.pageSize.width - margin - 70, currentY);
    
    currentY += 10;
    doc.text('Medical License No. W.XXXXX', doc.internal.pageSize.width - margin - 70, currentY);

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
