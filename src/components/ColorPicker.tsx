
import { useState } from 'react';
import { Button } from "@/components/ui/button";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  onSave: () => void;
}

const ColorPicker = ({ color, onChange, onSave }: ColorPickerProps) => {
  const [currentColor, setCurrentColor] = useState(color);
  
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentColor(e.target.value);
    onChange(e.target.value);
  };
  
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-4">
        <input
          type="color"
          value={currentColor}
          onChange={handleColorChange}
          className="w-12 h-12 cursor-pointer border-0 rounded overflow-hidden bg-transparent"
        />
        <input
          type="text"
          value={currentColor}
          onChange={e => {
            if (e.target.value.startsWith('#') && e.target.value.length <= 7) {
              setCurrentColor(e.target.value);
              onChange(e.target.value);
            }
          }}
          className="px-3 py-2 border rounded-md w-28"
        />
        <Button onClick={onSave} size="sm">
          Aplicar
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {['#0066cc', '#cc0000', '#009900', '#ff9900', '#9900cc', '#000000'].map(presetColor => (
          <div
            key={presetColor}
            className="w-8 h-8 rounded-full cursor-pointer border border-gray-300 flex items-center justify-center"
            style={{ backgroundColor: presetColor }}
            onClick={() => {
              setCurrentColor(presetColor);
              onChange(presetColor);
            }}
            title={presetColor}
          >
            {presetColor === currentColor && (
              <div className="w-2 h-2 bg-white rounded-full" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColorPicker;
