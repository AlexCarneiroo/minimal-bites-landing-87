
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Check, Palette, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  onSave: () => void;
}

const ColorPicker = ({ color, onChange, onSave }: ColorPickerProps) => {
  const [currentColor, setCurrentColor] = useState(color);

  // Paleta de cores predefinidas com gradientes
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

  useEffect(() => {
    setCurrentColor(color);
  }, [color]);

  return (
    <motion.div 
      className="space-y-6 p-6 bg-white/80 backdrop-blur-xl rounded-3xl border border-white/40 shadow-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gradient-to-r from-primary/20 to-primary/10 rounded-full">
          <Palette className="w-5 h-5 text-primary" />
        </div>
        <h3 className="text-lg font-semibold bg-gradient-to-r from-gray-800 to-primary bg-clip-text text-transparent">
          Seletor de Cores
        </h3>
      </div>

      <div className="flex items-center gap-4">
        <motion.div 
          className="relative group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <input
            type="color"
            value={currentColor}
            onChange={handleColorChange}
            className="w-16 h-16 cursor-pointer border-0 rounded-2xl overflow-hidden bg-transparent shadow-lg hover:shadow-xl transition-all duration-300"
            aria-label="Selecionar cor"
          />
          <div className="absolute inset-0 rounded-2xl ring-2 ring-white ring-offset-2 group-hover:ring-primary transition-all duration-300"></div>
        </motion.div>
        
        <input
          type="text"
          value={currentColor}
          onChange={e => {
            if (e.target.value.startsWith('#') && e.target.value.length <= 7) {
              setCurrentColor(e.target.value);
              onChange(e.target.value);
            }
          }}
          className="px-4 py-3 border-2 border-gray-200 rounded-xl w-32 font-mono text-center focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md"
          aria-label="Código da cor"
        />
        
        <Button 
          onClick={onSave} 
          variant="gradient"
          size="lg"
          className="gap-2 p-3"
        >
          <Sparkles className="w-4 h-4" />
          Aplicar
        </Button>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-600 mb-3 flex items-center gap-2">
          <div className="w-2 h-2 bg-primary rounded-full"></div>
          Cores predefinidas
        </p>
        <div className="grid grid-cols-7 gap-3">
          {presetColors.map((presetColor, index) => (
            <motion.button
              key={presetColor}
              className="w-10 h-10 rounded-xl cursor-pointer border-2 border-white shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 relative overflow-hidden group"
              style={{ backgroundColor: presetColor }}
              onClick={() => handlePresetClick(presetColor)}
              title={presetColor}
              aria-label={`Selecionar cor ${presetColor}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ 
                rotate: [0, -5, 5, 0],
                transition: { duration: 0.3 }
              }}
            >
              {presetColor === currentColor && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <Check className="h-5 w-5 text-white drop-shadow-lg" />
                </motion.div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </motion.button>
          ))}
        </div>
      </div>

      <motion.div 
        className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <p className="text-sm font-medium mb-3 text-gray-700">Prévia da cor</p>
        <div className="space-y-3">
          <motion.div 
            className="h-12 rounded-xl shadow-inner relative overflow-hidden"
            style={{ backgroundColor: currentColor }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-black/20"></div>
          </motion.div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Código:</span>
            <span className="font-mono font-semibold text-gray-800 bg-gray-100 px-3 py-1 rounded-lg">{currentColor}</span>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">
            Esta cor será aplicada em botões, links e elementos destacados do seu painel administrativo.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ColorPicker;
