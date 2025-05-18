
import { Button } from '@/components/ui/button';
import { ChefHat } from 'lucide-react';

const Hero = () => {
  return (
    <section id="home" className="relative">
      <div className="bg-gradient-to-r from-snackbar-peach/40 to-snackbar-orange/20">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0 text-center md:text-left">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-snackbar-orange/20 text-snackbar-dark mb-6">
                <ChefHat className="h-5 w-5 mr-2 text-snackbar-orange" />
                <span className="font-medium">Culinária Premium</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-snackbar-dark mb-4">
                Sabores que <span className="text-snackbar-orange">Encantam</span>
              </h1>
              <p className="text-xl text-snackbar-gray mb-8 max-w-md mx-auto md:mx-0">
                Lanches artesanais feitos com ingredientes frescos e muito carinho para você.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Button className="bg-snackbar-orange text-white hover:bg-snackbar-orange/90 px-8 py-6">
                  Ver Menu
                </Button>
                <Button variant="outline" className="border-snackbar-dark text-snackbar-dark hover:bg-snackbar-dark hover:text-white px-8 py-6">
                  Fazer Reserva
                </Button>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="relative">
                <div className="bg-white p-4 rounded-2xl shadow-lg overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&q=80&w=800" 
                    alt="Lanche especial da casa" 
                    className="w-full h-auto rounded-lg object-cover aspect-[4/3]"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-white p-3 rounded-full shadow-lg">
                  <div className="bg-gradient-to-r from-snackbar-orange to-snackbar-peach w-16 h-16 md:w-24 md:h-24 rounded-full flex items-center justify-center">
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
