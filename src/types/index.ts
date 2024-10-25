export interface Patient {
  hn: string;
  registrationDate: Date;
  firstName: string;
  lastName: string;
  birthDate: Date;
  age: number;
  idNumber: string;
  occupation: string;
  address: string;
  phoneNumber: string;
  underlyingDiseases: string;
  drugAllergies: string;
}

export interface VitalSigns {
  bloodPressure: string;
  heartRate: number;
  temperature: number;
  respiratoryRate: number;
}

export interface Treatment {
  id: string;
  patientHN: string;
  treatmentDate: Date;
  vitalSigns: VitalSigns;
  symptoms: string;
  diagnosis: string;
  treatment: string;
  medications: string;
  nextAppointment?: Date;
}