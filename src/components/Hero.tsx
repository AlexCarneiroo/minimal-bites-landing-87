
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChefHat } from 'lucide-react';
import ReservationDialog from './ReservationDialog';

const Hero = () => {
  return (
    <section id="home" className="relative">
      <div className="bg-gradient-elegant text-white">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2 mb-10 md:mb-0 text-center md:text-left">
              <Badge 
                variant="outline" 
                className="animate-fade-in px-4 py-2 rounded-full bg-snackbar-blue/20 border-snackbar-blue/50 text-white mb-6 inline-flex items-center gap-2"
              >
                <ChefHat className="h-4 w-4 text-snackbar-blue" />
                <span className="font-medium">Culinária Premium</span>
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in" style={{ animationDelay: "100ms" }}>
                <span className="text-white">Paizam</span>
              </h1>
              
              <div className="h-1 w-16 bg-snackbar-blue mx-auto md:mx-0 my-4 animate-fade-in" style={{ animationDelay: "200ms" }}></div>
              
              <p className="text-xl text-gray-300 mb-8 max-w-md mx-auto md:mx-0 animate-fade-in" style={{ animationDelay: "300ms" }}>
                Lanches artesanais feitos com ingredientes frescos e muito carinho para você.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start animate-fade-in" style={{ animationDelay: "400ms" }}>
                <Button className="bg-snackbar-blue hover:bg-snackbar-darkblue text-white px-8 py-6 transition-all duration-300 hover:shadow-lg">
                  Ver Menu
                </Button>
                <ReservationDialog>
                  <Button variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-6 transition-all duration-300">
                    Fazer Reserva
                  </Button>
                </ReservationDialog>
              </div>
            </div>
            
            <div className="md:w-1/2 animate-fade-in" style={{ animationDelay: "500ms" }}>
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-snackbar-blue to-snackbar-lightblue rounded-2xl blur opacity-30 group-hover:opacity-70 transition duration-1000"></div>
                <div className="bg-black p-4 rounded-2xl shadow-2xl overflow-hidden relative">
                  <img 
                    src="https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&q=80&w=800" 
                    alt="Especialidade da casa" 
                    className="w-full h-auto rounded-lg object-cover aspect-[4/3] group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-white text-xl font-bold mb-1">Sabor Extraordinário</h3>
                    <p className="text-gray-300">Experimente nossa especialidade</p>
                  </div>
                </div>
                <div className="absolute -bottom-6 -right-6 animate-pulse">
                  <div className="bg-snackbar-blue w-16 h-16 md:w-24 md:h-24 rounded-full flex items-center justify-center shadow-lg">
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
