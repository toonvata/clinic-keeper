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
    <>
      <div className="text-center print:text-left space-y-2">
        <h2 className="text-xl font-bold">เฮ้าส์ ออฟ เฮิร์บ เวลเนส คลินิก</h2>
        <p>162 ถนนสวนสมเด็จ ต.หน้าเมือง อ.เมือง จ.ฉะเชิงเทรา 0909149946</p>
      </div>

      <div className="text-center print:text-left">
        <h1 className="text-2xl font-bold">ใบรับรองแพทย์ / Medical Certificate</h1>
      </div>

      <div className="text-center print:text-left mt-8">
        <p>ทั้งนี้ได้ให้การรักษาพร้อมคำแนะนำให้เรียบร้อยแล้ว</p>
      </div>

      <div className="text-right mt-12 print:mt-24">
        <p>ลงนาม............................................</p>
        <p className="mt-2">
          {selectedDoctorData ? `${selectedDoctorData.title}${selectedDoctorData.name}` : ""}
        </p>
        <p className="mt-2">แพทย์ผู้ตรวจ</p>
      </div>
    </>
  );
};