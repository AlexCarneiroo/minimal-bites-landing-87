
import { useState } from 'react';
import { Save, Building, Mail, Phone, MapPin, Globe, Clock } from 'lucide-react';
import StyledCard from './StyledCard';
import StyledInput from './StyledInput';
import StyledTextarea from './StyledTextarea';
import StyledButton from './StyledButton';
import { ImageUpload } from "@/components/ui/image-upload";
import { useToast } from "@/hooks/use-toast";
import { motion } from 'framer-motion';

interface GeneralSettingsProps {
  establishmentData?: {
    name: string;
    description: string;
    address: string;
    phone: string;
    email: string;
    logo: string;
    menuUrl?: string;
    mapsUrl?: string;
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
  };
  onSave: (data: any) => void;
}

export default function GeneralSettings({ establishmentData, onSave }: GeneralSettingsProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: establishmentData?.name || '',
    description: establishmentData?.description || '',
    address: establishmentData?.address || '',
    phone: establishmentData?.phone || '',
    email: establishmentData?.email || '',
    logo: establishmentData?.logo || '',
    menuUrl: establishmentData?.menuUrl || '',
    mapsUrl: establishmentData?.mapsUrl || '',
    schedule: {
      weekdays: establishmentData?.schedule?.weekdays || '',
      weekends: establishmentData?.schedule?.weekends || '',
      holidays: establishmentData?.schedule?.holidays || '',
    },
    socialMedia: {
      facebook: establishmentData?.socialMedia?.facebook || '',
      instagram: establishmentData?.socialMedia?.instagram || '',
      youtube: establishmentData?.socialMedia?.youtube || '',
      linkedin: establishmentData?.socialMedia?.linkedin || '',
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    toast({
      title: "Configurações salvas",
      description: "As informações do estabelecimento foram atualizadas com sucesso",
    });
  };

  return (
    <div className="space-y-8">
      <StyledCard title="Informações Gerais">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StyledInput
              label="Nome do Estabelecimento"
              icon={<Building className="w-5 h-5" />}
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Digite o nome do estabelecimento"
              required
            />

            <StyledInput
              label="Email"
              icon={<Mail className="w-5 h-5" />}
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="contato@exemplo.com"
              required
            />

            <StyledInput
              label="Telefone"
              icon={<Phone className="w-5 h-5" />}
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="(11) 99999-9999"
              required
            />

            <StyledInput
              label="Endereço"
              icon={<MapPin className="w-5 h-5" />}
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              placeholder="Rua, número, bairro, cidade"
              required
            />
          </div>

          <StyledTextarea
            label="Descrição"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Descreva seu estabelecimento..."
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StyledInput
              label="URL do Menu"
              icon={<Globe className="w-5 h-5" />}
              value={formData.menuUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, menuUrl: e.target.value }))}
              placeholder="https://..."
            />

            <StyledInput
              label="URL do Google Maps"
              icon={<MapPin className="w-5 h-5" />}
              value={formData.mapsUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, mapsUrl: e.target.value }))}
              placeholder="https://maps.google.com/..."
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <ImageUpload
              value={formData.logo}
              onChange={(url) => setFormData(prev => ({ ...prev, logo: url }))}
              label="Logo do Estabelecimento"
            />
          </motion.div>

          <div className="flex justify-end">
            <StyledButton
              type="submit"
              gradient
              icon={<Save className="w-5 h-5" />}
            >
              Salvar Configurações
            </StyledButton>
          </div>
        </form>
      </StyledCard>

      <StyledCard title="Horários de Funcionamento">
        <div className="space-y-6">
          <StyledInput
            label="Dias da Semana"
            icon={<Clock className="w-5 h-5" />}
            value={formData.schedule.weekdays}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              schedule: { ...prev.schedule, weekdays: e.target.value }
            }))}
            placeholder="Ex: Segunda a Sexta: 9h às 18h"
          />

          <StyledInput
            label="Final de Semana"
            icon={<Clock className="w-5 h-5" />}
            value={formData.schedule.weekends}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              schedule: { ...prev.schedule, weekends: e.target.value }
            }))}
            placeholder="Ex: Sábado e Domingo: 10h às 16h"
          />

          <StyledInput
            label="Feriados"
            icon={<Clock className="w-5 h-5" />}
            value={formData.schedule.holidays}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              schedule: { ...prev.schedule, holidays: e.target.value }
            }))}
            placeholder="Ex: Fechado em feriados nacionais"
          />
        </div>
      </StyledCard>

      <StyledCard title="Redes Sociais">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StyledInput
            label="Facebook"
            value={formData.socialMedia.facebook}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              socialMedia: { ...prev.socialMedia, facebook: e.target.value }
            }))}
            placeholder="https://facebook.com/..."
          />

          <StyledInput
            label="Instagram"
            value={formData.socialMedia.instagram}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              socialMedia: { ...prev.socialMedia, instagram: e.target.value }
            }))}
            placeholder="https://instagram.com/..."
          />

          <StyledInput
            label="YouTube"
            value={formData.socialMedia.youtube}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              socialMedia: { ...prev.socialMedia, youtube: e.target.value }
            }))}
            placeholder="https://youtube.com/..."
          />

          <StyledInput
            label="LinkedIn"
            value={formData.socialMedia.linkedin}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              socialMedia: { ...prev.socialMedia, linkedin: e.target.value }
            }))}
            placeholder="https://linkedin.com/..."
          />
        </div>
      </StyledCard>
    </div>
  );
}
