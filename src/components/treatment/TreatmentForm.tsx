import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

interface TreatmentFormProps {
  formData: any;
  setFormData: (data: any) => void;
}

export const TreatmentForm = ({ formData, setFormData }: TreatmentFormProps) => {
  const handleTreatmentCheckboxChange = (checked: boolean, value: string) => {
    const currentTreatments = formData.treatment ? formData.treatment.split('\n') : [];
    
    if (checked) {
      currentTreatments.push(value);
    } else {
      const index = currentTreatments.indexOf(value);
      if (index > -1) {
        currentTreatments.splice(index, 1);
      }
    }
    
    setFormData({
      ...formData,
      treatment: currentTreatments.filter(t => t).join('\n')
    });
  };

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

      <div className="space-y-4">
        <Label>การรักษา</Label>
        
        <div className="space-y-2">
          <Label className="font-medium">จัดกระดูก</Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="bone-head"
                onCheckedChange={(checked) => 
                  handleTreatmentCheckboxChange(checked as boolean, "จัดกระดูก - หัว")}
              />
              <label htmlFor="bone-head" className="text-sm">หัว</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="bone-back"
                onCheckedChange={(checked) => 
                  handleTreatmentCheckboxChange(checked as boolean, "จัดกระดูก - หลัง")}
              />
              <label htmlFor="bone-back" className="text-sm">หลัง</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="bone-arm"
                onCheckedChange={(checked) => 
                  handleTreatmentCheckboxChange(checked as boolean, "จัดกระดูก - แขน")}
              />
              <label htmlFor="bone-arm" className="text-sm">แขน</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="bone-leg"
                onCheckedChange={(checked) => 
                  handleTreatmentCheckboxChange(checked as boolean, "จัดกระดูก - ขา")}
              />
              <label htmlFor="bone-leg" className="text-sm">ขา</label>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox 
            id="fascia"
            onCheckedChange={(checked) => 
              handleTreatmentCheckboxChange(checked as boolean, "ตัดพังผืด")}
          />
          <label htmlFor="fascia" className="text-sm">ตัดพังผืด</label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox 
            id="massage"
            onCheckedChange={(checked) => 
              handleTreatmentCheckboxChange(checked as boolean, "นวด")}
          />
          <label htmlFor="massage" className="text-sm">นวด</label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox 
            id="lymphatic"
            onCheckedChange={(checked) => 
              handleTreatmentCheckboxChange(checked as boolean, "ระบายน้ำเหลือง")}
          />
          <label htmlFor="lymphatic" className="text-sm">ระบายน้ำเหลือง</label>
        </div>

        <Textarea
          id="treatment"
          required
          value={formData.treatment || ''}
          onChange={(e) =>
            setFormData({ ...formData, treatment: e.target.value })
          }
          placeholder="รายละเอียดการรักษาเพิ่มเติม..."
          className="mt-4"
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