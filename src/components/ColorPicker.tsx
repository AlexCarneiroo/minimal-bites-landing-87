
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  onSave: () => void;
}

const ColorPicker = ({ color, onChange, onSave }: ColorPickerProps) => {
  const [currentColor, setCurrentColor] = useState(color);

  // Paleta de cores predefinidas
  const presetColors = [
    '#0066cc', '#cc0000', '#009900', '#ff9900',
    '#9900cc', '#000000', '#ff6600', '#0099cc',
    '#663399', '#339933', '#cc6600', '#3366ff',
    '#ff3366', '#33cccc', '#666666', '#993300',
    '#003366', '#cc33ff', '#33cc33', '#ffcc00',
    '#660000', '#006600', '#003300', '#330066',
    '#ff0033', '#00cccc', '#9999ff', '#ff99cc'
  ];


  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentColor(e.target.value);
    onChange(e.target.value);
  };

  const handlePresetClick = (presetColor: string) => {
    setCurrentColor(presetColor);
    onChange(presetColor);
  };

  // Sincronizar estado interno com prop externa
  useEffect(() => {
    setCurrentColor(color);
  }, [color]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <input
          type="color"
          value={currentColor}
          onChange={handleColorChange}
          className="w-12 h-12 cursor-pointer border-0 rounded overflow-hidden bg-transparent"
          aria-label="Selecionar cor"
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
          aria-label="Código da cor"
        />
        <Button onClick={onSave} size="sm">
          Aplicar
        </Button>
      </div>

      <div>
        <p className="text-sm text-gray-500 mb-2">Cores predefinidas</p>
        <div className="flex flex-wrap gap-2">
          {presetColors.map(presetColor => (
            <button
              key={presetColor}
              className="w-8 h-8 rounded-full cursor-pointer border border-gray-300 flex items-center justify-center transition-transform hover:scale-110"
              style={{ backgroundColor: presetColor }}
              onClick={() => handlePresetClick(presetColor)}
              title={presetColor}
              aria-label={`Selecionar cor ${presetColor}`}
            >
              {presetColor === currentColor && (
                <Check className="h-4 w-4 text-white drop-shadow-sm" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <p className="text-sm font-medium mb-2">Prévia</p>
        <div className="flex flex-col gap-2">
          <div className="h-10 rounded" style={{ backgroundColor: currentColor }}></div>
          <div className="flex items-center gap-2">
            <span className="text-sm">Código da cor:</span>
            <span className="font-mono text-sm">{currentColor}</span>
          </div>
          <p className="text-xs text-gray-500">
            Esta cor será aplicada em botões e elementos destacados do site.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;
