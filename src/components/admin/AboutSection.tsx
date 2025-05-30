import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ImageUpload } from "@/components/ui/image-upload";
import { collection, doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { X } from 'lucide-react';

interface AboutSectionProps {
  title: string;
  description: string;
  images: string[];
  onSave: (data: { title: string; description: string; images: string[] }) => void;
}

export default function AboutSection({
  title,
  description,
  images: initialImages,
  onSave
}: AboutSectionProps) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    title,
    description,
    images: initialImages || []
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      // Salvar no Firebase
      const aboutDoc = doc(db, 'about', 'section');
      await setDoc(aboutDoc, {
        ...formData,
        updatedAt: serverTimestamp()
      }, { merge: true });

      // Chamar o callback onSave
      await onSave(formData);

      toast({
        title: "Seção atualizada",
        description: "A seção Sobre Nós foi atualizada com sucesso",
      });
    } catch (error) {
      console.error('Erro ao salvar:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível atualizar a seção",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddImage = (url: string) => {
    if (formData.images.length >= 5) {
      toast({
        title: "Limite atingido",
        description: "Você pode adicionar no máximo 5 imagens",
        variant: "destructive",
      });
      return;
    }
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, url]
    }));
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="Título da seção"
                />
              </div>

              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Conte a história do seu estabelecimento"
                  rows={6}
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label>Imagens ({formData.images.length}/5)</Label>
              
              {/* Upload de nova imagem */}
              {formData.images.length < 5 && (
                <div className="mb-4">
                  <ImageUpload
                    value=""
                    onChange={handleAddImage}
                    label="Adicionar nova imagem"
                  />
                </div>
              )}

              {/* Lista de imagens */}
              <div className="grid grid-cols-2 gap-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Imagem ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
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