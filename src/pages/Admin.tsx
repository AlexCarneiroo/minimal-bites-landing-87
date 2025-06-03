
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeProvider } from '@/contexts/ThemeContext';
import AdminLogin from '@/components/AdminLogin';
import AdminHeader from '@/components/admin/AdminHeader';
import GeneralSettings from '@/components/admin/GeneralSettings';
import AppearanceSettings from '@/components/admin/AppearanceSettings';
import AboutSection from '@/components/admin/AboutSection';
import ReservationManager from '@/components/admin/ReservationManager';
import FeedbackManager from '@/components/admin/FeedbackManager';
import SpecialOfferManager from '@/components/admin/SpecialOfferManager';
import FooterManager from '@/components/admin/FooterManager';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';
import { useToast } from "@/hooks/use-toast";
import { SiteSettings } from '@/lib/site-settings';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const { settings, updateSettings } = useSiteSettings();
  const { toast } = useToast();

  useEffect(() => {
    const storedAuth = localStorage.getItem('isAuthenticated');
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('isAuthenticated', isAuthenticated.toString());
  }, [isAuthenticated]);

  const handleLogin = (username: string, password: string) => {
    if (username === 'admin' && password === 'admin') {
      setIsAuthenticated(true);
      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo ao painel administrativo",
      });
    } else {
      toast({
        title: "Erro no login",
        description: "Usuário ou senha incorretos",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    toast({
      title: "Logout realizado",
      description: "Até logo!",
    });
  };

  const handleSave = async (section: string) => {
    try {
      toast({
        title: "Configurações salvas",
        description: "As alterações foram salvas com sucesso",
      });
    } catch (error) {
      console.error('Erro ao salvar:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações",
        variant: "destructive",
      });
    }
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen">
        <AdminHeader onLogout={handleLogout} />
        
        <motion.div 
          className="container mx-auto px-6 py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <TabsList className="grid w-full grid-cols-7 gap-2 p-2 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl">
                <TabsTrigger 
                  value="general" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-xl font-semibold transition-all duration-300"
                >
                  Geral
                </TabsTrigger>
                <TabsTrigger 
                  value="appearance" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-xl font-semibold transition-all duration-300"
                >
                  Aparência
                </TabsTrigger>
                <TabsTrigger 
                  value="about" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-xl font-semibold transition-all duration-300"
                >
                  Sobre
                </TabsTrigger>
                <TabsTrigger 
                  value="reservations" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-xl font-semibold transition-all duration-300"
                >
                  Reservas
                </TabsTrigger>
                <TabsTrigger 
                  value="feedback" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-xl font-semibold transition-all duration-300"
                >
                  Depoimentos
                </TabsTrigger>
                <TabsTrigger 
                  value="offers" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-xl font-semibold transition-all duration-300"
                >
                  Ofertas
                </TabsTrigger>
                <TabsTrigger 
                  value="footer" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-xl font-semibold transition-all duration-300"
                >
                  Rodapé
                </TabsTrigger>
              </TabsList>
            </motion.div>

            <AnimatePresence mode="wait">
              <TabsContent value="general" className="space-y-6">
                <motion.div
                  key="general"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <GeneralSettings
                    establishmentData={settings?.establishmentData}
                    onSave={(data) => {
                      updateSettings({ establishmentData: data });
                      handleSave('general');
                    }}
                  />
                </motion.div>
              </TabsContent>

              <TabsContent value="appearance" className="space-y-6">
                <motion.div
                  key="appearance"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <AppearanceSettings
                    primaryColor={settings?.primaryColor || '#0066cc'}
                    setPrimaryColor={(color) => updateSettings({ primaryColor: color })}
                    heroImage={settings?.heroImage || ''}
                    setHeroImage={(url) => updateSettings({ heroImage: url })}
                    handleSave={handleSave}
                  />
                </motion.div>
              </TabsContent>

              <TabsContent value="about" className="space-y-6">
                <motion.div
                  key="about"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <AboutSection
                    title={settings?.about?.title || ''}
                    description={settings?.about?.description || ''}
                    images={settings?.about?.images || []}
                    spaceImages={settings?.about?.spaceImages || []}
                    onSave={(data) => {
                      updateSettings({ about: data });
                      handleSave('about');
                    }}
                  />
                </motion.div>
              </TabsContent>

              <TabsContent value="reservations" className="space-y-6">
                <motion.div
                  key="reservations"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <ReservationManager />
                </motion.div>
              </TabsContent>

              <TabsContent value="feedback" className="space-y-6">
                <motion.div
                  key="feedback"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <FeedbackManager 
                    enabled={true}
                    onSave={(feedbacks) => {
                      console.log('Feedbacks atualizados:', feedbacks);
                    }} 
                  />
                </motion.div>
              </TabsContent>

              <TabsContent value="offers" className="space-y-6">
                <motion.div
                  key="offers"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <SpecialOfferManager />
                </motion.div>
              </TabsContent>

              <TabsContent value="footer" className="space-y-6">
                <motion.div
                  key="footer"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <FooterManager />
                </motion.div>
              </TabsContent>
            </AnimatePresence>
          </Tabs>
        </motion.div>
      </div>
    </ThemeProvider>
  );
};

export default Admin;
