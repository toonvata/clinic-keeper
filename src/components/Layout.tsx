import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PatientRecords from "@/components/PatientRecords";
import TreatmentRecords from "@/components/TreatmentRecords";
import Dashboard from "@/components/Dashboard";
import PatientList from "@/components/PatientList";
import { Patient, Treatment } from "@/types";
import { supabase } from "@/integrations/supabase/client";

const Layout = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [activeTab, setActiveTab] = useState("patients");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  useEffect(() => {
    fetchPatients();
    fetchTreatments();
  }, []);

  const fetchPatients = async () => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*');
      
      if (error) throw error;

      const formattedPatients = data.map(p => ({
        hn: p.hn,
        registrationDate: new Date(p.registration_date),
        firstName: p.first_name,
        lastName: p.last_name,
        birthDate: new Date(p.birth_date),
        age: p.age,
        idNumber: p.id_number,
        occupation: p.occupation,
        address: p.address,
        phoneNumber: p.phone_number,
        underlyingDiseases: p.underlying_diseases,
        drugAllergies: p.drug_allergies
      }));

      setPatients(formattedPatients);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const fetchTreatments = async () => {
    try {
      const { data, error } = await supabase
        .from('treatments')
        .select('*');
      
      if (error) throw error;

      const formattedTreatments = data.map(t => ({
        id: t.id,
        patientHN: t.patient_hn,
        treatmentDate: new Date(t.treatment_date),
        vitalSigns: {
          bloodPressure: t.blood_pressure,
          heartRate: t.heart_rate,
          temperature: t.temperature,
          respiratoryRate: t.respiratory_rate
        },
        symptoms: t.symptoms,
        diagnosis: t.diagnosis,
        treatment: t.treatment,
        medications: t.medications,
        nextAppointment: t.next_appointment ? new Date(t.next_appointment) : undefined
      }));

      setTreatments(formattedTreatments);
    } catch (error) {
      console.error('Error fetching treatments:', error);
    }
  };

  const handleAddPatient = async (newPatient: Patient) => {
    setPatients([...patients, newPatient]);
    await fetchPatients(); // Refresh the list after adding
  };

  const handleDeletePatient = async (hn: string) => {
    try {
      const { error } = await supabase
        .from('patients')
        .delete()
        .eq('hn', hn);
      
      if (error) throw error;

      setPatients(patients.filter((p) => p.hn !== hn));
    } catch (error) {
      console.error('Error deleting patient:', error);
    }
  };

  const handleAddTreatment = async (newTreatment: Treatment) => {
    try {
      const { error } = await supabase
        .from('treatments')
        .insert({
          id: newTreatment.id,
          patient_hn: newTreatment.patientHN,
          treatment_date: newTreatment.treatmentDate.toISOString(),
          blood_pressure: newTreatment.vitalSigns.bloodPressure,
          heart_rate: newTreatment.vitalSigns.heartRate,
          temperature: newTreatment.vitalSigns.temperature,
          respiratory_rate: newTreatment.vitalSigns.respiratoryRate,
          symptoms: newTreatment.symptoms,
          diagnosis: newTreatment.diagnosis,
          treatment: newTreatment.treatment,
          medications: newTreatment.medications,
          next_appointment: newTreatment.nextAppointment?.toISOString()
        });

      if (error) throw error;

      setTreatments([...treatments, newTreatment]);
      await fetchTreatments(); // Refresh the list after adding
    } catch (error) {
      console.error('Error adding treatment:', error);
    }
  };

  const handleTreatmentClick = (patient: Patient) => {
    setSelectedPatient(patient);
    setActiveTab("treatments");
  };

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold">House of Herb wellness clinic</h1>
        <p className="text-gray-600 mt-2">
          เฮ้าส์ ออฟ เฮิร์บ เวลเนส สหคลินิก
        </p>
        <p className="text-gray-600">
          162 ถนนสวนสมเด็จ ต.หน้าเมือง อ.เมือง จ.ฉะเชิงเทรา
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="patients">บันทึกข้อมูลผู้ป่วย</TabsTrigger>
          <TabsTrigger value="patient-list">รายชื่อผู้ป่วย</TabsTrigger>
          <TabsTrigger value="treatments">บันทึกการรักษา</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        </TabsList>

        <TabsContent value="patients">
          <PatientRecords onAddPatient={handleAddPatient} />
        </TabsContent>

        <TabsContent value="patient-list">
          <PatientList
            patients={patients}
            treatments={treatments}
            onDeletePatient={handleDeletePatient}
            onTreatmentClick={handleTreatmentClick}
          />
        </TabsContent>

        <TabsContent value="treatments">
          <TreatmentRecords
            treatments={treatments}
            onAddTreatment={handleAddTreatment}
            patients={patients}
            selectedPatient={selectedPatient}
          />
        </TabsContent>

        <TabsContent value="dashboard">
          <Dashboard patients={patients} treatments={treatments} />
        </TabsContent>
      </Tabs>
    </div>
  );

};

export default Layout;
