
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';

const SpecialOffers = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-snackbar-purple/20 to-snackbar-magenta/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-snackbar-dark mb-4">Ofertas Especiais</h2>
          <div className="flex justify-center items-center gap-2 mb-4">
            <div className="h-[1px] w-10 bg-snackbar-gray"></div>
            <Bell className="w-5 h-5 text-snackbar-purple" fill="currentColor" />
            <div className="h-[1px] w-10 bg-snackbar-gray"></div>
          </div>
          <p className="text-snackbar-gray max-w-xl mx-auto">
            Confira nossas promoções e desfrute de preços especiais
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3 bg-white rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 hover:-translate-y-2">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=600" 
                alt="Combo Família" 
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-4 right-4 bg-snackbar-orange text-white px-3 py-1 rounded-full font-bold">
                -20%
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-snackbar-dark mb-2">Combo Família</h3>
              <p className="text-snackbar-gray mb-4">4 hambúrgueres, 4 batatas e 4 refrigerantes</p>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-snackbar-gray line-through">R$ 150,00</span>
                  <span className="text-xl font-bold text-snackbar-purple ml-2">R$ 120,00</span>
                </div>
                <Button className="bg-snackbar-purple hover:bg-snackbar-purple/90">Pedir</Button>
              </div>
            </div>
          </div>
          
          <div className="md:w-1/3 bg-white rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 hover:-translate-y-2">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&q=80&w=600" 
                alt="Lanches Vegetarianos" 
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-4 right-4 bg-snackbar-blue text-white px-3 py-1 rounded-full font-bold">
                NEW
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-snackbar-dark mb-2">Lanches Vegetarianos</h3>
              <p className="text-snackbar-gray mb-4">Opções saudáveis e deliciosas para todos os gostos</p>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xl font-bold text-snackbar-blue">A partir de R$ 25,90</span>
                </div>
                <Button className="bg-snackbar-blue hover:bg-snackbar-blue/90">Pedir</Button>
              </div>
            </div>
          </div>
          
          <div className="md:w-1/3 bg-white rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 hover:-translate-y-2">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1638176066623-b5b2f71da06c?auto=format&fit=crop&q=80&w=600" 
                alt="Happy Hour" 
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-4 right-4 bg-snackbar-magenta text-white px-3 py-1 rounded-full font-bold">
                2x1
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-snackbar-dark mb-2">Happy Hour</h3>
              <p className="text-snackbar-gray mb-4">Compre um milk shake e ganhe outro, todos os dias das 15h às 17h</p>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xl font-bold text-snackbar-magenta">R$ 16,90</span>
                </div>
                <Button className="bg-snackbar-magenta hover:bg-snackbar-magenta/90">Pedir</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpecialOffers;
