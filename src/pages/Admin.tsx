
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  Palette, 
  Star, 
  Calendar, 
  Tag, 
  MessageCircle, 
  Info, 
  SquareKanban 
} from "lucide-react";
import AdminLogin from '@/components/AdminLogin';
import AdminHeader from '@/components/admin/AdminHeader';
import GeneralSettings from '@/components/admin/GeneralSettings';
import AppearanceSettings from '@/components/admin/AppearanceSettings';
import ReservationManager from '@/components/admin/ReservationManager';
import SpecialOfferEditor from '@/components/SpecialOfferEditor';
import FeedbackManager from '@/components/admin/FeedbackManager';
import AboutSection from '@/components/admin/AboutSection';
import FeaturedProductSettings from '@/components/admin/FeaturedProductSettings';
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from '@/hooks/use-toast';
import { getSiteSettings, saveSiteSettings, SiteSettings } from '@/lib/site-settings';
import FooterSettings from '@/components/admin/FooterSettings';
import { Button } from "@/components/ui/button";
import { saveFooterSettings, getFooterSettings } from '@/lib/firebase-operations';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const navigate = useNavigate();
  const { toast } = useToast();

  const [specialOffers, setSpecialOffers] = useState({
    enabled: true,
    items: []
  });
  const [feedbacks, setFeedbacks] = useState({
    enabled: true,
    items: []
  });
  const [aboutData, setAboutData] = useState({
    title: 'Sobre Nós',
    description: 'Descrição da empresa',
    images: [],
    spaceImages: []
  });

  const [footerData, setFooterData] = useState({
    copyright: '© 2024 Todos os direitos reservados.',
    companyName: 'Nome da Empresa',
    additionalText: 'Texto adicional do footer'
  });

  useEffect(() => {
    const fetchData = async () => {
      const data = await getFooterSettings();
      if (data) {
        setFooterData(data as {
          copyright: string;
          companyName: string;
          additionalText: string;
        });
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const loadSettings = async () => {
      const settings = await getSiteSettings();
      if (settings) {
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

  const handleUpdateOffers = (newOffers: any) => {
    setSpecialOffers(newOffers);
    handleSave('special-offers');
  };

  const handleUpdateFeedbacks = (newFeedbacks: any) => {
    setFeedbacks(newFeedbacks);
    handleSave('feedbacks');
  };

  const handleUpdateAbout = (data: {
    title: string;
    description: string;
    images: string[];
    spaceImages: string[];
  }) => {
    setAboutData(data);
    handleSave('about');
  };

  const toggleSection = async (section: 'feedbacks' | 'special-offers') => {
    try {
      const settings: Partial<SiteSettings> = {};

      if (section === 'feedbacks') {
        const newState = { ...feedbacks, enabled: !feedbacks.enabled };
        setFeedbacks(newState);
        settings.feedbacks = newState;
      } else {
        const newState = { ...specialOffers, enabled: !specialOffers.enabled };
        setSpecialOffers(newState);
        settings.specialOffers = newState;
      }

      await saveSiteSettings(settings);

      toast({
        title: "Seção atualizada",
        description: `A seção foi ${settings[section]?.enabled ? 'habilitada' : 'desabilitada'} com sucesso`,
      });
    } catch (error) {
      console.error('Erro ao atualizar seção:', error);
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar o estado da seção",
        variant: "destructive",
      });
    }
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  const tabs = [
    { value: "general", label: "Geral", icon: LayoutDashboard },
    { value: "appearance", label: "Aparência", icon: Palette },
    { value: "featured-product", label: "Produto", icon: Star },
    { value: "reservations", label: "Reservas", icon: Calendar },
    { value: "special-offers", label: "Ofertas", icon: Tag },
    { value: "feedbacks", label: "Feedbacks", icon: MessageCircle },
    { value: "about", label: "Sobre", icon: Info },
    { value: "footer", label: "Footer", icon: SquareKanban },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <AdminHeader onLogout={handleLogout} />

      <div className="container mx-auto p-6">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex flex-col md:flex-row gap-6"
        >
          <TabsList className="flex md:flex-col w-full md:w-56 shrink-0 gap-2 overflow-x-auto md:overflow-visible p-4 bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all hover:bg-white/50 data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:shadow-lg"
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </TabsTrigger>
              );
            })}
          </TabsList>

          <div className="flex-1">
            <AnimatePresence mode="wait">
              <TabsContent value="general">
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-xl"
                >
                  <GeneralSettings />
                </motion.div>
              </TabsContent>

              <TabsContent value="appearance">
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-xl"
                >
                  <AppearanceSettings />
                </motion.div>
              </TabsContent>

              <TabsContent value="featured-product">
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-xl space-y-4"
                >
                  <h2 className="text-2xl font-bold">Produto em Destaque</h2>
                  <FeaturedProductSettings />
                </motion.div>
              </TabsContent>

              <TabsContent value="reservations">
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-xl space-y-4"
                >
                  <h2 className="text-2xl font-bold">Gerenciar Reservas</h2>
                  <Card className="bg-white/80 backdrop-blur-md">
                    <CardContent className="p-4">
                      <ReservationManager />
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="special-offers">
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-xl space-y-4"
                >
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Gerenciar Produtos</h2>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant={specialOffers.enabled ? "gradient" : "secondary"}
                        onClick={() => toggleSection('special-offers')}
                        className="text-white"
                      >
                        {specialOffers.enabled ? "Desabilitar Seção" : "Habilitar Seção"}
                      </Button>
                    </motion.div>
                  </div>
                  <Card className="bg-white/80 backdrop-blur-md">
                    <CardContent className="p-4">
                      <SpecialOfferEditor
                        enabled={specialOffers.enabled}
                        onSave={handleUpdateOffers}
                      />
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="feedbacks">
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-xl space-y-4"
                >
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Gerenciar Feedbacks</h2>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant={feedbacks.enabled ? "gradient" : "secondary"}
                        onClick={() => toggleSection('feedbacks')}
                        className="text-white"
                      >
                        {feedbacks.enabled ? "Desabilitar Seção" : "Habilitar Seção"}
                      </Button>
                    </motion.div>
                  </div>
                  <Card className="bg-white/80 backdrop-blur-md">
                    <CardContent className="p-4">
                      <FeedbackManager
                        enabled={feedbacks.enabled}
                        onSave={handleUpdateFeedbacks}
                      />
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="about">
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-xl space-y-4"
                >
                  <h2 className="text-2xl font-bold">Seção Sobre Nós</h2>
                  <Card className="bg-white/80 backdrop-blur-md">
                    <CardContent className="p-4">
                      <AboutSection
                        title={aboutData.title}
                        description={aboutData.description}
                        images={aboutData.images}
                        spaceImages={aboutData.spaceImages}
                        onSave={handleUpdateAbout}
                      />
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="footer">
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-xl space-y-4"
                >
                  <h2 className="text-2xl font-bold">Configurações do Footer</h2>
                  <Card className="bg-white/80 backdrop-blur-md">
                    <CardContent className="p-4">
                      <FooterSettings
                        footerData={footerData}
                        onSave={async (data) => {
                          const success = await saveFooterSettings(data);
                          if (success) {
                            setFooterData(data);
                          }
                        }}
                      />
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            </AnimatePresence>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
