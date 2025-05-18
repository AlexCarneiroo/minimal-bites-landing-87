
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Utensils, Menu, X, ShoppingCart } from 'lucide-react';

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
      isScrolled ? 'bg-white shadow-md py-2' : 'bg-white/80 backdrop-blur-sm py-4'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-snackbar-orange to-snackbar-purple p-2 rounded-lg">
              <Utensils className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl text-snackbar-dark">Sabor Express</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <a href="#home" className="text-snackbar-dark hover:text-snackbar-orange transition-colors">Home</a>
            <a href="#menu" className="text-snackbar-dark hover:text-snackbar-orange transition-colors">Menu</a>
            <a href="#gallery" className="text-snackbar-dark hover:text-snackbar-orange transition-colors">Galeria</a>
            <a href="#about" className="text-snackbar-dark hover:text-snackbar-orange transition-colors">Sobre</a>
            <a href="#contact" className="text-snackbar-dark hover:text-snackbar-orange transition-colors">Contato</a>
          </div>
          
          {/* Order Button - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline" className="border-snackbar-gray text-snackbar-dark rounded-full">
              <ShoppingCart className="w-5 h-5 mr-2" />
              Carrinho (0)
            </Button>
            <Button className="bg-gradient-to-r from-snackbar-orange to-snackbar-purple text-white hover:opacity-90">
              Fazer Pedido
            </Button>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-snackbar-dark p-2">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 animate-fade-in">
            <div className="flex flex-col space-y-4">
              <a href="#home" className="text-snackbar-dark hover:text-snackbar-orange transition-colors" onClick={toggleMenu}>Home</a>
              <a href="#menu" className="text-snackbar-dark hover:text-snackbar-orange transition-colors" onClick={toggleMenu}>Menu</a>
              <a href="#gallery" className="text-snackbar-dark hover:text-snackbar-orange transition-colors" onClick={toggleMenu}>Galeria</a>
              <a href="#about" className="text-snackbar-dark hover:text-snackbar-orange transition-colors" onClick={toggleMenu}>Sobre</a>
              <a href="#contact" className="text-snackbar-dark hover:text-snackbar-orange transition-colors" onClick={toggleMenu}>Contato</a>
              <div className="pt-4 border-t border-snackbar-gray/20">
                <Button className="bg-gradient-to-r from-snackbar-orange to-snackbar-purple text-white hover:opacity-90 w-full">
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
