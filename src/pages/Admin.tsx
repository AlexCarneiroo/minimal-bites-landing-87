
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
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

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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

  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 }
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <AdminHeader onLogout={handleLogout} />
      
      <main className="container mx-auto p-4 md:p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="grid grid-cols-1 md:grid-cols-8 gap-2 p-1 bg-white/50 backdrop-blur-sm rounded-xl shadow-sm">
              {[
                { value: "general", label: "Geral" },
                { value: "appearance", label: "Aparência" },
                { value: "featured-product", label: "Produto" },
                { value: "reservations", label: "Reservas" },
                { value: "special-offers", label: "Ofertas" },
                { value: "feedbacks", label: "Feedbacks" },
                { value: "about", label: "Sobre" },
                { value: "footer", label: "Footer" }
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className={cn(
                    "data-[state=active]:bg-white data-[state=active]:text-primary",
                    "data-[state=active]:shadow-sm transition-all duration-200",
                    "hover:bg-white/50"
                  )}
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            
            <AnimatePresence mode="wait">
              <TabsContent value="general">
                <motion.div
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <GeneralSettings />
                </motion.div>
              </TabsContent>
              
              <TabsContent value="appearance">
                <motion.div
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <AppearanceSettings />
                </motion.div>
              </TabsContent>

              <TabsContent value="featured-product">
                <motion.div
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold">Produto em Destaque</h2>
                    <motion.div
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <FeaturedProductSettings />
                    </motion.div>
                  </div>
                </motion.div>
              </TabsContent>

              <TabsContent value="reservations">
                <motion.div
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold">Gerenciar Reservas</h2>
                    <motion.div
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow duration-300">
                        <CardContent className="p-6">
                          <ReservationManager />
                        </CardContent>
                      </Card>
                    </motion.div>
                  </div>
                </motion.div>
              </TabsContent>
              
              <TabsContent value="special-offers">
                <motion.div
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-bold">Gerenciar Produtos</h2>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          variant={specialOffers.enabled ? "default" : "secondary"}
                          onClick={() => toggleSection('special-offers')}
                          className="transition-all duration-200 bg-primary hover:bg-primary/90 text-white"
                        >
                          {specialOffers.enabled ? "Desabilitar Seção" : "Habilitar Seção"}
                        </Button>
                      </motion.div>
                    </div>
                    <motion.div
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow duration-300">
                        <CardContent className="p-6">
                          <SpecialOfferEditor 
                            enabled={specialOffers.enabled}
                            onSave={handleUpdateOffers}
                          />
                        </CardContent>
                      </Card>
                    </motion.div>
                  </div>
                </motion.div>
              </TabsContent>
              
              <TabsContent value="feedbacks">
                <motion.div
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-bold">Gerenciar Feedbacks</h2>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          variant={feedbacks.enabled ? "default" : "secondary"}
                          onClick={() => toggleSection('feedbacks')}
                          className="transition-all duration-200 bg-primary hover:bg-primary/90 text-white"
                        >
                          {feedbacks.enabled ? "Desabilitar Seção" : "Habilitar Seção"}
                        </Button>
                      </motion.div>
                    </div>
                    <motion.div
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow duration-300">
                        <CardContent className="p-6">
                          <FeedbackManager 
                            enabled={feedbacks.enabled}
                            onSave={handleUpdateFeedbacks} 
                          />
                        </CardContent>
                      </Card>
                    </motion.div>
                  </div>
                </motion.div>
              </TabsContent>
              
              <TabsContent value="about">
                <motion.div
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold">Seção Sobre Nós</h2>
                    <motion.div
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow duration-300">
                        <CardContent className="p-6">
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
                  </div>
                </motion.div>
              </TabsContent>
              
              <TabsContent value="footer">
                <motion.div
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold">Configurações do Footer</h2>
                    <motion.div
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow duration-300">
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
                    </motion.div>
                  </div>
                </motion.div>
              </TabsContent>
            </AnimatePresence>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
};

export default Admin;
