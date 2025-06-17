import { MapPin, Phone, Mail, Star } from 'lucide-react';
import { useEstablishmentData } from '@/hooks/useEstablishmentData';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';

const Contact = () => {
  const { data: establishmentData, loading } = useEstablishmentData();
  const { settings } = useSiteSettings();
  const primaryColor = settings?.primaryColor || '';
  const defaultData = {
    address: 'Rua das Delícias, 123, Centro, São Paulo',
    phone: '(11) 99999-9999',
    email: 'contato@saborexpress.com',
    mapsUrl: `<iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d12943.622319559774!2d-46.4117453!3d-23.4585793!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce632bc1755ebb%3A0xa9284ae08e4ff979!2sBluefit%20Pimentas!5e1!3m2!1sen!2sbr!4v1749836018646!5m2!1sen!2sbr" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`
  };

  const contactData = {
    address: establishmentData?.address || defaultData.address,
    phone: establishmentData?.phone || defaultData.phone,
    email: establishmentData?.email || defaultData.email,
    mapsUrl: establishmentData?.mapsUrl || defaultData.mapsUrl
  };

  if (loading) {
    return (
      <section id="contact" className="py-20 bg-snackbar-peach/30">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-snackbar-gray">Carregando informações de contato...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="py-20 bg-snackbar-peach/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-snackbar-dark mb-4">Entre em Contato</h2>
          <div className="flex justify-center items-center gap-2 mb-4">
            <div className="h-[1px] w-10 bg-snackbar-gray"></div>
            <Star
              className="w-5 h-5"
              style={{ color: primaryColor }}
              fill="currentColor"
            />
            <div className="h-[1px] w-10 bg-snackbar-gray"></div>
          </div>{" "}
          <p className="text-snackbar-gray max-w-xl mx-auto">
            Estamos ansiosos para ouvir você. Entre em contato conosco ou visite-nos pessoalmente!
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-12">
          {/* Coluna de contato */}
          <div className="md:w-1/2 lg:w-1/3">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="bg-white p-4 rounded-full shadow-md">
                  <MapPin className="w-6 h-6 " style={{ color: primaryColor }} />
                </div>
                <div>
                  <h4 className="font-medium text-snackbar-dark text-xl">Endereço</h4>
                  <p className="text-snackbar-gray mt-2">{contactData.address}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-white p-4 rounded-full shadow-md">
                  <Phone className="w-6 h-6 " style={{ color: primaryColor }} />
                </div>
                <div>
                  <h4 className="font-medium text-snackbar-dark text-xl">Telefone</h4>
                  <p className="text-snackbar-gray mt-2">{contactData.phone}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-white p-4 rounded-full shadow-md">
                  <Mail className="w-6 h-6" style={{ color: primaryColor }} />
                </div>
                <div>
                  <h4 className="font-medium text-snackbar-dark text-xl">Email</h4>
                  <p className="text-snackbar-gray mt-2">{contactData.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Coluna com o mapa */}
          <div className="md:w-1/2 lg:w-1/2 mt-8 md:mt-0">
            <div
              className="aspect-video w-full rounded-lg overflow-hidden shadow-lg"
              dangerouslySetInnerHTML={{ __html: contactData.mapsUrl }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
