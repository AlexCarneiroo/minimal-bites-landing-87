
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
  Info 
} from "lucide-react";
import AdminLogin from '@/components/AdminLogin';
import AdminHeader from '@/components/admin/AdminHeader';
import GeneralSettings from '@/components/admin/GeneralSettings';
import AppearanceSettings from '@/components/admin/AppearanceSettings';
import ReservationManager from '@/components/admin/ReservationManager';
import SpecialOfferEditor from '@/components/SpecialOfferEditor';
import FeedbackManager from '@/components/admin/FeedbackManager';
import AboutSection from '@/components/admin/AboutSection';
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from '@/hooks/use-toast';
import { onAuthChange, signOutOwner } from '@/lib/firebase-auth';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setIsAuthenticated(!!user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      const result = await signOutOwner();
      if (result.success) {
        setIsAuthenticated(false);
        toast({
          title: "Logout realizado",
          description: "Você foi desconectado com sucesso",
        });
        navigate('/');
      } else {
        toast({
          title: "Erro no logout",
          description: "Não foi possível realizar o logout",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Erro no logout:', error);
      toast({
        title: "Erro no logout",
        description: "Ocorreu um erro inesperado",
        variant: "destructive",
      });
    }
  };

  const handleSave = (data: any) => {
    toast({
      title: "Sucesso",
      description: "Configurações salvas com sucesso!",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  const tabs = [
    { value: "general", label: "Geral", icon: LayoutDashboard },
    { value: "appearance", label: "Aparência", icon: Palette },
    { value: "reservations", label: "Reservas", icon: Calendar },
    { value: "special-offers", label: "Ofertas", icon: Tag },
    { value: "feedbacks", label: "Feedbacks", icon: MessageCircle },
    { value: "about", label: "Sobre", icon: Info },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <AdminHeader onLogout={handleLogout} />

      <div className="container mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <TabsList className="grid w-full grid-cols-6 gap-2 p-2 bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 h-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="flex flex-col items-center gap-1 py-3 px-2 rounded-xl font-medium transition-all duration-300 hover:bg-blue-50 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg"
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-xs">{tab.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </motion.div>

          <div className="w-full">
            <AnimatePresence mode="wait">
              <TabsContent value="general">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-xl"
                >
                  <GeneralSettings />
                </motion.div>
              </TabsContent>

              <TabsContent value="appearance">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-xl"
                >
                  <AppearanceSettings />
                </motion.div>
              </TabsContent>

              <TabsContent value="reservations">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
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
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-xl space-y-4"
                >
                  <h2 className="text-2xl font-bold">Gerenciar Produtos</h2>
                  <Card className="bg-white/80 backdrop-blur-md">
                    <CardContent className="p-4">
                      <SpecialOfferEditor
                        enabled={true}
                        onSave={handleSave}
                      />
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="feedbacks">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-xl space-y-4"
                >
                  <h2 className="text-2xl font-bold">Gerenciar Feedbacks</h2>
                  <Card className="bg-white/80 backdrop-blur-md">
                    <CardContent className="p-4">
                      <FeedbackManager
                        enabled={true}
                        onSave={handleSave}
                      />
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="about">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-xl space-y-4"
                >
                  <h2 className="text-2xl font-bold">Seção Sobre Nós</h2>
                  <Card className="bg-white/80 backdrop-blur-md">
                    <CardContent className="p-4">
                      <AboutSection
                        title="Sobre Nós"
                        description="Descrição da empresa"
                        images={[]}
                        spaceImages={[]}
                        onSave={handleSave}
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
