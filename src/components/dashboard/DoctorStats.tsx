import { useState, useEffect } from "react";
import { Treatment } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";

interface Doctor {
  id: number;
  name: string;
  title: string;
}

interface DoctorStatsProps {
  treatments: Treatment[];
}

const DoctorStats = ({ treatments }: DoctorStatsProps) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<string>("all");

  useEffect(() => {
    const fetchDoctors = async () => {
      const { data, error } = await supabase
        .from('doctors')
        .select('*');
      
      if (error) {
        console.error('Error fetching doctors:', error);
        return;
      }

      setDoctors(data);
    };

    fetchDoctors();
  }, []);

  const getDoctorTreatments = (doctorId: number) => {
    return treatments.filter(t => t.doctorId === doctorId);
  };

  const getMonthlyData = (doctorId?: number) => {
    const filteredTreatments = doctorId 
      ? treatments.filter(t => t.doctorId === doctorId)
      : treatments;

    return filteredTreatments.reduce((acc: any[], treatment) => {
      const month = format(new Date(treatment.treatmentDate), 'MMM yyyy');
      const existingMonth = acc.find(item => item.month === month);
      
      if (existingMonth) {
        existingMonth.count += 1;
      } else {
        acc.push({ month, count: 1 });
      }
      
      return acc;
    }, []);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>สถิติการรักษาแยกตามแพทย์</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedDoctor} onValueChange={setSelectedDoctor}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">ทั้งหมด</TabsTrigger>
              {doctors.map((doctor) => (
                <TabsTrigger key={doctor.id} value={doctor.id.toString()}>
                  {doctor.name}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="all">
              <div className="grid grid-cols-2 gap-4 mb-6">
                {doctors.map((doctor) => {
                  const doctorTreatments = getDoctorTreatments(doctor.id);
                  return (
                    <div key={doctor.id} className="p-4 border rounded-lg">
                      <h3 className="font-semibold">{doctor.name}</h3>
                      <p className="text-2xl font-bold">{doctorTreatments.length} ครั้ง</p>
                      <p className="text-sm text-gray-500">{doctor.title}</p>
                    </div>
                  );
                })}
              </div>

              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getMonthlyData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#6366f1" name="จำนวนการรักษา" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            {doctors.map((doctor) => (
              <TabsContent key={doctor.id} value={doctor.id.toString()}>
                <div className="p-4 border rounded-lg mb-6">
                  <h3 className="font-semibold">{doctor.name}</h3>
                  <p className="text-2xl font-bold">
                    {getDoctorTreatments(doctor.id).length} ครั้ง
                  </p>
                  <p className="text-sm text-gray-500">{doctor.title}</p>
                </div>

                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getMonthlyData(doctor.id)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#6366f1" name="จำนวนการรักษา" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorStats;