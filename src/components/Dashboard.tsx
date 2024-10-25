import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Dashboard = () => {
  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>สถิติผู้มารับบริการ</CardTitle>
        </CardHeader>
        <CardContent>
          {/* We'll add charts here later */}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;