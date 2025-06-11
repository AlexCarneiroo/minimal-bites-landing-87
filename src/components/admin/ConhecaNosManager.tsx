
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
      console.log('Buscando fotos do Conheça Nosso Espaço...');
      const fotosCollection = collection(db, 'conheca-nos');
      const snapshot = await getDocs(fotosCollection);
      console.log('Documentos encontrados:', snapshot.docs.length);
      
      const fotosList = snapshot.docs.map(doc => ({
        id: doc.id,
        url: doc.data().url || ''
      }));
      
      console.log('Fotos carregadas:', fotosList);
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
        description: 'Por favor, adicione uma imagem.', 
        variant: 'destructive' 
      });
      return;
    }
    
    setIsSaving(true);
    try {
      console.log('Adicionando nova foto:', novaFoto.length, 'caracteres');
      const fotosCollection = collection(db, 'conheca-nos');
      const docRef = await addDoc(fotosCollection, { 
        url: novaFoto,
        createdAt: new Date()
      });
      
      console.log('Foto adicionada com ID:', docRef.id);
      
      const novaFotoObj = { id: docRef.id, url: novaFoto };
      setFotos(prev => [...prev, novaFotoObj]);
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
      console.log('Removendo foto com ID:', id);
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50">
        <CardHeader className="pb-6">
          <motion.div 
            className="flex items-center gap-3"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-slate-800">
                Conheça Nosso Espaço
              </CardTitle>
              <p className="text-slate-600 mt-1">
                Gerencie a galeria de fotos do ambiente
              </p>
            </div>
          </motion.div>
        </CardHeader>
        
        <CardContent className="space-y-8">
          <motion.div 
            className="space-y-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
              <div className="flex items-center gap-2 mb-4">
                <Plus className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-slate-800">Adicionar Nova Foto</h3>
              </div>
              
              <div className="space-y-4">
                <div className="relative">
                  <ImageUpload
                    value={novaFoto}
                    onChange={setNovaFoto}
                    label=""
                  />
                </div>
                
                <Button 
                  onClick={handleAddFoto} 
                  disabled={isSaving || !novaFoto}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  {isSaving ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                    />
                  ) : (
                    <Plus className="w-5 h-5 mr-2" />
                  )}
                  {isSaving ? 'Adicionando...' : 'Adicionar Foto'}
                </Button>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="space-y-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Image className="w-5 h-5 text-slate-600" />
              <h3 className="text-lg font-semibold text-slate-800">
                Galeria Atual ({fotos.length} {fotos.length === 1 ? 'foto' : 'fotos'})
              </h3>
            </div>
            
            {fotos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {fotos.map((foto, index) => (
                  <motion.div 
                    key={foto.id} 
                    className="relative group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <div className="aspect-square overflow-hidden">
                      <img 
                        src={foto.url} 
                        alt="Foto Conheça Nosso Espaço" 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-2 right-2">
                        <Button
                          variant="destructive"
                          size="sm"
                          className="bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
                          onClick={() => handleDeleteFoto(foto.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div 
                className="text-center py-12 bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl border-2 border-dashed border-slate-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Camera className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 text-lg font-medium">Nenhuma foto cadastrada</p>
                <p className="text-sm text-slate-500 mt-2">Adicione fotos usando o campo acima para criar sua galeria</p>
              </motion.div>
            )}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
