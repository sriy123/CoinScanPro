import { Upload, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCallback } from "react";

interface UploadZoneProps {
  onImageSelect: (file: File) => void;
  isAnalyzing?: boolean;
}

export default function UploadZone({ onImageSelect, isAnalyzing = false }: UploadZoneProps) {
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  }, [onImageSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onImageSelect(file);
    }
  }, [onImageSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border-2 border-dashed rounded-lg p-12 text-center hover-elevate transition-colors"
        data-testid="dropzone-upload"
      >
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Upload className="w-8 h-8 text-primary" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Upload Coin Image</h3>
            <p className="text-muted-foreground">
              Drop your coin image here or click to browse
            </p>
            <p className="text-sm text-muted-foreground">
              Supports JPG, PNG, HEIC up to 10MB
            </p>
          </div>

          <div className="flex gap-4">
            <label htmlFor="file-upload">
              <input
                id="file-upload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isAnalyzing}
                data-testid="input-file-upload"
              />
              <Button
                asChild
                size="lg"
                disabled={isAnalyzing}
                data-testid="button-browse"
              >
                <span className="cursor-pointer">
                  <Upload className="w-4 h-4 mr-2" />
                  Browse Files
                </span>
              </Button>
            </label>

            <label htmlFor="camera-upload">
              <input
                id="camera-upload"
                type="file"
                className="hidden"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
                disabled={isAnalyzing}
                data-testid="input-camera-upload"
              />
              <Button
                asChild
                variant="outline"
                size="lg"
                disabled={isAnalyzing}
                data-testid="button-camera"
              >
                <span className="cursor-pointer">
                  <Camera className="w-4 h-4 mr-2" />
                  Use Camera
                </span>
              </Button>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
