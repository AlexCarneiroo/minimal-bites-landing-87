
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Utensils, Menu, X, Truck } from 'lucide-react';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { settings } = useSiteSettings();
  const primaryColor = settings?.primaryColor || '#0066cc';
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    setIsMenuOpen(false);
    
    const section = document.getElementById(sectionId);
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 80, // Offset for navbar height
        behavior: 'smooth'
      });
    }
  };
  
  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-black text-white shadow-md py-2' : 'bg-black/90 backdrop-blur-sm text-white py-4'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div style={{ backgroundColor: primaryColor }} className="p-2 rounded-lg">
              <Utensils className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl text-white">Paizam</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <a href="#home" onClick={(e) => handleNavClick(e, 'home')} className="text-white transition-all duration-300" style={{ ':hover': { color: primaryColor } }}>Home</a>
            <a href="#menu" onClick={(e) => handleNavClick(e, 'menu')} className="text-white transition-all duration-300" style={{ ':hover': { color: primaryColor } }}>Menu</a>
            <a href="#gallery" onClick={(e) => handleNavClick(e, 'gallery')} className="text-white transition-all duration-300" style={{ ':hover': { color: primaryColor } }}>Galeria</a>
            <a href="#about" onClick={(e) => handleNavClick(e, 'about')} className="text-white transition-all duration-300" style={{ ':hover': { color: primaryColor } }}>Sobre</a>
            <a href="#contact" onClick={(e) => handleNavClick(e, 'contact')} className="text-white transition-all duration-300" style={{ ':hover': { color: primaryColor } }}>Contato</a>
            <a href="#delivery" onClick={(e) => handleNavClick(e, 'delivery')} className="text-white transition-all duration-300 flex items-center gap-1" style={{ ':hover': { color: primaryColor } }}>
              <Truck className="h-4 w-4" />
              Delivery
            </a>
          </div>
          
          {/* Order Button - Desktop */}
          <div className="hidden md:flex items-center">
            <Button 
              className="text-white rounded-full px-6 hover:opacity-90"
              style={{ backgroundColor: primaryColor }}
            >
              Fazer Pedido
            </Button>
          </div>
          
          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 space-y-4 pb-4">
            <a href="#home" onClick={(e) => handleNavClick(e, 'home')} className="block text-white transition-all duration-300" style={{ ':hover': { color: primaryColor } }}>Home</a>
            <a href="#menu" onClick={(e) => handleNavClick(e, 'menu')} className="block text-white transition-all duration-300" style={{ ':hover': { color: primaryColor } }}>Menu</a>
            <a href="#gallery" onClick={(e) => handleNavClick(e, 'gallery')} className="block text-white transition-all duration-300" style={{ ':hover': { color: primaryColor } }}>Galeria</a>
            <a href="#about" onClick={(e) => handleNavClick(e, 'about')} className="block text-white transition-all duration-300" style={{ ':hover': { color: primaryColor } }}>Sobre</a>
            <a href="#contact" onClick={(e) => handleNavClick(e, 'contact')} className="block text-white transition-all duration-300" style={{ ':hover': { color: primaryColor } }}>Contato</a>
            <a href="#delivery" onClick={(e) => handleNavClick(e, 'delivery')} className="block text-white transition-all duration-300 flex items-center gap-1" style={{ ':hover': { color: primaryColor } }}>
              <Truck className="h-4 w-4" />
              Delivery
            </a>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
