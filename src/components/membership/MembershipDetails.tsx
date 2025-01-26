import { useState } from "react";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useToast } from "@/components/ui/use-toast";
import { Membership } from "@/types";
import { supabase } from "@/integrations/supabase/client";

interface MembershipDetailsProps {
  membership: Membership;
  onUpdate: () => void;
}

export const MembershipDetails = ({ membership, onUpdate }: MembershipDetailsProps) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [remainingSessions, setRemainingSessions] = useState(membership.remainingSessions.toString());
  const [usageHistory, setUsageHistory] = useState<{ visit_date: string }[]>([]);

  const handleEdit = async () => {
    try {
      const sessions = parseInt(remainingSessions);
      if (isNaN(sessions) || sessions < 0) {
        toast({
          title: "ข้อผิดพลาด",
          description: "กรุณาระบุจำนวนครั้งที่ถูกต้อง",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from("memberships")
        .update({ remaining_sessions: sessions })
        .eq("id", membership.id);

      if (error) throw error;

      toast({
        title: "อัพเดทสำเร็จ",
        description: "อัพเดทจำนวนครั้งคงเหลือเรียบร้อยแล้ว",
      });
      onUpdate();
      setIsOpen(false);
    } catch (error) {
      console.error("Error updating membership:", error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถอัพเดทจำนวนครั้งได้",
        variant: "destructive",
      });
    }
  };

  const fetchUsageHistory = async () => {
    try {
      const { data, error } = await supabase
        .from("membership_usage")
        .select("visit_date")
        .eq("membership_id", membership.id)
        .order("visit_date", { ascending: false });

      if (error) throw error;
      setUsageHistory(data || []);
    } catch (error) {
      console.error("Error fetching usage history:", error);
    }
  };

  const handleOpenDialog = () => {
    setIsOpen(true);
    fetchUsageHistory();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button variant="outline" size="sm" onClick={handleOpenDialog}>
        แก้ไข
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>แก้ไขจำนวนครั้งคงเหลือ</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">จำนวนครั้งคงเหลือ</label>
            <Input
              type="number"
              value={remainingSessions}
              onChange={(e) => setRemainingSessions(e.target.value)}
              min="0"
            />
          </div>
          <Button onClick={handleEdit} className="w-full">
            บันทึก
          </Button>

          <div className="space-y-2">
            <h4 className="font-medium">ประวัติการใช้บริการ</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>วันที่ใช้บริการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usageHistory.map((usage, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {format(new Date(usage.visit_date), "d MMMM yyyy", {
                        locale: th,
                      })}
                    </TableCell>
                  </TableRow>
                ))}
                {usageHistory.length === 0 && (
                  <TableRow>
                    <TableCell className="text-center">ไม่มีประวัติการใช้บริการ</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};