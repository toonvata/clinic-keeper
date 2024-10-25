import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";

const TreatmentRecords = () => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="ค้นหาด้วย HN หรือชื่อผู้ป่วย..."
            className="pl-8"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default TreatmentRecords;