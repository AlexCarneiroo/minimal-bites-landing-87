
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageUpload } from '@/components/ui/image-upload';
import { useToast } from '@/hooks/use-toast';
import { saveGeneralSettings, getGeneralSettings } from '@/lib/firebase-operations';

interface FeaturedProductData {
  title: string;
  description: string;
  image: string;
  year: string;
}

interface FeaturedProductSettingsProps {
  onSave?: (data: FeaturedProductData) => void;
}

const FeaturedProductSettings = ({ onSave }: FeaturedProductSettingsProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FeaturedProductData>({
    title: 'Sabor Extraordinário',
    description: 'Experimente nossa especialidade',
    image: '',
    year: '2010'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadFeaturedProduct = async () => {
      try {
        const data = await getGeneralSettings();
        if (data?.featuredProduct) {
          setFormData(data.featuredProduct);
        }
      } catch (error) {
        console.error('Erro ao carregar produto em destaque:', error);
      }
    };

    loadFeaturedProduct();
  }, []);

  const handleInputChange = (field: keyof FeaturedProductData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const success = await saveGeneralSettings({
        featuredProduct: formData
      });

      if (success) {
        toast({
          title: "Produto em destaque atualizado",
          description: "As alterações foram salvas com sucesso",
        });
        onSave?.(formData);
      } else {
        throw new Error('Falha ao salvar');
      }
    } catch (error) {
      console.error('Erro ao salvar produto em destaque:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as alterações",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Produto em Destaque</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Ex: Sabor Extraordinário"
              />
            </div>

            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Ex: Experimente nossa especialidade"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="year">Ano</Label>
              <Input
                id="year"
                value={formData.year}
                onChange={(e) => handleInputChange('year', e.target.value)}
                placeholder="Ex: 2010"
                maxLength={4}
              />
            </div>
          </div>

          <div>
            <ImageUpload
              label="Imagem do Produto"
              value={formData.image}
              onChange={(url) => handleInputChange('image', url)}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button 
            onClick={handleSave} 
            disabled={loading}
            className="bg-primary hover:bg-primary/90"
          >
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeaturedProductSettings;
