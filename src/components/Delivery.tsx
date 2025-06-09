
import { Button } from '@/components/ui/button';
import { Truck, Package, Phone } from 'lucide-react';
import { useEstablishmentData } from '@/hooks/useEstablishmentData';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';

const Delivery = () => {
  const { data: establishmentData, loading } = useEstablishmentData();
  const { settings } = useSiteSettings();
  const primaryColor = settings?.primaryColor || '#0066cc';

  // Dados padrão como fallback
  const defaultData = {
    phone: '(11) 9999-9999',
    menuUrl: 'https://www.saborexpress.com.br'
  };

  const deliveryData = {
    phone: establishmentData?.phone || defaultData.phone,
    menuUrl: establishmentData?.menuUrl || defaultData.menuUrl
  };

  if (loading) {
    return (
      <section className="py-20 bg-black text-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-gray-300">Carregando informações de delivery...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-black text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Peça seu Delivery</h2>
          <div className="flex justify-center items-center gap-2 mb-4">
            <div className="h-[1px] w-10 bg-gray-600"></div>
            <Truck className="w-5 h-5" style={{ color: primaryColor }} />
            <div className="h-[1px] w-10 bg-gray-600"></div>
          </div>
          <p className="text-gray-300 max-w-xl mx-auto">
            Receba nossos deliciosos pratos no conforto da sua casa
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white/5 backdrop-blur-sm p-8 rounded-xl border border-white/10 text-center">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: `${primaryColor}33` }}
            >
              <Phone className="w-6 h-6" style={{ color: primaryColor }} />
            </div>
            <h3 className="text-xl font-bold mb-2">Telefone</h3>
            <p className="text-gray-300 mb-4">{deliveryData.phone}</p>
            <p className="text-sm text-gray-400">Atendimento rápido e prático</p>
          </div>
          
          <div className="p-8 rounded-xl text-center transform scale-105 shadow-xl" style={{ backgroundColor: primaryColor }}>
            <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Aplicativo</h3>
            <p className="text-white/80 mb-4">Baixe nosso app exclusivo</p>
            <p className="text-sm text-white/70">Acompanhe seu pedido em tempo real</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm p-8 rounded-xl border border-white/10 text-center">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: `${primaryColor}33` }}
            >
              <Truck className="w-6 h-6" style={{ color: primaryColor }} />
            </div>
            <h3 className="text-xl font-bold mb-2">Website</h3>
            <p className="text-gray-300 mb-4">Cardápio Online</p>
            <p className="text-sm text-gray-400">Faça seu pedido pelo nosso cardápio</p>
          </div>
        </div>
        
        <div className="text-center">
          <Button 
            className="text-white text-lg px-10 py-6 hover:opacity-90"
            style={{ backgroundColor: primaryColor }}
            onClick={() => window.open(deliveryData.menuUrl, '_blank')}
          >
            Acessar Cardápio
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Delivery;
