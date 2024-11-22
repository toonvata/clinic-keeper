import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface TreatmentFormProps {
  formData: any;
  setFormData: (data: any) => void;
}

export const TreatmentForm = ({ formData, setFormData }: TreatmentFormProps) => {
  return (
    <>
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
          onChange={(e) =>
            setFormData({ ...formData, diagnosis: e.target.value })
          }
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="treatment">การรักษา</Label>
        <Textarea
          id="treatment"
          required
          onChange={(e) =>
            setFormData({ ...formData, treatment: e.target.value })
          }
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="medications">ยาที่ใช้</Label>
        <Textarea
          id="medications"
          required
          onChange={(e) =>
            setFormData({ ...formData, medications: e.target.value })
          }
        />
      </div>
    </>
  );
};