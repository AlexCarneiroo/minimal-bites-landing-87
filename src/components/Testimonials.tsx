
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { useFeedbacks } from '@/hooks/useFeedbacks';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';

const fallbackTestimonials = [
  {
    id: '1',
    name: 'Carlos Silva',
    comment: 'O melhor hambúrguer que já comi! Atendimento impecável e ambiente super agradável.',
    role: 'Cliente',
    image: 'https://i.pravatar.cc/150?img=11'
  },
  {
    id: '2',
    name: 'Maria Oliveira',
    comment: 'Frequento há anos e nunca me decepcionou. Os lanches são deliciosos e o milk-shake é incrível!',
    role: 'Cliente',
    image: 'https://i.pravatar.cc/150?img=5'
  },
  {
    id: '3',
    name: 'Paulo Santos',
    comment: 'Ótimo custo-benefício. Lanches generosos e muito saborosos. Recomendo!',
    role: 'Cliente',
    image: 'https://i.pravatar.cc/150?img=8'
  }
];

const Testimonials = () => {
  const { feedbacks, loading } = useFeedbacks();
  const { settings } = useSiteSettings();
  const primaryColor = settings?.primaryColor || '#0066cc';
  
  // Usar feedbacks do Firebase se disponíveis, senão usar dados de fallback
  const displayTestimonials = feedbacks.length > 0 ? feedbacks : fallbackTestimonials;

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-snackbar-gray">Carregando depoimentos...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-snackbar-dark mb-4">O Que Dizem Nossos Clientes</h2>
          <div className="flex justify-center items-center gap-2 mb-4">
            <div className="h-[1px] w-10 bg-snackbar-gray"></div>
            <Star className="w-5 h-5" style={{ color: primaryColor }} fill="currentColor" />
            <div className="h-[1px] w-10 bg-snackbar-gray"></div>
          </div>
          <p className="text-snackbar-gray max-w-xl mx-auto">
            A satisfação dos nossos clientes é o nosso maior reconhecimento
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayTestimonials.slice(0, 3).map(testimonial => (
            <Card key={testimonial.id} className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name} 
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h3 className="font-medium text-snackbar-dark">{testimonial.name}</h3>
                      {testimonial.role && (
                        <p className="text-sm text-snackbar-gray">{testimonial.role}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className="w-4 h-4 text-yellow-400" 
                        fill="currentColor" 
                      />
                    ))}
                  </div>
                </div>
                <p className="text-snackbar-gray text-sm italic">"{testimonial.comment}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
