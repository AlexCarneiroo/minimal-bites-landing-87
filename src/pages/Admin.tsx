
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
import { Button } from "@/components/ui/button";

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const navigate = useNavigate();
  const { toast } = useToast();

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
                        onSave={() => {}}
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
                        onSave={() => {}}
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
                        onSave={() => {}}
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
