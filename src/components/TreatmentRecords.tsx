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

const TreatmentRecords = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [treatments, setTreatments] = useState<Treatment[]>([]);

  const filteredTreatments = treatments.filter((treatment) => {
    const searchLower = searchTerm.toLowerCase();
    return treatment.patientHN.toLowerCase().includes(searchLower);
  });

  const handleNewTreatment = () => {
    // Will implement new treatment form later
    toast({
      title: "Coming soon",
      description: "This feature will be implemented soon",
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
              <TableHead>นัดครั้งถัดไป</TableHead>
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
                <TableCell>
                  {treatment.nextAppointment 
                    ? treatment.nextAppointment.toLocaleDateString('th-TH')
                    : '-'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TreatmentRecords;