export interface Patient {
  id?: string;
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
  doctorId?: number;
  treatmentImages?: string[];
}

export interface Course {
  id: number;
  name: string;
  description: string | null;
  totalSessions: number;
  price: number;
  createdAt: Date;
}

export interface Membership {
  id: number;
  patientHN: string;
  courseId: number;
  remainingSessions: number;
  purchaseDate: Date;
  expiryDate?: Date;
  createdAt: Date;
  course?: Course;
}

export interface MembershipUsage {
  id: number;
  membershipId: number;
  treatmentId: number;
  usedAt: Date;
}