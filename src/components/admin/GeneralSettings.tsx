import { useState, useEffect } from 'react';
import {
  Clock,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Youtube,
  Linkedin,
  Eye,
  EyeOff
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/ui/image-upload";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { saveGeneralSettings, getGeneralSettings } from '@/lib/firebase-operations';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';
interface EstablishmentData {
  type?: string; // 👈 novo campo
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  logo: string;
  menuUrl?: string;
  mapsUrl?: string;
  featuredProduct?: {
    title: string;
    description: string;
    image: string;
    year: string;
  };
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
  sectionVisibility: {
    featuredItems: boolean;
    testimonials: boolean;
  };
  reservationsEnabled?: boolean;
}

const defaultEstablishmentData: EstablishmentData = {
  type: '', // 👈 novo campo
  name: '',
  description: '',
  address: '',
  phone: '',
  email: '',
  logo: '',
  menuUrl: '',
  mapsUrl: '',
  featuredProduct: {
    title: '',
    description: '',
    image: '',
    year: ''
  },
  schedule: {
    weekdays: '',
    weekends: '',
    holidays: ''
  },
  socialMedia: {
    facebook: '',
    instagram: '',
    youtube: '',
    linkedin: ''
  },
  sectionVisibility: {
    featuredItems: true,
    testimonials: true
  },
  reservationsEnabled: true,
};

export default function GeneralSettings() {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [establishmentData, setEstablishmentData] = useState<EstablishmentData>(defaultEstablishmentData);
  const { settings} = useSiteSettings();
  const corPrimaria = settings?.primaryColor || '';
  // Carregar dados do Firebase
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getGeneralSettings();
        if (data) {
          setEstablishmentData({ ...defaultEstablishmentData, ...data });
        }
      } catch (error) {
        console.error('Erro ao carregar configurações:', error);
      }
    };

    fetchData();
  }, []);

  // Garantir que todos os valores sejam strings
  const safeValue = (value: any): string => {
    return value?.toString() || '';
  };

  // Função específica para atualizar o produto em destaque
  const updateFeaturedProduct = (field: string, value: string) => {
    const currentFeaturedProduct = establishmentData.featuredProduct || {
      title: '',
      description: '',
      image: '',
      year: ''
    };

    const updatedFeaturedProduct = {
      ...currentFeaturedProduct,
      [field]: value
    };

    setEstablishmentData(prev => ({
      ...prev,
      featuredProduct: updatedFeaturedProduct
    }));
  };

  const updateEstablishmentData = (field: string, value: any) => {
    setEstablishmentData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateSocialMedia = (platform: string, url: string) => {
    setEstablishmentData(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: url
      }
    }));
  };

  const updateSchedule = (period: string, time: string) => {
    setEstablishmentData(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [period]: time
      }
    }));
  };

  const updateSectionVisibility = (section: string, visible: boolean) => {
    setEstablishmentData(prev => ({
      ...prev,
      sectionVisibility: {
        ...prev.sectionVisibility,
        [section]: visible
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const success = await saveGeneralSettings(establishmentData);

      if (success) {
        toast({
          title: "Configurações salvas",
          description: "As configurações gerais foram atualizadas com sucesso",
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
          <h2 className="text-2xl font-bold mb-6" style={{ color: corPrimaria }}>Informações do Estabelecimento</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome do Estabelecimento</Label>
                <Input
                  id="name"
                  value={safeValue(establishmentData.name)}
                  onChange={(e) => updateEstablishmentData('name', e.target.value)}
                  placeholder="Nome do seu estabelecimento"
                />
              </div>

              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={safeValue(establishmentData.description)}
                  onChange={(e) => updateEstablishmentData('description', e.target.value)}
                  placeholder="Descreva seu estabelecimento"
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  value={safeValue(establishmentData.address)}
                  onChange={(e) => updateEstablishmentData('address', e.target.value)}
                  placeholder="Endereço completo"
                />
              </div>

              <div>
                <Label htmlFor="mapsUrl">Link do Google Maps</Label>
                <Input
                  id="mapsUrl"
                  type="text"
                  value={safeValue(establishmentData.mapsUrl)}
                  onChange={(e) => updateEstablishmentData('mapsUrl', e.target.value)}
                  placeholder="https://maps.google.com/..."
                />
              </div>
              <div>
                <Label htmlFor="type">Tipo de Estabelecimento</Label>
                <Select
                  value={establishmentData.type || ""}
                  onValueChange={(value) => updateEstablishmentData("type", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Lanchonete">Lanchonete</SelectItem>
                    <SelectItem value="Restaurante">Restaurante</SelectItem>
                    <SelectItem value="Pizzaria">Pizzaria</SelectItem>
                    <SelectItem value="Cafeteria">Cafeteria</SelectItem>
                    <SelectItem value="Sorveteria">Sorveteria</SelectItem>
                    <SelectItem value="Outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={safeValue(establishmentData.phone)}
                  onChange={(e) => updateEstablishmentData('phone', e.target.value)}
                  placeholder="(00) 0000-0000"
                />
              </div>

              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={safeValue(establishmentData.email)}
                  onChange={(e) => updateEstablishmentData('email', e.target.value)}
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <Label htmlFor="menuUrl">Link do Cardápio</Label>
                <Input
                  id="menuUrl"
                  type="url"
                  value={safeValue(establishmentData.menuUrl)}
                  onChange={(e) => updateEstablishmentData('menuUrl', e.target.value)}
                  placeholder="https://exemplo.com/cardapio"
                />
              </div>

{/*               <div>
                <Label>Logo</Label>
                <ImageUpload
                  value={safeValue(establishmentData.logo)}
                  onChange={(url) => updateEstablishmentData('logo', url)}
                />
              </div> */}
            </div>
          </div>
          <div className="mt-6 flex items-center gap-4">
            <Switch
              checked={establishmentData.reservationsEnabled}
              onCheckedChange={(checked) => updateEstablishmentData('reservationsEnabled', checked)}
              id="reservationsEnabled"
            />
            <Label htmlFor="reservationsEnabled" className="text-base font-medium">
              Permitir reservas online
            </Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-6" style={{ color: corPrimaria }}>Produto em Destaque</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="featuredTitle">Título do Produto</Label>
                <Input
                  id="featuredTitle"
                  type="text"
                  value={safeValue(establishmentData?.featuredProduct?.title)}
                  onChange={(e) => updateFeaturedProduct('title', e.target.value)}
                  placeholder="Nome do produto em destaque"
                />
              </div>

              <div>
                <Label htmlFor="featuredYear">Ano do Produto</Label>
                <Input
                  id="featuredYear"
                  type="number"
                  min="1900"
                  max={new Date().getFullYear()}
                  value={safeValue(establishmentData?.featuredProduct?.year)}
                  onChange={(e) => updateFeaturedProduct('year', e.target.value)}
                  placeholder="Ex: 2024"
                />
              </div>

              <div>
                <Label htmlFor="featuredDescription">Descrição do Produto</Label>
                <Textarea
                  id="featuredDescription"
                  value={safeValue(establishmentData?.featuredProduct?.description)}
                  onChange={(e) => updateFeaturedProduct('description', e.target.value)}
                  placeholder="Descreva o produto em destaque"
                  rows={4}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Imagem do Produto</Label>
                <ImageUpload              
                  value={safeValue(establishmentData?.featuredProduct?.image)}
                  onChange={(url) => updateFeaturedProduct('image', url)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-6" style={{ color: corPrimaria }}>Visibilidade das Seções</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                {establishmentData.sectionVisibility.featuredItems ? (
                  <Eye className="h-5 w-5 text-green-600" />
                ) : (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                )}
                <div>
                  <Label className="text-base font-medium">Menu de Destaque</Label>
                  <p className="text-sm text-gray-500">Exibir seção de produtos em destaque</p>
                </div>
              </div>
              <Switch
                checked={establishmentData.sectionVisibility.featuredItems}
                onCheckedChange={(checked) => updateSectionVisibility('featuredItems', checked)}
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                {establishmentData.sectionVisibility.testimonials ? (
                  <Eye className="h-5 w-5 text-green-600" />
                ) : (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                )}
                <div>
                  <Label className="text-base font-medium">O Que Dizem Nossos Clientes</Label>
                  <p className="text-sm text-gray-500">Exibir seção de depoimentos</p>
                </div>
              </div>
              <Switch
                checked={establishmentData.sectionVisibility.testimonials}
                onCheckedChange={(checked) => updateSectionVisibility('testimonials', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-6" style={{ color: corPrimaria }}>Horário de Funcionamento</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="weekdays">Dias de Semana</Label>
              <Input
                id="weekdays"
                value={safeValue(establishmentData.schedule.weekdays)}
                onChange={(e) => updateSchedule('weekdays', e.target.value)}
                placeholder="Ex: 11h às 22h"
              />
            </div>

            <div>
              <Label htmlFor="weekends">Finais de Semana</Label>
              <Input
                id="weekends"
                value={safeValue(establishmentData.schedule.weekends)}
                onChange={(e) => updateSchedule('weekends', e.target.value)}
                placeholder="Ex: 12h às 23h"
              />
            </div>

            <div>
              <Label htmlFor="holidays">Feriados</Label>
              <Input
                id="holidays"
                value={safeValue(establishmentData.schedule.holidays)}
                onChange={(e) => updateSchedule('holidays', e.target.value)}
                placeholder="Ex: 12h às 20h"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-6" style={{ color: corPrimaria }}>Redes Sociais</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="facebook">Facebook</Label>
              <Input
                id="facebook"
                value={safeValue(establishmentData.socialMedia.facebook)}
                onChange={(e) => updateSocialMedia('facebook', e.target.value)}
                placeholder="https://facebook.com/seu-perfil"
              />
            </div>

            <div>
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                value={safeValue(establishmentData.socialMedia.instagram)}
                onChange={(e) => updateSocialMedia('instagram', e.target.value)}
                placeholder="https://instagram.com/seu-perfil"
              />
            </div>

            <div>
              <Label htmlFor="youtube">YouTube</Label>
              <Input
                id="youtube"
                value={safeValue(establishmentData.socialMedia.youtube)}
                onChange={(e) => updateSocialMedia('youtube', e.target.value)}
                placeholder="https://youtube.com/seu-canal"
              />
            </div>

            <div>
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                value={safeValue(establishmentData.socialMedia.linkedin)}
                onChange={(e) => updateSocialMedia('linkedin', e.target.value)}
                placeholder="https://linkedin.com/seu-perfil"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <button className='py-2 px-4 rounded-lg font-medium' style={{ backgroundColor: corPrimaria , color: 'white' }} type="submit" disabled={isSaving}>
          {isSaving ? "Salvando..." : "Salvar Alterações"}
        </button>
      </div>
    </form>
  );
}
