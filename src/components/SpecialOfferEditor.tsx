
import { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit, 
  Tag, 
  DollarSign,
  ImagePlus
} from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

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
  initialOffers?: SpecialOffer[];
  onSave: (offers: SpecialOffer[]) => void;
}

const SpecialOfferEditor = ({ initialOffers = [], onSave }: SpecialOfferEditorProps) => {
  const [offers, setOffers] = useState<SpecialOffer[]>(initialOffers);
  const [currentOffer, setCurrentOffer] = useState<SpecialOffer | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const defaultOffer: SpecialOffer = {
    id: '',
    name: '',
    description: '',
    regularPrice: 0,
    promoPrice: null,
    discount: null,
    label: null,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=600',
  };

  const handleAddNew = () => {
    setCurrentOffer({
      ...defaultOffer,
      id: Date.now().toString(),
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (offer: SpecialOffer) => {
    setCurrentOffer({ ...offer });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    const updatedOffers = offers.filter(offer => offer.id !== id);
    setOffers(updatedOffers);
    onSave(updatedOffers);
    toast({
      title: "Oferta removida",
      description: "A oferta especial foi removida com sucesso",
    });
  };

  const handleSaveOffer = () => {
    if (!currentOffer) return;

    if (!currentOffer.name || !currentOffer.description || currentOffer.regularPrice <= 0) {
      toast({
        title: "Dados incompletos",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const updatedOffers = currentOffer.id 
      ? offers.map(offer => offer.id === currentOffer.id ? currentOffer : offer)
      : [...offers, currentOffer];

    setOffers(updatedOffers);
    onSave(updatedOffers);
    setIsDialogOpen(false);
    
    toast({
      title: currentOffer.id ? "Oferta atualizada" : "Nova oferta adicionada",
      description: `${currentOffer.name} foi ${currentOffer.id ? 'atualizada' : 'adicionada'} com sucesso`,
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && currentOffer) {
      // Para uma versão sem backend, criamos uma URL temporária da imagem
      const imageUrl = URL.createObjectURL(file);
      setCurrentOffer({
        ...currentOffer,
        image: imageUrl
      });
    }
  };

  const calculateDiscount = (regular: number, promo: number | null) => {
    if (!promo || regular <= 0) return null;
    const discount = ((regular - promo) / regular) * 100;
    return `-${Math.round(discount)}%`;
  };

  const updatePromoPrice = (promoPrice: number | null) => {
    if (!currentOffer) return;
    
    const newPromoPrice = promoPrice === 0 ? null : promoPrice;
    const discount = newPromoPrice ? calculateDiscount(currentOffer.regularPrice, newPromoPrice) : null;

    setCurrentOffer({
      ...currentOffer,
      promoPrice: newPromoPrice,
      discount
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Gerenciar Ofertas Especiais</h3>
        <Button onClick={handleAddNew}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Oferta
        </Button>
      </div>

      {offers.length === 0 ? (
        <div className="p-8 text-center border border-dashed rounded-lg">
          <p className="text-gray-500">Nenhuma oferta especial cadastrada</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={handleAddNew}
          >
            Adicionar primeira oferta
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {offers.map(offer => (
            <div key={offer.id} className="border rounded-lg overflow-hidden bg-white">
              <div className="relative h-40">
                <img 
                  src={offer.image} 
                  alt={offer.name} 
                  className="w-full h-full object-cover"
                />
                {offer.discount && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    {offer.discount}
                  </div>
                )}
                {offer.label && (
                  <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    {offer.label}
                  </div>
                )}
              </div>
              <div className="p-4">
                <h4 className="font-bold">{offer.name}</h4>
                <p className="text-sm text-gray-500 line-clamp-2">{offer.description}</p>
                <div className="mt-2 flex items-center">
                  {offer.promoPrice ? (
                    <>
                      <span className="text-sm text-gray-500 line-through mr-2">
                        R$ {offer.regularPrice.toFixed(2)}
                      </span>
                      <span className="text-lg font-bold text-purple-600">
                        R$ {offer.promoPrice.toFixed(2)}
                      </span>
                    </>
                  ) : (
                    <span className="text-lg font-bold">
                      R$ {offer.regularPrice.toFixed(2)}
                    </span>
                  )}
                </div>
                <div className="mt-4 flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleEdit(offer)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-red-500 hover:bg-red-50 hover:text-red-600"
                    onClick={() => handleDelete(offer.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Excluir
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {currentOffer?.id ? 'Editar Oferta Especial' : 'Nova Oferta Especial'}
            </DialogTitle>
          </DialogHeader>
          {currentOffer && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="offer-name">Nome da Oferta*</Label>
                <Input 
                  id="offer-name" 
                  value={currentOffer.name} 
                  onChange={(e) => setCurrentOffer({...currentOffer, name: e.target.value})}
                  placeholder="Ex: Combo Família"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="offer-description">Descrição*</Label>
                <Input 
                  id="offer-description" 
                  value={currentOffer.description} 
                  onChange={(e) => setCurrentOffer({...currentOffer, description: e.target.value})}
                  placeholder="Ex: 4 hambúrgueres, 4 batatas e 4 refrigerantes"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="regular-price">Preço Regular (R$)*</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                    <Input 
                      id="regular-price" 
                      type="number"
                      className="pl-10"
                      min="0.01"
                      step="0.01"
                      value={currentOffer.regularPrice} 
                      onChange={(e) => setCurrentOffer({
                        ...currentOffer, 
                        regularPrice: parseFloat(e.target.value) || 0,
                        discount: calculateDiscount(
                          parseFloat(e.target.value) || 0, 
                          currentOffer.promoPrice
                        )
                      })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="promo-price">Preço Promocional (R$)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                    <Input 
                      id="promo-price" 
                      type="number"
                      className="pl-10"
                      min="0.01"
                      step="0.01"
                      value={currentOffer.promoPrice || ''} 
                      onChange={(e) => updatePromoPrice(e.target.value ? parseFloat(e.target.value) : null)}
                      placeholder="Deixe vazio se não houver"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="label">Etiqueta (opcional)</Label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                  <Input 
                    id="label" 
                    className="pl-10"
                    value={currentOffer.label || ''} 
                    onChange={(e) => setCurrentOffer({...currentOffer, label: e.target.value || null})}
                    placeholder="Ex: NOVO, 2x1, etc."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Imagem</Label>
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                    {currentOffer.image && (
                      <img 
                        src={currentOffer.image} 
                        alt="Prévia" 
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="image-upload" className="cursor-pointer">
                      <div className="flex items-center gap-2 text-sm text-blue-600 mb-2">
                        <ImagePlus className="h-4 w-4" />
                        <span>Selecionar imagem</span>
                      </div>
                      <input 
                        id="image-upload" 
                        type="file" 
                        accept="image/*" 
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </Label>
                    <p className="text-xs text-gray-500">
                      Recomendado: 600x400px em formato JPG ou PNG
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveOffer}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SpecialOfferEditor;
