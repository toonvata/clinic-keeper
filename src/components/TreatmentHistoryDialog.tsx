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
import { Treatment } from "@/types";
import { format } from "date-fns";
import { useEffect, useRef } from "react";
import { Canvas as FabricCanvas, Image as FabricImage } from "fabric";

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
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>ประวัติการรักษา - คุณ{patientName}</DialogTitle>
        </DialogHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>วันที่</TableHead>
              <TableHead>อาการ</TableHead>
              <TableHead>การวินิจฉัย</TableHead>
              <TableHead>Body Chart</TableHead>
              <TableHead>การรักษา</TableHead>
              <TableHead>ยาที่ได้รับ</TableHead>
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
                <TableCell>
                  {treatment.bodyChart && (
                    <BodyChartDisplay data={treatment.bodyChart} />
                  )}
                </TableCell>
                <TableCell>{treatment.treatment}</TableCell>
                <TableCell>{treatment.medications}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
};

const BodyChartDisplay = ({ data }: { data: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 150,
      height: 150,
      backgroundColor: "#ffffff",
    });

    // Load background image
    FabricImage.fromURL(
      "https://pic.in.th/image/hbAE5cmOf1iUg4DqoSCjaQ-b.m088It",
      { crossOrigin: 'anonymous' },
      (img) => {
        if (img.width && img.height) {
          img.scaleToWidth(150);
          img.scaleToHeight(150);
          canvas.backgroundImage = img;
          canvas.renderAll();

          // Load saved drawing data
          canvas.loadFromJSON(data, () => {
            canvas.renderAll();
          });
        }
      }
    );

    return () => {
      canvas.dispose();
    };
  }, [data]);

  return (
    <div className="border rounded-lg overflow-hidden">
      <canvas ref={canvasRef} />
    </div>
  );
};

export default TreatmentHistoryDialog;