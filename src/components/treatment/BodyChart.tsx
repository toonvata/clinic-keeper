import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, Image } from "fabric";
import { Button } from "@/components/ui/button";
import { Eraser, Pencil } from "lucide-react";

interface BodyChartProps {
  initialData?: string;
  onChange: (data: string) => void;
}

const BodyChart = ({ initialData, onChange }: BodyChartProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<FabricCanvas | null>(null);
  const [mode, setMode] = useState<"draw" | "erase">("draw");

  useEffect(() => {
    if (!canvasRef.current) return;

    const fabricCanvas = new FabricCanvas(canvasRef.current, {
      width: 150,
      height: 150,
      backgroundColor: "#ffffff",
      isDrawingMode: true,
    });

    // Load background image
    Image.fromURL("https://pic.in.th/image/hbAE5cmOf1iUg4DqoSCjaQ-b.m088It", {
      crossOrigin: 'anonymous',
      signal: undefined,
      onLoad: (img) => {
        if (img.width && img.height) {
          img.scaleX = 150 / img.width;
          img.scaleY = 150 / img.height;
          fabricCanvas.backgroundImage = img;
          fabricCanvas.renderAll();
        }
      }
    });

    if (initialData) {
      fabricCanvas.loadFromJSON(initialData, () => {
        fabricCanvas.renderAll();
      });
    }

    fabricCanvas.freeDrawingBrush.width = 2;
    fabricCanvas.freeDrawingBrush.color = "#ff0000";

    fabricCanvas.on("path:created", () => {
      const jsonData = JSON.stringify(fabricCanvas.toJSON());
      onChange(jsonData);
    });

    setCanvas(fabricCanvas);

    return () => {
      fabricCanvas.dispose();
    };
  }, []);

  const handleModeChange = (newMode: "draw" | "erase") => {
    if (!canvas) return;

    setMode(newMode);
    canvas.isDrawingMode = true;

    if (newMode === "draw") {
      canvas.freeDrawingBrush.color = "#ff0000";
    } else {
      canvas.freeDrawingBrush.color = "#ffffff";
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Button
          type="button"
          variant={mode === "draw" ? "default" : "outline"}
          size="sm"
          onClick={() => handleModeChange("draw")}
        >
          <Pencil className="h-4 w-4 mr-1" />
          วาด
        </Button>
        <Button
          type="button"
          variant={mode === "erase" ? "default" : "outline"}
          size="sm"
          onClick={() => handleModeChange("erase")}
        >
          <Eraser className="h-4 w-4 mr-1" />
          ลบ
        </Button>
      </div>
      <div className="border rounded-lg overflow-hidden">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
};

export default BodyChart;