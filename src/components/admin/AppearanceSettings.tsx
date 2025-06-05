
import { useState, useEffect } from 'react';
import { Palette, Upload } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/ui/image-upload";
import { ColorPicker } from "@/components/ColorPicker";
import { useToast } from "@/hooks/use-toast";
import { saveAppearanceSettings, getAppearanceSettings } from '@/lib/firebase-operations';

export default function AppearanceSettings() {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [primaryColor, setPrimaryColor] = useState('#0066cc');
  const [heroImage, setHeroImage] = useState('');

  // Carregar dados do Firebase
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-6">Configurações de Aparência</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="primaryColor">Cor Principal</Label>
                <div className="flex items-center space-x-3">
                  <Palette className="h-5 w-5 text-muted-foreground" />
                  <ColorPicker
                    color={primaryColor}
                    onChange={setPrimaryColor}
                  />
                  <span className="text-sm text-muted-foreground">
                    {primaryColor}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Imagem Principal (Hero)</Label>
                <ImageUpload
                  value={heroImage}
                  onChange={setHeroImage}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </div>
    </form>
  );
}
