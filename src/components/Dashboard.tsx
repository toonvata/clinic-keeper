import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Patient, Treatment } from "@/types";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from "date-fns";

interface DashboardProps {
  patients: Patient[];
  treatments: Treatment[];
}

const Dashboard = ({ patients, treatments }: DashboardProps) => {
  // Process monthly data
  const monthlyData = patients.reduce((acc: any[], patient) => {
    const month = format(new Date(patient.registrationDate), 'MMM yyyy');
    const existingMonth = acc.find(item => item.month === month);
    
    if (existingMonth) {
      existingMonth.count += 1;
    } else {
      acc.push({ month, count: 1 });
    }
    
    return acc;
  }, []);

  // Process yearly data
  const yearlyData = patients.reduce((acc: any[], patient) => {
    const year = format(new Date(patient.registrationDate), 'yyyy');
    const existingYear = acc.find(item => item.year === year);
    
    if (existingYear) {
      existingYear.count += 1;
    } else {
      acc.push({ year, count: 1 });
    }
    
    return acc;
  }, []);

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>สถิติผู้มารับบริการ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold">จำนวนผู้ป่วยทั้งหมด</h3>
              <p className="text-3xl font-bold">{patients.length}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">จำนวนการรักษาทั้งหมด</h3>
              <p className="text-3xl font-bold">{treatments.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>จำนวนผู้ป่วยรายเดือน</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#4f46e5" name="จำนวนผู้ป่วย" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>จำนวนผู้ป่วยรายปี</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yearlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#2563eb" name="จำนวนผู้ป่วย" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;