import { format } from "date-fns";
import { th } from "date-fns/locale";

interface ReceiptPreviewProps {
  receiptNumber: string;
  patientName: string;
  date: Date;
  amount: number;
}

const ReceiptPreview = ({
  receiptNumber,
  patientName,
  date,
  amount,
}: ReceiptPreviewProps) => {
  return (
    <div className="p-8 bg-white">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-2xl font-bold">ใบเสร็จรับเงิน</h1>
        <h2 className="text-xl">Receipt</h2>
        <p>เฮ้าส์ ออฟ เฮิร์บ เวลเนส คลินิก</p>
        <p>162 ถนนสวนสมเด็จ ต.หน้าเมือง อ.เมือง จ.ฉะเชิงเทรา</p>
        <p>โทร. 0909149946</p>
      </div>

      <div className="space-y-4">
        <p>เลขที่: {receiptNumber}</p>
        <p>
          วันที่: {format(date, "d MMMM yyyy", { locale: th })}
        </p>
        <p>ได้รับเงินจาก: {patientName}</p>

        <table className="w-full mt-4">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">รายการ</th>
              <th className="text-right py-2">จำนวนเงิน</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2">ค่าบริการทางการแพทย์</td>
              <td className="text-right py-2">
                {amount.toLocaleString("th-TH")} บาท
              </td>
            </tr>
          </tbody>
        </table>

        <div className="border p-4 mt-4 text-center">
          <p>
            จำนวนเงินรวมทั้งสิ้น: {amount.toLocaleString("th-TH")} บาท
          </p>
        </div>
      </div>

      <div className="text-right mt-16 space-y-2">
        <p>ผู้รับเงิน ............................................</p>
        <p>วันที่ {format(new Date(), "d MMMM yyyy", { locale: th })}</p>
      </div>
    </div>
  );
};

export default ReceiptPreview;