import { useState, useEffect } from "react";
import { Patient } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Eye } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import PreviewDialog from "./PreviewDialog";
import ReceiptPreview from "./ReceiptPreview";
import ReceiptFormInputs from "./receipt/ReceiptFormInputs";
import ReceiptDatePicker from "./receipt/ReceiptDatePicker";

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
      // Save receipt data to database first
      const { error: insertError } = await supabase
        .from('receipts')
        .insert({
          receipt_number: receiptNumber,
          patient_hn: patient.hn,
          date: date.toISOString(),
          medical_service_amount: parseFloat(medicalServiceAmount || "0"),
          procedure_amount: parseFloat(procedureAmount || "0"),
          medication_amount: parseFloat(medicationAmount || "0"),
          total_amount: getTotalAmount()
        });

      if (insertError) throw insertError;

      // Generate PDF using edge function
      const { data, error } = await supabase.functions.invoke("generate-receipt", {
        body: {
          receiptData: {
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
          },
        },
      });

      if (error) throw error;

      if (!data?.pdf) {
        throw new Error("No PDF data received from the server");
      }

      // Create object URL from base64 PDF
      const pdfBlob = await fetch(
        `data:application/pdf;base64,${data.pdf}`
      ).then((res) => res.blob());
      const pdfUrl = URL.createObjectURL(pdfBlob);

      // Open PDF in new tab
      window.open(pdfUrl, "_blank");

      toast({
        title: "พิมพ์เอกสารสำเร็จ",
        description: "ระบบได้สร้างไฟล์ PDF เรียบร้อยแล้ว",
      });

      // Reset form
      setMedicalServiceAmount("");
      setProcedureAmount("");
      setMedicationAmount("");
      fetchLatestReceiptNumber();
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
          <Input value={receiptNumber} readOnly className="text-right" />
        </div>
        <div className="space-y-2">
          <Label>วันที่</Label>
          <ReceiptDatePicker date={date} setDate={setDate} />
        </div>
      </div>

      <ReceiptFormInputs
        medicalServiceAmount={medicalServiceAmount}
        setMedicalServiceAmount={setMedicalServiceAmount}
        procedureAmount={procedureAmount}
        setProcedureAmount={setProcedureAmount}
        medicationAmount={medicationAmount}
        setMedicationAmount={setMedicationAmount}
        getTotalAmount={getTotalAmount}
      />

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
          receiptNumber={receiptNumber}
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