import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/ui/image-upload";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import { useToast } from "@/hooks/use-toast";

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
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Aparência</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="primaryColor">Cor Primária</Label>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    id="primaryColor"
                    value={primaryColor}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="w-12 h-12 rounded cursor-pointer"
                  />
                  <span className="text-sm text-gray-500">{primaryColor}</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {PREDEFINED_COLORS.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => handleColorChange(color.value)}
                      className={`p-2 rounded border ${
                        primaryColor === color.value ? 'ring-2 ring-offset-2 ring-primary' : ''
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    >
                      <span className="sr-only">{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <ImageUpload
              value={heroImage}
              onChange={handleHeroImageChange}
              label="Imagem de Fundo"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
