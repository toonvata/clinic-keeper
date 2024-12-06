import { useState, useEffect } from "react";
import { Patient } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, FileText, Eye } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import PreviewDialog from "./PreviewDialog";
import ReceiptPreview from "./ReceiptPreview";

interface ReceiptFormProps {
  patient: Patient;
}

const ReceiptForm = ({ patient }: ReceiptFormProps) => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date>(new Date());
  const [medicalServiceAmount, setMedicalServiceAmount] = useState("");
  const [procedureAmount, setProcedureAmount] = useState("");
  const [medicationAmount, setMedicationAmount] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [receiptNumber, setReceiptNumber] = useState("");

  useEffect(() => {
    fetchLatestReceiptNumber();
  }, []);

  const fetchLatestReceiptNumber = async () => {
    try {
      const { data, error } = await supabase
        .from('receipts')
        .select('receipt_number')
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;

      let nextNumber = 1;
      if (data && data.length > 0) {
        const lastNumber = parseInt(data[0].receipt_number.split('-')[2]);
        nextNumber = lastNumber + 1;
      }

      const newReceiptNumber = `REC-${new Date().getFullYear()}-${nextNumber.toString().padStart(4, '0')}`;
      setReceiptNumber(newReceiptNumber);
    } catch (error) {
      console.error('Error fetching latest receipt number:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถดึงเลขที่ใบเสร็จได้",
        variant: "destructive",
      });
    }
  };

  const getTotalAmount = () => {
    return (
      parseFloat(medicalServiceAmount || "0") +
      parseFloat(procedureAmount || "0") +
      parseFloat(medicationAmount || "0")
    );
  };

  const handlePreview = () => {
    if (!medicalServiceAmount && !procedureAmount && !medicationAmount) {
      toast({
        title: "กรุณากรอกจำนวนเงิน",
        description: "โปรดกรอกจำนวนเงินอย่างน้อยหนึ่งรายการก่อนพิมพ์เอกสาร",
        variant: "destructive",
      });
      return;
    }
    setShowPreview(true);
  };

  const handlePrint = async () => {
    if (!medicalServiceAmount && !procedureAmount && !medicationAmount) {
      toast({
        title: "กรุณากรอกจำนวนเงิน",
        description: "โปรดกรอกจำนวนเงินอย่างน้อยหนึ่งรายการก่อนพิมพ์เอกสาร",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      // Generate receipt number
      const receiptNumber = `REC-${new Date().getFullYear()}-${Math.floor(
        Math.random() * 10000
      )
        .toString()
        .padStart(4, "0")}`;

      const receiptData = {
        receiptNumber,
        patientName: `${patient.firstName} ${patient.lastName}`,
        date: date.toISOString(),
        items: [
          {
            description: "ค่าบริการทางการแพทย์",
            amount: parseFloat(medicalServiceAmount || "0"),
          },
          {
            description: "ค่าหัตถการเพื่อการรักษา",
            amount: parseFloat(procedureAmount || "0"),
          },
          {
            description: "ค่ายาและเวชภัณฑ์",
            amount: parseFloat(medicationAmount || "0"),
          },
        ],
        totalAmount: getTotalAmount(),
      };

      console.log("Sending receipt data:", receiptData);

      const { data, error } = await supabase.functions.invoke("generate-receipt", {
        body: { receiptData },
      });

      if (error) {
        console.error("Error from edge function:", error);
        throw error;
      }

      if (!data?.pdf) {
        throw new Error("No PDF data received from the server");
      }

      console.log("Received PDF data from server");

      // Create object URL from base64 PDF
      const pdfBlob = await fetch(
        `data:application/pdf;base64,${data.pdf}`
      ).then((res) => res.blob());
      const pdfUrl = URL.createObjectURL(pdfBlob);

      console.log("Created PDF URL:", pdfUrl);

      // Open PDF in new tab
      window.open(pdfUrl, "_blank");

      toast({
        title: "พิมพ์เอกสารสำเร็จ",
        description: "ระบบได้สร้างไฟล์ PDF เรียบร้อยแล้ว",
      });
    } catch (error) {
      console.error("Error generating receipt:", error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถสร้างใบเสร็จรับเงินได้ กรุณาลองใหม่อีกครั้ง",
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
            value={receiptNumber}
            readOnly
            className="text-right"
          />
        </div>
        <div className="space-y-2">
          <Label>วันที่</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "dd/MM/yyyy") : "เลือกวันที่"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(date) => date && setDate(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>ค่าบริการทางการแพทย์</Label>
          <Input
            type="number"
            value={medicalServiceAmount}
            onChange={(e) => setMedicalServiceAmount(e.target.value)}
            placeholder="0.00"
          />
        </div>

        <div className="space-y-2">
          <Label>ค่าหัตถการเพื่อการรักษา</Label>
          <Input
            type="number"
            value={procedureAmount}
            onChange={(e) => setProcedureAmount(e.target.value)}
            placeholder="0.00"
          />
        </div>

        <div className="space-y-2">
          <Label>ค่ายาและเวชภัณฑ์</Label>
          <Input
            type="number"
            value={medicationAmount}
            onChange={(e) => setMedicationAmount(e.target.value)}
            placeholder="0.00"
          />
        </div>

        <div className="pt-4 border-t">
          <div className="text-right font-semibold">
            รวมทั้งสิ้น: {getTotalAmount().toLocaleString("th-TH")} บาท
          </div>
        </div>
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
        title="ตัวอย่างใบเสร็จรับเงิน"
      >
        <ReceiptPreview
          receiptNumber={`REC-${new Date().getFullYear()}-XXXX`}
          patientName={`${patient.firstName} ${patient.lastName}`}
          date={date}
          items={[
            {
              description: "ค่าบริการทางการแพทย์",
              amount: parseFloat(medicalServiceAmount || "0"),
            },
            {
              description: "ค่าหัตถการเพื่อการรักษา",
              amount: parseFloat(procedureAmount || "0"),
            },
            {
              description: "ค่ายาและเวชภัณฑ์",
              amount: parseFloat(medicationAmount || "0"),
            },
          ]}
          totalAmount={getTotalAmount()}
        />
      </PreviewDialog>
    </div>
  );
};

export default ReceiptForm;
