import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Treatment, Patient } from "@/types";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Search } from "lucide-react";

interface TreatmentRecordsProps {
  treatments: Treatment[];
  onAddTreatment: (treatment: Treatment) => void;
}

const TreatmentRecords = ({ treatments, onAddTreatment }: TreatmentRecordsProps) => {
  const { toast } = useToast();
  const [showSearch, setShowSearch] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [formData, setFormData] = useState({
    patientHN: "",
    treatmentDate: new Date(),
    vitalSigns: {
      bloodPressure: "",
      heartRate: 0,
      temperature: 0,
      respiratoryRate: 0
    },
    symptoms: "",
    diagnosis: "",
    treatment: "",
    medications: ""
  });

  // Dummy patient data for demonstration - replace with actual data source
  const patients: Patient[] = [
    {
      hn: "66001",
      firstName: "John",
      lastName: "Doe",
      age: 30,
      underlyingDiseases: "Diabetes",
      drugAllergies: "Penicillin",
      registrationDate: new Date(),
      birthDate: new Date(),
      idNumber: "1234567890123",
      occupation: "Engineer",
      address: "123 Street",
      phoneNumber: "0812345678"
    },
    // ... Add more dummy data as needed
  ];

  const handleSearch = (value: string) => {
    const patient = patients.find(p => 
      p.hn === value || 
      p.firstName.toLowerCase().includes(value.toLowerCase()) ||
      p.lastName.toLowerCase().includes(value.toLowerCase())
    );
    
    if (patient) {
      setSelectedPatient(patient);
      setFormData(prev => ({ ...prev, patientHN: patient.hn }));
      setShowSearch(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPatient) {
      toast({
        title: "กรุณาเลือกผู้ป่วย",
        description: "โปรดค้นหาและเลือกผู้ป่วยก่อนบันทึกข้อมูล",
        variant: "destructive"
      });
      return;
    }

    const newTreatment: Treatment = {
      id: `TR${Date.now()}`,
      ...formData,
      treatmentDate: new Date(formData.treatmentDate)
    };

    onAddTreatment(newTreatment);
    
    toast({
      title: "บันทึกข้อมูลสำเร็จ",
      description: `บันทึกการรักษาสำหรับ HN: ${formData.patientHN}`,
    });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>ค้นหาผู้ป่วย (HN หรือชื่อ)</Label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="พิมพ์ HN หรือชื่อผู้ป่วย..."
                className="pl-8"
                onClick={() => setShowSearch(true)}
                value={selectedPatient ? `${selectedPatient.hn} - ${selectedPatient.firstName} ${selectedPatient.lastName}` : ""}
                readOnly
              />
            </div>
          </div>

          {showSearch && (
            <CommandDialog open={showSearch} onOpenChange={setShowSearch}>
              <CommandInput placeholder="ค้นหาด้วย HN หรือชื่อ..." />
              <CommandList>
                <CommandEmpty>ไม่พบข้อมูลผู้ป่วย</CommandEmpty>
                <CommandGroup heading="ผู้ป่วย">
                  {patients.map((patient) => (
                    <CommandItem
                      key={patient.hn}
                      onSelect={() => handleSearch(patient.hn)}
                    >
                      {patient.hn} - {patient.firstName} {patient.lastName}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </CommandDialog>
          )}

          {selectedPatient && (
            <Card className="bg-muted p-4 mb-4">
              <div className="space-y-2">
                <h3 className="font-semibold">ข้อมูลผู้ป่วย</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-medium">ชื่อ-นามสกุล:</span> {selectedPatient.firstName} {selectedPatient.lastName}
                  </div>
                  <div>
                    <span className="font-medium">อายุ:</span> {selectedPatient.age} ปี
                  </div>
                  <div>
                    <span className="font-medium">โรคประจำตัว:</span> {selectedPatient.underlyingDiseases || "-"}
                  </div>
                  <div>
                    <span className="font-medium">ประวัติแพ้ยา:</span> {selectedPatient.drugAllergies || "-"}
                  </div>
                </div>
              </div>
            </Card>
          )}

          <div className="space-y-2">
            <Label>Vital Signs</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="bloodPressure">ความดันโลหิต</Label>
                <Input
                  id="bloodPressure"
                  onChange={(e) => setFormData({
                    ...formData,
                    vitalSigns: { ...formData.vitalSigns, bloodPressure: e.target.value }
                  })}
                />
              </div>
              <div>
                <Label htmlFor="heartRate">ชีพจร</Label>
                <Input
                  id="heartRate"
                  type="number"
                  onChange={(e) => setFormData({
                    ...formData,
                    vitalSigns: { ...formData.vitalSigns, heartRate: Number(e.target.value) }
                  })}
                />
              </div>
              <div>
                <Label htmlFor="temperature">อุณหภูมิ</Label>
                <Input
                  id="temperature"
                  type="number"
                  step="0.1"
                  onChange={(e) => setFormData({
                    ...formData,
                    vitalSigns: { ...formData.vitalSigns, temperature: Number(e.target.value) }
                  })}
                />
              </div>
              <div>
                <Label htmlFor="respiratoryRate">อัตราการหายใจ</Label>
                <Input
                  id="respiratoryRate"
                  type="number"
                  onChange={(e) => setFormData({
                    ...formData,
                    vitalSigns: { ...formData.vitalSigns, respiratoryRate: Number(e.target.value) }
                  })}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="symptoms">อาการ</Label>
            <Textarea
              id="symptoms"
              required
              onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="diagnosis">การวินิจฉัย</Label>
            <Textarea
              id="diagnosis"
              required
              onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="treatment">การรักษา</Label>
            <Textarea
              id="treatment"
              required
              onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="medications">ยาที่ใช้</Label>
            <Textarea
              id="medications"
              required
              onChange={(e) => setFormData({ ...formData, medications: e.target.value })}
            />
          </div>

          <Button type="submit" className="w-full">บันทึกข้อมูล</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TreatmentRecords;