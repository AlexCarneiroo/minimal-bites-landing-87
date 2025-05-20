
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Utensils, Menu, X, Truck } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
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
            <div className="bg-blue-600 p-2 rounded-lg">
              <Utensils className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl text-white">Paizam</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <a href="#home" onClick={(e) => handleNavClick(e, 'home')} className="text-white hover:text-blue-400 transition-all duration-300">Home</a>
            <a href="#menu" onClick={(e) => handleNavClick(e, 'menu')} className="text-white hover:text-blue-400 transition-all duration-300">Menu</a>
            <a href="#gallery" onClick={(e) => handleNavClick(e, 'gallery')} className="text-white hover:text-blue-400 transition-all duration-300">Galeria</a>
            <a href="#about" onClick={(e) => handleNavClick(e, 'about')} className="text-white hover:text-blue-400 transition-all duration-300">Sobre</a>
            <a href="#contact" onClick={(e) => handleNavClick(e, 'contact')} className="text-white hover:text-blue-400 transition-all duration-300">Contato</a>
            <a href="#delivery" onClick={(e) => handleNavClick(e, 'delivery')} className="text-white hover:text-blue-400 transition-all duration-300 flex items-center gap-1">
              <Truck className="h-4 w-4" />
              Delivery
            </a>
          </div>
          
          {/* Order Button - Desktop */}
          <div className="hidden md:flex items-center">
            <Button className="bg-blue-600 text-white hover:bg-blue-700 rounded-full px-6">
              Fazer Pedido
            </Button>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-white p-2">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 animate-fade-in">
            <div className="flex flex-col space-y-4">
              <a href="#home" onClick={(e) => handleNavClick(e, 'home')} className="text-white hover:text-blue-400 transition-all duration-300">Home</a>
              <a href="#menu" onClick={(e) => handleNavClick(e, 'menu')} className="text-white hover:text-blue-400 transition-all duration-300">Menu</a>
              <a href="#gallery" onClick={(e) => handleNavClick(e, 'gallery')} className="text-white hover:text-blue-400 transition-all duration-300">Galeria</a>
              <a href="#about" onClick={(e) => handleNavClick(e, 'about')} className="text-white hover:text-blue-400 transition-all duration-300">Sobre</a>
              <a href="#contact" onClick={(e) => handleNavClick(e, 'contact')} className="text-white hover:text-blue-400 transition-all duration-300">Contato</a>
              <a href="#delivery" onClick={(e) => handleNavClick(e, 'delivery')} className="text-white hover:text-blue-400 transition-all duration-300 flex items-center gap-1">
                <Truck className="h-4 w-4" />
                Delivery
              </a>
              <div className="pt-4 border-t border-gray-700">
                <Button className="bg-blue-600 text-white hover:bg-blue-700 w-full rounded-full">
                  Fazer Pedido
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
