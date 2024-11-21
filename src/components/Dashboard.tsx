import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Patient, Treatment } from "@/types";

interface DashboardProps {
  patients: Patient[];
  treatments: Treatment[];
}

const Dashboard = ({ patients, treatments }: DashboardProps) => {
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
    </div>
  );
};

export default Dashboard;