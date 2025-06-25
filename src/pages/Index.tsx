
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import FeaturedItems from '@/components/FeaturedItems';
import About from '@/components/About';
import Testimonials from '@/components/Testimonials';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import Gallery from '@/components/Gallery';
import Delivery from '@/components/Delivery';
import ScrollAnimationWrapper from '@/components/ScrollAnimationWrapper';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';
import LoadingScreen from '@/components/LoadingScreen';
import { useScrollAnimations } from '@/hooks/useScrollAnimations';

const Index = () => {
  const { settings, loading } = useSiteSettings();
  const { scrollY } = useScrollAnimations();

  if (loading) {
    return <LoadingScreen />;
  }
  
  const showFeaturedItems = settings?.sectionVisibility?.featuredItems !== false;
  const showTestimonials = settings?.sectionVisibility?.testimonials !== false;

  return (
    <div className="min-h-screen bg-white overflow-x-hidden relative">
      {/* Parallax Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div 
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"
          style={{ transform: `translateY(${scrollY * 0.3}px)` }}
        />
        <div 
          className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-r from-pink-400/10 to-orange-400/10 rounded-full blur-3xl"
          style={{ transform: `translateY(${scrollY * -0.2}px)` }}
        />
      </div>

      <div className="relative z-10">
        <Navbar />
        <Hero />
        
        {showFeaturedItems && (
          <ScrollAnimationWrapper animation="fadeInUp" delay={100}>
            <FeaturedItems />
          </ScrollAnimationWrapper>
        )}
        
        <ScrollAnimationWrapper animation="fadeInLeft" delay={200}>
          <Gallery />
        </ScrollAnimationWrapper>
        
        <ScrollAnimationWrapper animation="fadeInRight" delay={300}>
          <div id="delivery">
            <Delivery />
          </div>
        </ScrollAnimationWrapper>
        
        <ScrollAnimationWrapper animation="zoomIn" delay={400}>
          <About />
        </ScrollAnimationWrapper>
        
        {showTestimonials && (
          <ScrollAnimationWrapper animation="fadeInUp" delay={500}>
            <Testimonials />
          </ScrollAnimationWrapper>
        )}
        
        <ScrollAnimationWrapper animation="fadeInUp" delay={600}>
          <Contact />
        </ScrollAnimationWrapper>
        
        <Footer />
      </div>
    </div>
  );
};

export default Index;
