import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import AdminLogin from '@/components/AdminLogin';
import AdminHeader from '@/components/admin/AdminHeader';
import GeneralSettings from '@/components/admin/GeneralSettings';
import AppearanceSettings from '@/components/admin/AppearanceSettings';
import ReservationsManager from '@/components/admin/ReservationsManager';
import SpecialOfferEditor from '@/components/SpecialOfferEditor';
import FeedbackManager from '@/components/admin/FeedbackManager';
import AboutSection from '@/components/admin/AboutSection';
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from '@/hooks/use-toast';
import { getSiteSettings, saveSiteSettings, SiteSettings } from '@/lib/site-settings';
import FooterSettings from '@/components/admin/FooterSettings';

// Dados mockados para o exemplo - será substituído por dados reais do banco de dados
const mockReservations = [
  { id: 1, name: 'João Silva', date: '2025-05-25', time: '19:00', people: 4, phone: '(11) 98765-4321', status: 'Confirmada' },
  { id: 2, name: 'Maria Oliveira', date: '2025-05-26', time: '20:00', people: 2, phone: '(11) 91234-5678', status: 'Pendente' },
  { id: 3, name: 'Pedro Santos', date: '2025-05-27', time: '19:30', people: 6, phone: '(11) 99876-5432', status: 'Confirmada' },
];

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Estados para os dados do estabelecimento
  const [establishmentData, setEstablishmentData] = useState({
    name: 'Paizam',
    description: 'Lanches artesanais feitos com ingredientes frescos e muito carinho para você.',
    address: 'Av. Exemplo, 123 - Centro',
    phone: '(51) 3740 2900',
    email: 'contato@paizam.com.br',
    logo: '',
    schedule: {
      weekdays: '11h às 22h',
      weekends: '12h às 23h',
      holidays: '12h às 20h',
    },
    socialMedia: {
      facebook: 'https://facebook.com',
      instagram: 'https://instagram.com',
      youtube: 'https://youtube.com',
      linkedin: 'https://linkedin.com',
    }
  });

  const [primaryColor, setPrimaryColor] = useState('#0066cc');
  const [heroImage, setHeroImage] = useState('');
  const [specialOffers, setSpecialOffers] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [aboutData, setAboutData] = useState({
    title: 'Sobre Nós',
    description: 'Descrição da empresa',
    image: ''
  });

  const [footerData, setFooterData] = useState({
    copyright: '© 2024 Todos os direitos reservados.',
    companyName: 'Nome da Empresa',
    additionalText: 'Texto adicional do footer'
  });

  useEffect(() => {
    const loadSettings = async () => {
      const settings = await getSiteSettings();
      if (settings) {
        // Carregar dados do estabelecimento
        if (settings.establishmentData) {
          setEstablishmentData(settings.establishmentData);
        }

        // Carregar configurações de aparência
        setPrimaryColor(settings.primaryColor || '#0066cc');
        setHeroImage(settings.heroImage || '');

        // Carregar dados sobre
        if (settings.about) {
          setAboutData(settings.about);
        }

        // Carregar feedbacks
        if (settings.feedbacks) {
          setFeedbacks(settings.feedbacks);
        }

        // Carregar ofertas especiais
        if (settings.specialOffers) {
          setSpecialOffers(settings.specialOffers);
        }

        // Carregar dados do footer
        if (settings.footer) {
          setFooterData(settings.footer);
        }
      }
    };

    loadSettings();
  }, []);

  // Função simulando login
  const handleLogin = (username: string, password: string) => {
    if (username === 'admin' && password === 'admin') {
      setIsAuthenticated(true);
      localStorage.setItem('admin_authenticated', 'true');
      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo ao painel administrativo",
      });
    } else {
      toast({
        title: "Erro no login",
        description: "Credenciais inválidas",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const auth = localStorage.getItem('admin_authenticated');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_authenticated');
    navigate('/');
  };

  const handleSave = async (section: string) => {
    try {
      const settings: Partial<SiteSettings> = {};
      
      switch (section) {
        case 'general':
          settings.establishmentData = establishmentData;
          break;
        case 'appearance':
          settings.primaryColor = primaryColor;
          settings.heroImage = heroImage;
          break;
        case 'about':
          settings.about = aboutData;
          break;
        case 'feedbacks':
          settings.feedbacks = feedbacks;
          break;
        case 'special-offers':
          settings.specialOffers = specialOffers;
          break;
        case 'footer':
          settings.footer = footerData;
          break;
      }

      await saveSiteSettings(settings);
      
      toast({
        title: "Alterações salvas",
        description: `Seção ${section} atualizada com sucesso`,
      });
    } catch (error) {
      console.error('Erro ao salvar:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as alterações",
        variant: "destructive",
      });
    }
  };

  const updateEstablishmentData = (field: string, value: string) => {
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

  const handleUpdateOffers = (newOffers: any[]) => {
    setSpecialOffers(newOffers);
    handleSave('special-offers');
  };

  const handleUpdateFeedbacks = (newFeedbacks: any[]) => {
    setFeedbacks(newFeedbacks);
    handleSave('feedbacks');
  };

  const handleUpdateAbout = (data: { title: string; description: string; image: string }) => {
    setAboutData(data);
    handleSave('about');
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader onLogout={handleLogout} />
      
      <main className="container mx-auto p-4 md:p-6">
        <Tabs defaultValue="general" className="space-y-4">
          <TabsList className="grid grid-cols-1 md:grid-cols-7 gap-2">
            <TabsTrigger value="general">Geral</TabsTrigger>
            <TabsTrigger value="appearance">Aparência</TabsTrigger>
            <TabsTrigger value="reservations">Reservas</TabsTrigger>
            <TabsTrigger value="special-offers">Ofertas Especiais</TabsTrigger>
            <TabsTrigger value="feedbacks">Feedbacks</TabsTrigger>
            <TabsTrigger value="about">Sobre Nós</TabsTrigger>
            <TabsTrigger value="footer">Footer</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <GeneralSettings
              establishmentData={establishmentData}
              updateEstablishmentData={updateEstablishmentData}
              updateSocialMedia={updateSocialMedia}
              updateSchedule={updateSchedule}
              handleSave={handleSave}
            />
          </TabsContent>
          
          <TabsContent value="appearance">
            <AppearanceSettings
              primaryColor={primaryColor}
              setPrimaryColor={setPrimaryColor}
              heroImage={heroImage}
              setHeroImage={setHeroImage}
              handleSave={handleSave}
            />
          </TabsContent>
          
          <TabsContent value="reservations">
            <ReservationsManager reservations={mockReservations} />
          </TabsContent>
          
          <TabsContent value="special-offers">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Ofertas Especiais</h2>
              <Card>
                <CardContent className="p-6">
                  <SpecialOfferEditor 
                    initialOffers={specialOffers} 
                    onSave={handleUpdateOffers} 
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="feedbacks">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Gerenciar Feedbacks</h2>
              <Card>
                <CardContent className="p-6">
                  <FeedbackManager onSave={handleUpdateFeedbacks} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="about">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Seção Sobre Nós</h2>
              <AboutSection
                title={aboutData.title}
                description={aboutData.description}
                image={aboutData.image}
                onSave={handleUpdateAbout}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="footer">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Configurações do Footer</h2>
              <Card>
                <CardContent className="p-6">
                  <FooterSettings
                    footerData={footerData}
                    onSave={(data) => {
                      setFooterData(data);
                      handleSave('footer');
                    }}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
