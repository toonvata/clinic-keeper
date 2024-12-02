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
import { useAuth } from "./AuthProvider";

const Layout = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [activeTab, setActiveTab] = useState("patients");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [currentDoctor, setCurrentDoctor] = useState<{ id: number; name: string } | null>(null);

  useEffect(() => {
    if (session?.user) {
      fetchDoctorInfo();
    }
  }, [session]);

  useEffect(() => {
    if (currentDoctor) {
      fetchPatients();
      fetchTreatments();
    }
  }, [currentDoctor]);

  const fetchDoctorInfo = async () => {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('id, name')
        .eq('user_id', session?.user.id)
        .single();
      
      if (error) throw error;
      setCurrentDoctor(data);
    } catch (error) {
      console.error('Error fetching doctor info:', error);
    }
  };

  const fetchPatients = async () => {
    if (!currentDoctor) return;

    try {
      // Get unique patient HNs from treatments for this doctor
      const { data: doctorTreatments, error: treatmentsError } = await supabase
        .from('treatments')
        .select('patient_hn')
        .eq('doctor_id', currentDoctor.id);
      
      if (treatmentsError) throw treatmentsError;

      const uniquePatientHNs = [...new Set(doctorTreatments.map(t => t.patient_hn))];

      if (uniquePatientHNs.length === 0) {
        setPatients([]);
        return;
      }

      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .in('hn', uniquePatientHNs);
      
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
    if (!currentDoctor) return;

    try {
      const { data, error } = await supabase
        .from('treatments')
        .select('*')
        .eq('doctor_id', currentDoctor.id);
      
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
        nextAppointment: t.next_appointment ? new Date(t.next_appointment) : undefined,
        doctorId: t.doctor_id
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
      <div className="text-center mb-6 relative">
        <div className="absolute right-0 top-0 flex items-center gap-2">
          {currentDoctor && (
            <span className="text-sm text-gray-600">
              แพทย์: {currentDoctor.name}
            </span>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            ออกจากระบบ
          </Button>
        </div>
        <h1 className="text-3xl font-bold">House of Herb wellness clinic</h1>
        <p className="text-gray-600 mt-2">
          เฮ้าส์ ออฟ เฮิร์บ เวลเนส สหคลินิก
        </p>
        <p className="text-gray-600">
          162 ถนนสวนสมเด็จ ต.หน้าเมือง อ.เมือง จ.ฉะเชิงเทรา โทร. 0909149946
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