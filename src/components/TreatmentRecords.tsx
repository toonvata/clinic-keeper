import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Treatment, Patient } from "@/types";
import { PatientSearch } from "./treatment/PatientSearch";
import { VitalSignsForm } from "./treatment/VitalSignsForm";
import { TreatmentForm } from "./treatment/TreatmentForm";

interface TreatmentRecordsProps {
  treatments: Treatment[];
  onAddTreatment: (treatment: Treatment) => void;
  patients: Patient[];
}

const TreatmentRecords = ({
  treatments,
  onAddTreatment,
  patients,
}: TreatmentRecordsProps) => {
  const { toast } = useToast();
  const [showSearch, setShowSearch] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
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
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPatient) {
      toast({
        title: "กรุณาเลือกผู้ป่วย",
        description: "โปรดค้นหาและเลือกผู้ป่วยก่อนบันทึกข้อมูล",
        variant: "destructive",
      });
      return;
    }

    const newTreatment: Treatment = {
      id: `TR${Date.now()}`,
      ...formData,
      treatmentDate: new Date(formData.treatmentDate),
    };

    onAddTreatment(newTreatment);

    toast({
      title: "บันทึกข้อมูลสำเร็จ",
      description: `บันทึกการรักษาสำหรับ HN: ${formData.patientHN}`,
    });
  };

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
    setFormData((prev) => ({ ...prev, patientHN: patient.hn }));
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <PatientSearch
            showSearch={showSearch}
            setShowSearch={setShowSearch}
            selectedPatient={selectedPatient}
            patients={patients}
            onPatientSelect={handlePatientSelect}
          />

          <VitalSignsForm formData={formData} setFormData={setFormData} />

          <TreatmentForm formData={formData} setFormData={setFormData} />

          <Button type="submit" className="w-full">
            บันทึกข้อมูล
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TreatmentRecords;