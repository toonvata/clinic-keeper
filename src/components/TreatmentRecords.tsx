import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, PlusCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { Treatment } from "@/types";

interface TreatmentRecordsProps {
  treatments: Treatment[];
  onAddTreatment: (treatment: Treatment) => void;
}

const TreatmentRecords = ({ treatments, onAddTreatment }: TreatmentRecordsProps) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTreatments = treatments.filter((treatment) => {
    const searchLower = searchTerm.toLowerCase();
    return treatment.patientHN.toLowerCase().includes(searchLower);
  });

  const handleNewTreatment = () => {
    const newTreatment: Treatment = {
      id: `TR${Date.now()}`,
      patientHN: "TEST001", // This would normally come from a form
      treatmentDate: new Date(),
      vitalSigns: {
        bloodPressure: "120/80",
        heartRate: 80,
        temperature: 37,
        respiratoryRate: 16
      },
      symptoms: "ตัวอย่างอาการ",
      diagnosis: "ตัวอย่างการวินิจฉัย",
      treatment: "ตัวอย่างการรักษา",
      medications: "ตัวอย่างยาที่ใช้"
    };

    onAddTreatment(newTreatment);
    toast({
      title: "บันทึกข้อมูลสำเร็จ",
      description: "บันทึกข้อมูลการรักษาเรียบร้อยแล้ว",
    });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-6">
          <div className="relative flex-1 mr-4">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="ค้นหาด้วย HN..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={handleNewTreatment}>
            <PlusCircle className="mr-2 h-4 w-4" />
            เพิ่มการรักษา
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>HN</TableHead>
              <TableHead>วันที่รักษา</TableHead>
              <TableHead>อาการ</TableHead>
              <TableHead>การวินิจฉัย</TableHead>
              <TableHead>การรักษา</TableHead>
              <TableHead>ยาที่ใช้</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTreatments.map((treatment) => (
              <TableRow key={treatment.id}>
                <TableCell>{treatment.patientHN}</TableCell>
                <TableCell>
                  {treatment.treatmentDate.toLocaleDateString('th-TH')}
                </TableCell>
                <TableCell>{treatment.symptoms}</TableCell>
                <TableCell>{treatment.diagnosis}</TableCell>
                <TableCell>{treatment.treatment}</TableCell>
                <TableCell>{treatment.medications}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TreatmentRecords;