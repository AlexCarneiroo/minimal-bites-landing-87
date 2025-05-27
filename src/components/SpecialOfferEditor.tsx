import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ImageUpload } from "@/components/ui/image-upload";

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

interface SpecialOfferEditorProps {
  initialOffers: SpecialOffer[];
  onSave: (offers: SpecialOffer[]) => void;
}

export default function SpecialOfferEditor({
  initialOffers,
  onSave
}: SpecialOfferEditorProps) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [offers, setOffers] = useState<SpecialOffer[]>(initialOffers);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      if (!currentOffer.id) {
        // Nova oferta
        const newOffer = {
          ...currentOffer,
          id: Date.now().toString()
        };
        const updatedOffers = [...offers, newOffer];
        setOffers(updatedOffers);
        await onSave(updatedOffers);
      } else {
        // Atualizar oferta existente
        const updatedOffers = offers.map(o => 
          o.id === currentOffer.id ? currentOffer : o
        );
        setOffers(updatedOffers);
        await onSave(updatedOffers);
      }

      // Limpar formulário
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
        description: "A oferta especial foi salva com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar a oferta",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (offer: SpecialOffer) => {
    setCurrentOffer(offer);
  };

  const handleDelete = async (id: string) => {
    try {
      const updatedOffers = offers.filter(o => o.id !== id);
      setOffers(updatedOffers);
      await onSave(updatedOffers);
      
      toast({
        title: "Oferta removida",
        description: "A oferta especial foi removida com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro ao remover",
        description: "Não foi possível remover a oferta",
        variant: "destructive",
      });
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="regularPrice">Preço Regular</Label>
                    <Input
                      id="regularPrice"
                      type="number"
                      step="0.01"
                      value={currentOffer.regularPrice}
                      onChange={(e) => setCurrentOffer(prev => ({
                        ...prev,
                        regularPrice: parseFloat(e.target.value)
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

                <div className="grid grid-cols-2 gap-4">
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
              {offers.map(offer => (
                <div key={offer.id} className="border rounded-lg overflow-hidden">
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
