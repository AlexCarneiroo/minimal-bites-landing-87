
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import FeaturedItems from '@/components/FeaturedItems';
import About from '@/components/About';
import Testimonials from '@/components/Testimonials';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import Gallery from '@/components/Gallery';
import Delivery from '@/components/Delivery';
import { getGeneralSettings } from '@/lib/firebase-operations';

const Index = () => {
  const [sectionVisibility, setSectionVisibility] = useState({
    specialOffers: true,
    feedbacks: true,
    gallery: true,
    about: true,
    delivery: true
  });

  useEffect(() => {
    const loadVisibilitySettings = async () => {
      try {
        const data = await getGeneralSettings();
        if (data?.sectionVisibility) {
          setSectionVisibility(prev => ({ ...prev, ...data.sectionVisibility }));
        }
      } catch (error) {
        console.error('Erro ao carregar configurações de visibilidade:', error);
      }
    };

    loadVisibilitySettings();
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />
      <Hero />
      <FeaturedItems />
      
      {sectionVisibility.gallery && <Gallery />}
      
      {sectionVisibility.delivery && (
        <div id="delivery">
          <Delivery />
        </div>
      )}
      
      {sectionVisibility.about && <About />}
      
      {sectionVisibility.feedbacks && <Testimonials />}
      
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
