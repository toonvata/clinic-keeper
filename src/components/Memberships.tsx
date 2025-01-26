import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Course, Membership, Patient } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { th } from "date-fns/locale";

interface MembershipsProps {
  patients: Patient[];
  selectedPatient: Patient | null;
}

const Memberships = ({ patients, selectedPatient }: MembershipsProps) => {
  const { toast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchCourses();
    if (selectedPatient) {
      fetchMemberships(selectedPatient.hn);
    }
  }, [selectedPatient]);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase.from("courses").select("*");

      if (error) throw error;

      const formattedCourses: Course[] = data.map((course) => ({
        id: course.id,
        name: course.name,
        description: course.description,
        totalSessions: course.total_sessions,
        price: course.price,
        createdAt: new Date(course.created_at),
      }));

      setCourses(formattedCourses);
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถดึงข้อมูลคอร์สได้",
        variant: "destructive",
      });
    }
  };

  const fetchMemberships = async (patientHN: string) => {
    try {
      const { data, error } = await supabase
        .from("memberships")
        .select("*, courses(*)")
        .eq("patient_hn", patientHN);

      if (error) throw error;

      const formattedMemberships: Membership[] = data.map((membership) => ({
        id: membership.id,
        patientHN: membership.patient_hn,
        courseId: membership.course_id,
        remainingSessions: membership.remaining_sessions,
        purchaseDate: new Date(membership.purchase_date),
        expiryDate: membership.expiry_date
          ? new Date(membership.expiry_date)
          : undefined,
        createdAt: new Date(membership.created_at),
        course: membership.courses
          ? {
              id: membership.courses.id,
              name: membership.courses.name,
              description: membership.courses.description,
              totalSessions: membership.courses.total_sessions,
              price: membership.courses.price,
              createdAt: new Date(membership.courses.created_at),
            }
          : undefined,
      }));

      setMemberships(formattedMemberships);
    } catch (error) {
      console.error("Error fetching memberships:", error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถดึงข้อมูลสมาชิกได้",
        variant: "destructive",
      });
    }
  };

  const handlePurchaseCourse = async () => {
    if (!selectedPatient || !selectedCourseId) {
      toast({
        title: "กรุณาเลือกคอร์ส",
        description: "โปรดเลือกคอร์สที่ต้องการซื้อ",
        variant: "destructive",
      });
      return;
    }

    try {
      const course = courses.find((c) => c.id === parseInt(selectedCourseId));
      if (!course) throw new Error("Course not found");

      const { error } = await supabase.from("memberships").insert({
        patient_hn: selectedPatient.hn,
        course_id: course.id,
        remaining_sessions: course.totalSessions,
        expiry_date: new Date(
          new Date().setFullYear(new Date().getFullYear() + 1)
        ),
      });

      if (error) throw error;

      await fetchMemberships(selectedPatient.hn);
      setIsDialogOpen(false);
      setSelectedCourseId("");

      toast({
        title: "ซื้อคอร์สสำเร็จ",
        description: `ซื้อคอร์ส ${course.name} เรียบร้อยแล้ว`,
      });
    } catch (error) {
      console.error("Error purchasing course:", error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถซื้อคอร์สได้",
        variant: "destructive",
      });
    }
  };

  if (!selectedPatient) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            กรุณาเลือกผู้ป่วยก่อน
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">
            คอร์สของคุณ {selectedPatient.firstName} {selectedPatient.lastName}
          </h3>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>ซื้อคอร์สใหม่</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>ซื้อคอร์สใหม่</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Select
                    value={selectedCourseId}
                    onValueChange={setSelectedCourseId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกคอร์ส" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map((course) => (
                        <SelectItem
                          key={course.id}
                          value={course.id.toString()}
                        >
                          {course.name} - {course.totalSessions} ครั้ง - {course.price} บาท
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handlePurchaseCourse} className="w-full">
                  ยืนยันการซื้อคอร์ส
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>คอร์ส</TableHead>
              <TableHead>จำนวนครั้งคงเหลือ</TableHead>
              <TableHead>วันที่ซื้อ</TableHead>
              <TableHead>วันหมดอายุ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {memberships.map((membership) => (
              <TableRow key={membership.id}>
                <TableCell>{membership.course?.name}</TableCell>
                <TableCell>{membership.remainingSessions} ครั้ง</TableCell>
                <TableCell>
                  {format(membership.purchaseDate, "d MMMM yyyy", {
                    locale: th,
                  })}
                </TableCell>
                <TableCell>
                  {membership.expiryDate
                    ? format(membership.expiryDate, "d MMMM yyyy", {
                        locale: th,
                      })
                    : "-"}
                </TableCell>
              </TableRow>
            ))}
            {memberships.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  ไม่มีคอร์สที่ซื้อ
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default Memberships;