import { format } from "date-fns";
import { th } from "date-fns/locale";

interface CertificatePreviewProps {
  selectedPatient: any;
  selectedDoctorData: any;
}

export const CertificatePreview = ({
  selectedPatient,
  selectedDoctorData,
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
          ข้าพเจ้า{" "}
          {selectedDoctorData
            ? `${selectedDoctorData.title}${selectedDoctorData.name}`
            : "_______________"}{" "}
          ได้ทำการตรวจร่างกาย
        </p>
        
        <p>
          นาย/นาง/นางสาว {selectedPatient.firstName} {selectedPatient.lastName}
        </p>
        
        <div className="grid grid-cols-2 gap-4">
          <p>อายุ {selectedPatient.age} ปี</p>
          <p>เลขประจำตัวประชาชน {selectedPatient.idNumber}</p>
        </div>

        <p>อาชีพ {selectedPatient.occupation || "-"}</p>
        <p>ที่อยู่ {selectedPatient.address}</p>

        <p>
          ได้มารับการตรวจรักษาที่คลินิกนี้ เมื่อวันที่{" "}
          {format(new Date(), "d MMMM yyyy", { locale: th })}
        </p>

        <div className="space-y-2">
          <p>ผลการตรวจร่างกาย</p>
          <p>โรคประจำตัว: {selectedPatient.underlyingDiseases || "ไม่มี"}</p>
          <p>แพ้ยา: {selectedPatient.drugAllergies || "ไม่มี"}</p>
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
        <p className="mt-2">ใบอนุญาตประกอบวิชาชีพเวชกรรมเลขที่ ว.</p>
      </div>
    </div>
  );
};