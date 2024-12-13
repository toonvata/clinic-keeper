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
import { Image, FileText } from "lucide-react";
import { Treatment } from "@/types";
import { format } from "date-fns";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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
              <TableHead>การวินิจฉัย</TableHead>
              <TableHead className="text-right">รายละเอียด</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {treatments.map((treatment) => (
              <TableRow key={treatment.id}>
                <TableCell>
                  {format(new Date(treatment.treatmentDate), "dd/MM/yyyy")}
                </TableCell>
                <TableCell>{treatment.diagnosis}</TableCell>
                <TableCell className="text-right">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <FileText className="h-4 w-4" />
                        แสดงรายละเอียด
                      </Button>
                    </SheetTrigger>
                    <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
                      <SheetHeader>
                        <SheetTitle>รายละเอียดการรักษา</SheetTitle>
                      </SheetHeader>
                      <div className="mt-6 space-y-6">
                        <div>
                          <h4 className="font-medium mb-2">อาการ</h4>
                          <p className="text-sm text-gray-600">{treatment.symptoms}</p>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">การรักษา</h4>
                          <p className="text-sm text-gray-600 whitespace-pre-line">{treatment.treatment}</p>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">ยาที่ได้รับ</h4>
                          <p className="text-sm text-gray-600 whitespace-pre-line">{treatment.medications}</p>
                        </div>
                        {treatment.treatmentImages && treatment.treatmentImages.length > 0 && (
                          <div>
                            <h4 className="font-medium mb-2">รูปภาพการรักษา</h4>
                            <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                              <div className="grid grid-cols-2 gap-4">
                                {treatment.treatmentImages.map((imageUrl, index) => (
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
                          </div>
                        )}
                      </div>
                    </SheetContent>
                  </Sheet>
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