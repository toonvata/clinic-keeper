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
import { Canvas as FabricCanvas } from "fabric";

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

    // Load background image and drawing data
    const loadCanvas = async () => {
      try {
        const img = await new Promise((resolve, reject) => {
          const image = new Image();
          image.crossOrigin = 'anonymous';
          image.onload = () => resolve(image);
          image.onerror = reject;
          image.src = "https://pic.in.th/image/hbAE5cmOf1iUg4DqoSCjaQ-b.m088It";
        });

        canvas.backgroundImage = img as any;
        canvas.requestRenderAll();

        canvas.loadFromJSON(data, () => {
          canvas.renderAll();
        });
      } catch (error) {
        console.error('Error loading body chart:', error);
      }
    };

    loadCanvas();

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