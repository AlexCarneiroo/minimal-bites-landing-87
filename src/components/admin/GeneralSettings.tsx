
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

interface EstablishmentData {
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
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

const GeneralSettings = ({
  establishmentData,
  updateEstablishmentData,
  updateSocialMedia,
  updateSchedule,
  handleSave
}: GeneralSettingsProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Informações Gerais</h2>
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">Nome do Estabelecimento</label>
                <Input 
                  id="name" 
                  value={establishmentData.name}
                  onChange={(e) => updateEstablishmentData('name', e.target.value)}
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1">Descrição</label>
                <textarea
                  id="description"
                  className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  value={establishmentData.description}
                  onChange={(e) => updateEstablishmentData('description', e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-1">Telefone</label>
                <div className="flex items-center">
                  <Phone className="mr-2 h-4 w-4 text-gray-500" />
                  <Input 
                    id="phone" 
                    value={establishmentData.phone}
                    onChange={(e) => updateEstablishmentData('phone', e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">E-mail</label>
                <div className="flex items-center">
                  <Mail className="mr-2 h-4 w-4 text-gray-500" />
                  <Input 
                    id="email" 
                    value={establishmentData.email}
                    onChange={(e) => updateEstablishmentData('email', e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="address" className="block text-sm font-medium mb-1">Endereço</label>
                <div className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4 text-gray-500" />
                  <Input 
                    id="address" 
                    value={establishmentData.address}
                    onChange={(e) => updateEstablishmentData('address', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          <h3 className="text-lg font-medium mb-4">Horário de Funcionamento</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="weekdays" className="block text-sm font-medium mb-1">Segunda - Sexta</label>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-gray-500" />
                <Input 
                  id="weekdays" 
                  value={establishmentData.schedule.weekdays}
                  onChange={(e) => updateSchedule('weekdays', e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="weekends" className="block text-sm font-medium mb-1">Sábado - Domingo</label>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-gray-500" />
                <Input 
                  id="weekends" 
                  value={establishmentData.schedule.weekends}
                  onChange={(e) => updateSchedule('weekends', e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="holidays" className="block text-sm font-medium mb-1">Feriados</label>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-gray-500" />
                <Input 
                  id="holidays" 
                  value={establishmentData.schedule.holidays}
                  onChange={(e) => updateSchedule('holidays', e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          <h3 className="text-lg font-medium mb-4">Redes Sociais</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="facebook" className="block text-sm font-medium mb-1">Facebook</label>
              <div className="flex items-center">
                <Facebook className="mr-2 h-4 w-4 text-gray-500" />
                <Input 
                  id="facebook" 
                  value={establishmentData.socialMedia.facebook}
                  onChange={(e) => updateSocialMedia('facebook', e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="instagram" className="block text-sm font-medium mb-1">Instagram</label>
              <div className="flex items-center">
                <Instagram className="mr-2 h-4 w-4 text-gray-500" />
                <Input 
                  id="instagram" 
                  value={establishmentData.socialMedia.instagram}
                  onChange={(e) => updateSocialMedia('instagram', e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="youtube" className="block text-sm font-medium mb-1">Youtube</label>
              <div className="flex items-center">
                <Youtube className="mr-2 h-4 w-4 text-gray-500" />
                <Input 
                  id="youtube" 
                  value={establishmentData.socialMedia.youtube}
                  onChange={(e) => updateSocialMedia('youtube', e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="linkedin" className="block text-sm font-medium mb-1">LinkedIn</label>
              <div className="flex items-center">
                <Linkedin className="mr-2 h-4 w-4 text-gray-500" />
                <Input 
                  id="linkedin" 
                  value={establishmentData.socialMedia.linkedin}
                  onChange={(e) => updateSocialMedia('linkedin', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Button onClick={() => handleSave('geral')}>Salvar Alterações</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GeneralSettings;
