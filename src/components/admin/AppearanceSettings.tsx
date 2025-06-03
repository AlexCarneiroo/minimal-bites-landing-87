
import { Palette, Image as ImageIcon } from 'lucide-react';
import StyledCard from './StyledCard';
import StyledButton from './StyledButton';
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/ui/image-upload";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from '@/contexts/ThemeContext';
import { motion } from 'framer-motion';

const PREDEFINED_COLORS = [
  { name: 'Azul', value: '#0066cc' },
  { name: 'Verde', value: '#22c55e' },
  { name: 'Vermelho', value: '#ef4444' },
  { name: 'Roxo', value: '#8b5cf6' },
  { name: 'Laranja', value: '#f97316' },
  { name: 'Rosa', value: '#ec4899' },
  { name: 'Ciano', value: '#06b6d4' },
  { name: 'Amarelo', value: '#eab308' }
];

interface AppearanceSettingsProps {
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
  heroImage: string;
  setHeroImage: (url: string) => void;
  handleSave: (section: string) => void;
}

export default function AppearanceSettings({
  primaryColor,
  setPrimaryColor,
  heroImage,
  setHeroImage,
  handleSave
}: AppearanceSettingsProps) {
  const { updateSettings } = useSiteSettings();
  const { toast } = useToast();
  const { isDark } = useTheme();

  const handleColorChange = async (color: string) => {
    try {
      setPrimaryColor(color);
      await updateSettings({ primaryColor: color });
      toast({
        title: "Cor atualizada",
        description: "A cor primária foi atualizada com sucesso",
      });
      handleSave('appearance');
    } catch (error) {
      console.error('Erro ao atualizar cor:', error);
      toast({
        title: "Erro ao atualizar cor",
        description: "Não foi possível atualizar a cor primária",
        variant: "destructive",
      });
    }
  };

  const handleHeroImageChange = async (url: string) => {
    try {
      setHeroImage(url);
      await updateSettings({ heroImage: url });
      toast({
        title: "Imagem atualizada",
        description: "A imagem de fundo foi atualizada com sucesso",
      });
      handleSave('appearance');
    } catch (error) {
      console.error('Erro ao atualizar imagem:', error);
      toast({
        title: "Erro ao atualizar imagem",
        description: "Não foi possível atualizar a imagem de fundo",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      <StyledCard title="Cor Primária">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <input
                type="color"
                id="primaryColor"
                value={primaryColor}
                onChange={(e) => handleColorChange(e.target.value)}
                className="w-16 h-16 rounded-2xl cursor-pointer border-4 border-white shadow-lg transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            </div>
            <div>
              <Label className={`text-lg font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                Cor Atual
              </Label>
              <p className={`text-sm font-mono ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {primaryColor.toUpperCase()}
              </p>
            </div>
          </div>

          <div>
            <Label className={`text-sm font-semibold mb-4 block ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
              Cores Predefinidas
            </Label>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
              {PREDEFINED_COLORS.map((color) => (
                <motion.button
                  key={color.value}
                  onClick={() => handleColorChange(color.value)}
                  className={`relative w-12 h-12 rounded-xl shadow-lg transition-all duration-300 group ${
                    primaryColor === color.value 
                      ? 'ring-4 ring-offset-2 ring-blue-500 scale-110' 
                      : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {primaryColor === color.value && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <Palette className="w-6 h-6 text-white drop-shadow-lg" />
                    </motion.div>
                  )}
                  <span className="sr-only">{color.name}</span>
                </motion.button>
              ))}
            </div>
          </div>

          <motion.div 
            className={`p-6 rounded-2xl ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'} border-2 border-dashed ${isDark ? 'border-gray-600' : 'border-gray-300'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h4 className={`text-lg font-semibold mb-3 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
              Prévia da Cor
            </h4>
            <div className="space-y-3">
              <div 
                className="h-12 rounded-xl shadow-lg"
                style={{ backgroundColor: primaryColor }}
              ></div>
              <StyledButton
                style={{ backgroundColor: primaryColor }}
                className="border-0"
              >
                Botão de Exemplo
              </StyledButton>
            </div>
          </motion.div>
        </div>
      </StyledCard>

      <StyledCard title="Imagem de Fundo">
        <div className="space-y-6">
          <ImageUpload
            value={heroImage}
            onChange={handleHeroImageChange}
            label="Imagem Principal do Site"
          />
          
          {heroImage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-6 rounded-2xl ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'} border-2 border-dashed ${isDark ? 'border-gray-600' : 'border-gray-300'}`}
            >
              <h4 className={`text-lg font-semibold mb-3 flex items-center gap-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                <ImageIcon className="w-5 h-5" />
                Prévia da Imagem
              </h4>
              <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg">
                <img
                  src={heroImage}
                  alt="Prévia da imagem de fundo"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </motion.div>
          )}
        </div>
      </StyledCard>
    </div>
  );
}
