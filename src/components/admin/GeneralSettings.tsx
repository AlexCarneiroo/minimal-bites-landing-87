import { useState } from 'react';
import { 
  Clock, 
  Mail, 
  Phone, 
  MapPin,
  Facebook,
  Instagram,
  Youtube,
  Linkedin
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/ui/image-upload";
import { useToast } from "@/hooks/use-toast";

interface EstablishmentData {
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  logo: string;
  schedule: {
    weekdays: string;
    weekends: string;
    holidays: string;
  };
  socialMedia: {
    facebook: string;
    instagram: string;
    youtube: string;
    linkedin: string;
  };
}

interface GeneralSettingsProps {
  establishmentData: EstablishmentData;
  updateEstablishmentData: (field: string, value: string) => void;
  updateSocialMedia: (platform: string, url: string) => void;
  updateSchedule: (period: string, time: string) => void;
  handleSave: (section: string) => void;
}

export default function GeneralSettings({
  establishmentData,
  updateEstablishmentData,
  updateSocialMedia,
  updateSchedule,
  handleSave
}: GeneralSettingsProps) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      await handleSave('general');
      toast({
        title: "Configurações salvas",
        description: "As configurações gerais foram atualizadas com sucesso",
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-6">Informações do Estabelecimento</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome do Estabelecimento</Label>
                <Input
                  id="name"
                  value={establishmentData.name}
                  onChange={(e) => updateEstablishmentData('name', e.target.value)}
                  placeholder="Nome do seu estabelecimento"
                />
              </div>

              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={establishmentData.description}
                  onChange={(e) => updateEstablishmentData('description', e.target.value)}
                  placeholder="Descreva seu estabelecimento"
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  value={establishmentData.address}
                  onChange={(e) => updateEstablishmentData('address', e.target.value)}
                  placeholder="Endereço completo"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={establishmentData.phone}
                  onChange={(e) => updateEstablishmentData('phone', e.target.value)}
                  placeholder="(00) 0000-0000"
                />
              </div>

              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={establishmentData.email}
                  onChange={(e) => updateEstablishmentData('email', e.target.value)}
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <Label>Logo</Label>
                <ImageUpload
                  value={establishmentData.logo}
                  onChange={(url) => updateEstablishmentData('logo', url)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-6">Horário de Funcionamento</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="weekdays">Dias de Semana</Label>
              <Input
                id="weekdays"
                value={establishmentData.schedule.weekdays}
                onChange={(e) => updateSchedule('weekdays', e.target.value)}
                placeholder="Ex: 11h às 22h"
              />
            </div>

            <div>
              <Label htmlFor="weekends">Finais de Semana</Label>
              <Input
                id="weekends"
                value={establishmentData.schedule.weekends}
                onChange={(e) => updateSchedule('weekends', e.target.value)}
                placeholder="Ex: 12h às 23h"
              />
            </div>

            <div>
              <Label htmlFor="holidays">Feriados</Label>
              <Input
                id="holidays"
                value={establishmentData.schedule.holidays}
                onChange={(e) => updateSchedule('holidays', e.target.value)}
                placeholder="Ex: 12h às 20h"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-6">Redes Sociais</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="facebook">Facebook</Label>
              <Input
                id="facebook"
                value={establishmentData.socialMedia.facebook}
                onChange={(e) => updateSocialMedia('facebook', e.target.value)}
                placeholder="https://facebook.com/seu-perfil"
              />
            </div>

            <div>
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                value={establishmentData.socialMedia.instagram}
                onChange={(e) => updateSocialMedia('instagram', e.target.value)}
                placeholder="https://instagram.com/seu-perfil"
              />
            </div>

            <div>
              <Label htmlFor="youtube">YouTube</Label>
              <Input
                id="youtube"
                value={establishmentData.socialMedia.youtube}
                onChange={(e) => updateSocialMedia('youtube', e.target.value)}
                placeholder="https://youtube.com/seu-canal"
              />
            </div>

            <div>
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                value={establishmentData.socialMedia.linkedin}
                onChange={(e) => updateSocialMedia('linkedin', e.target.value)}
                placeholder="https://linkedin.com/seu-perfil"
              />
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
