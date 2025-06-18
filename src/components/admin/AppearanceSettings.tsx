
import { useState, useEffect } from 'react';
import { Palette, Upload, Sparkles, Image as ImageIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/ui/image-upload";
import ColorPicker from "@/components/ColorPicker";
import { useToast } from "@/hooks/use-toast";
import { saveAppearanceSettings, getAppearanceSettings } from '@/lib/firebase-operations';
import { motion } from "framer-motion";

export default function AppearanceSettings() {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [primaryColor, setPrimaryColor] = useState('#0066cc');
  const [heroImage, setHeroImage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAppearanceSettings();
        if (data) {
          setPrimaryColor(data.primaryColor || '#0066cc');
          setHeroImage(data.heroImage || '');
        }
      } catch (error) {
        console.error('Erro ao carregar configurações de aparência:', error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const success = await saveAppearanceSettings({
        primaryColor,
        heroImage
      });
      
      if (success) {
        // Aplicar a cor primária imediatamente
        document.documentElement.style.setProperty('--primary', primaryColor);
        
        toast({
          title: "Configurações salvas",
          description: "As configurações de aparência foram atualizadas com sucesso",
        });
      } else {
        throw new Error('Erro ao salvar');
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleColorSave = () => {
    handleSubmit(new Event('submit') as any);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, duration: 0.6, type: "spring" }}
          className="p-3 bg-gradient-to-r from-primary/20 to-primary/10 rounded-full"
        >
          <Palette className="w-6 h-6 text-primary" />
        </motion.div>
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 via-primary to-purple-600 bg-clip-text text-transparent">
            Configurações de Aparência
          </h2>
          <p className="text-gray-600 mt-1">Personalize a aparência do seu painel</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Color Picker Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Card className="bg-white/90 backdrop-blur-xl border-0 shadow-xl rounded-3xl overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-primary to-primary/60"></div>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <Label className="text-lg font-semibold text-gray-700">Cor Principal do Sistema</Label>
                </div>
                <ColorPicker
                  color={primaryColor}
                  onChange={setPrimaryColor}
                  onSave={handleColorSave}
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Image Upload Section */}
{/*           <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Card className="bg-white/90 backdrop-blur-xl border-0 shadow-xl rounded-3xl overflow-hidden h-full">
              <div className="h-1 bg-gradient-to-r from-emerald-500 to-emerald-400"></div>
              <CardContent className="p-6 h-full flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <ImageIcon className="w-5 h-5 text-emerald-600" />
                  <Label className="text-lg font-semibold text-gray-700">Imagem Principal (Hero)</Label>
                </div>
                <div className="flex-1 bg-gradient-to-br from-gray-50 to-white rounded-2xl p-4 border border-gray-100">
                  <ImageUpload
                    value={heroImage}
                    onChange={setHeroImage}
                  />
                  {heroImage && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-4"
                    >
                      <p className="text-sm text-gray-600 mb-2">Prévia da imagem:</p>
                      <img
                        src={heroImage}
                        alt="Prévia da imagem hero"
                        className="w-full h-32 object-cover rounded-xl shadow-md"
                      />
                    </motion.div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div> */}
        </div>

        <motion.div 
          className="flex justify-end pt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <Button 
            type="submit" 
            disabled={isSaving}
            variant="gradient"
            size="lg"
            className="gap-2 px-2 py-3"
          >
            <Sparkles className="w-5 h-5 " />
            {isSaving ? "Salvando Alterações..." : "Salvar Todas as Alterações"}
          </Button>
        </motion.div>
      </form>
    </motion.div>
  );
}
