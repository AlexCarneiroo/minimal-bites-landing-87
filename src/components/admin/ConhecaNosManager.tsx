
import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ImageUpload } from "@/components/ui/image-upload";
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

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
      toast({ title: 'Erro', description: 'Não foi possível carregar as fotos.', variant: 'destructive' });
    }
  };

  useEffect(() => {
    fetchFotos();
  }, []);

  const handleAddFoto = async () => {
    if (!novaFoto) {
      toast({ title: 'Erro', description: 'Por favor, adicione uma URL de imagem.', variant: 'destructive' });
      return;
    }
    
    setIsSaving(true);
    try {
      console.log('Adicionando nova foto:', novaFoto);
      const fotosCollection = collection(db, 'conheca-nos');
      const docRef = await addDoc(fotosCollection, { 
        url: novaFoto,
        createdAt: new Date()
      });
      
      console.log('Foto adicionada com ID:', docRef.id);
      
      const novaFotoObj = { id: docRef.id, url: novaFoto };
      setFotos(prev => [...prev, novaFotoObj]);
      setNovaFoto('');
      
      toast({ title: 'Sucesso', description: 'Foto adicionada com sucesso.' });
    } catch (error) {
      console.error('Erro ao adicionar foto:', error);
      toast({ title: 'Erro', description: 'Não foi possível adicionar a foto.', variant: 'destructive' });
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
      toast({ title: 'Sucesso', description: 'Foto removida com sucesso.' });
    } catch (error) {
      console.error('Erro ao remover foto:', error);
      toast({ title: 'Erro', description: 'Não foi possível remover a foto.', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Conheça Nosso Espaço - Galeria de Fotos</h3>
          
          <div className="flex flex-col gap-4 mb-6">
            <ImageUpload
              value={novaFoto}
              onChange={setNovaFoto}
              label="Adicionar nova foto"
            />
            <Button 
              onClick={handleAddFoto} 
              disabled={isSaving || !novaFoto}
              className="w-fit"
            >
              {isSaving ? 'Adicionando...' : 'Adicionar Foto'}
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {fotos.map(foto => (
              <div key={foto.id} className="relative group border rounded-lg overflow-hidden">
                <img 
                  src={foto.url} 
                  alt="Foto Conheça Nosso Espaço" 
                  className="w-full h-40 object-cover"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 opacity-80 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleDeleteFoto(foto.id)}
                >
                  Remover
                </Button>
              </div>
            ))}
          </div>
          
          {fotos.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhuma foto cadastrada.</p>
              <p className="text-sm text-gray-400 mt-2">Adicione fotos usando o campo acima.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
