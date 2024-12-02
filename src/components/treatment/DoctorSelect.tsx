import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

interface Doctor {
  id: number;
  name: string;
  title: string;
}

interface DoctorSelectProps {
  selectedDoctorId: number | null;
  onDoctorSelect: (doctorId: number) => void;
}

export const DoctorSelect = ({ selectedDoctorId, onDoctorSelect }: DoctorSelectProps) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      const { data, error } = await supabase
        .from('doctors')
        .select('*');
      
      if (error) {
        console.error('Error fetching doctors:', error);
        return;
      }

      setDoctors(data);
    };

    fetchDoctors();
  }, []);

  return (
    <div className="space-y-2">
      <Label htmlFor="doctor">แพทย์ผู้ตรวจ</Label>
      <Select
        value={selectedDoctorId?.toString() || ""}
        onValueChange={(value) => onDoctorSelect(parseInt(value))}
      >
        <SelectTrigger id="doctor">
          <SelectValue placeholder="เลือกแพทย์" />
        </SelectTrigger>
        <SelectContent>
          {doctors.map((doctor) => (
            <SelectItem key={doctor.id} value={doctor.id.toString()}>
              {doctor.name} ({doctor.title})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};