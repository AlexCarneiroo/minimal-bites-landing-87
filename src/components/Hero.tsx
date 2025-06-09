
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, Star, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import ReservationDialog from './ReservationDialog';
import { useEstablishmentData } from '@/hooks/useEstablishmentData';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';

const Hero = () => {
  const [showReservation, setShowReservation] = useState(false);
  const { establishmentData } = useEstablishmentData();
  const { settings } = useSiteSettings();
  const primaryColor = settings?.primaryColor || '#0066cc';

  const scrollToMenu = () => {
    const menuSection = document.getElementById('menu');
    if (menuSection) {
      menuSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const heroImage = settings?.heroImage || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=2000';

  return (
    <>
      <section 
        id="home" 
        className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-fixed"
        style={{ 
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('${heroImage}')`
        }}
      >
        <div className="container mx-auto px-4 text-center text-white z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              {establishmentData?.name || 'Paizam'}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto">
              {establishmentData?.description || 'Deliciosos hambúrguers artesanais feitos com ingredientes frescos e de qualidade premium'}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button 
                size="lg" 
                className="text-white font-semibold px-8 py-4 text-lg hover:scale-105 transition-all duration-300 shadow-lg"
                style={{ backgroundColor: primaryColor }}
                onClick={() => setShowReservation(true)}
              >
                Fazer Reserva
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white hover:text-black font-semibold px-8 py-4 text-lg transition-all duration-300"
                onClick={scrollToMenu}
              >
                Ver Cardápio
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
              <motion.div 
                className="flex items-center justify-center space-x-3 bg-white/10 backdrop-blur-sm rounded-lg p-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <Star className="w-6 h-6" style={{ color: primaryColor }} fill="currentColor" />
                <span className="text-lg font-medium">Qualidade Premium</span>
              </motion.div>
              
              <motion.div 
                className="flex items-center justify-center space-x-3 bg-white/10 backdrop-blur-sm rounded-lg p-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <Clock className="w-6 h-6" style={{ color: primaryColor }} />
                <span className="text-lg font-medium">Entrega Rápida</span>
              </motion.div>
              
              <motion.div 
                className="flex items-center justify-center space-x-3 bg-white/10 backdrop-blur-sm rounded-lg p-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <div className="w-6 h-6 rounded-full" style={{ backgroundColor: primaryColor }}></div>
                <span className="text-lg font-medium">Ingredientes Frescos</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
        
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          onClick={scrollToMenu}
        >
          <ChevronDown className="w-8 h-8 text-white" />
        </motion.div>
      </section>

      <ReservationDialog 
        open={showReservation} 
        onOpenChange={setShowReservation} 
      />
    </>
  );
};

export default Hero;
