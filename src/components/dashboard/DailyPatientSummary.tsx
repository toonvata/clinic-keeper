import { Patient } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DailyPatientSummaryProps {
  patients: Patient[];
}

const DailyPatientSummary = ({ patients }: DailyPatientSummaryProps) => {
  const dailyPatientData = patients.reduce((acc: any[], patient) => {
    const day = format(new Date(patient.registrationDate), 'dd MMM yyyy');
    const existingDay = acc.find(item => item.day === day);
    
    if (existingDay) {
      existingDay.count += 1;
      existingDay.patients.push(patient);
    } else {
      acc.push({ 
        day, 
        count: 1,
        patients: [patient]
      });
    }
    
    return acc;
  }, []);

  // Sort days in descending order (newest first)
  dailyPatientData.sort((a, b) => new Date(b.day).getTime() - new Date(a.day).getTime());

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>จำนวนผู้ป่วยรายวัน</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Select defaultValue={dailyPatientData[0]?.day}>
              <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="เลือกวันที่" />
              </SelectTrigger>
              <SelectContent>
                {dailyPatientData.map((dayData) => (
                  <SelectItem key={dayData.day} value={dayData.day}>
                    {dayData.day} - {dayData.count} คน
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="h-[300px] mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyPatientData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#6366f1" name="จำนวนผู้ป่วย" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>วันที่</TableHead>
                <TableHead>HN</TableHead>
                <TableHead>ชื่อ-นามสกุล</TableHead>
                <TableHead>อายุ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dailyPatientData.map((dayData) => (
                dayData.patients.map((patient) => (
                  <TableRow key={patient.hn}>
                    <TableCell>{format(new Date(patient.registrationDate), 'dd MMM yyyy')}</TableCell>
                    <TableCell>{patient.hn}</TableCell>
                    <TableCell>{`${patient.firstName} ${patient.lastName}`}</TableCell>
                    <TableCell>{patient.age}</TableCell>
                  </TableRow>
                ))
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default DailyPatientSummary;