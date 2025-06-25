import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChefHat } from 'lucide-react';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';
import { useEstablishmentData } from '@/hooks/useEstablishmentData';
import { useCustomerAuth } from '@/hooks/useCustomerAuth';
import { useState } from 'react';
import { toast } from 'sonner';
import CustomerAuth from './CustomerAuth';
import ReservationForm from './ReservationForm';

const Hero = () => {
  const { settings } = useSiteSettings();
  const { data: establishmentData, loading } = useEstablishmentData();
  const { isLoggedIn } = useCustomerAuth();
  const [showCustomerAuth, setShowCustomerAuth] = useState(false);
  const [showReservationForm, setShowReservationForm] = useState(false);
  const primaryColor = settings?.primaryColor || '#0066cc';

  const typeEstabelecimento = establishmentData?.type || 'Outro';
  
  // Usar dados do estabelecimento se disponíveis, senão usar dados padrão
  const establishmentName = establishmentData?.name || settings?.establishmentData?.name || '';
  
  // Para a imagem do produto em destaque, usar apenas os dados específicos do featured product
  const featuredProductImage = establishmentData?.featuredProduct?.image || 
    "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&q=80&w=800";

  const handleReservationClick = () => {
    if (isLoggedIn) {
      setShowReservationForm(true);
    } else {
      toast.error("Você precisa estar logado para fazer reservas", {
        description: "Faça login ou cadastre-se para continuar",
        duration: 4000,
        style: {
          background: '#fee2e2',
          border: '1px solid #fecaca',
          color: '#991b1b',
        },
      });
      setShowCustomerAuth(true);
    }
  };

  const handleCustomerAuthSuccess = () => {
    setShowCustomerAuth(false);
    setShowReservationForm(true);
  };

  return (
    <>
      <section id="home" className="relative overflow-hidden">
        <div className="bg-gradient-elegant text-white">
          <div className="container mx-auto px-4 py-12 sm:py-20 md:py-32 max-w-7xl">
            <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
              <div className="w-full lg:w-1/2 mb-6 lg:mb-0 text-center lg:text-left">
                <Badge 
                  variant="outline" 
                  className="animate-fade-in px-3 py-2 rounded-full bg-opacity-20 border-opacity-50 text-white mb-4 lg:mb-6 inline-flex items-center gap-2 text-sm"
                  style={{ 
                    backgroundColor: `${primaryColor}20`,
                    borderColor: `${primaryColor}50`
                  }}
                >
                  <ChefHat className="h-4 w-4" style={{ color: primaryColor }} />
                  <span className="font-medium">{typeEstabelecimento}</span>
                </Badge>
                
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 animate-fade-in break-words" style={{ animationDelay: "100ms" }}>
                  <span className="text-white">{establishmentName}</span>
                </h1>
                
                <div 
                  className="h-1 w-12 lg:w-16 mx-auto lg:mx-0 my-4 animate-fade-in" 
                  style={{ 
                    animationDelay: "200ms",
                    backgroundColor: primaryColor 
                  }}
                ></div>
                
                <p className="text-lg sm:text-xl text-gray-300 mb-6 lg:mb-8 max-w-md mx-auto lg:mx-0 animate-fade-in px-2 lg:px-0" style={{ animationDelay: "300ms" }}>
                  {establishmentData?.description || 'Lanches artesanais feitos com ingredientes frescos e muito carinho para você.'}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 justify-center lg:justify-start px-4 lg:px-0">
                  <button 
                    onClick={handleReservationClick}
                    className="animate-fade-in rounded-xl px-6 py-[10px] w-full sm:w-auto text-white hover:opacity-90 transition-all duration-300 hover:scale-105 hover:shadow-xl"
                    style={{ 
                      animationDelay: "400ms",
                      backgroundColor: primaryColor
                    }}
                  >
                    Fazer Reserva
                  </button>
                  <Button 
                    variant="outline" 
                    className="animate-fade-in w-full sm:w-auto bg-transparent hover:bg-white/10 transition-all duration-300 hover:scale-105"
                    style={{ 
                      animationDelay: "400ms",
                      borderColor: primaryColor,
                      color: primaryColor
                    }}
                    onClick={() => {
                      if (establishmentData?.menuUrl) {
                        window.open(establishmentData.menuUrl, '_blank');
                      } else {
                        document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    Ver Menu
                  </Button>
                </div>
              </div>
              
              <div className="w-full lg:w-1/2 relative px-4 lg:px-0">
                <div className="relative group max-w-md mx-auto lg:max-w-none">
                  <div 
                    className="absolute -inset-1 rounded-2xl blur opacity-30 group-hover:opacity-70 transition duration-1000"
                    style={{ 
                      background: `linear-gradient(to right, ${primaryColor}, ${primaryColor}80)`
                    }}
                  ></div>
                  <div className="bg-black p-3 lg:p-4 rounded-2xl shadow-2xl overflow-hidden relative">
                    <img 
                      src={featuredProductImage} 
                      alt="Produto em Destaque" 
                      className="w-full h-auto rounded-lg object-cover aspect-[4/3] transition-transform duration-500"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 lg:p-6">
                      <h3 className="text-white text-lg lg:text-xl font-bold mb-1">
                        {establishmentData?.featuredProduct?.title || 'Sabor Extraordinário'}
                      </h3>
                      <p className="text-gray-300 text-sm lg:text-base">
                        {establishmentData?.featuredProduct?.description || 'Experimente nossa especialidade'}
                      </p>
                    </div>
                  </div>
                  <div className="absolute -bottom-4 -right-4 lg:-bottom-6 lg:-right-6">
                    <div 
                      className="w-12 h-12 lg:w-16 lg:h-16 xl:w-24 xl:h-24 rounded-full flex items-center justify-center shadow-lg"
                      style={{ backgroundColor: primaryColor }}
                    >
                      <div className="text-center">
                        <p className="font-bold text-white text-xs lg:text-sm xl:text-base">Desde</p>
                        <p className="font-bold text-white text-xs lg:text-sm xl:text-base">
                          {establishmentData?.featuredProduct?.year || '2010'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modais */}
      <CustomerAuth
        isOpen={showCustomerAuth}
        onClose={() => setShowCustomerAuth(false)}
        onSuccess={handleCustomerAuthSuccess}
      />

      {showReservationForm && (
        <ReservationForm onClose={() => setShowReservationForm(false)} />
      )}
    </>
  );
};

export default Hero;
