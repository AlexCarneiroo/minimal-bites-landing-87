import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import FeedbackManager from "@/components/admin/FeedbackManager";
import SpecialOfferManager from "@/components/admin/SpecialOfferManager";
import AboutManager from "@/components/admin/AboutManager";
import FooterManager from "@/components/admin/FooterManager";
import ReservationManager from "@/components/admin/ReservationManager";
import FeaturedProductSettings from "@/components/admin/FeaturedProductSettings";
import { 
  MessageSquare, 
  Sparkles, 
  Calendar, 
  Info, 
  MoreHorizontal,
  Star
} from "lucide-react";

export default function Dashboard() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("feedback");

  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    hover: { scale: 1.02, transition: { duration: 0.2 } }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const tabConfig = [
    { 
      value: "feedback", 
      label: "Depoimentos", 
      icon: MessageSquare,
      gradient: "from-blue-500 to-blue-700",
      hoverColor: "hover:bg-blue-50",
      shadowColor: "shadow-blue-200"
    },
    { 
      value: "offers", 
      label: "Ofertas Especiais", 
      icon: Sparkles,
      gradient: "from-emerald-500 to-emerald-700",
      hoverColor: "hover:bg-emerald-50",
      shadowColor: "shadow-emerald-200"
    },
    { 
      value: "reservations", 
      label: "Reservas", 
      icon: Calendar,
      gradient: "from-purple-500 to-purple-700",
      hoverColor: "hover:bg-purple-50",
      shadowColor: "shadow-purple-200"
    },
    { 
      value: "featured", 
      label: "Produto Destaque", 
      icon: Star,
      gradient: "from-amber-500 to-amber-700",
      hoverColor: "hover:bg-amber-50",
      shadowColor: "shadow-amber-200"
    },
    { 
      value: "about", 
      label: "Sobre Nós", 
      icon: Info,
      gradient: "from-orange-500 to-orange-700",
      hoverColor: "hover:bg-orange-50",
      shadowColor: "shadow-orange-200"
    },
    { 
      value: "footer", 
      label: "Rodapé", 
      icon: MoreHorizontal,
      gradient: "from-slate-500 to-slate-700",
      hoverColor: "hover:bg-slate-50",
      shadowColor: "shadow-slate-200"
    }
  ];

  const handleSave = (data: any) => {
    console.log('Dados salvos:', data);
    toast({
      title: "Sucesso",
      description: "Configurações salvas com sucesso!",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/40 relative overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-emerald-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"></div>
      </div>

      <motion.div 
        className="container mx-auto py-8 px-4 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-12 text-center"
        >
          <div className="inline-flex items-center justify-center p-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-800 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Painel Administrativo
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Gerencie seu estabelecimento com elegância e eficiência
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mt-4 rounded-full"></div>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <TabsList className="grid w-full grid-cols-6 gap-2 p-3 bg-white/80 backdrop-blur-xl rounded-3xl border border-white/40 shadow-xl shadow-blue-100/20">
              {tabConfig.map((tab, index) => {
                const Icon = tab.icon;
                return (
                  <TabsTrigger 
                    key={`tab-${tab.value}`}
                    value={tab.value}
                    className={`
                      data-[state=active]:bg-gradient-to-r data-[state=active]:${tab.gradient} 
                      data-[state=active]:text-white data-[state=active]:shadow-xl 
                      data-[state=active]:${tab.shadowColor}
                      rounded-2xl font-medium transition-all duration-500 
                      ${tab.hoverColor} relative overflow-hidden group
                      flex flex-col items-center gap-2 py-4 px-2
                    `}
                  >
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative z-10"
                    >
                      <Icon className="w-5 h-5 mb-1" />
                      <span className="text-xs font-medium leading-tight text-center">
                        {tab.label}
                      </span>
                    </motion.div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </motion.div>

          {/* Feedback Tab */}
          <TabsContent value="feedback">
            <motion.div
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.5 }}
            >
              <motion.div variants={cardVariants} whileHover="hover">
                <Card className="bg-white/90 backdrop-blur-xl border-0 shadow-2xl rounded-3xl overflow-hidden relative">
                  <div className="h-2 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700"></div>
                  <div className="absolute top-4 right-4 p-2 bg-blue-500/10 rounded-full">
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                  </div>
                  <CardContent className="p-8">
                    <FeedbackManager 
                      enabled={true}
                      onSave={handleSave} 
                    />
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </TabsContent>

          {/* Special Offers Tab */}
          <TabsContent value="offers">
            <motion.div
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.5 }}
            >
              <motion.div variants={cardVariants} whileHover="hover">
                <Card className="bg-white/90 backdrop-blur-xl border-0 shadow-2xl rounded-3xl overflow-hidden relative">
                  <div className="h-2 bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700"></div>
                  <div className="absolute top-4 right-4 p-2 bg-emerald-500/10 rounded-full">
                    <Sparkles className="w-5 h-5 text-emerald-600" />
                  </div>
                  <CardContent className="p-8">
                    <SpecialOfferManager />
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </TabsContent>

          {/* Reservations Tab */}
          <TabsContent value="reservations">
            <motion.div
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.5 }}
            >
              <motion.div variants={cardVariants} whileHover="hover">
                <Card className="bg-white/90 backdrop-blur-xl border-0 shadow-2xl rounded-3xl overflow-hidden relative">
                  <div className="h-2 bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700"></div>
                  <div className="absolute top-4 right-4 p-2 bg-purple-500/10 rounded-full">
                    <Calendar className="w-5 h-5 text-purple-600" />
                  </div>
                  <CardContent className="p-8">
                    <ReservationManager />
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </TabsContent>

          {/* Featured Product Tab */}
          <TabsContent value="featured">
            <motion.div
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.5 }}
            >
              <motion.div variants={cardVariants} whileHover="hover">
                <Card className="bg-white/90 backdrop-blur-xl border-0 shadow-2xl rounded-3xl overflow-hidden relative">
                  <div className="h-2 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700"></div>
                  <div className="absolute top-4 right-4 p-2 bg-amber-500/10 rounded-full">
                    <Star className="w-5 h-5 text-amber-600" />
                  </div>
                  <CardContent className="p-8">
                    <FeaturedProductSettings />
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </TabsContent>

          {/* About Tab */}
          <TabsContent value="about">
            <motion.div
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.5 }}
            >
              <motion.div variants={cardVariants} whileHover="hover">
                <Card className="bg-white/90 backdrop-blur-xl border-0 shadow-2xl rounded-3xl overflow-hidden relative">
                  <div className="h-2 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700"></div>
                  <div className="absolute top-4 right-4 p-2 bg-orange-500/10 rounded-full">
                    <Info className="w-5 h-5 text-orange-600" />
                  </div>
                  <CardContent className="p-8">
                    <AboutManager />
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </TabsContent>

          {/* Footer Tab */}
          <TabsContent value="footer">
            <motion.div
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.5 }}
            >
              <motion.div variants={cardVariants} whileHover="hover">
                <Card className="bg-white/90 backdrop-blur-xl border-0 shadow-2xl rounded-3xl overflow-hidden relative">
                  <div className="h-2 bg-gradient-to-r from-slate-500 via-slate-600 to-slate-700"></div>
                  <div className="absolute top-4 right-4 p-2 bg-slate-500/10 rounded-full">
                    <MoreHorizontal className="w-5 h-5 text-slate-600" />
                  </div>
                  <CardContent className="p-8">
                    <FooterManager />
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
