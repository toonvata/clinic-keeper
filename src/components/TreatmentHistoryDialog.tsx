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

export default TreatmentHistoryDialog;