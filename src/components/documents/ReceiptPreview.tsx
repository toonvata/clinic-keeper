
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { convertToThaiText } from "@/utils/thaiNumberToText";

interface ReceiptItem {
  description: string;
  amount: number;
}

interface ReceiptPreviewProps {
  receiptNumber: string;
  patientName: string;
  date: Date;
  items: ReceiptItem[];
  totalAmount: number;
}

const ReceiptPreview = ({
  receiptNumber,
  patientName,
  date,
  items,
  totalAmount,
}: ReceiptPreviewProps) => {
  return (
    <div className="p-8 bg-white min-h-[29.7cm] w-[21cm] mx-auto">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-2xl font-bold">ใบเสร็จรับเงิน / Receipt</h1>
        <p>เฮ้าส์ ออฟ เฮิร์บ เวลเนส คลินิก</p>
        <p>เลขที่ใบอนุญาตประกอบกิจการ 24110000168</p>
        <p>House of Herb Wellness Clinic</p>
        <p>162 ถนนสวนสมเด็จ ต.หน้าเมือง อ.เมือง จ.ฉะเชิงเทรา</p>
        <p>โทร. 0909149946</p>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between">
          <p>วันที่ / Date: {format(date, "d MMMM yyyy", { locale: th })}</p>
          <p>เลขที่ / No: {receiptNumber}</p>
        </div>
        <p>ได้รับเงินจาก / Received from: {patientName}</p>

        <table className="w-full mt-4">
          <thead>
            <tr className="border-y border-black">
              <th className="text-left py-2">รายการ / Description</th>
              <th className="text-right py-2">จำนวนเงิน / Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              item.amount > 0 && (
                <tr key={index} className="border-b">
                  <td className="py-2">{item.description}</td>
                  <td className="text-right py-2">
                    {item.amount.toLocaleString("th-TH")} บาท
                  </td>
                </tr>
              )
            ))}
          </tbody>
        </table>

        <div className="border p-4 mt-4">
          <p className="text-center">จำนวนเงินรวมทั้งสิ้น / Total Amount: {totalAmount.toLocaleString("th-TH")} บาท</p>
          <p className="text-center mt-2">({convertToThaiText(totalAmount)})</p>
        </div>
      </div>

      <div className="text-right mt-16 space-y-2">
        <p>ผู้รับเงิน / Received by ............................................</p>
        <p>วันที่ / Date {format(new Date(), "d MMMM yyyy", { locale: th })}</p>
      </div>
    </div>
  );
};

export default ReceiptPreview;
