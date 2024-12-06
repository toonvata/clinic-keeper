import { format } from "date-fns";
import { th } from "date-fns/locale";

interface MedicalCertificatePreviewProps {
  certificateNumber: string;
  doctorName: string;
  patientName: string;
  visitDate: Date;
  startDate?: Date;
  endDate?: Date;
  restDays?: number;
  diagnosis: string;
}

const MedicalCertificatePreview = ({
  certificateNumber,
  doctorName,
  patientName,
  visitDate,
  startDate,
  endDate,
  restDays,
  diagnosis,
}: MedicalCertificatePreviewProps) => {
  return (
    <div className="p-8 bg-white">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-2xl font-bold">ใบรับรองแพทย์</h1>
        <h2 className="text-xl">Medical Certificate</h2>
        <p>เฮ้าส์ ออฟ เฮิร์บ เวลเนส คลินิก</p>
        <p>162 ถนนสวนสมเด็จ ต.หน้าเมือง อ.เมือง จ.ฉะเชิงเทรา</p>
        <p>โทร. 0909149946</p>
      </div>

      <div className="space-y-4">
        <p>เลขที่: {certificateNumber}</p>
        <p>ข้าพเจ้า {doctorName} ได้ทำการตรวจร่างกาย</p>
        <p>นาย/นาง/นางสาว {patientName}</p>
        <p>
          เมื่อวันที่{" "}
          {format(visitDate, "d MMMM yyyy", { locale: th })}
        </p>
        {diagnosis && <p>ผลการตรวจ/วินิจฉัยโรค: {diagnosis}</p>}
        {startDate && endDate && (
          <>
            <p>
              ให้หยุดพักตั้งแต่วันที่{" "}
              {format(startDate, "d MMMM yyyy", { locale: th })}
            </p>
            <p>
              ถึงวันที่ {format(endDate, "d MMMM yyyy", { locale: th })}
            </p>
            {restDays && <p>รวมเป็นเวลา {restDays} วัน</p>}
          </>
        )}
        <p>
          ออกให้ ณ วันที่{" "}
          {format(new Date(), "d MMMM yyyy", { locale: th })}
        </p>
      </div>

      <div className="text-right mt-16 space-y-2">
        <p>ลงชื่อ ............................................</p>
        <p>({doctorName})</p>
        <p>แพทย์ผู้ตรวจ</p>
        <p>ใบอนุญาตประกอบวิชาชีพเวชกรรมเลขที่ ว.XXXXX</p>
      </div>
    </div>
  );
};

export default MedicalCertificatePreview;