
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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

  const primariColor = settings?.primaryColor || '';
  const nameEstabelecimento = settings?.establishmentData?.name || 'Nome do Estabelecimento';
  const logoUrl = settings?.establishmentData?.logo || '';

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm">
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
            <Link to="/" className="hover:text-gray-600 transition-colors duration-300">
              Início
            </Link>
            <a href="#gallery" className="hover:text-gray-600 transition-colors duration-300">
              Galeria
            </a>
            <a href="#delivery" className="hover:text-gray-600 transition-colors duration-300">
              Entrega
            </a>
            <a href="#about" className="hover:text-gray-600 transition-colors duration-300">
              Sobre
            </a>
            <a href="#contact" className="hover:text-gray-600 transition-colors duration-300">
              Contato
            </a>
            <button onClick={() => setShowReservationDialog(true)} className="hover:text-gray-600 transition-colors duration-300">
              Reservar
            </button>
          </div>

          <div className="flex items-center space-x-4">
            {/* Botão Área do Cliente */}
            <Button
              variant="outline"
              onClick={handleCustomerButton}
              className="hidden md:flex items-center gap-2"
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
          <div className="md:hidden bg-white border-t">
            <div className="px-4 py-4 space-y-3">
              {/* Mobile navigation links */}
              <Link to="/" className="block py-2 hover:text-gray-600 transition-colors duration-300" onClick={closeMobileMenu}>
                Início
              </Link>
              <a href="#gallery" className="block py-2 hover:text-gray-600 transition-colors duration-300" onClick={closeMobileMenu}>
                Galeria
              </a>
              <a href="#delivery" className="block py-2 hover:text-gray-600 transition-colors duration-300" onClick={closeMobileMenu}>
                Entrega
              </a>
              <a href="#about" className="block py-2 hover:text-gray-600 transition-colors duration-300" onClick={closeMobileMenu}>
                Sobre
              </a>
              <a href="#contact" className="block py-2 hover:text-gray-600 transition-colors duration-300" onClick={closeMobileMenu}>
                Contato
              </a>
              <button onClick={() => {setShowReservationDialog(true); closeMobileMenu();}} className="block py-2 hover:text-gray-600 transition-colors duration-300 text-left w-full">
                Reservar
              </button>
              
              <Button
                variant="outline"
                onClick={handleCustomerButton}
                className="w-full justify-start gap-2"
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
