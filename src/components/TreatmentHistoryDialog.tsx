import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Image } from "lucide-react";
import { Treatment } from "@/types";
import { format } from "date-fns";
import { useState } from "react";

interface TreatmentHistoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  treatments: Treatment[];
  patientName: string;
}

const TreatmentHistoryDialog = ({
  isOpen,
  onClose,
  treatments,
  patientName,
}: TreatmentHistoryDialogProps) => {
  const [selectedTreatmentImages, setSelectedTreatmentImages] = useState<string[]>([]);
  const [showImages, setShowImages] = useState(false);

  const handleShowImages = (treatmentId: string) => {
    // Fetch images for the selected treatment
    const treatment = treatments.find(t => t.id === treatmentId);
    setSelectedTreatmentImages(treatment?.treatmentImages || []);
    setShowImages(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>ประวัติการรักษา - คุณ{patientName}</DialogTitle>
        </DialogHeader>
        
        {showImages && selectedTreatmentImages.length > 0 && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">รูปภาพการรักษา</h3>
            <ScrollArea className="h-[200px] w-full rounded-md border p-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {selectedTreatmentImages.map((imageUrl, index) => (
                  <div key={index} className="relative aspect-square">
                    <img
                      src={imageUrl}
                      alt={`Treatment image ${index + 1}`}
                      className="rounded-lg object-cover w-full h-full"
                    />
                  </div>
                ))}
              </div>
            </ScrollArea>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowImages(false)}
              className="mt-2"
            >
              ปิด
            </Button>
          </div>
        )}

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>วันที่</TableHead>
              <TableHead>อาการ</TableHead>
              <TableHead>การวินิจฉัย</TableHead>
              <TableHead>การรักษา</TableHead>
              <TableHead>ยาที่ได้รับ</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {treatments.map((treatment) => (
              <TableRow key={treatment.id}>
                <TableCell>
                  {format(new Date(treatment.treatmentDate), "dd/MM/yyyy")}
                </TableCell>
                <TableCell>{treatment.symptoms}</TableCell>
                <TableCell>{treatment.diagnosis}</TableCell>
                <TableCell>{treatment.treatment}</TableCell>
                <TableCell>{treatment.medications}</TableCell>
                <TableCell>
                  {treatment.treatmentImages && treatment.treatmentImages.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShowImages(treatment.id)}
                      className="flex items-center gap-2"
                    >
                      <Image className="h-4 w-4" />
                      แสดงรูป
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
};

export default TreatmentHistoryDialog;