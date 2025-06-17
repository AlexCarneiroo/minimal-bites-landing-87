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
    <footer className="bg-snackbar-dark text-white py-8">
      <div className="container mx-auto px-4">
        {/* Coluna 1 - Info básica */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            {footerData?.logo || generalData?.logo ? (
              <img
                src={footerData?.logo || generalData?.logo}
                alt={`${displayName} Logo`}
                className="h-8 w-auto"
              />
            ) : (
              <Utensils className="w-6 h-6 text-white" />
            )}
            <span className="font-bold text-xl" style={{ color: primariColor }}>{displayName}</span>
          </div>

          {displayDescription && (
            <p className="text-gray-300 text-sm mb-4">{displayDescription}</p>
          )}

          {displayAddress && (
            <p className="text-gray-300 text-sm mb-2">📍 {displayAddress}</p>
          )}

          {displayPhone && (
            <p className="text-gray-300 text-sm mb-2">📞 {displayPhone}</p>
          )}

          {displayEmail && (
            <p className="text-gray-300 text-sm mb-4">✉️ {displayEmail}</p>
          )}

          {/* Redes sociais */}
          <div className="flex space-x-4 mt-4">
            {socialMedia.facebook && (
              <a
                href={socialMedia.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors"
              >
                <Facebook size={20} />
              </a>
            )}
            {socialMedia.instagram && (
              <a
                href={socialMedia.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors"
              >
                <Instagram size={20} />
              </a>
            )}
            {socialMedia.linkedin && (
              <a
                href={socialMedia.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors"
              >
                <Linkedin size={20} />
              </a>
            )}
            {socialMedia.youtube && (
              <a
                href={socialMedia.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors"
              >
                <Youtube size={20} />
              </a>
            )}
          </div>
        </div>

        {/* Rodapé final */}
        <div className="border-t border-white/10 pt-6 text-center">
          <a
            href="https://www.logarithm.com.br/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 text-sm hover:text-white transition">
            {copyright}
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
