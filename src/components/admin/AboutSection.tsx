
import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import ConhecaNosManager from './ConhecaNosManager';

interface AboutSectionProps {
  title: string;
  description: string;
  images: string[];
  spaceImages: string[];
  onSave: (data: { 
    title: string; 
    description: string; 
    images: string[];
    spaceImages: string[];
  }) => void;
}

export default function AboutSection({ 
  title = '', 
  description = '', 
  images = [], 
  spaceImages = [],
  onSave 
}: AboutSectionProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: title || '',
    description: description || '',
    images: Array.isArray(images) ? images : []
  });

  // Atualizar formData quando props mudarem
  useEffect(() => {
    setFormData({
      title: title || '',
      description: description || '',
      images: Array.isArray(images) ? images : []
    });
  }, [title, description, images]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Salvar via API
      const response = await fetch('/api/about', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          images: formData.images
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao salvar');
      }

      // Chamar onSave para atualizar o estado local
      onSave({
        title: formData.title,
        description: formData.description,
        images: formData.images,
        spaceImages: [] // As imagens do espaço são gerenciadas separadamente
      });

      toast({
        title: "Alterações salvas",
        description: "As informações foram atualizadas com sucesso",
      });
    } catch (error) {
      console.error('Erro ao salvar:', error);
      toast({
        title: "Erro ao salvar",
        description: error instanceof Error ? error.message : "Não foi possível salvar as alterações",
        variant: "destructive",
      });
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <div className="space-y-6">
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.3 }}
      >
        <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4">Informações Gerais</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      title: e.target.value
                    }))}
                    placeholder="Título da seção"
                    required
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      description: e.target.value
                    }))}
                    placeholder="Descrição da empresa"
                    rows={4}
                    required
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex justify-end"
              >
                <Button
                  type="submit"
                  className="transition-all duration-200 hover:scale-105 bg-primary hover:bg-primary/90 text-white"
                >
                  Salvar Alterações
                </Button>
              </motion.div>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Seção para gerenciar fotos do "Conheça Nosso Espaço" */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <ConhecaNosManager />
      </motion.div>

      {/* Visualização das Informações */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4">Visualização</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-medium mb-2">{formData.title || 'Título não definido'}</h4>
                <p className="text-gray-600">{formData.description || 'Descrição não definida'}</p>
              </div>

              {formData.images.length > 0 && (
                <div>
                  <h4 className="text-lg font-medium mb-4">Imagens da Empresa</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {formData.images.map((image, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        className="relative aspect-video rounded-lg overflow-hidden"
                      >
                        <img
                          src={image}
                          alt={`Imagem da empresa ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
