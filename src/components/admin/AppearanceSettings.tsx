
import { ImagePlus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ColorPicker from '@/components/ColorPicker';
import { useToast } from '@/hooks/use-toast';

interface AppearanceSettingsProps {
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
  heroImage: string;
  setHeroImage: (image: string) => void;
  handleSave: (section: string) => void;
}

const AppearanceSettings = ({
  primaryColor,
  setPrimaryColor,
  heroImage,
  setHeroImage,
  handleSave
}: AppearanceSettingsProps) => {
  const { toast } = useToast();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Por enquanto, criar uma URL local temporária
      const tempUrl = URL.createObjectURL(file);
      setHeroImage(tempUrl);
      toast({
        title: "Imagem carregada",
        description: "A nova imagem foi adicionada",
      });
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Aparência</h2>
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Cor Principal</h3>
              <p className="text-sm text-gray-500 mb-4">
                Esta cor será aplicada nos elementos destacados do site.
              </p>
              <ColorPicker 
                color={primaryColor} 
                onChange={setPrimaryColor}
                onSave={() => handleSave('cor')}
              />
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Imagem Principal (Hero)</h3>
              <p className="text-sm text-gray-500 mb-4">
                Esta imagem aparece na seção de destaque da página inicial.
              </p>
              
              <div className="border border-gray-200 rounded p-4">
                <img 
                  src={heroImage} 
                  alt="Imagem principal" 
                  className="w-full h-48 object-cover rounded mb-4" 
                />
                
                <label htmlFor="hero-image" className="cursor-pointer">
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <ImagePlus className="h-4 w-4" />
                    <span>Alterar imagem</span>
                  </div>
                  <input 
                    id="hero-image" 
                    type="file" 
                    accept="image/*" 
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Button onClick={() => handleSave('aparência')}>Salvar Alterações</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppearanceSettings;
