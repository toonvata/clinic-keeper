import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Patient, Treatment } from "@/types";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from "date-fns";

interface DashboardProps {
  patients: Patient[];
  treatments: Treatment[];
}

const Dashboard = ({ patients, treatments }: DashboardProps) => {
  // Process daily data for patients
  const dailyPatientData = patients.reduce((acc: any[], patient) => {
    const day = format(new Date(patient.registrationDate), 'dd MMM yyyy');
    const existingDay = acc.find(item => item.day === day);
    
    if (existingDay) {
      existingDay.count += 1;
    } else {
      acc.push({ day, count: 1 });
    }
    
    return acc;
  }, []);

  // Process monthly data for patients
  const monthlyPatientData = patients.reduce((acc: any[], patient) => {
    const month = format(new Date(patient.registrationDate), 'MMM yyyy');
    const existingMonth = acc.find(item => item.month === month);
    
    if (existingMonth) {
      existingMonth.count += 1;
    } else {
      acc.push({ month, count: 1 });
    }
    
    return acc;
  }, []);

  // Process yearly data for patients
  const yearlyPatientData = patients.reduce((acc: any[], patient) => {
    const year = format(new Date(patient.registrationDate), 'yyyy');
    const existingYear = acc.find(item => item.year === year);
    
    if (existingYear) {
      existingYear.count += 1;
    } else {
      acc.push({ year, count: 1 });
    }
    
    return acc;
  }, []);

  // Process monthly data for treatments
  const monthlyTreatmentData = treatments.reduce((acc: any[], treatment) => {
    const month = format(new Date(treatment.treatmentDate), 'MMM yyyy');
    const existingMonth = acc.find(item => item.month === month);
    
    if (existingMonth) {
      existingMonth.count += 1;
    } else {
      acc.push({ month, count: 1 });
    }
    
    return acc;
  }, []);

  // Process yearly data for treatments
  const yearlyTreatmentData = treatments.reduce((acc: any[], treatment) => {
    const year = format(new Date(treatment.treatmentDate), 'yyyy');
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
          <CardTitle>จำนวนผู้ป่วยรายวัน</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
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
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>จำนวนผู้ป่วยรายเดือน</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyPatientData}>
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
            <CardTitle>จำนวนการรักษารายเดือน</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyTreatmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#10b981" name="จำนวนการรักษา" />
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
                <BarChart data={yearlyPatientData}>
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

        <Card>
          <CardHeader>
            <CardTitle>จำนวนการรักษารายปี</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={yearlyTreatmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#059669" name="จำนวนการรักษา" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;