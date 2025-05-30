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
      const fotosCollection = collection(db, 'conheca-nos');
      const snapshot = await getDocs(fotosCollection);
      const fotosList = snapshot.docs.map(doc => ({
        id: doc.id,
        url: doc.data().url || ''
      }));
      setFotos(fotosList);
    } catch (error) {
      console.error('Erro ao buscar fotos:', error);
    }
  };

  useEffect(() => {
    fetchFotos();
  }, []);

  const handleAddFoto = async () => {
    if (!novaFoto) return;
    setIsSaving(true);
    try {
      const fotosCollection = collection(db, 'conheca-nos');
      const docRef = await addDoc(fotosCollection, { url: novaFoto });
      setFotos(prev => [...prev, { id: docRef.id, url: novaFoto }]);
      setNovaFoto('');
      toast({ title: 'Foto adicionada', description: 'A foto foi adicionada com sucesso.' });
    } catch (error) {
      toast({ title: 'Erro ao adicionar', description: 'Não foi possível adicionar a foto.', variant: 'destructive' });
      console.error('Erro ao adicionar foto:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteFoto = async (id: string) => {
    if (!confirm('Tem certeza que deseja remover esta foto?')) return;
    try {
      await deleteDoc(doc(db, 'conheca-nos', id));
      setFotos(prev => prev.filter(f => f.id !== id));
      toast({ title: 'Foto removida', description: 'A foto foi removida com sucesso.' });
    } catch (error) {
      toast({ title: 'Erro ao remover', description: 'Não foi possível remover a foto.', variant: 'destructive' });
      console.error('Erro ao remover foto:', error);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Conheça Nós - Galeria de Fotos</h3>
          <div className="flex items-center gap-4 mb-4">
            <ImageUpload
              value={novaFoto}
              onChange={setNovaFoto}
              label="Adicionar nova foto"
            />
            <Button onClick={handleAddFoto} disabled={isSaving || !novaFoto}>
              {isSaving ? 'Adicionando...' : 'Adicionar Foto'}
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {fotos.map(foto => (
              <div key={foto.id} className="relative group border rounded overflow-hidden">
                <img src={foto.url} alt="Foto Conheça Nós" className="w-full h-40 object-cover" />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 opacity-80 group-hover:opacity-100"
                  onClick={() => handleDeleteFoto(foto.id)}
                >
                  Remover
                </Button>
              </div>
            ))}
            {fotos.length === 0 && <p className="col-span-full text-center text-gray-500">Nenhuma foto cadastrada.</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 