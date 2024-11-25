import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PatientFormHeaderProps {
  hn: string;
  registrationDate: Date;
}

export const PatientFormHeader = ({ hn, registrationDate }: PatientFormHeaderProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div className="space-y-2">
        <Label>HN</Label>
        <Input value={hn || "-"} disabled />
      </div>
      <div className="space-y-2">
        <Label>วันที่มารักษา</Label>
        <Input 
          type="text" 
          value={registrationDate.toLocaleDateString('th-TH')} 
          disabled 
        />
      </div>
    </div>
  );
};