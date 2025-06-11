
import { useState, useEffect } from 'react';
import { Utensils, Facebook, Instagram, Linkedin, Youtube } from 'lucide-react';
import { getFooterSettings, getGeneralSettings } from '@/lib/firebase-operations';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';

interface FooterData {
  logo?: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  };
  copyright?: string;
}

const Footer = () => {
  const { settings } = useSiteSettings();
  const [footerData, setFooterData] = useState<FooterData>({});
  const [establishmentData, setEstablishmentData] = useState<any>({});
  const primaryColor = settings?.primaryColor || '#0066cc';

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const [footerSettings, generalSettings] = await Promise.all([
          getFooterSettings(),
          getGeneralSettings()
        ]);
        
        if (footerSettings) {
          setFooterData(footerSettings);
        }
        
        if (generalSettings) {
          setEstablishmentData(generalSettings);
        }
      } catch (error) {
        console.error('Erro ao carregar dados do footer:', error);
      }
    };

    fetchFooterData();
  }, []);

  const displayName = establishmentData?.name || 'Sabor Express';
  const displayDescription = footerData?.description || establishmentData?.description || 'Lanches artesanais feitos com ingredientes frescos e muito carinho para você.';
  const displayPhone = footerData?.phone || establishmentData?.phone || '';
  const displayEmail = footerData?.email || establishmentData?.email || '';
  const displayAddress = footerData?.address || establishmentData?.address || '';
  const displayCopyright = footerData?.copyright || `© ${new Date().getFullYear()} ${displayName}. Todos os direitos reservados.`;

  return (
    <footer className="bg-snackbar-dark text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              {footerData?.logo || establishmentData?.logo ? (
                <img 
                  src={footerData?.logo || establishmentData?.logo} 
                  alt={`${displayName} Logo`}
                  className="h-8 w-auto"
                />
              ) : (
                <Utensils className="w-6 h-6 text-white" />
              )}
              <span className="font-bold text-xl">{displayName}</span>
            </div>
            <p className="text-gray-300 text-sm mb-4">
              {displayDescription}
            </p>
            {displayAddress && (
              <p className="text-gray-300 text-sm mb-2">
                📍 {displayAddress}
              </p>
            )}
            {displayPhone && (
              <p className="text-gray-300 text-sm mb-2">
                📞 {displayPhone}
              </p>
            )}
            {displayEmail && (
              <p className="text-gray-300 text-sm">
                ✉️ {displayEmail}
              </p>
            )}
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Links Rápidos</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#home" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="#menu" className="hover:text-white transition-colors">Menu</a></li>
              <li><a href="#about" className="hover:text-white transition-colors">Sobre</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Contato</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Horário</h3>
            <ul className="space-y-2 text-gray-300">
              <li>Segunda - Sexta: {establishmentData?.schedule?.weekdays || '11h às 22h'}</li>
              <li>Sábado - Domingo: {establishmentData?.schedule?.weekends || '12h às 23h'}</li>
              <li>Feriados: {establishmentData?.schedule?.holidays || '12h às 20h'}</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Siga-nos</h3>
            <div className="flex space-x-4">
              {(footerData?.socialMedia?.facebook || establishmentData?.socialMedia?.facebook) && (
                <a 
                  href={footerData?.socialMedia?.facebook || establishmentData?.socialMedia?.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors"
                >
                  <Facebook size={20} />
                </a>
              )}
              {(footerData?.socialMedia?.instagram || establishmentData?.socialMedia?.instagram) && (
                <a 
                  href={footerData?.socialMedia?.instagram || establishmentData?.socialMedia?.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors"
                >
                  <Instagram size={20} />
                </a>
              )}
              {(footerData?.socialMedia?.linkedin || establishmentData?.socialMedia?.linkedin) && (
                <a 
                  href={footerData?.socialMedia?.linkedin || establishmentData?.socialMedia?.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors"
                >
                  <Linkedin size={20} />
                </a>
              )}
              {(footerData?.socialMedia?.youtube || establishmentData?.socialMedia?.youtube) && (
                <a 
                  href={footerData?.socialMedia?.youtube || establishmentData?.socialMedia?.youtube} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors"
                >
                  <Youtube size={20} />
                </a>
              )}
            </div>
          </div>
        </div>
        
        {/* Divisor */}
        <div className="my-10 border-t border-white/10"></div>
        
        {/* Seção da empresa desenvolvedora - Responsiva */}
        <div className="flex flex-col items-center text-center md:flex-row md:items-center md:justify-between md:text-left">
          <div className="flex flex-col items-center md:items-start mb-6 md:mb-0">
            <div className="flex items-center gap-3 mb-2">
              <img 
                src="/lovable-uploads/26d56408-a96d-4449-b9dc-fc1daedd8aaf.png"
                alt="MK Solutions Logo" 
                className="h-10 md:h-12 w-auto"
              />
            </div>
            <p className="text-sm text-gray-300 mt-2">
              Governança, tecnologia e escala para o seu provedor.
            </p>
            <p className="text-sm text-gray-300 mt-1">
              Fale conosco: (51) 3740 2900
            </p>
          </div>
          
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" 
              className="rounded-full p-2 hover:opacity-80 transition-colors"
              style={{ backgroundColor: primaryColor }}
            >
              <Instagram size={20} className="text-white" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
              className="rounded-full p-2 hover:opacity-80 transition-colors"
              style={{ backgroundColor: primaryColor }}
            >
              <Facebook size={20} className="text-white" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
              className="rounded-full p-2 hover:opacity-80 transition-colors"
              style={{ backgroundColor: primaryColor }}
            >
              <Linkedin size={20} className="text-white" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"
              className="rounded-full p-2 hover:opacity-80 transition-colors"
              style={{ backgroundColor: primaryColor }}
            >
              <Youtube size={20} className="text-white" />
            </a>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            {displayCopyright}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
