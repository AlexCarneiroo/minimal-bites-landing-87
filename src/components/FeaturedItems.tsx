
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Utensils, Coffee, Cookie, Cake } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getSpecialOffers } from '@/lib/firebase-operations';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';

interface Product {
  id: string;
  name?: string;
  title?: string;
  description: string;
  price: number;
  specialPrice?: number;
  category?: string;
  image: string;
  isSpecial?: boolean;
}

interface Category {
  name: string;
  icon: JSX.Element;
}

const getCategoryIcon = (categoryName: string) => {
  const name = categoryName.toLowerCase();
  if (name.includes('hambúrguer') || name.includes('lanche') || name.includes('sanduíche')) {
    return <Utensils className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />;
  }
  if (name.includes('bebida') || name.includes('drink') || name.includes('suco') || name.includes('refrigerante')) {
    return <Coffee className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />;
  }
  if (name.includes('doce') || name.includes('sobremesa') || name.includes('açaí') || name.includes('milk')) {
    return <Cake className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />;
  }
  if (name.includes('acompanhamento') || name.includes('batata') || name.includes('porção')) {
    return <Cookie className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />;
  }
  return <Utensils className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />;
};

const FeaturedItems = () => {
  const { settings } = useSiteSettings();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const primaryColor = settings?.primaryColor || '#0066cc';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const specialOffers = await getSpecialOffers();
        const productsRef = collection(db, 'products');
        const snapshot = await getDocs(productsRef);
        const productsList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Product[];
        
        const allProductsData = [
          ...specialOffers.map((offer: any) => ({
            ...offer,
            name: offer.title || offer.name,
            isSpecial: true
          })),
          ...productsList
        ];
        
        const categoryNames = Array.from(new Set(allProductsData.map(product => product.category || 'Outros')));
        const availableCategories = categoryNames.map(name => ({
          name,
          icon: getCategoryIcon(name)
        }));
        
        setCategories(availableCategories);
        setAllProducts(allProductsData);
        setFilteredProducts(allProductsData.slice(0, 4));
      } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        const defaultProducts = [
          {
            id: '1',
            name: 'Hambúrguer Artesanal',
            description: 'Pão brioche, carne 180g, queijo cheddar, alface e tomate',
            price: 28.90,
            image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800',
            category: 'Hambúrgueres',
            isSpecial: false
          },
          {
            id: '2',
            name: 'Sanduíche Natural',
            description: 'Pão integral, frango desfiado, cenoura ralada e maionese caseira',
            price: 18.90,
            image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&q=80&w=800',
            category: 'Hambúrgueres',
            isSpecial: false
          },
          {
            id: '3',
            name: 'Batata Frita Especial',
            description: 'Batata frita crocante, cheddar, bacon e cebola caramelizada',
            price: 22.90,
            image: 'https://images.unsplash.com/photo-1630384060421-cb20d0e09817?auto=format&fit=crop&q=80&w=800',
            category: 'Acompanhamentos',
            isSpecial: false
          },
          {
            id: '4',
            name: 'Milk Shake de Chocolate',
            description: 'Sorvete de chocolate, calda de chocolate e chantilly',
            price: 16.90,
            image: 'https://images.unsplash.com/photo-1638176066623-b5b2f71da06c?auto=format&fit=crop&q=80&w=800',
            category: 'Bebidas',
            isSpecial: false
          }
        ];
        
        setAllProducts(defaultProducts);
        setFilteredProducts(defaultProducts);
        setCategories([
          { name: 'Hambúrgueres', icon: getCategoryIcon('Hambúrgueres') },
          { name: 'Acompanhamentos', icon: getCategoryIcon('Acompanhamentos') },
          { name: 'Bebidas', icon: getCategoryIcon('Bebidas') }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleCategoryClick = (categoryName: string) => {
    if (activeCategory === categoryName) {
      // Se a categoria já está ativa, mostrar todos os produtos
      setActiveCategory(null);
      setFilteredProducts(allProducts.slice(0, 4));
    } else {
      // Filtrar produtos pela categoria selecionada
      setActiveCategory(categoryName);
      const filtered = allProducts.filter(product => product.category === categoryName);
      setFilteredProducts(filtered);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  if (loading) {
    return (
      <section id="menu" className="py-12 sm:py-16 lg:py-20 bg-white overflow-hidden">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center">
            <p className="text-snackbar-gray">Carregando produtos...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="menu" className="py-12 sm:py-16 lg:py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-8 lg:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-snackbar-dark mb-4">Menu de Destaque</h2>
          <div className="flex justify-center items-center gap-2 mb-4">
            <div className="h-[1px] w-8 lg:w-10 bg-snackbar-gray"></div>
            <Star className="w-4 h-4 lg:w-5 lg:h-5" style={{ color: primaryColor }} fill="currentColor" />
            <div className="h-[1px] w-8 lg:w-10 bg-snackbar-gray"></div>
          </div>
          <p className="text-snackbar-gray max-w-xl mx-auto px-4 lg:px-0">
            Conheça nossos produtos mais pedidos, preparados com ingredientes selecionados e muito carinho
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-8 mb-8 lg:mb-12 px-4">
          {categories.map((category, index) => (
            <div 
              key={index} 
              className="text-center group cursor-pointer"
              onClick={() => handleCategoryClick(category.name)}
            >
              <div 
                className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full bg-white border-2 flex items-center justify-center mb-2 group-hover:scale-110 transition-all duration-300 ${
                  activeCategory === category.name ? 'scale-110' : ''
                }`}
                style={{ 
                  borderColor: activeCategory === category.name ? primaryColor : primaryColor,
                  backgroundColor: activeCategory === category.name ? primaryColor : `${primaryColor}05`,
                  boxShadow: activeCategory === category.name ? `0 4px 15px ${primaryColor}40` : 'none'
                }}
              >
                <div style={{ color: activeCategory === category.name ? 'white' : primaryColor }}>
                  {category.icon}
                </div>
              </div>
              <span 
                className={`font-medium text-sm sm:text-base ${
                  activeCategory === category.name ? 'font-bold' : ''
                }`} 
                style={{ color: primaryColor }}
              >
                {category.name}
              </span>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 px-4 lg:px-0">
          {filteredProducts.map(item => (
            <Card key={item.id} className="overflow-hidden border-none shadow-md hover:shadow-xl transition-all group w-full">
              <div className="relative h-40 sm:h-48 overflow-hidden">
                <img 
                  src={item.image || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800'} 
                  alt={item.name || item.title || 'Produto'} 
                  className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
                />
                <div 
                  className="absolute top-2 right-2 lg:top-3 lg:right-3 text-white px-2 py-1 rounded-full text-xs font-medium"
                  style={{ backgroundColor: `${primaryColor}90` }}
                >
                  {item.category || 'Produto'}
                </div>
                {item.isSpecial && (
                  <div 
                    className="absolute top-2 left-2 lg:top-3 lg:left-3 text-white px-2 py-1 rounded-full text-xs font-bold"
                    style={{ backgroundColor: primaryColor }}
                  >
                    OFERTA
                  </div>
                )}
              </div>
              <CardContent className="p-4 lg:p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-base lg:text-lg text-snackbar-dark pr-2">
                    {item.name || item.title || 'Produto'}
                  </h3>
                  <div className="text-right">
                    {item.isSpecial && item.specialPrice ? (
                      <div>
                        <span className="text-xs text-snackbar-gray line-through block">
                          {formatPrice(item.price)}
                        </span>
                        <span className="font-bold text-sm lg:text-base" style={{ color: primaryColor }}>
                          {formatPrice(item.specialPrice)}
                        </span>
                      </div>
                    ) : (
                      <span className="font-bold text-sm lg:text-base" style={{ color: primaryColor }}>
                        {formatPrice(item.price)}
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-xs lg:text-sm text-snackbar-gray">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {activeCategory && filteredProducts.length === 0 && (
          <div className="text-center mt-8">
            <p className="text-snackbar-gray">Nenhum produto encontrado para esta categoria.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedItems;
