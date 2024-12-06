import { useState } from "react";
import { Patient } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DoctorSelect } from "@/components/treatment/DoctorSelect";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, FileText, Eye } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import PreviewDialog from "./PreviewDialog";
import MedicalCertificatePreview from "./MedicalCertificatePreview";

interface MedicalCertificateFormProps {
  patient: Patient;
}

const MedicalCertificateForm = ({ patient }: MedicalCertificateFormProps) => {
  const { toast } = useToast();
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);
  const [visitDate, setVisitDate] = useState<Date>(new Date());
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [diagnosis, setDiagnosis] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [doctorName, setDoctorName] = useState("");

  const handleDoctorSelect = async (id: number) => {
    setSelectedDoctorId(id);
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('name')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      if (data) setDoctorName(data.name);
    } catch (error) {
      console.error('Error fetching doctor name:', error);
    }
  };

  const handlePreview = () => {
    if (!selectedDoctorId) {
      toast({
        title: "กรุณาเลือกแพทย์",
        description: "โปรดเลือกแพทย์ผู้ตรวจก่อนพิมพ์เอกสาร",
        variant: "destructive",
      });
      return;
    }
    setShowPreview(true);
  };

  const handlePrint = async () => {
    if (!selectedDoctorId) {
      toast({
        title: "กรุณาเลือกแพทย์",
        description: "โปรดเลือกแพทย์ผู้ตรวจก่อนพิมพ์เอกสาร",
        variant: "destructive",
      });
      return;
    }

    try {
      // Calculate rest days if both start and end dates are set
      let restDays = 0;
      if (startDate && endDate) {
        restDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      }

      // Generate certificate number
      const certificateNumber = `MC-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;

      const certificateData = {
        certificateNumber,
        patientName: `${patient.firstName} ${patient.lastName}`,
        doctorName,
        visitDate: visitDate.toISOString(),
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
        restDays,
        diagnosis
      };

      const { data, error } = await supabase.functions.invoke('generate-medical-certificate', {
        body: { certificateData }
      });

      if (error) throw error;

      // Create object URL from base64 PDF
      const pdfBlob = await fetch(`data:application/pdf;base64,${data.pdf}`).then(res => res.blob());
      const pdfUrl = URL.createObjectURL(pdfBlob);

      // Save certificate data to database
      const { error: insertError } = await supabase
        .from('medical_certificates')
        .insert({
          certificate_number: certificateNumber,
          patient_hn: patient.hn,
          doctor_id: selectedDoctorId,
          visit_date: visitDate.toISOString(),
          start_date: startDate?.toISOString(),
          end_date: endDate?.toISOString(),
          rest_days: restDays,
          diagnosis,
          pdf_url: pdfUrl
        });

      if (insertError) throw insertError;

      // Open PDF in new tab
      window.open(pdfUrl, '_blank');

      toast({
        title: "พิมพ์เอกสารสำเร็จ",
        description: "ระบบได้สร้างไฟล์ PDF เรียบร้อยแล้ว",
      });
    } catch (error) {
      console.error('Error generating certificate:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถสร้างใบรับรองแพทย์ได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>เลขที่</Label>
          <Input value={`MC-${new Date().getFullYear()}-XXXX`} readOnly />
        </div>
        <DoctorSelect
          selectedDoctorId={selectedDoctorId}
          onDoctorSelect={handleDoctorSelect}
        />
      </div>

      <div className="space-y-2">
        <Label>วันที่ตรวจ</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !visitDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {visitDate ? format(visitDate, "dd/MM/yyyy") : "เลือกวันที่"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={visitDate}
              onSelect={(date) => date && setVisitDate(date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>วันที่เริ่มหยุดพัก</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "dd/MM/yyyy") : "เลือกวันที่"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={(date) => date && setStartDate(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>ถึงวันที่</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "dd/MM/yyyy") : "เลือกวันที่"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={(date) => date && setEndDate(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="space-y-2">
        <Label>วินิจฉัย</Label>
        <Textarea
          value={diagnosis}
          onChange={(e) => setDiagnosis(e.target.value)}
          placeholder="กรอกการวินิจฉัยโรค"
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={handlePreview}>
          <Eye className="w-4 h-4 mr-2" />
          ดูตัวอย่าง
        </Button>
        <Button onClick={handlePrint}>
          <FileText className="w-4 h-4 mr-2" />
          พิมพ์เอกสาร
        </Button>
      </div>

      <PreviewDialog
        open={showPreview}
        onOpenChange={setShowPreview}
        title="ตัวอย่างใบรับรองแพทย์"
      >
        <MedicalCertificatePreview
          certificateNumber={`MC-${new Date().getFullYear()}-XXXX`}
          doctorName={doctorName}
          patientName={`${patient.firstName} ${patient.lastName}`}
          visitDate={visitDate}
          startDate={startDate}
          endDate={endDate}
          restDays={
            startDate && endDate
              ? Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
              : undefined
          }
          diagnosis={diagnosis}
        />
      </PreviewDialog>
    </div>
  );
};

export default MedicalCertificateForm;