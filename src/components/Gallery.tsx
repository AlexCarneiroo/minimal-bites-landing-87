
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface GalleryImage {
  id: string;
  url: string;
}

const Gallery = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [currentImage, setCurrentImage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const fotosCollection = collection(db, 'conheca-nos');
        const snapshot = await getDocs(fotosCollection);
        const imagesList = snapshot.docs.map(doc => ({
          id: doc.id,
          url: doc.data().url || ''
        }));
        setImages(imagesList);
      } catch (error) {
        console.error('Erro ao buscar fotos da galeria:', error);
        // Fallback para imagens padrão em caso de erro
        setImages([
          {
            id: '1',
            url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=1200'
          },
          {
            id: '2',
            url: 'https://images.unsplash.com/photo-1513639776629-7b40dd08d4c6?auto=format&fit=crop&q=80&w=1200'
          },
          {
            id: '3',
            url: 'https://images.unsplash.com/photo-1493962853295-0fd70327578a?auto=format&fit=crop&q=80&w=1200'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  if (loading) {
    return (
      <section id="gallery" className="py-20 bg-snackbar-softgray">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-snackbar-gray">Carregando galeria...</p>
          </div>
        </div>
      </section>
    );
  }

  if (images.length === 0) {
    return (
      <section id="gallery" className="py-20 bg-snackbar-softgray">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-snackbar-dark mb-4">Conheça Nosso Espaço</h2>
            <p className="text-snackbar-gray">Nenhuma foto disponível no momento.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="gallery" className="py-20 bg-snackbar-softgray">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-snackbar-dark mb-4">Conheça Nosso Espaço</h2>
          <div className="flex justify-center items-center gap-2 mb-4">
            <div className="h-[1px] w-10 bg-snackbar-gray"></div>
            <Image className="w-5 h-5 text-snackbar-purple" />
            <div className="h-[1px] w-10 bg-snackbar-gray"></div>
          </div>
          <p className="text-snackbar-gray max-w-xl mx-auto">
            Um ambiente aconchegante e elegante para você desfrutar dos melhores momentos
          </p>
        </div>
        
        <div className="relative max-w-5xl mx-auto">
          <div className="aspect-[16/9] overflow-hidden rounded-lg shadow-xl">
            <img 
              src={images[currentImage].url} 
              alt={`Foto do estabelecimento ${currentImage + 1}`}
              className="w-full h-full object-cover transition-all duration-500"
            />
          </div>
          
          {images.length > 1 && (
            <>
              <Button 
                variant="outline" 
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm border-none rounded-full p-2 hover:bg-white"
                onClick={prevImage}
              >
                <ChevronLeft className="w-6 h-6" />
                <span className="sr-only">Imagem anterior</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm border-none rounded-full p-2 hover:bg-white"
                onClick={nextImage}
              >
                <ChevronRight className="w-6 h-6" />
                <span className="sr-only">Próxima imagem</span>
              </Button>
              
              <div className="flex justify-center mt-4 gap-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImage(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentImage ? 'bg-snackbar-purple w-8' : 'bg-snackbar-gray'
                    }`}
                  >
                    <span className="sr-only">Imagem {index + 1}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
        
        {images.length > 3 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            {images.slice(0, 3).map((image) => (
              <div key={image.id} className="overflow-hidden rounded-lg shadow-md">
                <img 
                  src={image.url} 
                  alt="Foto do estabelecimento" 
                  className="w-full h-48 object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;
