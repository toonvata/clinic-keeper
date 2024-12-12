import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Image } from "lucide-react";

interface ImageUploadProps {
  treatmentId: string;
  onImageUploaded: (url: string) => void;
}

export const ImageUpload = ({ treatmentId, onImageUploaded }: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('กรุณาเลือกไฟล์รูปภาพ');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${treatmentId}/${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('treatment-images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('treatment-images')
        .getPublicUrl(filePath);

      onImageUploaded(publicUrl);

      toast({
        title: "อัพโหลดสำเร็จ",
        description: "อัพโหลดรูปภาพเรียบร้อยแล้ว",
      });

    } catch (error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถอัพโหลดรูปภาพได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="image-upload" className="flex items-center gap-2">
        <Image className="w-4 h-4" />
        อัพโหลดรูปภาพ
      </Label>
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          className="relative"
          disabled={uploading}
        >
          {uploading ? "กำลังอัพโหลด..." : "เลือกรูปภาพ"}
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleFileUpload}
            disabled={uploading}
          />
        </Button>
      </div>
    </div>
  );
};