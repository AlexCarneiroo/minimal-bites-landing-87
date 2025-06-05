
import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ImageUpload } from "@/components/ui/image-upload";

interface AboutContent {
  id: string;
  title: string;
  description: string;
  image: string;
  mission: string;
  vision: string;
  values: string[];
}

export default function AboutManager() {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [aboutContent, setAboutContent] = useState<AboutContent>({
    id: '',
    title: '',
    description: '',
    image: '',
    mission: '',
    vision: '',
    values: []
  });

  const fetchAboutContent = async () => {
    try {
      const response = await fetch('/api/about');
      if (!response.ok) {
        throw new Error('Erro ao buscar conteúdo');
      }
      const data = await response.json();
      if (data) {
        setAboutContent({
          id: data.id || '',
          title: data.title || '',
          description: data.description || '',
          image: data.image || '',
          mission: data.mission || '',
          vision: data.vision || '',
          values: data.values || []
        });
      }
    } catch (error) {
      console.error('Erro ao buscar conteúdo sobre:', error);
      toast({
        title: "Erro ao carregar",
        description: "Não foi possível carregar o conteúdo",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchAboutContent();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const response = await fetch('/api/about', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(aboutContent),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao salvar conteúdo');
      }

      const data = await response.json();
      setAboutContent({ ...data });

      toast({
        title: "Conteúdo salvo",
        description: "O conteúdo sobre foi salvo com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: error instanceof Error ? error.message : "Não foi possível salvar o conteúdo",
        variant: "destructive",
      });
      console.error("Erro ao salvar conteúdo:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddValue = () => {
    setAboutContent(prev => ({
      ...prev,
      values: [...prev.values, '']
    }));
  };

  const handleUpdateValue = (index: number, value: string) => {
    setAboutContent(prev => ({
      ...prev,
      values: prev.values.map((v, i) => i === index ? value : v)
    }));
  };

  const handleRemoveValue = (index: number) => {
    setAboutContent(prev => ({
      ...prev,
      values: prev.values.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Conteúdo Sobre Nós</h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={aboutContent.title}
                  onChange={(e) => setAboutContent(prev => ({
                    ...prev,
                    title: e.target.value
                  }))}
                  placeholder="Título da seção"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={aboutContent.description}
                  onChange={(e) => setAboutContent(prev => ({
                    ...prev,
                    description: e.target.value
                  }))}
                  placeholder="Descrição geral"
                  rows={4}
                  required
                />
              </div>

              <div>
                <Label>Imagem Principal</Label>
                <ImageUpload
                  value={aboutContent.image}
                  onChange={(url) => setAboutContent(prev => ({
                    ...prev,
                    image: url
                  }))}
                  label="Imagem Principal da Seção"
                />
              </div>

              <div>
                <Label htmlFor="mission">Missão</Label>
                <Textarea
                  id="mission"
                  value={aboutContent.mission}
                  onChange={(e) => setAboutContent(prev => ({
                    ...prev,
                    mission: e.target.value
                  }))}
                  placeholder="Nossa missão"
                  rows={3}
                  required
                />
              </div>

              <div>
                <Label htmlFor="vision">Visão</Label>
                <Textarea
                  id="vision"
                  value={aboutContent.vision}
                  onChange={(e) => setAboutContent(prev => ({
                    ...prev,
                    vision: e.target.value
                  }))}
                  placeholder="Nossa visão"
                  rows={3}
                  required
                />
              </div>

              <div>
                <Label>Valores</Label>
                <div className="space-y-2">
                  {aboutContent.values.map((value, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={value}
                        onChange={(e) => handleUpdateValue(index, e.target.value)}
                        placeholder={`Valor ${index + 1}`}
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveValue(index)}
                      >
                        Remover
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddValue}
                  >
                    Adicionar Valor
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Salvando..." : "Salvar Conteúdo"}
          </Button>
        </div>
      </form>
    </div>
  );
}
