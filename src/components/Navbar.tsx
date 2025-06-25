
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Utensils, Menu, X, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ReservationForm from './ReservationForm';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';
import { useCustomerAuth } from '@/hooks/useCustomerAuth';
import CustomerAuth from './CustomerAuth';
import CustomerProfile from './CustomerProfile';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showReservationDialog, setShowReservationDialog] = useState(false);
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

  const handleReservationClick = () => {
    if (isLoggedIn) {
      setShowReservationDialog(true);
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
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-md shadow-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="h-8 w-auto" />
            ) : (
              <div style={{ backgroundColor: primariColor }} className="p-2 rounded-lg">
                <Utensils className="w-6 h-6 text-white" />
              </div>
            )}
            <span className="font-bold text-lg md:text-2xl" style={{ color: primariColor }}>{nameEstabelecimento}</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            {/* Navigation links */}
            <Link to="/" className="hover:text-gray-600 transition-colors duration-300 text-gray-800 font-medium">
              Início
            </Link>
            <button 
              onClick={() => handleSmoothScroll('menu')} 
              className="hover:text-gray-600 transition-colors duration-300 text-gray-800 font-medium"
            >
              Menu de Destaque
            </button>
            <button 
              onClick={() => handleSmoothScroll('gallery')} 
              className="hover:text-gray-600 transition-colors duration-300 text-gray-800 font-medium"
            >
              Galeria
            </button>
            <button 
              onClick={() => handleSmoothScroll('delivery')} 
              className="hover:text-gray-600 transition-colors duration-300 text-gray-800 font-medium"
            >
              Entrega
            </button>
            <button 
              onClick={() => handleSmoothScroll('about')} 
              className="hover:text-gray-600 transition-colors duration-300 text-gray-800 font-medium"
            >
              Sobre
            </button>
            <button 
              onClick={() => handleSmoothScroll('contact')} 
              className="hover:text-gray-600 transition-colors duration-300 text-gray-800 font-medium"
            >
              Contato
            </button>
            <button 
              onClick={handleReservationClick}
              className="hover:text-gray-600 transition-colors duration-300 text-gray-800 font-medium"
            >
              Reservar Mesa
            </button>
          </div>

          <div className="flex items-center space-x-4">
            {/* Botão Área do Cliente */}
            <Button
              onClick={handleCustomerButton}
              className="hidden md:flex items-center gap-2 text-white hover:opacity-90 transition-opacity"
              style={{ backgroundColor: primariColor }}
            >
              <User className="w-4 h-4" />
              {isLoggedIn ? `Olá, ${customerData?.name?.split(' ')[0]}` : 'Área do Cliente'}
            </Button>

            {/* Mobile menu button */}
            <button onClick={toggleMobileMenu} className="md:hidden">
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white/90 backdrop-blur-md border-t border-white/20">
            <div className="px-4 py-4 space-y-3">
              {/* Mobile navigation links */}
              <Link to="/" className="block py-2 hover:text-gray-600 transition-colors duration-300 text-gray-800 font-medium" onClick={closeMobileMenu}>
                Início
              </Link>
              <button 
                onClick={() => handleSmoothScroll('menu')} 
                className="block py-2 hover:text-gray-600 transition-colors duration-300 text-left w-full text-gray-800 font-medium"
              >
                Menu de Destaque
              </button>
              <button 
                onClick={() => handleSmoothScroll('gallery')} 
                className="block py-2 hover:text-gray-600 transition-colors duration-300 text-left w-full text-gray-800 font-medium"
              >
                Galeria
              </button>
              <button 
                onClick={() => handleSmoothScroll('delivery')} 
                className="block py-2 hover:text-gray-600 transition-colors duration-300 text-left w-full text-gray-800 font-medium"
              >
                Entrega
              </button>
              <button 
                onClick={() => handleSmoothScroll('about')} 
                className="block py-2 hover:text-gray-600 transition-colors duration-300 text-left w-full text-gray-800 font-medium"
              >
                Sobre
              </button>
              <button 
                onClick={() => handleSmoothScroll('contact')} 
                className="block py-2 hover:text-gray-600 transition-colors duration-300 text-left w-full text-gray-800 font-medium"
              >
                Contato
              </button>
              <button 
                onClick={() => { handleReservationClick(); closeMobileMenu(); }}
                className="block py-2 hover:text-gray-600 transition-colors duration-300 text-left w-full text-gray-800 font-medium"
              >
                Reservar Mesa
              </button>
              
              <Button
                onClick={handleCustomerButton}
                className="w-full justify-start gap-2 text-white hover:opacity-90 transition-opacity"
                style={{ backgroundColor: primariColor }}
              >
                <User className="w-4 h-4" />
                {isLoggedIn ? `Olá, ${customerData?.name?.split(' ')[0]}` : 'Área do Cliente'}
              </Button>
            </div>
          </div>
        )}
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

      {/* Reservation dialog */}
      {showReservationDialog && (
        <ReservationForm onClose={() => setShowReservationDialog(false)} />
      )}
    </>
  );
};

export default Navbar;
