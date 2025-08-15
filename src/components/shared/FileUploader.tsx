import { ChangeEvent } from 'react';
import { Card } from '@/components/ui/card';

interface FileUploaderProps {
  accept: string;
  maxSize: number;
  onFileSelect: (file: File | null) => void;
}

export function FileUploader({ accept, maxSize, onFileSelect }: FileUploaderProps) {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file && file.size > maxSize) {
      console.error('File is too large');
      return;
    }
    onFileSelect(file);
  };

  return (
    <Card className="border-2 border-dashed p-4 hover:bg-accent/50 transition-colors cursor-pointer">
      <input
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        id="file-upload"
      />
      <label htmlFor="file-upload" className="block w-full h-full cursor-pointer">
        <div className="flex flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
          <p>Drag and drop a file here, or click to select</p>
          <p className="text-xs">Supported formats: {accept}</p>
          <p className="text-xs">Maximum size: {Math.round(maxSize / (1024 * 1024))}MB</p>
        </div>
      </label>
    </Card>
  );
}
