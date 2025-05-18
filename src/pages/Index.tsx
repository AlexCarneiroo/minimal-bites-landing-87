
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import FeaturedItems from '@/components/FeaturedItems';
import About from '@/components/About';
import Testimonials from '@/components/Testimonials';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import Gallery from '@/components/Gallery';
import SpecialOffers from '@/components/SpecialOffers';

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <FeaturedItems />
      <SpecialOffers />
      <Gallery />
      <About />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
