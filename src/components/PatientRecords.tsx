import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Patient } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { calculateAge } from "@/utils/dateUtils";
import { PatientFormHeader } from "./patient/PatientFormHeader";

interface PatientRecordsProps {
  onAddPatient: (patient: Patient) => void;
}

const PatientRecords = ({ onAddPatient }: PatientRecordsProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<Patient>>({});
  const [hn, setHn] = useState<string>("");
  const [registrationDate, setRegistrationDate] = useState<Date>(new Date());

  const generateHN = () => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${year}${random}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newHn = generateHN();
    setHn(newHn);
    
    if (!formData.birthDate) {
      toast({
        title: "กรุณากรอกวันเกิด",
        variant: "destructive"
      });
      return;
    }

    const birthDate = new Date(formData.birthDate);
    
    const newPatient: Patient = {
      ...formData as Patient,
      hn: newHn,
      registrationDate: new Date(),
      birthDate: birthDate,
      age: calculateAge(birthDate)
    };

    try {
      const { error } = await supabase
        .from('patients')
        .insert({
          hn: newPatient.hn,
          registration_date: newPatient.registrationDate.toISOString(),
          first_name: newPatient.firstName,
          last_name: newPatient.lastName,
          birth_date: newPatient.birthDate.toISOString(),
          age: newPatient.age,
          id_number: newPatient.idNumber,
          occupation: newPatient.occupation,
          address: newPatient.address,
          phone_number: newPatient.phoneNumber,
          underlying_diseases: newPatient.underlyingDiseases,
          drug_allergies: newPatient.drugAllergies
        });

      if (error) throw error;

      onAddPatient(newPatient);
      
      toast({
        title: "บันทึกข้อมูลสำเร็จ",
        description: `HN: ${newHn}`,
      });
    } catch (error) {
      console.error('Error inserting patient:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <PatientFormHeader hn={hn} registrationDate={registrationDate} />

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">ชื่อ</Label>
              <Input
                id="firstName"
                required
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lastName">นามสกุล</Label>
              <Input
                id="lastName"
                required
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="birthDate">วันเกิด (ค.ศ.)</Label>
              <Input
                id="birthDate"
                type="date"
                required
                max={new Date().toISOString().split('T')[0]}
                onChange={(e) => {
                  const date = new Date(e.target.value);
                  setFormData({ ...formData, birthDate: date });
                }}
              />
              <span className="text-sm text-gray-500">กรุณาใส่วันเกิดในรูปแบบ ค.ศ.</span>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="idNumber">เลขบัตรประจำตัวประชาชน</Label>
              <Input
                id="idNumber"
                required
                maxLength={13}
                onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="occupation">อาชีพ</Label>
              <Input
                id="occupation"
                onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">เบอร์โทรศัพท์</Label>
              <Input
                id="phoneNumber"
                required
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">ที่อยู่</Label>
            <Textarea
              id="address"
              required
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="underlyingDiseases">โรคประจำตัว</Label>
            <Textarea
              id="underlyingDiseases"
              onChange={(e) => setFormData({ ...formData, underlyingDiseases: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="drugAllergies">ประวัติการแพ้ยา</Label>
            <Textarea
              id="drugAllergies"
              onChange={(e) => setFormData({ ...formData, drugAllergies: e.target.value })}
            />
          </div>
          
          <Button type="submit" className="w-full">บันทึกข้อมูล</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PatientRecords;