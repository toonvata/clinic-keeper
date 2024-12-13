import { useState } from "react";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "./ImageUpload";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TreatmentImageUploadProps {
  images: string[];
  onImageUploaded: (url: string) => void;
}

export const TreatmentImageUpload = ({
  images,
  onImageUploaded,
}: TreatmentImageUploadProps) => {
  return (
    <>
      <ImageUpload
        treatmentId={crypto.randomUUID()}
        onImageUploaded={onImageUploaded}
      />
      {images && images.length > 0 && (
        <div className="mt-4">
          <Label>รูปภาพที่อัพโหลด</Label>
          <ScrollArea className="h-[200px] w-full rounded-md border p-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((imageUrl: string, index: number) => (
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
    </>
  );
};