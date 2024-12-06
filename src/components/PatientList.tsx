import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, History, Trash2, FileText } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { Patient, Treatment } from "@/types";
import TreatmentHistoryDialog from "./TreatmentHistoryDialog";

interface PatientListProps {
  patients: Patient[];
  treatments: Treatment[];
  onDeletePatient: (hn: string) => void;
  onTreatmentClick: (patient: Patient) => void;
  onMedicalCertClick: (patient: Patient) => void;
}

const PatientList = ({ 
  patients, 
  treatments, 
  onDeletePatient,
  onTreatmentClick,
  onMedicalCertClick
}: PatientListProps) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<{
    hn: string;
    name: string;
  } | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const filteredPatients = patients.filter((patient) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      patient.hn.toLowerCase().includes(searchLower) ||
      patient.firstName.toLowerCase().includes(searchLower) ||
      patient.lastName.toLowerCase().includes(searchLower)
    );
  });

  const handleDelete = (hn: string) => {
    onDeletePatient(hn);
    toast({
      title: "ลบข้อมูลสำเร็จ",
      description: `ลบข้อมูลผู้ป่วย HN: ${hn} เรียบร้อยแล้ว`,
    });
  };

  const handleShowHistory = (patient: Patient) => {
    setSelectedPatient({
      hn: patient.hn,
      name: `${patient.firstName} ${patient.lastName}`,
    });
    setShowHistory(true);
  };

  const handleMedicalCertificate = (patient: Patient) => {
    onMedicalCertClick(patient);
  };

  const getPatientTreatments = (hn: string) => {
    return treatments.filter((treatment) => treatment.patientHN === hn);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="relative mb-6">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="ค้นหาด้วย HN หรือชื่อผู้ป่วย..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>HN</TableHead>
              <TableHead>ชื่อ-นามสกุล</TableHead>
              <TableHead>อายุ</TableHead>
              <TableHead>เบอร์โทรศัพท์</TableHead>
              <TableHead className="text-right">การดำเนินการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPatients.map((patient) => (
              <TableRow key={patient.hn}>
                <TableCell>{patient.hn}</TableCell>
                <TableCell>{`${patient.firstName} ${patient.lastName}`}</TableCell>
                <TableCell>{patient.age}</TableCell>
                <TableCell>{patient.phoneNumber}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onTreatmentClick(patient)}
                  >
                    บันทึกการรักษา
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShowHistory(patient)}
                  >
                    <History className="h-4 w-4 mr-1" />
                    ประวัติการรักษา
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleMedicalCertificate(patient)}
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    ใบรับรองแพทย์
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(patient.hn)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {selectedPatient && (
          <TreatmentHistoryDialog
            isOpen={showHistory}
            onClose={() => setShowHistory(false)}
            treatments={getPatientTreatments(selectedPatient.hn)}
            patientName={selectedPatient.name}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default PatientList;