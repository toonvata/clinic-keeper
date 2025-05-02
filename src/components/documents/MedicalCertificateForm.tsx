import { useState, useEffect } from "react";
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
import MedicalCertificatePreview, { generateMedicalCertificatePDF } from "./MedicalCertificatePreview";

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
  const [isGenerating, setIsGenerating] = useState(false);
  const [certificateNumber, setCertificateNumber] = useState("");

  useEffect(() => {
    fetchLatestCertificateNumber();
  }, []);

  const fetchLatestCertificateNumber = async () => {
    try {
      const { data, error } = await supabase
        .from('medical_certificates')
        .select('certificate_number')
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;

      let nextNumber = 1;
      if (data && data.length > 0) {
        const lastNumber = parseInt(data[0].certificate_number.split('-')[2]);
        nextNumber = lastNumber + 1;
      }

      const newCertificateNumber = `MC-${new Date().getFullYear()}-${nextNumber.toString().padStart(4, '0')}`;
      setCertificateNumber(newCertificateNumber);
    } catch (error) {
      console.error('Error fetching latest certificate number:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถดึงเลขที่ใบรับรองแพทย์ได้",
        variant: "destructive",
      });
    }
  };

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

    setIsGenerating(true);

    try {
      // Calculate rest days if both start and end dates are set
      let restDays = 0;
      if (startDate && endDate) {
        restDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      }

      // Generate PDF using browser-side jsPDF
      const pdfData = generateMedicalCertificatePDF({
        certificateNumber,
        doctorName,
        patientName: `${patient.firstName} ${patient.lastName}`,
        visitDate,
        startDate,
        endDate,
        restDays: restDays > 0 ? restDays : undefined,
        diagnosis
      });

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
          rest_days: restDays > 0 ? restDays : null,
          diagnosis
        });

      if (insertError) {
        console.error('Error saving to database:', insertError);
        throw insertError;
      }

      // Open PDF in new tab
      window.open(pdfData, '_blank');

      toast({
        title: "พิมพ์เอกสารสำเร็จ",
        description: "ระบบได้สร้างไฟล์ PDF เรียบร้อยแล้ว",
      });
      
      // Reset form and get new certificate number
      fetchLatestCertificateNumber();
      setDiagnosis("");
      setStartDate(undefined);
      setEndDate(undefined);
    } catch (error) {
      console.error('Error generating certificate:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถสร้างใบรับรองแพทย์ได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>เลขที่</Label>
          <Input 
            value={certificateNumber} 
            readOnly 
            className="text-right"
          />
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
        <Button onClick={handlePrint} disabled={isGenerating}>
          <FileText className="w-4 h-4 mr-2" />
          {isGenerating ? "กำลังสร้างเอกสาร..." : "พิมพ์เอกสาร"}
        </Button>
      </div>

      <PreviewDialog
        open={showPreview}
        onOpenChange={setShowPreview}
        title="ตัวอย่างใบรับรองแพทย์"
      >
        <MedicalCertificatePreview
          certificateNumber={certificateNumber}
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
