
import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
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

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Painel Administrativo</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="feedback">Depoimentos</TabsTrigger>
          <TabsTrigger value="offers">Ofertas Especiais</TabsTrigger>
          <TabsTrigger value="reservations">Reservas</TabsTrigger>
          <TabsTrigger value="about">Sobre Nós</TabsTrigger>
          <TabsTrigger value="footer">Rodapé</TabsTrigger>
        </TabsList>

        <TabsContent value="feedback">
          <Card>
            <CardContent className="p-6">
              <FeedbackManager 
                enabled={true}
                onSave={(feedbacks) => {
                  // Atualizar feedbacks se necessário
                  console.log('Feedbacks atualizados:', feedbacks);
                }} 
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="offers">
          <Card>
            <CardContent className="p-6">
              <SpecialOfferManager />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reservations">
          <Card>
            <CardContent className="p-6">
              <ReservationManager />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="about">
          <Card>
            <CardContent className="p-6">
              <AboutManager />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="footer">
          <Card>
            <CardContent className="p-6">
              <FooterManager />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 
