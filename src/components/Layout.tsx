import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PatientRecords from "@/components/PatientRecords";
import TreatmentRecords from "@/components/TreatmentRecords";
import Dashboard from "@/components/Dashboard";

const Layout = () => {
  return (
    <div className="container mx-auto p-4 min-h-screen">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold">House of Herb wellness clinic</h1>
        <p className="text-gray-600 mt-2">เฮ้าส์ ออฟ เฮิร์บ เวลเนส สหคลินิก</p>
        <p className="text-gray-600">162 ถนนสวนสมเด็จ ต.หน้าเมือง อ.เมือง จ.ฉะเชิงเทรา</p>
      </div>
      
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