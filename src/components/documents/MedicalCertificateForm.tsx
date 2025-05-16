import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Patient } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import PreviewDialog from "./PreviewDialog";
import MedicalCertificatePreview from "./MedicalCertificatePreview";
import { toast } from "@/hooks/use-toast";
import { differenceInDays, isBefore, addDays } from "date-fns";

const formSchema = z.object({
  certificateNumber: z.string().min(2, {
    message: "Certificate number is required",
  }),
  doctorName: z.string().min(2, {
    message: "Doctor name is required",
  }),
  doctorLicenseNumber: z.string().optional(),
  patientName: z.string(),
  patientAge: z.string().optional(),
  patientIdNumber: z.string().optional(),
  patientAddress: z.string().optional(),
  diagnosis: z.string().optional(),
  visitDate: z.date(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  restDays: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface MedicalCertificateFormProps {
  patient: Patient;
}

// Define the doctor type
interface Doctor {
  id: string;
  name: string;
  license_number?: string;
}

// Predefined doctors
const predefinedDoctors: Doctor[] = [
  { 
    id: "1", 
    name: "นาย วาตา โสดา", 
    license_number: "พทป.2381" 
  },
  { 
    id: "2", 
    name: "นายแพทย์ นิรัตน์พงษ์ เชาวนิช", 
    license_number: "ว......" 
  }
];

const MedicalCertificateForm = ({ patient }: MedicalCertificateFormProps) => {
  const [doctors, setDoctors] = useState<Doctor[]>(predefinedDoctors);
  const [open, setOpen] = useState(false);
  const [certificateData, setCertificateData] = useState<FormValues | null>(null);
  
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data, error } = await supabase
          .from('doctors')
          .select('id, name, license_number');
        
        if (error) {
          console.error('Error fetching doctors:', error);
        } else if (data && Array.isArray(data)) {
          // Merge predefined doctors with any from the database
          const dbDoctors = data.map(doc => ({
            id: doc.id.toString(),
            name: doc.name,
            license_number: doc.license_number
          }));
          
          // Use Set to ensure unique doctors by ID
          const uniqueDoctors = [...predefinedDoctors];
          
          dbDoctors.forEach(dbDoc => {
            if (!uniqueDoctors.some(doc => doc.id === dbDoc.id)) {
              uniqueDoctors.push(dbDoc);
            }
          });
          
          setDoctors(uniqueDoctors);
        }
      } catch (error) {
        console.error('Exception fetching doctors:', error);
      }
    };
    
    fetchDoctors();
  }, []);
  
  const handleDoctorChange = (doctorId: string) => {
    const selectedDoctor = doctors.find(doc => doc.id === doctorId);
    if (selectedDoctor) {
      form.setValue("doctorName", selectedDoctor.name);
      if (selectedDoctor.license_number) {
        form.setValue("doctorLicenseNumber", selectedDoctor.license_number);
      }
    }
  };

  const handleStartDateChange = (date: Date) => {
    form.setValue("startDate", date);
    
    const endDate = form.getValues("endDate");
    if (endDate && !isBefore(date, endDate)) {
      form.setValue("endDate", undefined);
      form.setValue("restDays", "");
    } else if (endDate) {
      // Calculate rest days
      const days = differenceInDays(endDate, date) + 1;
      form.setValue("restDays", days.toString());
    }
  };

  const handleEndDateChange = (date: Date) => {
    form.setValue("endDate", date);
    
    const startDate = form.getValues("startDate");
    if (startDate) {
      // Calculate rest days
      const days = differenceInDays(date, startDate) + 1;
      form.setValue("restDays", days.toString());
    }
  };
  
  const handleSubmit = (values: FormValues) => {
    setCertificateData(values);
    setOpen(true);
  };
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      certificateNumber: `MC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      patientName: `${patient.firstName} ${patient.lastName}`,
      patientAge: patient.age?.toString() || "",
      patientIdNumber: patient.idNumber,
      patientAddress: patient.address,
      visitDate: new Date(),
    },
  });
  
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="certificateNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>เลขที่ใบรับรองแพทย์</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">แพทย์ผู้ตรวจ</label>
              <Select onValueChange={handleDoctorChange}>
                <SelectTrigger>
                  <SelectValue placeholder="เลือกแพทย์" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.id}>
                      {doctor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <FormField
              control={form.control}
              name="doctorLicenseNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>เลขที่ใบอนุญาต</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="visitDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>วันที่ตรวจ</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP", { locale: th })
                        ) : (
                          <span>เลือกวันที่</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      className="p-3 pointer-events-auto"
                      locale={th}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="diagnosis"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ผลการตรวจ / วินิจฉัยโรค</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col md:w-1/3">
                  <FormLabel>วันที่เริ่มหยุดพัก</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP", { locale: th })
                          ) : (
                            <span>เลือกวันที่</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => date && handleStartDateChange(date)}
                        className="p-3 pointer-events-auto"
                        locale={th}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem className="flex flex-col md:w-1/3">
                  <FormLabel>ถึงวันที่</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP", { locale: th })
                          ) : (
                            <span>เลือกวันที่</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => date && handleEndDateChange(date)}
                        disabled={(date) => {
                          const startDate = form.getValues("startDate");
                          return startDate ? isBefore(date, startDate) : false;
                        }}
                        className="p-3 pointer-events-auto"
                        locale={th}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="restDays"
              render={({ field }) => (
                <FormItem className="md:w-1/3">
                  <FormLabel>จำนวนวัน</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" min="1" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit">พิมพ์ใบรับรองแพทย์</Button>
          </div>
        </form>
      </Form>

      <PreviewDialog 
        open={open} 
        onOpenChange={setOpen}
      >
        {certificateData && (
          <MedicalCertificatePreview 
            certificateNumber={certificateData.certificateNumber}
            doctorName={certificateData.doctorName}
            doctorLicenseNumber={certificateData.doctorLicenseNumber || "พทป.2381"}
            patientName={certificateData.patientName}
            patientAge={certificateData.patientAge ? parseInt(certificateData.patientAge) : undefined}
            patientIdNumber={certificateData.patientIdNumber}
            patientAddress={certificateData.patientAddress}
            visitDate={certificateData.visitDate}
            startDate={certificateData.startDate}
            endDate={certificateData.endDate}
            restDays={certificateData.restDays ? parseInt(certificateData.restDays) : undefined}
            diagnosis={certificateData.diagnosis || ""}
          />
        )}
      </PreviewDialog>
    </div>
  );
};

export default MedicalCertificateForm;
