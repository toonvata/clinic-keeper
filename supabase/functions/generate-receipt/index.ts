import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import * as puppeteer from 'https://deno.land/x/puppeteer@16.2.0/mod.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const units = ['', 'หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า'];
const positions = ['', 'สิบ', 'ร้อย', 'พัน', 'หมื่น', 'แสน', 'ล้าน'];

function convertToThaiText(number: number): string {
  if (number === 0) return 'ศูนย์บาทถ้วน';
  
  const decimal = Math.round((number % 1) * 100);
  const integer = Math.floor(number);
  
  let result = '';
  
  // Convert integer part
  const intStr = integer.toString();
  for (let i = 0; i < intStr.length; i++) {
    const digit = parseInt(intStr[i]);
    if (digit !== 0) {
      // Special case for tens
      if (digit === 1 && positions[intStr.length - i - 1] === 'สิบ') {
        result += positions[intStr.length - i - 1];
      } else if (digit === 2 && positions[intStr.length - i - 1] === 'สิบ') {
        result += 'ยี่' + positions[intStr.length - i - 1];
      } else {
        result += units[digit] + positions[intStr.length - i - 1];
      }
    }
  }
  
  result += 'บาท';
  
  // Add satang if exists
  if (decimal > 0) {
    const satangStr = decimal.toString().padStart(2, '0');
    for (let i = 0; i < satangStr.length; i++) {
      const digit = parseInt(satangStr[i]);
      if (digit !== 0) {
        if (i === 0) {
          if (digit === 1) {
            result += 'สิบ';
          } else if (digit === 2) {
            result += 'ยี่สิบ';
          } else {
            result += units[digit] + 'สิบ';
          }
        } else {
          result += units[digit];
        }
      }
    }
    result += 'สตางค์';
  } else {
    result += 'ถ้วน';
  }
  
  return result;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { receiptData } = await req.json()
    console.log('Received receipt data:', receiptData)

    // Launch browser
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    console.log('Browser launched successfully')

    const thaiAmountText = convertToThaiText(receiptData.totalAmount);

    // Generate HTML content
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>ใบเสร็จรับเงิน</title>
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
            .amount {
              margin: 20px 0;
              padding: 10px;
              border: 1px solid #000;
              text-align: center;
            }
            .signature {
              text-align: right;
              margin-top: 50px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
            }
            th, td {
              padding: 8px;
              text-align: left;
              border-bottom: 1px solid #ddd;
            }
            .amount-column {
              text-align: right;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>ใบเสร็จรับเงิน</h1>
            <h2>Receipt</h2>
            <p>เฮ้าส์ ออฟ เฮิร์บ เวลเนส คลินิก</p>
            <p>162 ถนนสวนสมเด็จ ต.หน้าเมือง อ.เมือง จ.ฉะเชิงเทรา</p>
            <p>โทร. 0909149946</p>
          </div>

          <div class="content">
            <p>เลขที่: ${receiptData.receiptNumber}</p>
            <p>วันที่: ${new Date(receiptData.date).toLocaleDateString('th-TH')}</p>
            <p>ได้รับเงินจาก: ${receiptData.patientName}</p>

            <table>
              <tr>
                <th>รายการ</th>
                <th class="amount-column">จำนวนเงิน</th>
              </tr>
              ${receiptData.items
                .filter(item => item.amount > 0)
                .map(item => `
                  <tr>
                    <td>${item.description}</td>
                    <td class="amount-column">${item.amount.toLocaleString('th-TH')} บาท</td>
                  </tr>
                `).join('')}
            </table>

            <div class="amount">
              <p>จำนวนเงินรวมทั้งสิ้น: ${receiptData.totalAmount.toLocaleString('th-TH')} บาท</p>
              <p>(${thaiAmountText})</p>
            </div>
          </div>

          <div class="signature">
            <p>ผู้รับเงิน ............................................</p>
            <p>วันที่ ${new Date().toLocaleDateString('th-TH')}</p>
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
    console.error('Error generating receipt:', error)
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