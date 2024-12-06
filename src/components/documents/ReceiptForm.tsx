import { useState } from "react";
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

interface ReceiptFormProps {
  patient: Patient;
}

const ReceiptForm = ({ patient }: ReceiptFormProps) => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date>(new Date());
  const [amount, setAmount] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const handlePreview = () => {
    if (!amount) {
      toast({
        title: "กรุณากรอกจำนวนเงิน",
        description: "โปรดกรอกจำนวนเงินก่อนพิมพ์เอกสาร",
        variant: "destructive",
      });
      return;
    }
    setShowPreview(true);
  };

  const handlePrint = async () => {
    if (!amount) {
      toast({
        title: "กรุณากรอกจำนวนเงิน",
        description: "โปรดกรอกจำนวนเงินก่อนพิมพ์เอกสาร",
        variant: "destructive",
      });
      return;
    }

    try {
      // Generate receipt number
      const receiptNumber = `REC-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;

      const receiptData = {
        receiptNumber,
        patientName: `${patient.firstName} ${patient.lastName}`,
        date: date.toISOString(),
        amount: parseFloat(amount)
      };

      // Call the Edge Function to generate PDF
      const response = await fetch(
        'https://qezunutqfumuzloarrti.supabase.co/functions/v1/generate-receipt',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`
          },
          body: JSON.stringify({ receiptData })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      // Get the PDF blob from the response
      const pdfBlob = await response.blob();
      
      // Create a URL for the blob
      const pdfUrl = URL.createObjectURL(pdfBlob);
      
      // Open PDF in new tab
      window.open(pdfUrl, '_blank');

      toast({
        title: "พิมพ์เอกสารสำเร็จ",
        description: "ระบบได้สร้างไฟล์ PDF เรียบร้อยแล้ว",
      });
    } catch (error) {
      console.error('Error generating receipt:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถสร้างใบเสร็จรับเงินได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>เลขที่</Label>
          <Input value="REC-2024-0001" readOnly />
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

      <div className="space-y-2">
        <Label>จำนวนเงิน</Label>
        <Input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
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
    </div>
  );
};

export default ReceiptForm;