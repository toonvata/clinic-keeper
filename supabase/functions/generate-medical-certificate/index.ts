import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import * as puppeteer from 'https://deno.land/x/puppeteer@16.2.0/mod.ts'

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
    const { certificateData } = await req.json()
    console.log('Received certificate data:', certificateData)

    // Launch browser
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    console.log('Browser launched successfully')

    // Generate HTML content
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>ใบรับรองแพทย์</title>
          <style>
            body { 
              font-family: sans-serif;
              padding: 40px;
              font-size: 16px;
              line-height: 1.6;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .content {
              margin: 20px 0;
            }
            .signature {
              text-align: right;
              margin-top: 50px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>ใบรับรองแพทย์</h1>
            <h2>Medical Certificate</h2>
            <p>เฮ้าส์ ออฟ เฮิร์บ เวลเนส คลินิก</p>
            <p>162 ถนนสวนสมเด็จ ต.หน้าเมือง อ.เมือง จ.ฉะเชิงเทรา</p>
            <p>โทร. 0909149946</p>
          </div>

          <div class="content">
            <p>เลขที่: ${certificateData.certificateNumber}</p>
            <p>ข้าพเจ้า ${certificateData.doctorName} ได้ทำการตรวจร่างกาย</p>
            <p>นาย/นาง/นางสาว ${certificateData.patientName}</p>
            <p>เมื่อวันที่ ${new Date(certificateData.visitDate).toLocaleDateString('th-TH')}</p>
            ${certificateData.diagnosis ? `<p>ผลการตรวจ/วินิจฉัยโรค: ${certificateData.diagnosis}</p>` : ''}
            ${certificateData.startDate && certificateData.endDate ? `
              <p>ให้หยุดพักตั้งแต่วันที่ ${new Date(certificateData.startDate).toLocaleDateString('th-TH')}</p>
              <p>ถึงวันที่ ${new Date(certificateData.endDate).toLocaleDateString('th-TH')}</p>
              <p>รวมเป็นเวลา ${certificateData.restDays} วัน</p>
            ` : ''}
            <p>ออกให้ ณ วันที่ ${new Date().toLocaleDateString('th-TH')}</p>
          </div>

          <div class="signature">
            <p>ลงชื่อ ............................................</p>
            <p>(${certificateData.doctorName})</p>
            <p>แพทย์ผู้ตรวจ</p>
            <p>ใบอนุญาตประกอบวิชาชีพเวชกรรมเลขที่ ว.XXXXX</p>
          </div>
        </body>
      </html>
    `

    console.log('HTML content generated')

    // Set content and generate PDF
    await page.setContent(htmlContent)
    console.log('Content set to page')

    const pdf = await page.pdf({ 
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm'
      }
    })

    console.log('PDF generated successfully')

    // Close browser
    await browser.close()
    console.log('Browser closed')

    // Convert PDF to base64
    const base64Pdf = btoa(String.fromCharCode(...new Uint8Array(pdf)))
    console.log('PDF converted to base64')

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
    console.error('Error generating medical certificate:', error)
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