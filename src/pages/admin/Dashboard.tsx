
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

interface Feedback {
  id: string;
  name: string;
  photo: string;
  message: string;
  rating: number;
  date: string;
}

interface SpecialOffer {
  id: string;
  name: string;
  description: string;
  regularPrice: number;
  promoPrice: number;
  discount: number;
  label: string;
  image: string;
}

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto py-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent mb-2">
            Painel Administrativo
          </h1>
          <p className="text-slate-600">Gerencie seu estabelecimento de forma eficiente</p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <TabsList className="grid w-full grid-cols-5 gap-2 p-2 bg-white/70 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg mb-8">
              <TabsTrigger 
                value="feedback" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-medium transition-all duration-300 hover:bg-blue-50"
              >
                Depoimentos
              </TabsTrigger>
              <TabsTrigger 
                value="offers" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-medium transition-all duration-300 hover:bg-emerald-50"
              >
                Ofertas Especiais
              </TabsTrigger>
              <TabsTrigger 
                value="reservations" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-medium transition-all duration-300 hover:bg-purple-50"
              >
                Reservas
              </TabsTrigger>
              <TabsTrigger 
                value="about" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-medium transition-all duration-300 hover:bg-orange-50"
              >
                Sobre Nós
              </TabsTrigger>
              <TabsTrigger 
                value="footer" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-slate-500 data-[state=active]:to-slate-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-medium transition-all duration-300 hover:bg-slate-50"
              >
                Rodapé
              </TabsTrigger>
            </TabsList>
          </motion.div>

          <TabsContent value="feedback">
            <motion.div
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.4 }}
            >
              <motion.div variants={cardVariants} whileHover="hover">
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl overflow-hidden">
                  <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-600"></div>
                  <CardContent className="p-8">
                    <FeedbackManager 
                      enabled={true}
                      onSave={(feedbacks) => {
                        console.log('Feedbacks atualizados:', feedbacks);
                      }} 
                    />
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </TabsContent>

          <TabsContent value="offers">
            <motion.div
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.4 }}
            >
              <motion.div variants={cardVariants} whileHover="hover">
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl overflow-hidden">
                  <div className="h-2 bg-gradient-to-r from-emerald-500 to-emerald-600"></div>
                  <CardContent className="p-8">
                    <SpecialOfferManager />
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </TabsContent>

          <TabsContent value="reservations">
            <motion.div
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.4 }}
            >
              <motion.div variants={cardVariants} whileHover="hover">
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl overflow-hidden">
                  <div className="h-2 bg-gradient-to-r from-purple-500 to-purple-600"></div>
                  <CardContent className="p-8">
                    <ReservationManager />
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </TabsContent>

          <TabsContent value="about">
            <motion.div
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.4 }}
            >
              <motion.div variants={cardVariants} whileHover="hover">
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl overflow-hidden">
                  <div className="h-2 bg-gradient-to-r from-orange-500 to-orange-600"></div>
                  <CardContent className="p-8">
                    <AboutManager />
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </TabsContent>

          <TabsContent value="footer">
            <motion.div
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.4 }}
            >
              <motion.div variants={cardVariants} whileHover="hover">
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl overflow-hidden">
                  <div className="h-2 bg-gradient-to-r from-slate-500 to-slate-600"></div>
                  <CardContent className="p-8">
                    <FooterManager />
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 
