
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ImageUpload } from "@/components/ui/image-upload";
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { motion } from 'framer-motion';
import { Image, Plus, Trash2, Camera } from 'lucide-react';

interface ConhecaFoto {
  id: string;
  url: string;
}

export default function ConhecaNosManager() {
  const { toast } = useToast();
  const [fotos, setFotos] = useState<ConhecaFoto[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [novaFoto, setNovaFoto] = useState<string>('');

  const fetchFotos = async () => {
    try {
      const fotosCollection = collection(db, 'conheca-nos');
      const snapshot = await getDocs(fotosCollection);

      const fotosList = snapshot.docs.map(doc => ({
        id: doc.id,
        url: doc.data().url || ''
      }));

      setFotos(fotosList);
    } catch (error) {
      console.error('Erro ao buscar fotos:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as fotos.',
        variant: 'destructive'
      });
    }
  };

  useEffect(() => {
    fetchFotos();
  }, []);

  const handleAddFoto = async () => {
    if (!novaFoto) {
      toast({ 
        title: 'Erro', 
        description: 'Por favor, selecione uma imagem.', 
        variant: 'destructive' 
      });
      return;
    }

    if (fotos.length >= 6) {
      toast({ 
        title: 'Limite atingido', 
        description: 'Máximo de 6 fotos permitidas.', 
        variant: 'destructive' 
      });
      return;
    }

    setIsSaving(true);
    try {
      const docRef = await addDoc(collection(db, 'conheca-nos'), {
        url: novaFoto,
        createdAt: new Date()
      });
      
      setFotos(prev => [...prev, { id: docRef.id, url: novaFoto }]);
      setNovaFoto('');
      
      toast({ 
        title: 'Sucesso', 
        description: 'Foto adicionada com sucesso!' 
      });
    } catch (error) {
      console.error('Erro ao adicionar foto:', error);
      toast({ 
        title: 'Erro', 
        description: 'Não foi possível adicionar a foto.', 
        variant: 'destructive' 
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteFoto = async (id: string) => {
    if (!confirm('Tem certeza que deseja remover esta foto?')) return;

    try {
      await deleteDoc(doc(db, 'conheca-nos', id));
      setFotos(prev => prev.filter(f => f.id !== id));
      toast({
        title: 'Sucesso',
        description: 'Foto removida com sucesso!'
      });
    } catch (error) {
      console.error('Erro ao remover foto:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível remover a foto.',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Camera className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Conheça Nosso Espaço
          </h3>
          <p className="text-sm text-gray-600">
            Máximo 6 fotos • {fotos.length}/6 fotos cadastradas
          </p>
        </div>
      </div>

      {/* Adicionar Nova Foto */}
      <Card className="border-2 border-dashed border-blue-200 bg-blue-50/50">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Plus className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-gray-700">Adicionar Nova Foto</span>
            </div>
            
            <ImageUpload
              value={novaFoto}
              onChange={setNovaFoto}
              label=""
            />
            
            <Button
              onClick={handleAddFoto}
              disabled={isSaving || !novaFoto || fotos.length >= 6}
              className="w-full bg-blue-500 hover:bg-blue-600"
            >
              {isSaving ? 'Adicionando...' : 'Adicionar Foto'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Fotos */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-800 flex items-center gap-2">
          <Image className="w-4 h-4" />
          Fotos Cadastradas ({fotos.length})
        </h4>

        {fotos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {fotos.map((foto, index) => (
              <motion.div
                key={foto.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="relative group bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={foto.url}
                    alt={`Foto ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteFoto(foto.id)}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-sm font-medium">
                    Foto {index + 1}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <Camera className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 font-medium">Nenhuma foto cadastrada</p>
            <p className="text-sm text-gray-500 mt-1">
              Adicione fotos para mostrar seu espaço aos clientes
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
