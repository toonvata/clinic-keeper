import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PatientRecords from "@/components/PatientRecords";
import TreatmentRecords from "@/components/TreatmentRecords";
import Dashboard from "@/components/Dashboard";

const Layout = () => {
  return (
    <div className="container mx-auto p-4 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">คลินิกระบบบริหารจัดการ</h1>
      
      <Tabs defaultValue="patients" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="patients">บันทึกข้อมูลผู้ป่วย</TabsTrigger>
          <TabsTrigger value="treatments">บันทึกการรักษา</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        </TabsList>
        
        <TabsContent value="patients">
          <PatientRecords />
        </TabsContent>
        
        <TabsContent value="treatments">
          <TreatmentRecords />
        </TabsContent>
        
        <TabsContent value="dashboard">
          <Dashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Layout;