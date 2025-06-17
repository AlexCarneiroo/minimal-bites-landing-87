
import { useState, useRef } from 'react';
import { Button } from './button';
import { Label } from './label';
import { uploadImageToStorage } from '@/lib/upload';
import { Upload, X, Image } from 'lucide-react';

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

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview('');
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      {label && <Label className="text-sm font-medium text-gray-700">{label}</Label>}
      
      <div className="flex flex-col space-y-3">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
        
        {!preview ? (
          <div 
            onClick={handleClick}
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-colors"
          >
            <Image className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-1">
              {uploading ? 'Enviando...' : 'Clique para escolher uma imagem'}
            </p>
            <p className="text-xs text-gray-500">
              PNG, JPG, GIF até 10MB
            </p>
          </div>
        ) : (
          <div className="relative inline-block">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-32 object-cover rounded-lg border border-gray-200"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0 bg-red-500 hover:bg-red-600"
              onClick={handleRemove}
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        )}
        
        <Button
          type="button"
          variant="outline"
          onClick={handleClick}
          disabled={uploading}
          className="w-full"
        >
          <Upload className="w-4 h-4 mr-2" />
          {uploading ? 'Enviando...' : preview ? 'Trocar Imagem' : 'Escolher Imagem'}
        </Button>
      </div>
    </div>
  );
}
