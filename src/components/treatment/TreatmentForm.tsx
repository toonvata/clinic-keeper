import { TreatmentFormData } from "@/types/treatment";
import { TreatmentFormFields } from "./TreatmentFormFields";
import { VitalSignsForm } from "./VitalSignsForm";
import { TreatmentImageUpload } from "./TreatmentImageUpload";
import { PatientSearch } from "./PatientSearch";
import { DoctorSelect } from "./DoctorSelect";
import { Button } from "../ui/button";
import { Patient } from "@/types";

interface TreatmentFormProps {
  formData: TreatmentFormData;
  setFormData: (data: TreatmentFormData) => void;
  showSearch: boolean;
  setShowSearch: (show: boolean) => void;
  currentPatient: Patient | null;
  patients: Patient[];
  selectedDoctorId: number | null;
  setSelectedDoctorId: (id: number | null) => void;
  onPatientSelect: (patient: Patient) => void;
  onImageUploaded: (url: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const TreatmentForm = ({
  formData,
  setFormData,
  showSearch,
  setShowSearch,
  currentPatient,
  patients,
  selectedDoctorId,
  setSelectedDoctorId,
  onPatientSelect,
  onImageUploaded,
  onSubmit,
}: TreatmentFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <PatientSearch
        showSearch={showSearch}
        setShowSearch={setShowSearch}
        selectedPatient={currentPatient}
        patients={patients}
        onPatientSelect={onPatientSelect}
      />

      <DoctorSelect
        selectedDoctorId={selectedDoctorId}
        onDoctorSelect={setSelectedDoctorId}
      />

      <VitalSignsForm formData={formData} setFormData={setFormData} />

      <TreatmentFormFields formData={formData} setFormData={setFormData} />

      <TreatmentImageUpload
        images={formData.treatmentImages}
        onImageUploaded={onImageUploaded}
      />

      <Button type="submit" className="w-full">
        บันทึกข้อมูล
      </Button>
    </form>
  );
};