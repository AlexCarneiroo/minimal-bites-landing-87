
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
    <nav className={`sticky top-0 z-50 transition-all duration-500 ${
      isScrolled ? 'bg-black text-white shadow-md py-2' : 'bg-black/90 backdrop-blur-sm text-white py-4'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <span className="font-bold text-xl text-white transition-all duration-500 hover:text-blue-400">Sabor Express</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {['Home', 'Menu', 'Galeria', 'Sobre', 'Contato'].map((item, index) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`} 
                className="text-white hover:text-blue-400 transition-colors relative overflow-hidden group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {item}
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
              </a>
            ))}
          </div>
          
          {/* Order Button - Desktop */}
          <div className="hidden md:flex items-center">
            <Button className="bg-blue-600 text-white hover:bg-blue-700 rounded-full px-6 transform transition-transform hover:scale-105 hover:shadow-lg">
              Fazer Pedido
            </Button>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-white p-2 transition-transform duration-300 hover:rotate-180">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 animate-fade-in">
            <div className="flex flex-col space-y-4">
              {['Home', 'Menu', 'Galeria', 'Sobre', 'Contato'].map((item, index) => (
                <a 
                  key={item}
                  href={`#${item.toLowerCase()}`} 
                  className="text-white hover:text-blue-400 transition-all duration-300 transform translate-x-0 hover:translate-x-2" 
                  onClick={toggleMenu}
                  style={{ animationDelay: `${index * 100}ms`, opacity: 0, animation: 'fadeSlideIn 0.5s forwards' }}
                >
                  {item}
                </a>
              ))}
              <div className="pt-4 border-t border-gray-700">
                <Button className="bg-blue-600 text-white hover:bg-blue-700 w-full rounded-full transform transition hover:scale-105">
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
