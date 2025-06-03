
import { Card, CardContent } from '@/components/ui/card';
import { Star, Coffee, Pizza, Sandwich, Salad } from 'lucide-react';

const menuCategories = [
  {
    id: 1,
    name: 'Hambúrgueres',
    icon: <Sandwich className="text-snackbar-blue" />
  },
  {
    id: 2,
    name: 'Pizzas',
    icon: <Pizza className="text-snackbar-blue" />
  },
  {
    id: 3,
    name: 'Bebidas',
    icon: <Coffee className="text-snackbar-blue" />
  },
  {
    id: 4,
    name: 'Saladas',
    icon: <Salad className="text-snackbar-blue" />
  }
];

const menuItems = [
  {
    id: 1,
    name: 'Hambúrguer Artesanal',
    description: 'Pão brioche, carne 180g, queijo cheddar, alface e tomate',
    price: 'R$ 28,90',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800',
    featured: true,
    category: 'Hambúrgueres'
  },
  {
    id: 2,
    name: 'Sanduíche Natural',
    description: 'Pão integral, frango desfiado, cenoura ralada e maionese caseira',
    price: 'R$ 18,90',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&q=80&w=800',
    featured: true,
    category: 'Hambúrgueres'
  },
  {
    id: 3,
    name: 'Batata Frita Especial',
    description: 'Batata frita crocante, cheddar, bacon e cebola caramelizada',
    price: 'R$ 22,90',
    image: 'https://images.unsplash.com/photo-1630384060421-cb20d0e09817?auto=format&fit=crop&q=80&w=800',
    featured: true,
    category: 'Acompanhamentos'
  },
  {
    id: 4,
    name: 'Milk Shake de Chocolate',
    description: 'Sorvete de chocolate, calda de chocolate e chantilly',
    price: 'R$ 16,90',
    image: 'https://images.unsplash.com/photo-1638176066623-b5b2f71da06c?auto=format&fit=crop&q=80&w=800',
    featured: true,
    category: 'Bebidas'
  }
];

const FeaturedItems = () => {
  return (
    <section id="menu" className="py-12 sm:py-16 lg:py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-8 lg:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-snackbar-dark mb-4">Menu de Destaque</h2>
          <div className="flex justify-center items-center gap-2 mb-4">
            <div className="h-[1px] w-8 lg:w-10 bg-snackbar-gray"></div>
            <Star className="w-4 h-4 lg:w-5 lg:h-5 text-snackbar-blue" fill="currentColor" />
            <div className="h-[1px] w-8 lg:w-10 bg-snackbar-gray"></div>
          </div>
          <p className="text-snackbar-gray max-w-xl mx-auto px-4 lg:px-0">
            Conheça nossos produtos mais pedidos, preparados com ingredientes selecionados e muito carinho
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-8 mb-8 lg:mb-12 px-4">
          {menuCategories.map((category) => (
            <div key={category.id} className="text-center group">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full bg-white border border-snackbar-gray/30 flex items-center justify-center mb-2 group-hover:border-snackbar-blue transition-all">
                {category.icon}
              </div>
              <span className="font-medium text-sm sm:text-base">{category.name}</span>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 px-4 lg:px-0">
          {menuItems.map(item => (
            <Card key={item.id} className="overflow-hidden border-none shadow-md hover:shadow-xl transition-all group w-full">
              <div className="relative h-40 sm:h-48 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
                />
                <div className="absolute top-2 right-2 lg:top-3 lg:right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium">
                  {item.category}
                </div>
              </div>
              <CardContent className="p-4 lg:p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-base lg:text-lg text-snackbar-dark pr-2">{item.name}</h3>
                  <span className="font-bold text-snackbar-blue text-sm lg:text-base whitespace-nowrap">{item.price}</span>
                </div>
                <p className="text-xs lg:text-sm text-snackbar-gray">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-8 lg:mt-12">
          <a 
            href="#menu-full" 
            className="inline-block bg-gradient-to-r from-snackbar-dark to-snackbar-blue bg-clip-text text-transparent border-b-2 border-snackbar-blue/50 font-medium hover:border-snackbar-dark/50 transition-colors"
          >
            Ver menu completo
          </a>
        </div>
      </div>
    </section>
  );
};

export default FeaturedItems;
