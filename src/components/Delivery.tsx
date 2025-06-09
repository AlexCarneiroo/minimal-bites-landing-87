
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, MapPin, Phone, Truck } from 'lucide-react';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';

const Delivery = () => {
  const [cep, setCep] = useState('');
  const { settings } = useSiteSettings();
  const primaryColor = settings?.primaryColor || '#0066cc';

  const handleCheckDelivery = () => {
    // Implementar lógica de verificação de entrega
    console.log('Verificando entrega para CEP:', cep);
  };

  return (
    <section className="py-20 bg-snackbar-softgray">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-snackbar-dark mb-4">Delivery</h2>
          <div className="flex justify-center items-center gap-2 mb-4">
            <div className="h-[1px] w-10 bg-snackbar-gray"></div>
            <Truck className="w-5 h-5" style={{ color: primaryColor }} />
            <div className="h-[1px] w-10 bg-snackbar-gray"></div>
          </div>
          <p className="text-snackbar-gray max-w-xl mx-auto">
            Entregamos nossos deliciosos pratos no conforto da sua casa
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <Card className="border-none shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-snackbar-dark mb-4">Verifique se entregamos na sua região</h3>
                <div className="flex gap-3">
                  <Input
                    placeholder="Digite seu CEP"
                    value={cep}
                    onChange={(e) => setCep(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleCheckDelivery}
                    className="text-white font-medium"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Verificar
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-none shadow-md">
                <CardContent className="p-4 text-center">
                  <Clock className="w-8 h-8 mx-auto mb-2" style={{ color: primaryColor }} />
                  <h4 className="font-semibold text-snackbar-dark">Entrega Rápida</h4>
                  <p className="text-sm text-snackbar-gray">25-35 minutos</p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md">
                <CardContent className="p-4 text-center">
                  <MapPin className="w-8 h-8 mx-auto mb-2" style={{ color: primaryColor }} />
                  <h4 className="font-semibold text-snackbar-dark">Raio de Entrega</h4>
                  <p className="text-sm text-snackbar-gray">Até 5km</p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-none shadow-md">
              <CardContent className="p-6">
                <h4 className="font-semibold text-snackbar-dark mb-3">Informações de Entrega</h4>
                <div className="space-y-2 text-sm text-snackbar-gray">
                  <p>• Taxa de entrega: R$ 3,00 a R$ 8,00</p>
                  <p>• Pedido mínimo: R$ 25,00</p>
                  <p>• Entrega gratuita acima de R$ 50,00</p>
                  <p>• Formas de pagamento: Dinheiro, cartão e PIX</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <div className="text-center">
              <img 
                src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&q=80&w=600" 
                alt="Delivery" 
                className="w-full max-w-md mx-auto rounded-lg shadow-lg"
              />
            </div>

            <Card className="border-none shadow-lg">
              <CardContent className="p-6 text-center">
                <Phone className="w-8 h-8 mx-auto mb-4" style={{ color: primaryColor }} />
                <h4 className="font-semibold text-snackbar-dark mb-2">Faça seu pedido</h4>
                <p className="text-snackbar-gray mb-4">Ligue agora e receba em casa</p>
                <Button 
                  size="lg" 
                  className="text-white font-semibold w-full"
                  style={{ backgroundColor: primaryColor }}
                >
                  (11) 99999-9999
                </Button>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="h-12 font-medium border-2 transition-all duration-300"
                style={{ 
                  borderColor: primaryColor, 
                  color: primaryColor 
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = primaryColor;
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = primaryColor;
                }}
              >
                WhatsApp
              </Button>
              <Button 
                variant="outline" 
                className="h-12 font-medium border-2 transition-all duration-300"
                style={{ 
                  borderColor: primaryColor, 
                  color: primaryColor 
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = primaryColor;
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = primaryColor;
                }}
              >
                iFood
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Delivery;
