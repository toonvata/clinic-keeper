export interface TreatmentFormData {
  id: string;
  patientHN: string;
  treatmentDate: Date;
  vitalSigns: {
    bloodPressure: string;
    heartRate: number;
    temperature: number;
    respiratoryRate: number;
  };
  symptoms: string;
  diagnosis: string;
  treatment: string;
  medications: string;
  treatmentImages: string[];
}

export const initialFormData: TreatmentFormData = {
  id: "",
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
  treatmentImages: []
};