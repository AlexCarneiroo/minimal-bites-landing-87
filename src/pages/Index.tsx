
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import FeaturedItems from '@/components/FeaturedItems';
import About from '@/components/About';
import Testimonials from '@/components/Testimonials';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import Gallery from '@/components/Gallery';
import Delivery from '@/components/Delivery';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';
import LoadingScreen from '@/components/LoadingScreen';

const Index = () => {
  const { settings, loading } = useSiteSettings();

  if (loading) {
    return <LoadingScreen />;
  }
  
  const showFeaturedItems = settings?.sectionVisibility?.featuredItems !== false;
  const showTestimonials = settings?.sectionVisibility?.testimonials !== false;

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />
      <Hero />
      {showFeaturedItems && <FeaturedItems />}
      <Gallery />
      <div id="delivery">
        <Delivery />
      </div>
      <About />
      {showTestimonials && <Testimonials />}
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
