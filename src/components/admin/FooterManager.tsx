
import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ImageUpload } from "@/components/ui/image-upload";
import { saveFooterSettings, getFooterSettings } from '@/lib/firebase-operations';

interface FooterContent {
  id?: string;
  logo: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  socialMedia: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
  copyright: string;
}

export default function FooterManager() {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [footerContent, setFooterContent] = useState<FooterContent>({
    logo: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    socialMedia: {},
    copyright: ''
  });

  const fetchFooterContent = async () => {
    try {
      const data = await getFooterSettings();
      if (data) {
        setFooterContent({
          id: data.id || '',
          logo: data.logo || '',
          description: data.description || '',
          address: data.address || '',
          phone: data.phone || '',
          email: data.email || '',
          socialMedia: data.socialMedia || {},
          copyright: data.copyright || ''
        });
      }
    } catch (error) {
      console.error('Erro ao buscar conteúdo do rodapé:', error);
      toast({
        title: "Erro ao carregar",
        description: "Não foi possível carregar o conteúdo",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchFooterContent();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const success = await saveFooterSettings(footerContent);

      if (success) {
        toast({
          title: "Conteúdo salvo",
          description: "O conteúdo do rodapé foi salvo com sucesso",
        });
      } else {
        throw new Error('Erro ao salvar');
      }
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

  const handleSocialMediaChange = (platform: string, value: string) => {
    setFooterContent(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Conteúdo do Rodapé</h3>
            
            <div className="space-y-4">
              <div>
                <Label>Logo</Label>
                <ImageUpload
                  value={footerContent.logo}
                  onChange={(url) => setFooterContent(prev => ({
                    ...prev,
                    logo: url
                  }))}
                  label="Logo do Rodapé"
                />
              </div>

              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={footerContent.description}
                  onChange={(e) => setFooterContent(prev => ({
                    ...prev,
                    description: e.target.value
                  }))}
                  placeholder="Descrição da empresa"
                  rows={3}
                  required
                />
              </div>

              <div>
                <Label htmlFor="address">Endereço</Label>
                <Textarea
                  id="address"
                  value={footerContent.address}
                  onChange={(e) => setFooterContent(prev => ({
                    ...prev,
                    address: e.target.value
                  }))}
                  placeholder="Endereço completo"
                  rows={2}
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={footerContent.phone}
                  onChange={(e) => setFooterContent(prev => ({
                    ...prev,
                    phone: e.target.value
                  }))}
                  placeholder="(00) 00000-0000"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={footerContent.email}
                  onChange={(e) => setFooterContent(prev => ({
                    ...prev,
                    email: e.target.value
                  }))}
                  placeholder="contato@empresa.com"
                  required
                />
              </div>

              <div>
                <Label>Redes Sociais</Label>
                <div className="space-y-2">
                  <Input
                    value={footerContent.socialMedia.facebook || ''}
                    onChange={(e) => handleSocialMediaChange('facebook', e.target.value)}
                    placeholder="URL do Facebook"
                  />
                  <Input
                    value={footerContent.socialMedia.instagram || ''}
                    onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
                    placeholder="URL do Instagram"
                  />
                  <Input
                    value={footerContent.socialMedia.twitter || ''}
                    onChange={(e) => handleSocialMediaChange('twitter', e.target.value)}
                    placeholder="URL do Twitter"
                  />
                  <Input
                    value={footerContent.socialMedia.linkedin || ''}
                    onChange={(e) => handleSocialMediaChange('linkedin', e.target.value)}
                    placeholder="URL do LinkedIn"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="copyright">Copyright</Label>
                <Input
                  id="copyright"
                  value={footerContent.copyright}
                  onChange={(e) => setFooterContent(prev => ({
                    ...prev,
                    copyright: e.target.value
                  }))}
                  placeholder="© 2024 Empresa. Todos os direitos reservados."
                  required
                />
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
