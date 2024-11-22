import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface VitalSignsFormProps {
  formData: {
    vitalSigns: {
      bloodPressure: string;
      heartRate: number;
      temperature: number;
      respiratoryRate: number;
    };
  };
  setFormData: (data: any) => void;
}

export const VitalSignsForm = ({ formData, setFormData }: VitalSignsFormProps) => {
  return (
    <div className="space-y-2">
      <Label>Vital Signs</Label>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <Label htmlFor="bloodPressure">ความดันโลหิต</Label>
          <Input
            id="bloodPressure"
            onChange={(e) =>
              setFormData({
                ...formData,
                vitalSigns: {
                  ...formData.vitalSigns,
                  bloodPressure: e.target.value,
                },
              })
            }
          />
        </div>
        <div>
          <Label htmlFor="heartRate">ชีพจร</Label>
          <Input
            id="heartRate"
            type="number"
            onChange={(e) =>
              setFormData({
                ...formData,
                vitalSigns: {
                  ...formData.vitalSigns,
                  heartRate: Number(e.target.value),
                },
              })
            }
          />
        </div>
        <div>
          <Label htmlFor="temperature">อุณหภูมิ</Label>
          <Input
            id="temperature"
            type="number"
            step="0.1"
            onChange={(e) =>
              setFormData({
                ...formData,
                vitalSigns: {
                  ...formData.vitalSigns,
                  temperature: Number(e.target.value),
                },
              })
            }
          />
        </div>
        <div>
          <Label htmlFor="respiratoryRate">อัตราการหายใจ</Label>
          <Input
            id="respiratoryRate"
            type="number"
            onChange={(e) =>
              setFormData({
                ...formData,
                vitalSigns: {
                  ...formData.vitalSigns,
                  respiratoryRate: Number(e.target.value),
                },
              })
            }
          />
        </div>
      </div>
    </div>
  );
};