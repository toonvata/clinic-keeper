import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const CourseForm = () => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    totalSessions: "",
    price: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.totalSessions || !formData.price) {
      toast({
        title: "กรุณากรอกข้อมูลให้ครบถ้วน",
        description: "ชื่อคอร์ส จำนวนครั้ง และราคา เป็นข้อมูลที่จำเป็น",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.from("courses").insert({
        name: formData.name,
        description: formData.description,
        total_sessions: parseInt(formData.totalSessions),
        price: parseFloat(formData.price),
      });

      if (error) throw error;

      toast({
        title: "เพิ่มคอร์สสำเร็จ",
        description: `เพิ่มคอร์ส ${formData.name} เรียบร้อยแล้ว`,
      });

      setFormData({
        name: "",
        description: "",
        totalSessions: "",
        price: "",
      });
      setIsOpen(false);
    } catch (error) {
      console.error("Error adding course:", error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถเพิ่มคอร์สได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>เพิ่มคอร์สใหม่</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>เพิ่มคอร์สใหม่</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">ชื่อคอร์ส</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="ชื่อคอร์ส"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">รายละเอียด</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="รายละเอียดคอร์ส"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="totalSessions">จำนวนครั้ง</Label>
            <Input
              id="totalSessions"
              type="number"
              value={formData.totalSessions}
              onChange={(e) =>
                setFormData({ ...formData, totalSessions: e.target.value })
              }
              placeholder="จำนวนครั้ง"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">ราคา</Label>
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              placeholder="ราคา"
            />
          </div>
          <Button type="submit" className="w-full">
            บันทึก
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};