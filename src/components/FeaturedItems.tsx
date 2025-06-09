import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Star, Utensils, Coffee, IceCream, Pizza, Sandwich } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';

interface MenuItem {
  id: string;
  titulo: string;
  descricao: string;
  imagem: string;
  preco: number;
  precoEspecial?: number;
  categoria?: string;
}

const fallbackItems: MenuItem[] = [
  {
    id: '1',
    titulo: 'Hambúrguer Clássico',
    descricao: 'Pão brioche, carne 180g, queijo cheddar, alface, tomate e molho especial.',
    imagem: 'https://images.unsplash.com/photo-1550547660-d9450f8593ca?auto=format&fit=crop&q=60&w=800&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aGFtYnVyZ3VlcnxlbnwwfHwwfHx8MA%3D%3D',
    preco: 25.90,
    categoria: 'hamburguer'
  },
  {
    id: '2',
    titulo: 'Pizza Margherita',
    descricao: 'Massa fina, molho de tomate, mussarela de búfala e manjericão fresco.',
    imagem: 'https://images.unsplash.com/photo-1548611635-c99498c4f39f?auto=format&fit=crop&q=60&w=800&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHBpenphfGVufDB8fDB8fHww',
    preco: 32.50,
    categoria: 'pizza'
  },
  {
    id: '3',
    titulo: 'Milk-shake de Chocolate',
    descricao: 'Sorvete de chocolate, leite integral, calda de chocolate e chantilly.',
    imagem: 'https://images.unsplash.com/photo-1610786373984-369b9295e3f9?auto=format&fit=crop&q=60&w=800&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fG1pbGtzaGFrZXxlbnwwfHwwfHx8MA%3D%3D',
    preco: 18.00,
    precoEspecial: 15.00,
    categoria: 'sobremesa'
  }
];

const categoryIcons = {
  'hamburguer': Sandwich,
  'hamburger': Sandwich,
  'lanche': Sandwich,
  'sanduiche': Sandwich,
  'pizza': Pizza,
  'bebida': Coffee,
  'sobremesa': IceCream,
  'doce': IceCream,
  'salgado': Utensils,
  'entrada': Utensils,
  'prato principal': Utensils,
  'default': Utensils
};

const FeaturedItems = () => {
  const [items, setItems] = useState<MenuItem[]>(fallbackItems);
  const [loading, setLoading] = useState(true);
  const { settings } = useSiteSettings();
  const primaryColor = settings?.primaryColor || '#0066cc';

  useEffect(() => {
    const fetchItems = async () => {
      try {
        console.log('Buscando itens em destaque do cardápio...');
        const menuCollection = collection(db, 'menu');
        const snapshot = await getDocs(menuCollection);
        
        console.log('Documentos encontrados no cardápio:', snapshot.docs.length);
        
        if (snapshot.docs.length > 0) {
          const menuItems = snapshot.docs.map(doc => {
            const data = doc.data();
            console.log('Documento do cardápio:', doc.id, data);
            return {
              id: doc.id,
              titulo: data.titulo || 'Sem título',
              descricao: data.descricao || 'Sem descrição',
              imagem: data.imagem || '',
              preco: data.preco || 0,
              precoEspecial: data.precoEspecial || null,
              categoria: data.categoria || 'default'
            };
          });

          console.log('Itens processados do cardápio:', menuItems);
          setItems(menuItems);
          console.log('Cardápio carregado com sucesso:', menuItems.length);
        } else {
          console.log('Nenhum documento encontrado na coleção menu, usando fallback');
        }
      } catch (error) {
        console.error('Erro ao carregar cardápio:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const getCategoryIcon = (category: string) => {
    const normalizedCategory = category.toLowerCase();
    const IconComponent = categoryIcons[normalizedCategory as keyof typeof categoryIcons] || categoryIcons.default;
    return IconComponent;
  };

  if (loading) {
    return (
      <section id="menu" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-snackbar-gray">Carregando cardápio...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="menu" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-snackbar-dark mb-4">Cardápio em Destaque</h2>
          <div className="flex justify-center items-center gap-2 mb-4">
            <div className="h-[1px] w-10 bg-snackbar-gray"></div>
            <Utensils className="w-5 h-5" style={{ color: primaryColor }} />
            <div className="h-[1px] w-10 bg-snackbar-gray"></div>
          </div>
          <p className="text-snackbar-gray max-w-xl mx-auto">
            Descubra nossos pratos mais populares, preparados com ingredientes frescos e muito amor
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(item => {
            const IconComponent = getCategoryIcon(item.categoria || '');
            
            return (
              <Card key={item.id} className="border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group overflow-hidden">
                <div className="relative overflow-hidden">
                  <img 
                    src={item.imagem} 
                    alt={item.titulo} 
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full p-2">
                    <IconComponent className="w-5 h-5" style={{ color: primaryColor }} />
                  </div>
                  {item.precoEspecial && (
                    <div className="absolute top-4 right-4 rounded-full px-3 py-1 text-white text-sm font-semibold" style={{ backgroundColor: primaryColor }}>
                      Oferta!
                    </div>
                  )}
                </div>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-snackbar-dark group-hover:text-primary transition-colors">
                      {item.titulo}
                    </h3>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" />
                      <span className="text-sm text-snackbar-gray">4.8</span>
                    </div>
                  </div>
                  
                  {item.categoria && (
                    <p className="text-sm text-snackbar-gray mb-2 capitalize">{item.categoria}</p>
                  )}
                  
                  <p className="text-snackbar-gray mb-4 text-sm line-clamp-2">
                    {item.descricao}
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      {item.precoEspecial ? (
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold" style={{ color: primaryColor }}>
                            R$ {item.precoEspecial.toFixed(2)}
                          </span>
                          <span className="text-sm text-snackbar-gray line-through">
                            R$ {item.preco.toFixed(2)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-lg font-bold" style={{ color: primaryColor }}>
                          R$ {item.preco.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <Button 
                      size="sm" 
                      className="text-white font-medium hover:scale-105 transition-all duration-200"
                      style={{ backgroundColor: primaryColor }}
                    >
                      Pedir
                    </Button>
                  </div>
                  
                  <div className="flex items-center mt-3 text-xs text-snackbar-gray">
                    <Clock className="w-3 h-3 mr-1" />
                    <span>15-25 min</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        <div className="text-center mt-12">
          <Button 
            size="lg" 
            variant="outline" 
            className="font-semibold px-8 py-3 border-2 hover:text-white transition-all duration-300"
            style={{ 
              borderColor: primaryColor, 
              color: primaryColor 
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = primaryColor}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            Ver Cardápio Completo
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedItems;
