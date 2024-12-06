import { useState } from "react";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Patient } from "@/types";

export const useMedicalCertificate = (initialPatient?: Patient) => {
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

  const handlePatientSelect = (patient: Patient) => {
    setCurrentPatient(patient);
    setShowSearch(false);
  };

  const handleSaveAndPrint = async (selectedDoctorData: any) => {
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
          patient_hn: currentPatient?.hn,
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
            patientName: currentPatient ? `${currentPatient.firstName} ${currentPatient.lastName}` : '',
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

  return {
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
  };
};