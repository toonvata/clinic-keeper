import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Treatment, Patient, Membership } from "@/types";
import { TreatmentFormData, initialFormData } from "@/types/treatment";
import { supabase } from "@/integrations/supabase/client";
import { TreatmentForm } from "./treatment/TreatmentForm";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TreatmentRecordsProps {
  treatments: Treatment[];
  onAddTreatment: (treatment: Treatment) => void;
  patients: Patient[];
  selectedPatient?: Patient | null;
}

const TreatmentRecords = ({
  treatments,
  onAddTreatment,
  patients,
  selectedPatient,
}: TreatmentRecordsProps) => {
  const { toast } = useToast();
  const [showSearch, setShowSearch] = useState(false);
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);
  const [formData, setFormData] = useState<TreatmentFormData>(initialFormData);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [selectedMembershipId, setSelectedMembershipId] = useState<string>("");

  useEffect(() => {
    if (selectedPatient) {
      setCurrentPatient(selectedPatient);
      setFormData(prev => ({ ...prev, patientHN: selectedPatient.hn }));
      fetchMemberships(selectedPatient.hn);
    }
  }, [selectedPatient]);

  const fetchMemberships = async (patientHN: string) => {
    try {
      const { data, error } = await supabase
        .from("memberships")
        .select("*, courses(*)")
        .eq("patient_hn", patientHN)
        .gt("remaining_sessions", 0);

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
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPatient) {
      toast({
        title: "กรุณาเลือกผู้ป่วย",
        description: "โปรดค้นหาและเลือกผู้ป่วยก่อนบันทึกข้อมูล",
        variant: "destructive",
      });
      return;
    }

    if (!selectedDoctorId) {
      toast({
        title: "กรุณาเลือกแพทย์",
        description: "โปรดเลือกแพทย์ก่อนบันทึกข้อมูล",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('treatments')
        .insert({
          patient_hn: formData.patientHN,
          treatment_date: formData.treatmentDate.toISOString(),
          blood_pressure: formData.vitalSigns.bloodPressure,
          heart_rate: formData.vitalSigns.heartRate,
          temperature: formData.vitalSigns.temperature,
          respiratory_rate: formData.vitalSigns.respiratoryRate,
          symptoms: formData.symptoms,
          diagnosis: formData.diagnosis,
          treatment: formData.treatment,
          medications: formData.medications,
          doctor_id: selectedDoctorId
        })
        .select()
        .single();

      if (error) throw error;

      // If a membership was selected, update the remaining sessions and create usage record
      if (selectedMembershipId) {
        const membershipId = parseInt(selectedMembershipId);
        const membership = memberships.find(m => m.id === membershipId);
        
        if (membership) {
          // Update remaining sessions
          const { error: updateError } = await supabase
            .from('memberships')
            .update({ remaining_sessions: membership.remainingSessions - 1 })
            .eq('id', membershipId);

          if (updateError) throw updateError;

          // Create usage record
          const { error: usageError } = await supabase
            .from('membership_usage')
            .insert({
              membership_id: membershipId,
              treatment_id: data.id
            });

          if (usageError) throw usageError;

          // Refresh memberships
          await fetchMemberships(currentPatient.hn);
        }
      }

      const newTreatment: Treatment = {
        id: data.id.toString(),
        patientHN: data.patient_hn,
        treatmentDate: new Date(data.treatment_date),
        vitalSigns: {
          bloodPressure: data.blood_pressure || "",
          heartRate: data.heart_rate || 0,
          temperature: data.temperature || 0,
          respiratoryRate: data.respiratory_rate || 0,
        },
        symptoms: data.symptoms,
        diagnosis: data.diagnosis,
        treatment: data.treatment,
        medications: data.medications,
        doctorId: data.doctor_id,
        treatmentImages: []
      };

      setFormData({
        ...initialFormData,
        patientHN: currentPatient.hn,
      });
      setSelectedMembershipId("");

      onAddTreatment(newTreatment);

      toast({
        title: "บันทึกข้อมูลสำเร็จ",
        description: `บันทึกการรักษาสำหรับ HN: ${formData.patientHN}`,
      });
    } catch (error) {
      console.error('Error saving treatment:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถบันทึกข้อมูลการรักษาได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      });
    }
  };

  const handlePatientSelect = async (patient: Patient) => {
    setCurrentPatient(patient);
    setFormData((prev) => ({ ...prev, patientHN: patient.hn }));
    fetchMemberships(patient.hn);

    try {
      const { data: treatmentData, error } = await supabase
        .from('treatments')
        .select('*')
        .eq('patient_hn', patient.hn)
        .order('treatment_date', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error('Error fetching treatment:', error);
        return;
      }

      if (treatmentData) {
        const { data: filesData } = await supabase
          .storage
          .from('treatment-images')
          .list(treatmentData.id.toString());

        if (filesData) {
          const imageUrls = filesData.map(file => {
            const { data: { publicUrl } } = supabase
              .storage
              .from('treatment-images')
              .getPublicUrl(`${treatmentData.id}/${file.name}`);
            return publicUrl;
          });

          setFormData(prev => ({
            ...prev,
            id: treatmentData.id.toString(),
            treatmentImages: imageUrls
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching treatment images:', error);
    }
  };

  const handleImageUploaded = (imageUrl: string) => {
    setFormData(prev => ({
      ...prev,
      treatmentImages: [...prev.treatmentImages, imageUrl]
    }));
  };

  return (
    <Card>
      <CardContent className="pt-6">
        {currentPatient && memberships.length > 0 && (
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              เลือกคอร์สที่ต้องการใช้
            </label>
            <Select
              value={selectedMembershipId}
              onValueChange={setSelectedMembershipId}
            >
              <SelectTrigger>
                <SelectValue placeholder="เลือกคอร์ส (ไม่บังคับ)" />
              </SelectTrigger>
              <SelectContent>
                {memberships.map((membership) => (
                  <SelectItem
                    key={membership.id}
                    value={membership.id.toString()}
                  >
                    {membership.course?.name} - เหลือ {membership.remainingSessions} ครั้ง
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <TreatmentForm
          formData={formData}
          setFormData={setFormData}
          showSearch={showSearch}
          setShowSearch={setShowSearch}
          currentPatient={currentPatient}
          patients={patients}
          selectedDoctorId={selectedDoctorId}
          setSelectedDoctorId={setSelectedDoctorId}
          onPatientSelect={handlePatientSelect}
          onImageUploaded={handleImageUploaded}
          onSubmit={handleSubmit}
        />
      </CardContent>
    </Card>
  );
};

export default TreatmentRecords;