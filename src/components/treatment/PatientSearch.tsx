
import { Patient } from "@/types";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Card } from "@/components/ui/card";

interface PatientSearchProps {
  showSearch: boolean;
  setShowSearch: (show: boolean) => void;
  selectedPatient: Patient | null;
  patients: Patient[];
  onPatientSelect: (patient: Patient) => void;
}

export const PatientSearch = ({
  showSearch,
  setShowSearch,
  selectedPatient,
  patients,
  onPatientSelect,
}: PatientSearchProps) => {
  const handleSearch = (value: string) => {
    const patient = patients.find(
      (p) =>
        p.hn === value ||
        p.firstName.toLowerCase().includes(value.toLowerCase()) ||
        p.lastName.toLowerCase().includes(value.toLowerCase()) ||
        p.phoneNumber.includes(value) // Added phone number search
    );

    if (patient) {
      onPatientSelect(patient);
      setShowSearch(false);
    }
  };

  return (
    <>
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="พิมพ์ HN, ชื่อผู้ป่วย หรือเบอร์โทรศัพท์..."
          className="pl-8"
          onClick={() => setShowSearch(true)}
          value={
            selectedPatient
              ? `${selectedPatient.hn} - ${selectedPatient.firstName} ${selectedPatient.lastName}`
              : ""
          }
          readOnly
        />
      </div>

      {showSearch && (
        <CommandDialog open={showSearch} onOpenChange={setShowSearch}>
          <CommandInput placeholder="ค้นหาด้วย HN, ชื่อ หรือเบอร์โทรศัพท์..." />
          <CommandList>
            <CommandEmpty>ไม่พบข้อมูลผู้ป่วย</CommandEmpty>
            <CommandGroup heading="ผู้ป่วย">
              {patients.map((patient) => (
                <CommandItem
                  key={patient.hn}
                  onSelect={() => handleSearch(patient.hn)}
                >
                  {patient.hn} - {patient.firstName} {patient.lastName} ({patient.phoneNumber})
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
                <span className="font-medium">ชื่อ-นามสกุล:</span>{" "}
                {selectedPatient.firstName} {selectedPatient.lastName}
              </div>
              <div>
                <span className="font-medium">อายุ:</span> {selectedPatient.age} ปี
              </div>
              <div>
                <span className="font-medium">เลขบัตรประจำตัวประชาชน:</span>{" "}
                {selectedPatient.idNumber || "-"}
              </div>
              <div>
                <span className="font-medium">เบอร์โทรศัพท์:</span>{" "}
                {selectedPatient.phoneNumber}
              </div>
              <div className="col-span-2">
                <span className="font-medium">ที่อยู่:</span>{" "}
                {selectedPatient.address || "-"}
              </div>
              <div>
                <span className="font-medium">โรคประจำตัว:</span>{" "}
                {selectedPatient.underlyingDiseases || "-"}
              </div>
              <div>
                <span className="font-medium">ประวัติแพ้ยา:</span>{" "}
                {selectedPatient.drugAllergies || "-"}
              </div>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};
