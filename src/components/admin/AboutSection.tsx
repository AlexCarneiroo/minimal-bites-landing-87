
import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/ui/image-upload";
import { useToast } from "@/hooks/use-toast";
import { saveAboutSettings, getAboutSettings } from '@/lib/firebase-operations';

interface AboutSectionProps {
  title: string;
  description: string;
  images: string[];
  spaceImages: string[];
  onSave: (data: { 
    title: string; 
    description: string; 
    images: string[];
    spaceImages: string[];
  }) => void;
}

export default function AboutSection({ title, description, images, spaceImages, onSave }: AboutSectionProps) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: title || 'Sobre Nós',
    description: description || '',
    images: images || [],
    spaceImages: spaceImages || []
  });

  // Carregar dados do Firebase
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAboutSettings();
        if (data) {
          setFormData({
            title: data.title || 'Sobre Nós',
            description: data.description || '',
            images: data.images || [],
            spaceImages: data.spaceImages || []
          });
        }
      } catch (error) {
        console.error('Erro ao carregar dados sobre:', error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const success = await saveAboutSettings(formData);
      
      if (success) {
        onSave(formData);
        toast({
          title: "Dados salvos",
          description: "As informações da seção Sobre foram atualizadas com sucesso",
        });
      } else {
        throw new Error('Erro ao salvar');
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as informações",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const addImage = (type: 'images' | 'spaceImages') => {
    setFormData(prev => ({
      ...prev,
      [type]: [...prev[type], '']
    }));
  };

  const updateImage = (type: 'images' | 'spaceImages', index: number, url: string) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].map((img, i) => i === index ? url : img)
    }));
  };

  const removeImage = (type: 'images' | 'spaceImages', index: number) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-4">Informações Gerais</h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="about-title">Título da Seção</Label>
              <Input
                id="about-title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Título da seção sobre"
              />
            </div>

            <div>
              <Label htmlFor="about-description">Descrição</Label>
              <Textarea
                id="about-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descrição da empresa"
                rows={6}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-4">Galeria de Imagens</h3>
          
          <div className="space-y-4">
            {formData.images.map((image, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="flex-1">
                  <ImageUpload
                    value={image}
                    onChange={(url) => updateImage('images', index, url)}
                  />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeImage('images', index)}
                >
                  Remover
                </Button>
              </div>
            ))}
            
            <Button
              type="button"
              variant="outline"
              onClick={() => addImage('images')}
            >
              Adicionar Imagem
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-4">Conheça Nosso Espaço</h3>
          
          <div className="space-y-4">
            {formData.spaceImages.map((image, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="flex-1">
                  <ImageUpload
                    value={image}
                    onChange={(url) => updateImage('spaceImages', index, url)}
                  />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeImage('spaceImages', index)}
                >
                  Remover
                </Button>
              </div>
            ))}
            
            <Button
              type="button"
              variant="outline"
              onClick={() => addImage('spaceImages')}
            >
              Adicionar Foto do Espaço
            </Button>
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
