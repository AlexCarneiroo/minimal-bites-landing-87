
import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/ui/image-upload";
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

export default function AppearanceSettings() {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [primaryColor, setPrimaryColor] = useState('#0066cc');
  const [heroImage, setHeroImage] = useState('');

  // Carregar dados do banco
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/appearance');
        if (response.ok) {
          const data = await response.json();
          if (data) {
            setPrimaryColor(data.primaryColor || '#0066cc');
            setHeroImage(data.heroImage || '');
          }
        }
      } catch (error) {
        console.error('Erro ao carregar configurações de aparência:', error);
      }
    };

    fetchData();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      const response = await fetch('/api/appearance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          primaryColor,
          heroImage
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar configurações');
      }

      toast({
        title: "Configurações salvas",
        description: "As configurações de aparência foram atualizadas com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleColorChange = async (color: string) => {
    setPrimaryColor(color);
    toast({
      title: "Cor atualizada",
      description: "A cor primária foi atualizada. Clique em 'Salvar' para confirmar.",
    });
  };

  const handleHeroImageChange = async (url: string) => {
    setHeroImage(url);
    toast({
      title: "Imagem atualizada",
      description: "A imagem de fundo foi atualizada. Clique em 'Salvar' para confirmar.",
    });
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
            <div>
              <Label>Imagem de Fundo</Label>
              <ImageUpload
                value={heroImage}
                onChange={handleHeroImageChange}
                label="Imagem de Fundo"
              />
            </div>
          </div>
          
          <div className="flex justify-end mt-6">
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
