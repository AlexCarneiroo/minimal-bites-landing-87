
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Utensils, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Utensils className="w-6 h-6 text-snackbar-dark" />
            <span className="font-bold text-xl text-snackbar-dark">Sabor Express</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <a href="#home" className="text-snackbar-dark hover:text-snackbar-gray transition-colors">Home</a>
            <a href="#menu" className="text-snackbar-dark hover:text-snackbar-gray transition-colors">Menu</a>
            <a href="#about" className="text-snackbar-dark hover:text-snackbar-gray transition-colors">Sobre</a>
            <a href="#contact" className="text-snackbar-dark hover:text-snackbar-gray transition-colors">Contato</a>
          </div>
          
          {/* Order Button - Desktop */}
          <div className="hidden md:block">
            <Button className="bg-snackbar-dark text-white hover:bg-black">
              Fazer Pedido
            </Button>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-snackbar-dark">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 animate-fade-in">
            <div className="flex flex-col space-y-4">
              <a href="#home" className="text-snackbar-dark hover:text-snackbar-gray transition-colors" onClick={toggleMenu}>Home</a>
              <a href="#menu" className="text-snackbar-dark hover:text-snackbar-gray transition-colors" onClick={toggleMenu}>Menu</a>
              <a href="#about" className="text-snackbar-dark hover:text-snackbar-gray transition-colors" onClick={toggleMenu}>Sobre</a>
              <a href="#contact" className="text-snackbar-dark hover:text-snackbar-gray transition-colors" onClick={toggleMenu}>Contato</a>
              <Button className="bg-snackbar-dark text-white hover:bg-black w-full">
                Fazer Pedido
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
