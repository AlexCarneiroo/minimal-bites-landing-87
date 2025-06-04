
import { MapPin, Phone, Mail } from 'lucide-react';
import { useEstablishmentData } from '@/hooks/useEstablishmentData';

const Contact = () => {
  const { data: establishmentData, loading } = useEstablishmentData();

  // Dados padrão como fallback
  const defaultData = {
    address: 'Rua das Delicias, 123, Centro, São Paulo',
    phone: '(11) 99999-9999',
    email: 'contato@saborexpress.com',
    mapsUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117002.25399198493!2d-46.7030389!3d-23.5505199!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce448183a461d1%3A0x9ba94b08ff335bae!2zU8OjbyBQYXVsbywgU1A!5e0!3m2!1spt-BR!2sbr!4v1716414016561!5m2!1spt-BR!2sbr'
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
          <p className="text-snackbar-gray max-w-xl mx-auto">
            Estamos ansiosos para ouvir você. Entre em contato conosco ou visite-nos pessoalmente!
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-12">
          <div className="md:w-1/2 lg:w-1/3">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="bg-white p-4 rounded-full shadow-md">
                  <MapPin className="w-6 h-6 text-snackbar-blue" />
                </div>
                <div>
                  <h4 className="font-medium text-snackbar-dark text-xl">Endereço</h4>
                  <p className="text-snackbar-gray mt-2">{contactData.address}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-white p-4 rounded-full shadow-md">
                  <Phone className="w-6 h-6 text-snackbar-blue" />
                </div>
                <div>
                  <h4 className="font-medium text-snackbar-dark text-xl">Telefone</h4>
                  <p className="text-snackbar-gray mt-2">{contactData.phone}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-white p-4 rounded-full shadow-md">
                  <Mail className="w-6 h-6 text-snackbar-blue" />
                </div>
                <div>
                  <h4 className="font-medium text-snackbar-dark text-xl">Email</h4>
                  <p className="text-snackbar-gray mt-2">{contactData.email}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="md:w-1/2 lg:w-1/2 mt-8 md:mt-0">
            <div className="aspect-video w-full rounded-lg overflow-hidden shadow-lg">
              <iframe 
                src={contactData.mapsUrl}
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
