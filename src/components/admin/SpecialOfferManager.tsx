import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ImageUpload } from "@/components/ui/image-upload";
import { collection, getDocs, addDoc, doc, setDoc, deleteDoc, serverTimestamp, getFirestore } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface SpecialOffer {
  id: string;
  name: string;
  description: string;
  regularPrice: number;
  promoPrice: number | null;
  discount: string | null;
  label: string | null;
  image: string;
}

export default function SpecialOfferManager() {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [offers, setOffers] = useState<SpecialOffer[]>([]);
  const [currentOffer, setCurrentOffer] = useState<SpecialOffer>({
    id: '',
    name: '',
    description: '',
    regularPrice: 0,
    promoPrice: null,
    discount: null,
    label: null,
    image: ''
  });

  const fetchOffers = async () => {
    try {
      const offersCollection = collection(db, 'products');
      const snapshot = await getDocs(offersCollection);
      const offersList = snapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name || '',
        description: doc.data().description || '',
        regularPrice: doc.data().regularPrice || 0,
        promoPrice: doc.data().promoPrice || null,
        discount: doc.data().discount || null,
        label: doc.data().label || null,
        image: doc.data().image || ''
      }));
      setOffers(offersList);
    } catch (error) {
      console.error('Erro ao buscar ofertas:', error);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (!db) throw new Error('Conexão com o banco de dados não está disponível');

      const offersCollection = collection(db, 'special-offers');

      if (!currentOffer.id) {
        const snapshot = await getDocs(offersCollection);
        const offerCount = snapshot.size;

        if (offerCount >= 4) {
          throw new Error('Limite de 4 ofertas atingido. Exclua uma para adicionar outra.');
        }
      }

      if (!currentOffer.name || !currentOffer.description || !currentOffer.regularPrice) {
        throw new Error('Por favor, preencha todos os campos obrigatórios');
      }

      const dataToSave = {
        name: currentOffer.name.trim(),
        description: currentOffer.description.trim(),
        regularPrice: Number(currentOffer.regularPrice),
        promoPrice: currentOffer.promoPrice ? Number(currentOffer.promoPrice) : null,
        discount: currentOffer.discount?.trim() || null,
        label: currentOffer.label?.trim() || null,
        image: currentOffer.image || '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      let docRef;

      if (currentOffer.id) {
        const offerDoc = doc(db, 'products', currentOffer.id);
        await setDoc(offerDoc, { ...dataToSave, updatedAt: serverTimestamp() }, { merge: true });
        docRef = { id: currentOffer.id };
      } else {
        docRef = await addDoc(offersCollection, dataToSave);
      }

      if (!docRef.id) {
        throw new Error('Falha ao salvar a oferta no banco de dados');
      }

      if (currentOffer.id) {
        setOffers(prev => prev.map(offer =>
          offer.id === currentOffer.id ? { ...dataToSave, id: currentOffer.id } : offer
        ));
      } else {
        setOffers(prev => [...prev, { ...dataToSave, id: docRef.id }]);
      }

      setCurrentOffer({
        id: '',
        name: '',
        description: '',
        regularPrice: 0,
        promoPrice: null,
        discount: null,
        label: null,
        image: ''
      });

      toast({
        title: "Oferta salva",
        description: "A oferta foi salva com sucesso",
      });

      await fetchOffers();
    } catch (error) {
      console.error("Erro ao salvar oferta:", error);

      toast({
        title: "Erro ao salvar",
        description:
          error instanceof Error
            ? error.message
            : "Não foi possível salvar a oferta",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (offer: SpecialOffer) => {
    setCurrentOffer(offer);
  };

  const handleDelete = async (offerId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta oferta?')) return;

    try {
      const offerDoc = doc(db, 'products', offerId);
      await deleteDoc(offerDoc);

      setOffers(prev => prev.filter(offer => offer.id !== offerId));

      toast({
        title: "Oferta excluída",
        description: "A oferta foi excluída com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro ao excluir",
        description: error instanceof Error ? error.message : "Não foi possível excluir a oferta",
        variant: "destructive",
      });
      console.error("Erro ao excluir oferta:", error);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              {currentOffer.id ? 'Editar Oferta Especial' : 'Nova Oferta Especial'}
            </h3>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome da Oferta</Label>
                <Input
                  id="name"
                  value={currentOffer.name}
                  onChange={(e) => setCurrentOffer(prev => ({
                    ...prev,
                    name: e.target.value
                  }))}
                  placeholder="Nome da oferta"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={currentOffer.description}
                  onChange={(e) => setCurrentOffer(prev => ({
                    ...prev,
                    description: e.target.value
                  }))}
                  placeholder="Descrição da oferta"
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="regularPrice">Preço Regular</Label>
                  <Input
                    id="regularPrice"
                    type="number"
                    step="0.01"
                    value={currentOffer.regularPrice}
                    onChange={(e) => setCurrentOffer(prev => ({
                      ...prev,
                      regularPrice: parseFloat(e.target.value) || 0
                    }))}
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="promoPrice">Preço Promocional</Label>
                  <Input
                    id="promoPrice"
                    type="number"
                    step="0.01"
                    value={currentOffer.promoPrice || ''}
                    onChange={(e) => setCurrentOffer(prev => ({
                      ...prev,
                      promoPrice: e.target.value ? parseFloat(e.target.value) : null
                    }))}
                    placeholder="Opcional"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="discount">Desconto</Label>
                  <Input
                    id="discount"
                    value={currentOffer.discount || ''}
                    onChange={(e) => setCurrentOffer(prev => ({
                      ...prev,
                      discount: e.target.value || null
                    }))}
                    placeholder="Ex: -20%"
                  />
                </div>

                <div>
                  <Label htmlFor="label">Rótulo</Label>
                  <Input
                    id="label"
                    value={currentOffer.label || ''}
                    onChange={(e) => setCurrentOffer(prev => ({
                      ...prev,
                      label: e.target.value || null
                    }))}
                    placeholder="Ex: NEW, 2x1"
                  />
                </div>
              </div>

              <div>
                <Label>Imagem</Label>
                <ImageUpload
                  value={currentOffer.image}
                  onChange={(url) => setCurrentOffer(prev => ({
                    ...prev,
                    image: url
                  }))}
                  label="Imagem da Oferta"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Salvando..." : currentOffer.id ? "Atualizar Oferta" : "Adicionar Oferta"}
          </Button>
        </div>
      </form>

      {offers.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Ofertas Cadastradas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {offers.map((offer, index) => (
                <div key={`offer-${offer.id || index}`} className="border rounded-lg overflow-hidden">
                  {offer.image && (
                    <img
                      src={offer.image}
                      alt={offer.name}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{offer.name}</h4>
                        {offer.label && (
                          <span className="inline-block px-2 py-1 text-xs font-semibold bg-primary text-primary-foreground rounded-full">
                            {offer.label}
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        {offer.promoPrice ? (
                          <>
                            <span className="text-sm line-through text-gray-500">
                              R$ {offer.regularPrice.toFixed(2)}
                            </span>
                            <div className="text-lg font-bold text-primary">
                              R$ {offer.promoPrice.toFixed(2)}
                            </div>
                          </>
                        ) : (
                          <div className="text-lg font-bold">
                            R$ {offer.regularPrice.toFixed(2)}
                          </div>
                        )}
                        {offer.discount && (
                          <span className="text-sm text-primary">{offer.discount}</span>
                        )}
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">{offer.description}</p>
                    <div className="mt-4 flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(offer)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(offer.id)}
                      >
                        Remover
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
