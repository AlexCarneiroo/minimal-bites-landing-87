
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface SpecialOffer {
  id: string;
  name: string;
  description: string;
  regularPrice: number;
  promoPrice?: number;
  discount?: string;
  label?: string;
  image: string;
}

const SpecialOffers = () => {
  const [offers, setOffers] = useState<SpecialOffer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const offersRef = collection(db, 'special-offers');
        const snapshot = await getDocs(offersRef);
        const offersList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as SpecialOffer[];
        
        // Mostrar apenas as primeiras 3 ofertas
        setOffers(offersList.slice(0, 3));
      } catch (error) {
        console.error('Erro ao carregar ofertas especiais:', error);
        // Fallback para ofertas estáticas em caso de erro
        setOffers([
          {
            id: '1',
            name: 'Combo Família',
            description: '4 hambúrgueres, 4 batatas e 4 refrigerantes',
            regularPrice: 150.00,
            promoPrice: 120.00,
            discount: '-20%',
            image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=600'
          },
          {
            id: '2',
            name: 'Lanches Vegetarianos',
            description: 'Opções saudáveis e deliciosas para todos os gostos',
            regularPrice: 25.90,
            label: 'NEW',
            image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&q=80&w=600'
          },
          {
            id: '3',
            name: 'Happy Hour',
            description: 'Compre um milk shake e ganhe outro, todos os dias das 15h às 17h',
            regularPrice: 16.90,
            label: '2x1',
            image: 'https://images.unsplash.com/photo-1638176066623-b5b2f71da06c?auto=format&fit=crop&q=80&w=600'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const getBadgeColor = (label?: string, discount?: string) => {
    if (discount) return 'bg-snackbar-orange';
    if (label === 'NEW') return 'bg-snackbar-blue';
    if (label === '2x1') return 'bg-snackbar-magenta';
    return 'bg-snackbar-purple';
  };

  const getButtonColor = (index: number) => {
    const colors = [
      'bg-snackbar-purple hover:bg-snackbar-purple/90',
      'bg-snackbar-blue hover:bg-snackbar-blue/90',
      'bg-snackbar-magenta hover:bg-snackbar-magenta/90'
    ];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-r from-snackbar-purple/20 to-snackbar-magenta/10">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-snackbar-gray">Carregando ofertas especiais...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-r from-snackbar-purple/20 to-snackbar-magenta/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-snackbar-dark mb-4">Ofertas Especiais</h2>
          <div className="flex justify-center items-center gap-2 mb-4">
            <div className="h-[1px] w-10 bg-snackbar-gray"></div>
            <Bell className="w-5 h-5 text-snackbar-purple" fill="currentColor" />
            <div className="h-[1px] w-10 bg-snackbar-gray"></div>
          </div>
          <p className="text-snackbar-gray max-w-xl mx-auto">
            Confira nossas promoções e desfrute de preços especiais
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          {offers.map((offer, index) => (
            <div key={offer.id} className="md:w-1/3 bg-white rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 hover:-translate-y-2">
              <div className="relative">
                <img 
                  src={offer.image} 
                  alt={offer.name} 
                  className="w-full h-48 object-cover"
                />
                <div className={`absolute top-4 right-4 ${getBadgeColor(offer.label, offer.discount)} text-white px-3 py-1 rounded-full font-bold`}>
                  {offer.discount || offer.label || 'OFERTA'}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-snackbar-dark mb-2">{offer.name}</h3>
                <p className="text-snackbar-gray mb-4">{offer.description}</p>
                <div className="flex items-center justify-between">
                  <div>
                    {offer.promoPrice ? (
                      <>
                        <span className="text-sm text-snackbar-gray line-through">
                          {formatPrice(offer.regularPrice)}
                        </span>
                        <span className="text-xl font-bold text-snackbar-purple ml-2">
                          {formatPrice(offer.promoPrice)}
                        </span>
                      </>
                    ) : (
                      <span className="text-xl font-bold text-snackbar-blue">
                        {offer.label === '2x1' ? formatPrice(offer.regularPrice) : `A partir de ${formatPrice(offer.regularPrice)}`}
                      </span>
                    )}
                  </div>
                  <Button className={getButtonColor(index)}>Pedir</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {offers.length === 0 && (
          <div className="text-center py-8">
            <p className="text-snackbar-gray">Nenhuma oferta especial disponível no momento.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default SpecialOffers;
