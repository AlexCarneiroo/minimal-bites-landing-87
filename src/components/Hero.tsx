
import { Button } from '@/components/ui/button';
import { ChefHat } from 'lucide-react';
import ReservationDialog from './ReservationDialog';
import { useEffect, useState } from 'react';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);
  
  return (
    <section id="home" className="relative">
      <div className="bg-black text-white overflow-hidden">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="flex flex-col md:flex-row items-center">
            <div 
              className={`md:w-1/2 mb-10 md:mb-0 text-center md:text-left transition-all duration-1000 ease-out ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <div 
                className="inline-flex items-center px-4 py-2 rounded-full bg-blue-600/20 text-white mb-6 transform hover:scale-105 transition-all"
                style={{ transitionDelay: '200ms' }}
              >
                <ChefHat className="h-5 w-5 mr-2 text-blue-500 animate-pulse" />
                <span className="font-medium">Culinária Premium</span>
              </div>
              <h1 
                className="text-4xl md:text-6xl font-bold text-white mb-4 transition-all duration-700"
                style={{ transitionDelay: '400ms' }}
              >
                Sabores que <span className="text-blue-500 relative inline-block">
                  Encantam
                  <span className="absolute -bottom-1 left-0 w-full h-1 bg-blue-500/50 rounded"></span>
                </span>
              </h1>
              <p 
                className="text-xl text-gray-300 mb-8 max-w-md mx-auto md:mx-0 transition-all duration-700"
                style={{ transitionDelay: '600ms' }}
              >
                Lanches artesanais feitos com ingredientes frescos e muito carinho para você.
              </p>
              <div 
                className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start transition-all duration-700"
                style={{ transitionDelay: '800ms' }}
              >
                <Button 
                  className="bg-blue-600 text-white hover:bg-blue-700 px-8 py-6 hover:shadow-blue-500/50 hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  Ver Menu
                </Button>
                <ReservationDialog>
                  <Button 
                    variant="outline" 
                    className="border-white text-white hover:bg-white/10 px-8 py-6 transform hover:scale-105 transition-all duration-300"
                  >
                    Fazer Reserva
                  </Button>
                </ReservationDialog>
              </div>
            </div>
            <div 
              className={`md:w-1/2 transition-all duration-1000 ease-out ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
              }`}
              style={{ transitionDelay: '300ms' }}
            >
              <div className="relative">
                <div className="bg-white p-4 rounded-2xl shadow-lg overflow-hidden transform hover:rotate-2 hover:scale-105 transition-all duration-500">
                  <img 
                    src="https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&q=80&w=800" 
                    alt="Lanche especial da casa" 
                    className="w-full h-auto rounded-lg object-cover aspect-[4/3]"
                  />
                </div>
                <div 
                  className="absolute -bottom-6 -right-6 bg-white p-3 rounded-full shadow-lg animate-pulse hover:animate-none transform hover:scale-110 transition-all duration-300"
                >
                  <div className="bg-blue-600 w-16 h-16 md:w-24 md:h-24 rounded-full flex items-center justify-center transform transition-transform hover:rotate-12">
                    <div className="text-center">
                      <p className="font-bold text-white text-sm md:text-base">Desde</p>
                      <p className="font-bold text-white text-sm md:text-base">2010</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
