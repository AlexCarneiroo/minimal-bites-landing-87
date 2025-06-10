
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageUpload } from '@/components/ui/image-upload';
import { useToast } from '@/hooks/use-toast';
import { saveGeneralSettings, getGeneralSettings } from '@/lib/firebase-operations';
import { motion } from 'framer-motion';
import { Star, Image, Type, Calendar } from 'lucide-react';

interface FeaturedProductData {
  title: string;
  description: string;
  image: string;
  year: string;
}

interface FeaturedProductSettingsProps {
  onSave?: (data: FeaturedProductData) => void;
}

const FeaturedProductSettings = ({ onSave }: FeaturedProductSettingsProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FeaturedProductData>({
    title: 'Sabor Extraordinário',
    description: 'Experimente nossa especialidade',
    image: '',
    year: '2010'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadFeaturedProduct = async () => {
      try {
        const data = await getGeneralSettings();
        if (data?.featuredProduct) {
          setFormData(data.featuredProduct);
        }
      } catch (error) {
        console.error('Erro ao carregar produto em destaque:', error);
      }
    };

    loadFeaturedProduct();
  }, []);

  const handleInputChange = (field: keyof FeaturedProductData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const success = await saveGeneralSettings({
        featuredProduct: formData
      });

      if (success) {
        toast({
          title: "Produto em destaque atualizado",
          description: "As alterações foram salvas com sucesso",
        });
        onSave?.(formData);
      } else {
        throw new Error('Falha ao salvar');
      }
    } catch (error) {
      console.error('Erro ao salvar produto em destaque:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as alterações",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formFields = [
    {
      id: 'title',
      label: 'Título',
      placeholder: 'Ex: Sabor Extraordinário',
      icon: Type,
      type: 'input'
    },
    {
      id: 'description',
      label: 'Descrição',
      placeholder: 'Ex: Experimente nossa especialidade',
      icon: Type,
      type: 'textarea'
    },
    {
      id: 'year',
      label: 'Ano',
      placeholder: 'Ex: 2010',
      icon: Calendar,
      type: 'input'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-0 shadow-none bg-transparent">
        <CardHeader className="px-0 pb-6">
          <motion.div 
            className="flex items-center gap-3"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="p-3 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl shadow-lg">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-slate-800">
                Produto em Destaque
              </CardTitle>
              <p className="text-slate-600 mt-1">
                Configure o produto principal exibido na página inicial
              </p>
            </div>
          </motion.div>
        </CardHeader>
        
        <CardContent className="px-0 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div 
              className="space-y-6"
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {formFields.map((field, index) => {
                const Icon = field.icon;
                return (
                  <motion.div
                    key={field.id}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="space-y-3"
                  >
                    <Label 
                      htmlFor={field.id}
                      className="text-sm font-semibold text-slate-700 flex items-center gap-2"
                    >
                      <Icon className="w-4 h-4 text-amber-600" />
                      {field.label}
                    </Label>
                    {field.type === 'input' ? (
                      <Input
                        id={field.id}
                        value={formData[field.id as keyof FeaturedProductData]}
                        onChange={(e) => handleInputChange(field.id as keyof FeaturedProductData, e.target.value)}
                        placeholder={field.placeholder}
                        className="border-2 border-slate-200 focus:border-amber-500 transition-colors rounded-xl py-3 px-4"
                        maxLength={field.id === 'year' ? 4 : undefined}
                      />
                    ) : (
                      <Textarea
                        id={field.id}
                        value={formData[field.id as keyof FeaturedProductData]}
                        onChange={(e) => handleInputChange(field.id as keyof FeaturedProductData, e.target.value)}
                        placeholder={field.placeholder}
                        rows={3}
                        className="border-2 border-slate-200 focus:border-amber-500 transition-colors rounded-xl py-3 px-4 resize-none"
                      />
                    )}
                  </motion.div>
                );
              })}
            </motion.div>

            <motion.div
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Image className="w-4 h-4 text-amber-600" />
                Imagem do Produto
              </Label>
              <div className="relative">
                <div className="p-6 border-2 border-dashed border-slate-200 rounded-xl bg-gradient-to-br from-slate-50 to-white hover:border-amber-300 transition-colors">
                  <ImageUpload
                    label=""
                    value={formData.image}
                    onChange={(url) => handleInputChange('image', url)}
                  />
                </div>
                {formData.image && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mt-4 relative overflow-hidden rounded-xl shadow-lg"
                  >
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>

          <motion.div 
            className="flex justify-end pt-6 border-t border-slate-100"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Button 
              onClick={handleSave} 
              disabled={loading}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                />
              ) : (
                <Star className="w-5 h-5 mr-2" />
              )}
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FeaturedProductSettings;
