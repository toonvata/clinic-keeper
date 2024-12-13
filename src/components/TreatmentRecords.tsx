import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Treatment, Patient } from "@/types";
import { PatientSearch } from "./treatment/PatientSearch";
import { VitalSignsForm } from "./treatment/VitalSignsForm";
import { TreatmentFormFields } from "./treatment/TreatmentFormFields";
import { TreatmentImageUpload } from "./treatment/TreatmentImageUpload";
import { DoctorSelect } from "./treatment/DoctorSelect";
import { supabase } from "@/integrations/supabase/client";

interface TreatmentRecordsProps {
  treatments: Treatment[];
  onAddTreatment: (treatment: Treatment) => void;
  patients: Patient[];
  selectedPatient?: Patient | null;
}

const TreatmentRecords = ({
  treatments,
  onAddTreatment,
  patients,
  selectedPatient,
}: TreatmentRecordsProps) => {
  const { toast } = useToast();
  const [showSearch, setShowSearch] = useState(false);
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    patientHN: "",
    treatmentDate: new Date(),
    vitalSigns: {
      bloodPressure: "",
      heartRate: 0,
      temperature: 0,
      respiratoryRate: 0,
    },
    symptoms: "",
    diagnosis: "",
    treatment: "",
    medications: "",
    treatmentImages: [] as string[]
  });

  useEffect(() => {
    if (selectedPatient) {
      setCurrentPatient(selectedPatient);
      setFormData(prev => ({ ...prev, patientHN: selectedPatient.hn }));
    }
  }, [selectedPatient]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPatient) {
      toast({
        title: "กรุณาเลือกผู้ป่วย",
        description: "โปรดค้นหาและเลือกผู้ป่วยก่อนบันทึกข้อมูล",
        variant: "destructive",
      });
      return;
    }

    if (!selectedDoctorId) {
      toast({
        title: "กรุณาเลือกแพทย์",
        description: "โปรดเลือกแพทย์ก่อนบันทึกข้อมูล",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('treatments')
        .insert({
          patient_hn: formData.patientHN,
          treatment_date: formData.treatmentDate.toISOString(),
          blood_pressure: formData.vitalSigns.bloodPressure,
          heart_rate: formData.vitalSigns.heartRate,
          temperature: formData.vitalSigns.temperature,
          respiratory_rate: formData.vitalSigns.respiratoryRate,
          symptoms: formData.symptoms,
          diagnosis: formData.diagnosis,
          treatment: formData.treatment,
          medications: formData.medications,
          doctor_id: selectedDoctorId
        })
        .select()
        .single();

      if (error) throw error;

      const newTreatment: Treatment = {
        id: data.id.toString(),
        patientHN: data.patient_hn,
        treatmentDate: new Date(data.treatment_date),
        vitalSigns: {
          bloodPressure: data.blood_pressure || "",
          heartRate: data.heart_rate || 0,
          temperature: data.temperature || 0,
          respiratoryRate: data.respiratory_rate || 0,
        },
        symptoms: data.symptoms,
        diagnosis: data.diagnosis,
        treatment: data.treatment,
        medications: data.medications,
        doctorId: data.doctor_id,
        treatmentImages: []
      };

      // Reset form
      setFormData({
        patientHN: currentPatient.hn,
        treatmentDate: new Date(),
        vitalSigns: {
          bloodPressure: "",
          heartRate: 0,
          temperature: 0,
          respiratoryRate: 0,
        },
        symptoms: "",
        diagnosis: "",
        treatment: "",
        medications: "",
        treatmentImages: []
      });

      onAddTreatment(newTreatment);

      toast({
        title: "บันทึกข้อมูลสำเร็จ",
        description: `บันทึกการรักษาสำหรับ HN: ${formData.patientHN}`,
      });
    } catch (error) {
      console.error('Error saving treatment:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถบันทึกข้อมูลการรักษาได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      });
    }
  };

  const handlePatientSelect = async (patient: Patient) => {
    setCurrentPatient(patient);
    setFormData((prev) => ({ ...prev, patientHN: patient.hn }));

    // Fetch the latest treatment images for this patient
    try {
      const { data: treatmentData, error } = await supabase
        .from('treatments')
        .select('*')
        .eq('patient_hn', patient.hn)
        .order('treatment_date', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error('Error fetching treatment:', error);
        return;
      }

      if (treatmentData) {
        // Get all files from the treatment-images bucket for this treatment
        const { data: filesData } = await supabase
          .storage
          .from('treatment-images')
          .list(treatmentData.id.toString());

        if (filesData) {
          const imageUrls = filesData.map(file => {
            const { data: { publicUrl } } = supabase
              .storage
              .from('treatment-images')
              .getPublicUrl(`${treatmentData.id}/${file.name}`);
            return publicUrl;
          });

          setFormData(prev => ({
            ...prev,
            id: treatmentData.id,
            treatmentImages: imageUrls
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching treatment images:', error);
    }
  };

  const handleImageUploaded = (imageUrl: string) => {
    setFormData(prev => ({
      ...prev,
      treatmentImages: [...prev.treatmentImages, imageUrl]
    }));
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <PatientSearch
            showSearch={showSearch}
            setShowSearch={setShowSearch}
            selectedPatient={currentPatient}
            patients={patients}
            onPatientSelect={handlePatientSelect}
          />

          <DoctorSelect
            selectedDoctorId={selectedDoctorId}
            onDoctorSelect={setSelectedDoctorId}
          />

          <VitalSignsForm formData={formData} setFormData={setFormData} />

          <TreatmentFormFields formData={formData} setFormData={setFormData} />

          <TreatmentImageUpload
            treatmentId={formData.id}
            images={formData.treatmentImages}
            onImageUploaded={handleImageUploaded}
          />

          <Button type="submit" className="w-full">
            บันทึกข้อมูล
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TreatmentRecords;