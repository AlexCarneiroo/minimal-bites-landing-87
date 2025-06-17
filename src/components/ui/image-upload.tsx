import { useState, useRef } from 'react';
import { Button } from './button';
import { Label } from './label';
import { uploadImageToStorage } from '@/lib/upload';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export function ImageUpload({ value, onChange, label = 'Imagem' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string>(value);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploading(true);
      try {
        const url = await uploadImageToStorage(file);
        setPreview(url);
        onChange(url);
      } catch (error) {
        console.error('Erro ao fazer upload:', error);
        alert('Erro ao fazer upload da imagem.');
      }
      setUploading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    setPreview('');
    onChange('');
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center space-x-4">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          onClick={handleClick}
          disabled={uploading}
        >
          {uploading ? 'Enviando...' : 'Escolher Imagem'}
        </Button>
        {preview && (
          <div className="relative w-20 h-20">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover rounded-lg"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute -top-2 -right-2"
              onClick={handleRemove}
            >
              ×
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
