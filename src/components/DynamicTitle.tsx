import { useEffect } from 'react';
import { useEstablishmentData } from '@/hooks/useEstablishmentData';

const DynamicTitle = () => {
  const { data: establishmentData } = useEstablishmentData();

  useEffect(() => {
    const updateTitle = () => {
      const establishmentName = establishmentData?.name;
      const establishmentDescription = establishmentData?.description;
      
      if (establishmentName) {
        // Atualiza o título da página
        document.title = `${establishmentName} - Lanches Artesanais`;
        
        // Cria descrição personalizada
        const description = establishmentDescription 
          ? `${establishmentName} - ${establishmentDescription}`
          : `${establishmentName} - Lanches artesanais feitos com ingredientes frescos e muito carinho para você.`;
        
        // Atualiza também as meta tags para SEO
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
          metaDescription.setAttribute('content', description);
        }

        // Atualiza meta tags do Open Graph
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) {
          ogTitle.setAttribute('content', `${establishmentName} - Lanches Artesanais`);
        }

        const ogDescription = document.querySelector('meta[property="og:description"]');
        if (ogDescription) {
          ogDescription.setAttribute('content', description);
        }

        // Atualiza o autor
        const metaAuthor = document.querySelector('meta[name="author"]');
        if (metaAuthor) {
          metaAuthor.setAttribute('content', establishmentName);
        }
      } else {
        // Título padrão caso não tenha dados do estabelecimento
        document.title = 'Estabelecimento - Lanches Artesanais';
      }
    };

    updateTitle();
  }, [establishmentData?.name, establishmentData?.description]);

  return null; // Este componente não renderiza nada visualmente
};

export default DynamicTitle; 