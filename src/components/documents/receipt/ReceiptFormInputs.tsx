import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ReceiptFormInputsProps {
  medicalServiceAmount: string;
  setMedicalServiceAmount: (value: string) => void;
  procedureAmount: string;
  setProcedureAmount: (value: string) => void;
  medicationAmount: string;
  setMedicationAmount: (value: string) => void;
  getTotalAmount: () => number;
}

const ReceiptFormInputs = ({
  medicalServiceAmount,
  setMedicalServiceAmount,
  procedureAmount,
  setProcedureAmount,
  medicationAmount,
  setMedicationAmount,
  getTotalAmount,
}: ReceiptFormInputsProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>ค่าบริการทางการแพทย์</Label>
        <Input
          type="number"
          value={medicalServiceAmount}
          onChange={(e) => setMedicalServiceAmount(e.target.value)}
          placeholder="0.00"
        />
      </div>

      <div className="space-y-2">
        <Label>ค่าหัตถการเพื่อการรักษา</Label>
        <Input
          type="number"
          value={procedureAmount}
          onChange={(e) => setProcedureAmount(e.target.value)}
          placeholder="0.00"
        />
      </div>

      <div className="space-y-2">
        <Label>ค่ายาและเวชภัณฑ์</Label>
        <Input
          type="number"
          value={medicationAmount}
          onChange={(e) => setMedicationAmount(e.target.value)}
          placeholder="0.00"
        />
      </div>

      <div className="pt-4 border-t">
        <div className="text-right font-semibold">
          รวมทั้งสิ้น: {getTotalAmount().toLocaleString("th-TH")} บาท
        </div>
      </div>
    </div>
  );
};

export default ReceiptFormInputs;