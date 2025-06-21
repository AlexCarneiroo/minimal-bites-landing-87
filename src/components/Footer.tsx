
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
  companyName?: string;
  copyright?: string;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  };
}

const Footer = () => {
  const [footerData, setFooterData] = useState<FooterData>({});
  const [generalData, setGeneralData] = useState<any>({});

  const { settings } = useSiteSettings();
  const primariColor = settings?.primaryColor || '';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [footerSettings, generalSettings] = await Promise.all([
          getFooterSettings(),
          getGeneralSettings(),
        ]);

        if (footerSettings) setFooterData(footerSettings);
        if (generalSettings) setGeneralData(generalSettings);
      } catch (error) {
        console.error('Erro ao buscar dados do footer:', error);
      }
    };

    fetchData();
  }, []);

  const displayName = footerData?.companyName || generalData?.name || 'Logarithm';
  const displayDescription = footerData?.description || generalData?.description || '';
  const displayPhone = footerData?.phone || generalData?.phone || '';
  const displayEmail = footerData?.email || generalData?.email || '';
  const displayAddress = footerData?.address || generalData?.address || '';
  const socialMedia = footerData?.socialMedia || generalData?.socialMedia || {};
  const copyright =
    footerData?.copyright ||
    `© ${new Date().getFullYear()} Todos os direitos reservados.`;

  return (
    <footer className="bg-black text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Lado Esquerdo - Informações da Empresa */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              {footerData?.logo || generalData?.logo ? (
                <img
                  src={footerData?.logo || generalData?.logo}
                  alt={`${displayName} Logo`}
                  className="h-10 w-auto"
                />
              ) : (
                <div style={{ backgroundColor: primariColor }} className="p-2 rounded-lg">
                  <Utensils className="w-6 h-6 text-white" />
                </div>
              )}
              <span className="font-bold text-2xl" style={{ color: primariColor }}>{displayName}</span>
            </div>

            {displayDescription && (
              <p className="text-gray-300 text-base leading-relaxed max-w-md">
                {displayDescription}
              </p>
            )}
          </div>

          {/* Lado Direito - Contato e Redes Sociais */}
          <div className="space-y-8">
            {/* Informações de Contato */}
            <div>
              <h3 className="font-semibold text-xl mb-6" style={{ color: primariColor }}>
                Informações de Contato
              </h3>
              
              <div className="space-y-4">
                {displayAddress && (
                  <div className="flex items-start space-x-3">
                    <span className="text-lg mt-1" style={{ color: primariColor }}>📍</span>
                    <p className="text-gray-300">{displayAddress}</p>
                  </div>
                )}

                {displayPhone && (
                  <div className="flex items-center space-x-3">
                    <span className="text-lg" style={{ color: primariColor }}>📞</span>
                    <p className="text-gray-300">{displayPhone}</p>
                  </div>
                )}

                {displayEmail && (
                  <div className="flex items-center space-x-3">
                    <span className="text-lg" style={{ color: primariColor }}>✉️</span>
                    <p className="text-gray-300">{displayEmail}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Redes Sociais */}
            {(socialMedia.facebook || socialMedia.instagram || socialMedia.linkedin || socialMedia.youtube) && (
              <div>
                <h3 className="font-semibold text-xl mb-6" style={{ color: primariColor }}>
                  Siga-nos nas Redes Sociais
                </h3>
                <div className="flex space-x-4">
                  {socialMedia.facebook && (
                    <a
                      href={socialMedia.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white/10 hover:bg-white/20 rounded-full p-3 transition-all duration-300 hover:scale-110"
                      style={{ 
                        borderColor: primariColor,
                        borderWidth: '1px'
                      }}
                    >
                      <Facebook size={24} />
                    </a>
                  )}
                  {socialMedia.instagram && (
                    <a
                      href={socialMedia.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white/10 hover:bg-white/20 rounded-full p-3 transition-all duration-300 hover:scale-110"
                      style={{ 
                        borderColor: primariColor,
                        borderWidth: '1px'
                      }}
                    >
                      <Instagram size={24} />
                    </a>
                  )}
                  {socialMedia.linkedin && (
                    <a
                      href={socialMedia.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white/10 hover:bg-white/20 rounded-full p-3 transition-all duration-300 hover:scale-110"
                      style={{ 
                        borderColor: primariColor,
                        borderWidth: '1px'
                      }}
                    >
                      <Linkedin size={24} />
                    </a>
                  )}
                  {socialMedia.youtube && (
                    <a
                      href={socialMedia.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white/10 hover:bg-white/20 rounded-full p-3 transition-all duration-300 hover:scale-110"
                      style={{ 
                        borderColor: primariColor,
                        borderWidth: '1px'
                      }}
                    >
                      <Youtube size={24} />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Linha de Copyright */}
        <div className="border-t border-white/10 mt-12 pt-8 text-center">
          <a
            href="https://www.logarithm.com.br/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors duration-300">
            {copyright}
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
