import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface CertificateFormProps {
  selectedPatient: any;
  certificateNumber: string;
  selectedDoctor: string;
  visitDate: string;
  startDate: string;
  endDate: string;
  restDays: string;
  onCertificateNumberChange: (value: string) => void;
  onDoctorChange: (value: string) => void;
  onVisitDateChange: (value: string) => void;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onRestDaysChange: (value: string) => void;
}

export const CertificateForm = ({
  selectedPatient,
  certificateNumber,
  selectedDoctor,
  visitDate,
  startDate,
  endDate,
  restDays,
  onCertificateNumberChange,
  onDoctorChange,
  onVisitDateChange,
  onStartDateChange,
  onEndDateChange,
  onRestDaysChange,
}: CertificateFormProps) => {
  const { data: doctors } = useQuery({
    queryKey: ["doctors"],
    queryFn: async () => {
      const { data, error } = await supabase.from("doctors").select("*");
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>เลขที่</Label>
        <Input
          value={certificateNumber}
          onChange={(e) => onCertificateNumberChange(e.target.value)}
          placeholder="เลขที่ใบรับรองแพทย์"
        />
      </div>

      <div className="space-y-2">
        <Label>แพทย์ผู้ตรวจ</Label>
        <Select value={selectedDoctor} onValueChange={onDoctorChange}>
          <SelectTrigger>
            <SelectValue placeholder="เลือกแพทย์" />
          </SelectTrigger>
          <SelectContent>
            {doctors?.map((doctor) => (
              <SelectItem key={doctor.id} value={doctor.id.toString()}>
                {doctor.title} {doctor.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>วันที่มาตรวจ</Label>
        <Input
          type="date"
          value={visitDate}
          onChange={(e) => onVisitDateChange(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>ชื่อผู้ป่วย</Label>
        <Input
          value={selectedPatient ? `${selectedPatient.firstName} ${selectedPatient.lastName}` : ""}
          disabled
        />
      </div>

      <div className="space-y-2">
        <Label>ตั้งแต่วันที่</Label>
        <Input
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>ถึงวันที่</Label>
        <Input
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>จำนวนวันพัก</Label>
        <Input
          type="number"
          value={restDays}
          onChange={(e) => onRestDaysChange(e.target.value)}
          placeholder="จำนวนวัน"
        />
      </div>
    </div>
  );
};