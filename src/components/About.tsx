
import { useState, useEffect } from 'react';
import { Clock, MapPin } from 'lucide-react';
import { useEstablishmentData } from '@/hooks/useEstablishmentData';
import { getAboutSettings } from '@/lib/firebase-operations';

interface AboutData {
  title?: string;
  description?: string;
  images?: string[];
}

const About = () => {
  const { data: establishmentData } = useEstablishmentData();
  const [aboutData, setAboutData] = useState<AboutData>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const data = await getAboutSettings();
        if (data) {
          setAboutData(data);
        }
      } catch (error) {
        console.error('Erro ao carregar dados sobre:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  // Usar dados do banco ou fallback
  const title = aboutData.title || 'Sobre Nós';
  const description = aboutData.description || 'A Sabor Express nasceu da paixão por comida de qualidade e do desejo de oferecer lanches artesanais feitos com ingredientes frescos e selecionados. Desde 2010, nosso compromisso é proporcionar uma experiência única, com um ambiente acolhedor e um atendimento que faz você se sentir em casa.';
  const mainImage = aboutData.images?.[0] || 'https://images.unsplash.com/photo-1513639776629-7b40dd08d4c6?auto=format&fit=crop&q=80&w=1200';
  const secondaryImage = aboutData.images?.[1] || 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=500';
  const galleryImages = aboutData.images?.slice(2, 5) || [
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=400'
  ];

  // Dados do estabelecimento
  const establishmentName = establishmentData?.name || 'Sabor Express';
  const address = establishmentData?.address || 'Rua das Delicias, 123 - Centro - São Paulo';
  const schedule = establishmentData?.schedule || {
    weekdays: 'Seg - Sex: 11h às 22h',
    weekends: 'Sáb - Dom: 12h às 23h'
  };

  return (
    <section id="about" className="py-20 bg-snackbar-softgray">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-snackbar-dark mb-6">{title}</h2>
          <div className="h-1 w-24 bg-snackbar-blue mx-auto mb-8"></div>
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <div className="relative">
              <img 
                src={mainImage} 
                alt={`${establishmentName} - ambiente interno`} 
                className="rounded-lg shadow-lg w-full h-auto aspect-[4/3] object-cover"
              />
              <div className="absolute -bottom-8 -left-8 hidden md:block">
                <img 
                  src={secondaryImage} 
                  alt={`${establishmentName} - ambiente acolhedor`} 
                  className="rounded-lg shadow-lg w-48 h-48 object-cover border-4 border-white"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-16">
              {galleryImages.map((image, index) => (
                <img 
                  key={index}
                  src={image} 
                  alt={`${establishmentName} - espaço ${index + 1}`} 
                  className="rounded-lg shadow-sm h-24 object-cover w-full"
                />
              ))}
            </div>
          </div>
          
          <div className="md:w-1/2 mt-16 md:mt-0">
            <p className="text-snackbar-gray mb-6">
              {description}
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-white p-3 rounded-full shadow-sm">
                  <Clock className="w-5 h-5 text-snackbar-blue" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-snackbar-dark mb-1">Horário de Funcionamento</h3>
                  <p className="text-snackbar-gray">{schedule.weekdays}</p>
                  <p className="text-snackbar-gray">{schedule.weekends}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-white p-3 rounded-full shadow-sm">
                  <MapPin className="w-5 h-5 text-snackbar-blue" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-snackbar-dark mb-1">Localização</h3>
                  <p className="text-snackbar-gray">{address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
