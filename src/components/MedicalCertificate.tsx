import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "./ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { CertificateForm } from "./medical-certificate/CertificateForm";
import { CertificatePreview } from "./medical-certificate/CertificatePreview";
import { useQuery } from "@tanstack/react-query";
import { PatientSearch } from "./treatment/PatientSearch";
import { Alert, AlertDescription } from "./ui/alert";
import { Card, CardContent } from "./ui/card";
import { Patient } from "@/types";

interface MedicalCertificateProps {
  selectedPatient?: Patient;
}

const MedicalCertificate = ({ selectedPatient: initialPatient }: MedicalCertificateProps) => {
  const { toast } = useToast();
  const [showSearch, setShowSearch] = useState(!initialPatient);
  const [currentPatient, setCurrentPatient] = useState(initialPatient || null);
  const [certificateNumber, setCertificateNumber] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [visitDate, setVisitDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [restDays, setRestDays] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

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
      
      // Transform the raw data to match our Patient interface
      return data?.map(p => ({
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

  const handlePatientSelect = (patient: Patient) => {
    setCurrentPatient(patient);
    setShowSearch(false);
  };

  const handleSaveAndPrint = async () => {
    if (!selectedDoctor || !certificateNumber) {
      toast({
        title: "กรุณากรอกข้อมูลให้ครบถ้วน",
        description: "กรุณาเลือกแพทย์และกรอกเลขที่ใบรับรองแพทย์",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      // Save certificate data to Supabase
      const { error: saveError } = await supabase
        .from('medical_certificates')
        .insert({
          certificate_number: certificateNumber,
          patient_hn: currentPatient.hn,
          doctor_id: parseInt(selectedDoctor),
          visit_date: new Date(visitDate).toISOString(),
          start_date: startDate ? new Date(startDate).toISOString() : null,
          end_date: endDate ? new Date(endDate).toISOString() : null,
          rest_days: restDays ? parseInt(restDays) : null,
        });

      if (saveError) throw saveError;

      // Generate PDF using edge function
      const { data: pdfData, error: pdfError } = await supabase.functions.invoke('generate-medical-certificate', {
        body: {
          certificateData: {
            certificateNumber,
            doctorName: selectedDoctorData ? `${selectedDoctorData.title}${selectedDoctorData.name}` : '',
            patientName: `${currentPatient.firstName} ${currentPatient.lastName}`,
            visitDate,
            startDate,
            endDate,
            restDays
          }
        }
      });

      if (pdfError) throw pdfError;

      // Update certificate with PDF URL
      const { error: updateError } = await supabase
        .from('medical_certificates')
        .update({ pdf_url: pdfData.pdfUrl })
        .eq('certificate_number', certificateNumber);

      if (updateError) throw updateError;

      // Open PDF in new tab
      window.open(pdfData.pdfUrl, '_blank');

      toast({
        title: "บันทึกและสร้างใบรับรองแพทย์สำเร็จ",
        description: "ระบบได้บันทึกและสร้าง PDF ใบรับรองแพทย์เรียบร้อยแล้ว"
      });

    } catch (error) {
      console.error('Error generating medical certificate:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถสร้างใบรับรองแพทย์ได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (!patients) {
    return <div>Loading...</div>;
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

          {currentPatient ? (
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
                />
              </div>

              <div className="mt-6">
                <Button 
                  onClick={handleSaveAndPrint} 
                  className="w-full"
                  disabled={isGenerating}
                >
                  {isGenerating ? "กำลังสร้างใบรับรองแพทย์..." : "บันทึกและพิมพ์ใบรับรองแพทย์"}
                </Button>
              </div>
            </>
          ) : (
            <Alert>
              <AlertDescription>
                กรุณาค้นหาและเลือกผู้ป่วยเพื่อออกใบรับรองแพทย์
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            .print\\:p-8, .print\\:p-8 * {
              visibility: visible;
            }
            .print\\:hidden {
              display: none;
            }
          }
        `}
      </style>
    </div>
  );
};

export default MedicalCertificate;