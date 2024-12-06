import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { useToast } from "./ui/use-toast";

interface MedicalCertificateProps {
  selectedPatient: any;
}

const MedicalCertificate = ({ selectedPatient }: MedicalCertificateProps) => {
  const { toast } = useToast();
  const [certificateNumber, setCertificateNumber] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [visitDate, setVisitDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [restDays, setRestDays] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: doctors } = useQuery({
    queryKey: ["doctors"],
    queryFn: async () => {
      const { data, error } = await supabase.from("doctors").select("*");
      if (error) throw error;
      return data;
    },
  });

  const selectedDoctorData = doctors?.find(d => d.id.toString() === selectedDoctor);

  const handleSaveAndPrint = async () => {
    if (!selectedDoctor || !certificateNumber) {
      toast({
        title: "กรุณากรอกข้อมูลให้ครบถ้วน",
        description: "กรุณาเลือกแพทย์และกรอกเลขที่ใบรับรองแพทย์",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      // Save certificate data to Supabase
      const { error: saveError } = await supabase
        .from('medical_certificates')
        .insert({
          certificate_number: certificateNumber,
          patient_hn: selectedPatient.hn,
          doctor_id: parseInt(selectedDoctor),
          visit_date: new Date(visitDate).toISOString(),
          start_date: startDate ? new Date(startDate).toISOString() : null,
          end_date: endDate ? new Date(endDate).toISOString() : null,
          rest_days: restDays ? parseInt(restDays) : null,
        });

      if (saveError) throw saveError;

      // Generate PDF using edge function
      const { data: pdfData, error: pdfError } = await supabase.functions.invoke('generate-medical-certificate', {
        body: {
          certificateData: {
            certificateNumber,
            doctorName: selectedDoctorData ? `${selectedDoctorData.title}${selectedDoctorData.name}` : '',
            patientName: `${selectedPatient.firstName} ${selectedPatient.lastName}`,
            visitDate,
            startDate,
            endDate,
            restDays
          }
        }
      });

      if (pdfError) throw pdfError;

      // Update certificate with PDF URL
      const { error: updateError } = await supabase
        .from('medical_certificates')
        .update({ pdf_url: pdfData.pdfUrl })
        .eq('certificate_number', certificateNumber);

      if (updateError) throw updateError;

      // Open PDF in new tab
      window.open(pdfData.pdfUrl, '_blank');

      toast({
        title: "บันทึกและสร้างใบรับรองแพทย์สำเร็จ",
        description: "ระบบได้บันทึกและสร้าง PDF ใบรับรองแพทย์เรียบร้อยแล้ว"
      });

    } catch (error) {
      console.error('Error generating medical certificate:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถสร้างใบรับรองแพทย์ได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (!selectedPatient) {
    return null;
  }

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
        <Button 
          onClick={handleSaveAndPrint} 
          className="w-full"
          disabled={isGenerating}
        >
          {isGenerating ? "กำลังสร้างใบรับรองแพทย์..." : "บันทึกและพิมพ์ใบรับรองแพทย์"}
        </Button>
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