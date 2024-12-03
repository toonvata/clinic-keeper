import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PatientFormHeaderProps {
  hn: string;
  registrationDate: Date;
}

export const PatientFormHeader = ({ hn, registrationDate }: PatientFormHeaderProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div className="space-y-2 text-left">
        <Label htmlFor="hn">HN</Label>
        <Input id="hn" value={hn || "-"} disabled />
      </div>
      <div className="space-y-2 text-left">
        <Label htmlFor="registrationDate">วันที่มารักษา</Label>
        <Input 
          id="registrationDate"
          type="text" 
          value={registrationDate.toLocaleDateString('th-TH')} 
          disabled 
        />
      </div>
    </div>
  );
};