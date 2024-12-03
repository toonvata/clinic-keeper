import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PatientRecords from "@/components/PatientRecords";
import TreatmentRecords from "@/components/TreatmentRecords";
import Dashboard from "@/components/Dashboard";
import PatientList from "@/components/PatientList";
import { Patient, Treatment } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";

const Layout = () => {
  const navigate = useNavigate();
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
        occupation: p.occupation || '',
        address: p.address,
        phoneNumber: p.phone_number,
        underlyingDiseases: p.underlying_diseases || '',
        drugAllergies: p.drug_allergies || ''
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
        id: t.id.toString(),
        patientHN: t.patient_hn || '',
        treatmentDate: new Date(t.treatment_date),
        vitalSigns: {
          bloodPressure: t.blood_pressure || '',
          heartRate: t.heart_rate || 0,
          temperature: t.temperature || 0,
          respiratoryRate: t.respiratory_rate || 0
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
    await fetchPatients();
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
    await fetchTreatments();
  };

  const handleTreatmentClick = (patient: Patient) => {
    setSelectedPatient(patient);
    setActiveTab("treatments");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <div className="mb-6 relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="absolute right-0 top-0 flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          ออกจากระบบ
        </Button>
        <div className="text-center">
          <h1 className="text-3xl font-bold">House of Herb wellness clinic</h1>
          <p className="text-gray-600 mt-2">
            เฮ้าส์ ออฟ เฮิร์บ เวลเนส สหคลินิก
          </p>
          <p className="text-gray-600">
            162 ถนนสวนสมเด็จ ต.หน้าเมือง อ.เมือง จ.ฉะเชิงเทรา โทร. 0909149946
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="patients" className="justify-center">บันทึกข้อมูลผู้ป่วย</TabsTrigger>
          <TabsTrigger value="patient-list" className="justify-center">รายชื่อผู้ป่วย</TabsTrigger>
          <TabsTrigger value="treatments" className="justify-center">บันทึกการรักษา</TabsTrigger>
          <TabsTrigger value="dashboard" className="justify-center">Dashboard</TabsTrigger>
        </TabsList>

        <TabsContent value="patients">
          <h2 className="text-2xl font-semibold mb-4 text-left">บันทึกข้อมูลผู้ป่วย</h2>
          <PatientRecords onAddPatient={handleAddPatient} />
        </TabsContent>

        <TabsContent value="patient-list">
          <h2 className="text-2xl font-semibold mb-4 text-left">รายชื่อผู้ป่วย</h2>
          <PatientList
            patients={patients}
            treatments={treatments}
            onDeletePatient={handleDeletePatient}
            onTreatmentClick={handleTreatmentClick}
          />
        </TabsContent>

        <TabsContent value="treatments">
          <h2 className="text-2xl font-semibold mb-4 text-left">บันทึกการรักษา</h2>
          <TreatmentRecords
            treatments={treatments}
            onAddTreatment={handleAddTreatment}
            patients={patients}
            selectedPatient={selectedPatient}
          />
        </TabsContent>

        <TabsContent value="dashboard">
          <h2 className="text-2xl font-semibold mb-4 text-left">Dashboard</h2>
          <Dashboard patients={patients} treatments={treatments} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Layout;