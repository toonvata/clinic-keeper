import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PatientRecords from "@/components/PatientRecords";
import TreatmentRecords from "@/components/TreatmentRecords";
import Dashboard from "@/components/Dashboard";
import PatientList from "@/components/PatientList";
import { Patient, Treatment } from "@/types";

const Layout = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [activeTab, setActiveTab] = useState("patients");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const handleAddPatient = (newPatient: Patient) => {
    setPatients([...patients, newPatient]);
  };

  const handleDeletePatient = (hn: string) => {
    setPatients(patients.filter((p) => p.hn !== hn));
  };

  const handleAddTreatment = (newTreatment: Treatment) => {
    setTreatments([...treatments, newTreatment]);
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