
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

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
  
  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-black text-white shadow-md py-2' : 'bg-black/90 backdrop-blur-sm text-white py-4'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <span className="font-bold text-xl text-white">Sabor Express</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <a href="#home" className="text-white hover:text-blue-400 transition-colors">Home</a>
            <a href="#menu" className="text-white hover:text-blue-400 transition-colors">Menu</a>
            <a href="#gallery" className="text-white hover:text-blue-400 transition-colors">Galeria</a>
            <a href="#about" className="text-white hover:text-blue-400 transition-colors">Sobre</a>
            <a href="#contact" className="text-white hover:text-blue-400 transition-colors">Contato</a>
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
              <a href="#home" className="text-white hover:text-blue-400 transition-colors" onClick={toggleMenu}>Home</a>
              <a href="#menu" className="text-white hover:text-blue-400 transition-colors" onClick={toggleMenu}>Menu</a>
              <a href="#gallery" className="text-white hover:text-blue-400 transition-colors" onClick={toggleMenu}>Galeria</a>
              <a href="#about" className="text-white hover:text-blue-400 transition-colors" onClick={toggleMenu}>Sobre</a>
              <a href="#contact" className="text-white hover:text-blue-400 transition-colors" onClick={toggleMenu}>Contato</a>
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
