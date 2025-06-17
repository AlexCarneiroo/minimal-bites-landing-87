import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getAboutSettings } from '@/lib/firebase-operations';

interface GalleryImage {
  id: string;
  url: string;
  alt?: string;
}

const fallbackImages: GalleryImage[] = [
  {
    id: '1',
    url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=1200',
    alt: 'Ambiente interno do restaurante'
  },
  {
    id: '2',
    url: 'https://images.unsplash.com/photo-1513639776629-7b40dd08d4c6?auto=format&fit=crop&q=80&w=1200',
    alt: 'Balcão de atendimento'
  },
  {
    id: '3',
    url: 'https://images.unsplash.com/photo-1493962853295-0fd70327578a?auto=format&fit=crop&q=80&w=1200',
    alt: 'Área externa do restaurante'
  }
];

const Gallery = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        const data = await getAboutSettings();
        const spaceImages = Array.isArray(data?.spaceImages) ? data.spaceImages : [];

        if (spaceImages.length > 0) {
          const galleryImages = spaceImages.map((url, index) => ({
            id: String(index),
            url: url || '',
            alt: `Conheça nosso espaço - ${index + 1}`
          })).filter(img => {
            const isValid = img.url && img.url.trim() !== '' && img.url.startsWith('http');
            return isValid;
          });

          if (galleryImages.length > 0) {
            setImages(galleryImages);
            setCurrentImage(0);
          } else {
            setImages(fallbackImages);
          }
        } else {
          setImages(fallbackImages);
        }
      } catch (error) {
        console.error('❌ Erro ao carregar imagens da galeria:', error);
        setImages(fallbackImages);
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryImages();
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
        <div className="container mx-auto px-4 text-center animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-96 mx-auto"></div>
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

        {images.length > 0 ? (
          <>
            <div className="relative max-w-5xl mx-auto">
              <div className="aspect-[16/9] overflow-hidden rounded-lg shadow-xl bg-gray-100">
                <img
                  src={images[currentImage]?.url}
                  alt={images[currentImage]?.alt || 'Conheça nosso espaço'}
                  className="w-full h-full object-cover transition-all duration-500"
                  onError={(e) => {
                    e.currentTarget.src = fallbackImages[0].url;
                  }}
                />
              </div>

              {images.length > 1 && (
                <>
                  <Button
                    variant="outline"
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm border-none rounded-full p-2 hover:bg-white shadow-lg"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="w-6 h-6" />
                    <span className="sr-only">Imagem anterior</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm border-none rounded-full p-2 hover:bg-white shadow-lg"
                    onClick={nextImage}
                  >
                    <ChevronRight className="w-6 h-6" />
                    <span className="sr-only">Próxima imagem</span>
                  </Button>
                </>
              )}

              {images.length > 1 && (
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
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              {images.map((image, index) => (
                <div
                  key={image.id}
                  className={`overflow-hidden rounded-lg shadow-md cursor-pointer transition-all hover:shadow-lg ${
                    index === currentImage ? 'ring-2 ring-snackbar-purple' : ''
                  }`}
                  onClick={() => setCurrentImage(index)}
                >
                  <img
                    src={image.url}
                    alt={image.alt || 'Conheça nosso espaço'}
                    className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = fallbackImages[0].url;
                    }}
                  />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <Image className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-snackbar-gray text-lg">Nenhuma imagem encontrada.</p>
            <p className="text-sm text-snackbar-gray mt-2">Adicione imagens no painel administrativo.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;
