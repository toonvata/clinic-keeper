import { Patient, Treatment } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface YearlyStatsProps {
  patients: Patient[];
  treatments: Treatment[];
}

const YearlyStats = ({ patients, treatments }: YearlyStatsProps) => {
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
    <>
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
    </>
  );
};

export default YearlyStats;