
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Utensils, Menu, X, Truck, Settings } from 'lucide-react';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';
import { useEstablishmentData } from '@/hooks/useEstablishmentData';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { data: establishmentData, loading } = useEstablishmentData();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { settings } = useSiteSettings();
  const { isAdmin } = useAdminAuth();
  const navigate = useNavigate();
  const primaryColor = settings?.primaryColor || '#0066cc';
  const nameEstabelecimento = settings?.establishmentData?.name || '';
  const menuUrl = establishmentData?.menuUrl || '';

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

  const handleOrderClick = () => {
    const deliverySection = document.getElementById('delivery');
    if (deliverySection) {
      window.scrollTo({
        top: deliverySection.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };

  const handleAdminClick = () => {
    navigate('/admin');
  };

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-black text-white shadow-md py-2' : 'bg-black/90 backdrop-blur-sm text-white py-4'
      }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div style={{ backgroundColor: primaryColor }} className="p-2 rounded-lg">
              <Utensils className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl text-white">{nameEstabelecimento}</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <a
              href="#home"
              onClick={(e) => handleNavClick(e, 'home')}
              className="text-white transition-all duration-300 hover:opacity-80"
              style={{ color: 'white' }}
              onMouseEnter={(e) => e.currentTarget.style.color = primaryColor}
              onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
            >
              Home
            </a>
            <a
              href="#menu"
              onClick={(e) => handleNavClick(e, 'menu')}
              className="text-white transition-all duration-300 hover:opacity-80"
              style={{ color: 'white' }}
              onMouseEnter={(e) => e.currentTarget.style.color = primaryColor}
              onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
            >
              Menu
            </a>
            <a
              href="#gallery"
              onClick={(e) => handleNavClick(e, 'gallery')}
              className="text-white transition-all duration-300 hover:opacity-80"
              style={{ color: 'white' }}
              onMouseEnter={(e) => e.currentTarget.style.color = primaryColor}
              onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
            >
              Galeria
            </a>
            <a
              href="#about"
              onClick={(e) => handleNavClick(e, 'about')}
              className="text-white transition-all duration-300 hover:opacity-80"
              style={{ color: 'white' }}
              onMouseEnter={(e) => e.currentTarget.style.color = primaryColor}
              onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
            >
              Sobre
            </a>
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, 'contact')}
              className="text-white transition-all duration-300 hover:opacity-80"
              style={{ color: 'white' }}
              onMouseEnter={(e) => e.currentTarget.style.color = primaryColor}
              onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
            >
              Contato
            </a>
            <a
              href="#delivery"
              onClick={(e) => handleNavClick(e, 'delivery')}
              className="text-white transition-all duration-300 hover:opacity-80 flex items-center gap-1"
              style={{ color: 'white' }}
              onMouseEnter={(e) => e.currentTarget.style.color = primaryColor}
              onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
            >
              <Truck className="h-4 w-4" />
              Delivery
            </a>
          </div>

          {/* Order Button + Admin Button - Desktop */}
          <div className="hidden md:flex items-center gap-3">
            {isAdmin && (
              <Button
                onClick={handleAdminClick}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm rounded-xl transition-all duration-300 flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Admin
              </Button>
            )}
            <Button
              onClick={handleOrderClick}
              className="bg-gradient-to-r text-white font-semibold px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-white/20"
              style={{ 
                backgroundImage: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}dd)`,
                boxShadow: `0 4px 15px ${primaryColor}40`
              }}
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
            <a
              href="#home"
              onClick={(e) => handleNavClick(e, 'home')}
              className="block text-white transition-all duration-300 hover:opacity-80"
            >
              Home
            </a>
            <a
              href="#menu"
              onClick={(e) => handleNavClick(e, 'menu')}
              className="block text-white transition-all duration-300 hover:opacity-80"
            >
              Menu
            </a>
            <a
              href="#gallery"
              onClick={(e) => handleNavClick(e, 'gallery')}
              className="block text-white transition-all duration-300 hover:opacity-80"
            >
              Galeria
            </a>
            <a
              href="#about"
              onClick={(e) => handleNavClick(e, 'about')}
              className="block text-white transition-all duration-300 hover:opacity-80"
            >
              Sobre
            </a>
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, 'contact')}
              className="block text-white transition-all duration-300 hover:opacity-80"
            >
              Contato
            </a>
            <a
              href="#delivery"
              onClick={(e) => handleNavClick(e, 'delivery')}
              className="text-white transition-all duration-300 hover:opacity-80 flex items-center gap-1"
            >
              <Truck className="h-4 w-4" />
              Delivery
            </a>
            {isAdmin && (
              <Button
                onClick={handleAdminClick}
                variant="outline"
                className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm rounded-xl transition-all duration-300 flex items-center gap-2 justify-center mt-3"
              >
                <Settings className="h-4 w-4" />
                Painel Admin
              </Button>
            )}
            <Button
              onClick={handleOrderClick}
              className="w-full bg-gradient-to-r text-white font-semibold px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-white/20 mt-4"
              style={{ 
                backgroundImage: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}dd)`,
                boxShadow: `0 4px 15px ${primaryColor}40`
              }}
            >
              Fazer Pedido
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
