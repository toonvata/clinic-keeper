
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PreviewDialogProps {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;  // Make title optional
}

const PreviewDialog = ({ children, open, onOpenChange, title = "Preview" }: PreviewDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="max-h-[80vh] overflow-y-auto">{children}</div>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewDialog;
