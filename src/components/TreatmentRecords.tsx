import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Treatment } from "@/types";

interface TreatmentRecordsProps {
  treatments: Treatment[];
  onAddTreatment: (treatment: Treatment) => void;
}

const TreatmentRecords = ({ treatments, onAddTreatment }: TreatmentRecordsProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    patientHN: "",
    treatmentDate: new Date(),
    vitalSigns: {
      bloodPressure: "",
      heartRate: 0,
      temperature: 0,
      respiratoryRate: 0
    },
    symptoms: "",
    diagnosis: "",
    treatment: "",
    medications: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newTreatment: Treatment = {
      id: `TR${Date.now()}`,
      ...formData,
      treatmentDate: new Date(formData.treatmentDate)
    };

    onAddTreatment(newTreatment);
    
    toast({
      title: "บันทึกข้อมูลสำเร็จ",
      description: `บันทึกการรักษาสำหรับ HN: ${formData.patientHN}`,
    });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="patientHN">ค้นหาผู้ป่วย (เลือกรหัส HN)</Label>
              <Input
                id="patientHN"
                required
                onChange={(e) => setFormData({ ...formData, patientHN: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="treatmentDate">วันที่รักษา</Label>
              <Input
                id="treatmentDate"
                type="date"
                required
                onChange={(e) => setFormData({ ...formData, treatmentDate: new Date(e.target.value) })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Vital Signs</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="bloodPressure">ความดันโลหิต</Label>
                <Input
                  id="bloodPressure"
                  onChange={(e) => setFormData({
                    ...formData,
                    vitalSigns: { ...formData.vitalSigns, bloodPressure: e.target.value }
                  })}
                />
              </div>
              <div>
                <Label htmlFor="heartRate">ชีพจร</Label>
                <Input
                  id="heartRate"
                  type="number"
                  onChange={(e) => setFormData({
                    ...formData,
                    vitalSigns: { ...formData.vitalSigns, heartRate: Number(e.target.value) }
                  })}
                />
              </div>
              <div>
                <Label htmlFor="temperature">อุณหภูมิ</Label>
                <Input
                  id="temperature"
                  type="number"
                  step="0.1"
                  onChange={(e) => setFormData({
                    ...formData,
                    vitalSigns: { ...formData.vitalSigns, temperature: Number(e.target.value) }
                  })}
                />
              </div>
              <div>
                <Label htmlFor="respiratoryRate">อัตราการหายใจ</Label>
                <Input
                  id="respiratoryRate"
                  type="number"
                  onChange={(e) => setFormData({
                    ...formData,
                    vitalSigns: { ...formData.vitalSigns, respiratoryRate: Number(e.target.value) }
                  })}
                />
              </div>
            </div>
          </div>

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
              onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="treatment">การรักษา</Label>
            <Textarea
              id="treatment"
              required
              onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="medications">ยาที่ใช้</Label>
            <Textarea
              id="medications"
              required
              onChange={(e) => setFormData({ ...formData, medications: e.target.value })}
            />
          </div>

          <Button type="submit" className="w-full">บันทึกข้อมูล</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TreatmentRecords;