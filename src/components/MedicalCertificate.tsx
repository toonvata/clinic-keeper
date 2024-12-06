import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Patient } from "@/types";
import { Card, CardContent } from "./ui/card";
import { Button } from "@/components/ui/button";
import { PatientSearch } from "./treatment/PatientSearch";
import { CertificateForm } from "./medical-certificate/CertificateForm";
import { CertificatePreview } from "./medical-certificate/CertificatePreview";
import { useMedicalCertificate } from "@/hooks/useMedicalCertificate";

interface MedicalCertificateProps {
  selectedPatient?: Patient;
}

const MedicalCertificate = ({ selectedPatient: initialPatient }: MedicalCertificateProps) => {
  const {
    showSearch,
    setShowSearch,
    currentPatient,
    certificateNumber,
    setCertificateNumber,
    selectedDoctor,
    setSelectedDoctor,
    visitDate,
    setVisitDate,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    restDays,
    setRestDays,
    isGenerating,
    handlePatientSelect,
    handleSaveAndPrint
  } = useMedicalCertificate(initialPatient);

  const { data: doctors } = useQuery({
    queryKey: ["doctors"],
    queryFn: async () => {
      const { data, error } = await supabase.from("doctors").select("*");
      if (error) throw error;
      return data;
    },
  });

  const { data: patients } = useQuery({
    queryKey: ["patients"],
    queryFn: async () => {
      const { data, error } = await supabase.from("patients").select("*");
      if (error) throw error;
      
      return data.map(p => ({
        hn: p.hn,
        registrationDate: new Date(p.registration_date),
        firstName: p.first_name,
        lastName: p.last_name,
        birthDate: new Date(p.birth_date),
        age: p.age,
        idNumber: p.id_number,
        occupation: p.occupation || '',
        address: p.address,
        phoneNumber: p.phone_number,
        underlyingDiseases: p.underlying_diseases || '',
        drugAllergies: p.drug_allergies || ''
      })) as Patient[];
    },
  });

  const selectedDoctorData = doctors?.find(d => d.id.toString() === selectedDoctor);

  if (!patients) {
    return <div>กำลังโหลดข้อมูล...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <PatientSearch
            showSearch={showSearch}
            setShowSearch={setShowSearch}
            selectedPatient={currentPatient}
            patients={patients}
            onPatientSelect={handlePatientSelect}
          />

          {currentPatient && (
            <>
              <CertificateForm
                selectedPatient={currentPatient}
                certificateNumber={certificateNumber}
                selectedDoctor={selectedDoctor}
                visitDate={visitDate}
                startDate={startDate}
                endDate={endDate}
                restDays={restDays}
                onCertificateNumberChange={setCertificateNumber}
                onDoctorChange={setSelectedDoctor}
                onVisitDateChange={setVisitDate}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
                onRestDaysChange={setRestDays}
              />

              <div className="mt-6">
                <CertificatePreview
                  selectedPatient={currentPatient}
                  selectedDoctorData={selectedDoctorData}
                  certificateNumber={certificateNumber}
                  visitDate={visitDate}
                  startDate={startDate}
                  endDate={endDate}
                  restDays={restDays}
                />
              </div>

              <div className="mt-6">
                <Button 
                  onClick={() => handleSaveAndPrint(selectedDoctorData)} 
                  className="w-full"
                  disabled={isGenerating}
                >
                  {isGenerating ? "กำลังสร้างใบรับรองแพทย์..." : "บันทึกและพิมพ์ใบรับรองแพทย์"}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MedicalCertificate;