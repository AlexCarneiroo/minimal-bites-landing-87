
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Utensils, Menu, X, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';
import { useCustomerAuth } from '@/hooks/useCustomerAuth';
import CustomerAuth from './CustomerAuth';
import CustomerProfile from './CustomerProfile';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { settings } = useSiteSettings();
  const { isLoggedIn, customerData } = useCustomerAuth();
  const [showCustomerAuth, setShowCustomerAuth] = useState(false);
  const [showCustomerProfile, setShowCustomerProfile] = useState(false);
  const navigate = useNavigate();

  const handleCustomerAuthSuccess = () => {
    setShowCustomerAuth(false);
    setShowCustomerProfile(true);
  };

  const handleCustomerButton = () => {
    if (isLoggedIn) {
      setShowCustomerProfile(true);
    } else {
      setShowCustomerAuth(true);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleSmoothScroll = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
    closeMobileMenu();
  };

  const primariColor = settings?.primaryColor || '';
  const nameEstabelecimento = settings?.establishmentData?.name || 'Nome do Estabelecimento';
  const logoUrl = settings?.establishmentData?.logo || '';

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/60 backdrop-blur-lg shadow-sm border-b border-white/20 transition-all duration-300">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 animate-fade-in">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="h-8 w-auto transition-transform duration-300 hover:scale-110" />
            ) : (
              <div style={{ backgroundColor: primariColor }} className="p-2 rounded-lg transition-transform duration-300 hover:scale-110">
                <Utensils className="w-6 h-6 text-white" />
              </div>
            )}
            <span className="font-bold text-lg md:text-2xl transition-colors duration-300 hover:opacity-80" style={{ color: primariColor }}>
              {nameEstabelecimento}
            </span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            {/* Navigation links */}
            <Link 
              to="/" 
              className="hover:text-gray-600 transition-all duration-300 text-gray-800 font-medium relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full"
            >
              Início
            </Link>
            <button 
              onClick={() => handleSmoothScroll('menu')} 
              className="hover:text-gray-600 transition-all duration-300 text-gray-800 font-medium relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full"
            >
              Menu
            </button>
            <button 
              onClick={() => handleSmoothScroll('gallery')} 
              className="hover:text-gray-600 transition-all duration-300 text-gray-800 font-medium relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full"
            >
              Galeria
            </button>
            <button 
              onClick={() => handleSmoothScroll('delivery')} 
              className="hover:text-gray-600 transition-all duration-300 text-gray-800 font-medium relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full"
            >
              Delivery
            </button>
            <button 
              onClick={() => handleSmoothScroll('about')} 
              className="hover:text-gray-600 transition-all duration-300 text-gray-800 font-medium relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full"
            >
              Sobre
            </button>
            <button 
              onClick={() => handleSmoothScroll('contact')} 
              className="hover:text-gray-600 transition-all duration-300 text-gray-800 font-medium relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full"
            >
              Contato
            </button>
          </div>

          <div className="flex items-center space-x-4">
            {/* Botão Área do Cliente */}
            <button
              onClick={handleCustomerButton}
              className="font-medium hidden md:flex items-center gap-2 text-white hover:opacity-90 transition-all duration-300 hover:scale-105 shadow-lg py-2 px-4 rounded-xl"
              style={{ backgroundColor: primariColor }}
            >
              <User className="w-4 h-4 font-medium" />
              {isLoggedIn ? `Olá, ${customerData?.name?.split(' ')[0]}` : 'Área do Cliente'}
            </button>

            {/* Mobile menu button */}
            <button 
              onClick={toggleMobileMenu} 
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-all duration-300 hover:scale-110"
            >
              <div className="relative w-6 h-6">
                <Menu 
                  className={`h-6 w-6 absolute transition-all duration-300 ${
                    isMobileMenuOpen ? 'rotate-180 opacity-0' : 'rotate-0 opacity-100'
                  }`} 
                />
                <X 
                  className={`h-6 w-6 absolute transition-all duration-300 ${
                    isMobileMenuOpen ? 'rotate-0 opacity-100' : 'rotate-180 opacity-0'
                  }`} 
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden bg-white/80 backdrop-blur-lg border-t border-white/20 transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="px-4 py-4 space-y-3">
            {/* Mobile navigation links */}
            <Link 
              to="/" 
              className="block py-3 px-2 hover:text-gray-600 transition-all duration-300 text-gray-800 font-medium rounded-lg hover:bg-gray-100/50 transform hover:translate-x-2" 
              onClick={closeMobileMenu}
            >
              Início
            </Link>
            <button 
              onClick={() => handleSmoothScroll('menu')} 
              className="block py-3 px-2 hover:text-gray-600 transition-all duration-300 text-left w-full text-gray-800 font-medium rounded-lg hover:bg-gray-100/50 transform hover:translate-x-2"
            >
              Menu
            </button>
            <button 
              onClick={() => handleSmoothScroll('gallery')} 
              className="block py-3 px-2 hover:text-gray-600 transition-all duration-300 text-left w-full text-gray-800 font-medium rounded-lg hover:bg-gray-100/50 transform hover:translate-x-2"
            >
              Galeria
            </button>
            <button 
              onClick={() => handleSmoothScroll('delivery')} 
              className="block py-3 px-2 hover:text-gray-600 transition-all duration-300 text-left w-full text-gray-800 font-medium rounded-lg hover:bg-gray-100/50 transform hover:translate-x-2"
            >
              Entrega
            </button>
            <button 
              onClick={() => handleSmoothScroll('about')} 
              className="block py-3 px-2 hover:text-gray-600 transition-all duration-300 text-left w-full text-gray-800 font-medium rounded-lg hover:bg-gray-100/50 transform hover:translate-x-2"
            >
              Sobre
            </button>
            <button 
              onClick={() => handleSmoothScroll('contact')} 
              className="block py-3 px-2 hover:text-gray-600 transition-all duration-300 text-left w-full text-gray-800 font-medium rounded-lg hover:bg-gray-100/50 transform hover:translate-x-2"
            >
              Contato
            </button>
            
            <div className="pt-2">
              <button
                onClick={handleCustomerButton}
                className="w-full justify-start gap-2 text-white hover:opacity-90 transition-all duration-300 hover:scale-105 shadow-lg p-2 rounded-lg flex items-center font-medium"
                style={{ backgroundColor: primariColor }}
              >
                <User className="w-4 h-4 font-medium" />
                {isLoggedIn ? `Olá, ${customerData?.name?.split(' ')[0]}` : 'Área do Cliente'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Modais */}
      <CustomerAuth
        isOpen={showCustomerAuth}
        onClose={() => setShowCustomerAuth(false)}
        onSuccess={handleCustomerAuthSuccess}
      />

      <CustomerProfile
        isOpen={showCustomerProfile}
        onClose={() => setShowCustomerProfile(false)}
      />
    </>
  );
};

export default Navbar;
