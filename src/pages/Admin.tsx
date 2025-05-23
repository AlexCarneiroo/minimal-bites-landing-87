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
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from '@/hooks/use-toast';

// Dados mockados para o exemplo - será substituído por dados reais do banco de dados
const mockReservations = [
  { id: 1, name: 'João Silva', date: '2025-05-25', time: '19:00', people: 4, phone: '(11) 98765-4321', status: 'Confirmada' },
  { id: 2, name: 'Maria Oliveira', date: '2025-05-26', time: '20:00', people: 2, phone: '(11) 91234-5678', status: 'Pendente' },
  { id: 3, name: 'Pedro Santos', date: '2025-05-27', time: '19:30', people: 6, phone: '(11) 99876-5432', status: 'Confirmada' },
];

// Ofertas especiais iniciais
const initialOffers = [
  { 
    id: '1', 
    name: 'Combo Família', 
    description: '4 hambúrgueres, 4 batatas e 4 refrigerantes',
    regularPrice: 150.00,
    promoPrice: 120.00,
    discount: '-20%',
    label: null,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=600'
  },
  { 
    id: '2', 
    name: 'Lanches Vegetarianos', 
    description: 'Opções saudáveis e deliciosas para todos os gostos',
    regularPrice: 25.90,
    promoPrice: null,
    discount: null,
    label: 'NEW',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&q=80&w=600'
  },
  { 
    id: '3', 
    name: 'Happy Hour', 
    description: 'Compre um milk shake e ganhe outro, todos os dias das 15h às 17h',
    regularPrice: 16.90,
    promoPrice: null,
    discount: null,
    label: '2x1',
    image: 'https://images.unsplash.com/photo-1638176066623-b5b2f71da06c?auto=format&fit=crop&q=80&w=600'
  },
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
  const [heroImage, setHeroImage] = useState('https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&q=80&w=800');
  const [specialOffers, setSpecialOffers] = useState(initialOffers);

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

  const handleSave = (section: string) => {
    toast({
      title: "Alterações salvas",
      description: `Seção ${section} atualizada com sucesso`,
    });
    console.log('Dados salvos:', { establishmentData, primaryColor });
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
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader onLogout={handleLogout} />
      
      <main className="container mx-auto p-4 md:p-6">
        <Tabs defaultValue="general" className="space-y-4">
          <TabsList className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <TabsTrigger value="general">Geral</TabsTrigger>
            <TabsTrigger value="appearance">Aparência</TabsTrigger>
            <TabsTrigger value="reservations">Reservas</TabsTrigger>
            <TabsTrigger value="special-offers">Ofertas Especiais</TabsTrigger>
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
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
