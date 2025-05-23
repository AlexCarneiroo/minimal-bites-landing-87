
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Settings, 
  Users, 
  Home, 
  Clock, 
  Mail, 
  Phone, 
  MapPin,
  Facebook,
  Instagram,
  Youtube,
  Linkedin,
  Image as ImageIcon
} from 'lucide-react';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import AdminLogin from '@/components/AdminLogin';
import ColorPicker from '@/components/ColorPicker';
import { useToast } from '@/hooks/use-toast';

// Dados mockados para o exemplo - será substituído por dados reais do Supabase
const mockReservations = [
  { id: 1, name: 'João Silva', date: '2025-05-25', time: '19:00', people: 4, phone: '(11) 98765-4321', status: 'Confirmada' },
  { id: 2, name: 'Maria Oliveira', date: '2025-05-26', time: '20:00', people: 2, phone: '(11) 91234-5678', status: 'Pendente' },
  { id: 3, name: 'Pedro Santos', date: '2025-05-27', time: '19:30', people: 6, phone: '(11) 99876-5432', status: 'Confirmada' },
];

const Admin = () => {
  // Simulação de autenticação
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

  const [primaryColor, setPrimaryColor] = useState('#0066cc'); // Cor inicial
  const [heroImage, setHeroImage] = useState('https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&q=80&w=800');

  // Função simulando login
  const handleLogin = (username: string, password: string) => {
    // Em produção, isso seria verificado no backend
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

  // Verifica se o usuário está logado ao carregar a página
  useEffect(() => {
    const auth = localStorage.getItem('admin_authenticated');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Função para sair
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_authenticated');
    navigate('/');
  };

  // Função para salvar as alterações
  const handleSave = (section: string) => {
    // Aqui enviaríamos os dados para o backend
    toast({
      title: "Alterações salvas",
      description: `Seção ${section} atualizada com sucesso`,
    });
    
    // Na implementação real, salvar no banco de dados Supabase
    console.log('Dados salvos:', { establishmentData, primaryColor });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Na implementação real, fazer upload para Supabase Storage
      // Por enquanto, criar uma URL local temporária
      const tempUrl = URL.createObjectURL(file);
      setHeroImage(tempUrl);
      toast({
        title: "Imagem carregada",
        description: "A nova imagem foi adicionada",
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

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-snackbar-dark text-white p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Settings className="w-6 h-6" />
          <h1 className="text-xl font-bold">Painel Administrativo</h1>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => navigate('/')}>
            <Home className="mr-2 h-4 w-4" />
            Ver Site
          </Button>
          <Button variant="destructive" onClick={handleLogout}>Sair</Button>
        </div>
      </header>
      
      <main className="container mx-auto p-4 md:p-6">
        <Tabs defaultValue="general" className="space-y-4">
          <TabsList className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <TabsTrigger value="general">Geral</TabsTrigger>
            <TabsTrigger value="appearance">Aparência</TabsTrigger>
            <TabsTrigger value="reservations">Reservas</TabsTrigger>
            <TabsTrigger value="special-offers">Ofertas Especiais</TabsTrigger>
          </TabsList>
          
          {/* Aba Geral */}
          <TabsContent value="general" className="space-y-4">
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
          </TabsContent>
          
          {/* Aba Aparência */}
          <TabsContent value="appearance" className="space-y-4">
            <h2 className="text-2xl font-bold">Aparência</h2>
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Cor Principal</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Esta cor será aplicada nos elementos destacados do site.
                    </p>
                    <ColorPicker 
                      color={primaryColor} 
                      onChange={setPrimaryColor}
                      onSave={() => handleSave('cor')}
                    />
                    
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">Prévia</p>
                      <div className="flex gap-2 items-center">
                        <div className="h-10 w-10 rounded" style={{ backgroundColor: primaryColor }}></div>
                        <span>{primaryColor}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Imagem Principal (Hero)</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Esta imagem aparece na seção de destaque da página inicial.
                    </p>
                    
                    <div className="border border-gray-200 rounded p-4">
                      <img 
                        src={heroImage} 
                        alt="Imagem principal" 
                        className="w-full h-48 object-cover rounded mb-4" 
                      />
                      
                      <label htmlFor="hero-image" className="cursor-pointer">
                        <div className="flex items-center gap-2 text-sm text-blue-600">
                          <ImageIcon className="h-4 w-4" />
                          <span>Alterar imagem</span>
                        </div>
                        <input 
                          id="hero-image" 
                          type="file" 
                          accept="image/*" 
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <Button onClick={() => handleSave('aparência')}>Salvar Alterações</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Aba Reservas */}
          <TabsContent value="reservations" className="space-y-4">
            <h2 className="text-2xl font-bold">Gerenciar Reservas</h2>
            <Card>
              <CardContent className="p-6">
                <Table>
                  <TableCaption>Lista de reservas recentes</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Horário</TableHead>
                      <TableHead>Pessoas</TableHead>
                      <TableHead>Telefone</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockReservations.map((reservation) => (
                      <TableRow key={reservation.id}>
                        <TableCell>{reservation.id}</TableCell>
                        <TableCell>{reservation.name}</TableCell>
                        <TableCell>{reservation.date}</TableCell>
                        <TableCell>{reservation.time}</TableCell>
                        <TableCell>{reservation.people}</TableCell>
                        <TableCell>{reservation.phone}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-xs ${
                            reservation.status === 'Confirmada' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {reservation.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">Confirmar</Button>
                            <Button variant="outline" size="sm" className="text-red-500">Cancelar</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Aba Ofertas Especiais */}
          <TabsContent value="special-offers" className="space-y-4">
            <h2 className="text-2xl font-bold">Ofertas Especiais</h2>
            <Card>
              <CardContent className="p-6">
                <p className="text-gray-500 mb-4">
                  Gerencie as ofertas especiais que aparecerão no site.
                </p>
                
                <div className="mt-4">
                  <Button>Adicionar Nova Oferta</Button>
                </div>
                
                <div className="mt-6">
                  <p className="text-sm text-gray-500">
                    As ofertas especiais serão exibidas após a implementação do banco de dados.
                    Conecte seu projeto ao Supabase para habilitar esta funcionalidade.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
