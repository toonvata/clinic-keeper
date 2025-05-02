
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Patient } from "@/types";
import { PatientSearch } from "./treatment/PatientSearch";
import MedicalCertificateForm from "./documents/MedicalCertificateForm";
import ReceiptForm from "./documents/ReceiptForm";

interface DocumentsProps {
  patients: Patient[];
}

const Documents = ({ patients }: DocumentsProps) => {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showSearch, setShowSearch] = useState(false);

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
  };

  return (
    <div className="space-y-4">
      <PatientSearch
        showSearch={showSearch}
        setShowSearch={setShowSearch}
        selectedPatient={selectedPatient}
        patients={patients}
        onPatientSelect={handlePatientSelect}
      />

      {selectedPatient && (
        <Tabs defaultValue="medical-cert" className="w-full">
          <TabsList>
            <TabsTrigger value="medical-cert">ใบรับรองแพทย์</TabsTrigger>
            <TabsTrigger value="receipt">ใบเสร็จรับเงิน</TabsTrigger>
          </TabsList>

          <TabsContent value="medical-cert">
            <Card>
              <CardContent className="pt-6">
                <MedicalCertificateForm patient={selectedPatient} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="receipt">
            <Card>
              <CardContent className="pt-6">
                <ReceiptForm patient={selectedPatient} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default Documents;
