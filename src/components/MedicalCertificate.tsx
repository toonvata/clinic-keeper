import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface MedicalCertificateProps {
  selectedPatient: any;
}

const MedicalCertificate = ({ selectedPatient }: MedicalCertificateProps) => {
  const [certificateNumber, setCertificateNumber] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [visitDate, setVisitDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [restDays, setRestDays] = useState("");

  const { data: doctors } = useQuery({
    queryKey: ["doctors"],
    queryFn: async () => {
      const { data, error } = await supabase.from("doctors").select("*");
      if (error) throw error;
      return data;
    },
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 print:p-8">
      <div className="text-center print:text-left space-y-2">
        <h2 className="text-xl font-bold">เฮ้าส์ ออฟ เฮิร์บ เวลเนส คลินิก</h2>
        <p>162 ถนนสวนสมเด็จ ต.หน้าเมือง อ.เมือง จ.ฉะเชิงเทรา 0909149946</p>
      </div>

      <div className="text-center print:text-left">
        <h1 className="text-2xl font-bold">ใบรับรองแพทย์ / Medical Certificate</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>เลขที่</Label>
          <Input
            value={certificateNumber}
            onChange={(e) => setCertificateNumber(e.target.value)}
            placeholder="เลขที่ใบรับรองแพทย์"
          />
        </div>

        <div className="space-y-2">
          <Label>แพทย์ผู้ตรวจ</Label>
          <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
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
            onChange={(e) => setVisitDate(e.target.value)}
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
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>ถึงวันที่</Label>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>จำนวนวันพัก</Label>
          <Input
            type="number"
            value={restDays}
            onChange={(e) => setRestDays(e.target.value)}
            placeholder="จำนวนวัน"
          />
        </div>
      </div>

      <div className="text-center print:text-left mt-8">
        <p>ทั้งนี้ได้ให้การรักษาพร้อมคำแนะนำให้เรียบร้อยแล้ว</p>
      </div>

      <div className="text-right mt-12 print:mt-24">
        <p>ลงนาม............................................</p>
        <p className="mt-2">แพทย์ผู้ตรวจ</p>
      </div>

      <div className="print:hidden">
        <Button onClick={handlePrint} className="w-full">พิมพ์ใบรับรองแพทย์</Button>
      </div>

      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            .print\\:p-8, .print\\:p-8 * {
              visibility: visible;
            }
            .print\\:hidden {
              display: none;
            }
          }
        `}
      </style>
    </div>
  );
};

export default MedicalCertificate;