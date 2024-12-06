import { format } from "date-fns";
import { th } from "date-fns/locale";

interface CertificatePreviewProps {
  selectedPatient: any;
  selectedDoctorData: any;
  certificateNumber?: string;
  visitDate?: string;
  startDate?: string;
  endDate?: string;
  restDays?: string;
}

export const CertificatePreview = ({
  selectedPatient,
  selectedDoctorData,
  certificateNumber,
  visitDate,
  startDate,
  endDate,
  restDays,
}: CertificatePreviewProps) => {
  if (!selectedPatient) return null;

  return (
    <div className="space-y-6 border p-8 rounded-lg">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold">เฮ้าส์ ออฟ เฮิร์บ เวลเนส คลินิก</h2>
        <p>162 ถนนสวนสมเด็จ ต.หน้าเมือง อ.เมือง จ.ฉะเชิงเทรา</p>
        <p>โทร. 0909149946</p>
      </div>

      <div className="text-center">
        <h1 className="text-2xl font-bold">ใบรับรองแพทย์</h1>
        <h2 className="text-xl">Medical Certificate</h2>
      </div>

      <div className="space-y-4">
        <p>
          เลขที่ {certificateNumber || "__________"}
        </p>
        
        <p>
          ข้าพเจ้า{" "}
          {selectedDoctorData
            ? `${selectedDoctorData.title}${selectedDoctorData.name}`
            : "__________"}{" "}
          ปฏิบัติงาน ณ เฮ้าส์ ออฟ เฮิร์บ เวลเนส คลินิก
        </p>
        
        <p>
          เป็นผู้ประกอบวิชาชีพเวชกรรม ใบอนุญาตประกอบวิชาชีพเวชกรรมเลขที่ {selectedDoctorData?.license_number || "__________"}
        </p>

        <p>
          ได้ทำการตรวจร่างกาย {selectedPatient.firstName} {selectedPatient.lastName}
        </p>

        <p>
          เมื่อวันที่ {visitDate ? format(new Date(visitDate), "d MMMM yyyy", { locale: th }) : "__________"}
        </p>

        <div className="space-y-2">
          <p>
            ตั้งแต่วันที่ {startDate ? format(new Date(startDate), "d MMMM yyyy", { locale: th }) : "__________"}{" "}
            ถึงวันที่ {endDate ? format(new Date(endDate), "d MMMM yyyy", { locale: th }) : "__________"}
          </p>
          <p>เป็นเวลา {restDays || "__"} วัน</p>
        </div>

        <p>ทั้งนี้ได้ให้การรักษาพร้อมคำแนะนำให้เรียบร้อยแล้ว</p>
      </div>

      <div className="text-right mt-12">
        <p>ลงนาม............................................</p>
        <p className="mt-2">
          {selectedDoctorData
            ? `(${selectedDoctorData.title}${selectedDoctorData.name})`
            : "(แพทย์ผู้ตรวจ)"}
        </p>
        <p className="mt-2">แพทย์ผู้ตรวจ</p>
      </div>
    </div>
  );
};