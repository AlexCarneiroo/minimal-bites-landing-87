
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ImageUpload } from "@/components/ui/image-upload";
import { useRealtimeData } from "@/hooks/useRealtimeData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface Product {
  id?: string;
  name: string;
  description: string;
  regularPrice: number;
  promoPrice?: number;
  discount?: string;
  label?: string;
  image: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const CATEGORIES = [
  'Hambúrguer', 'Pizza', 'Bebida', 'Sorvete',
  'Porção', 'Sobremesa', 'Combo', 'Outros'
];

interface SpecialOfferEditorProps {
  enabled: boolean;
  onSave: (data: any) => void;
}

export default function SpecialOfferEditor({ enabled, onSave }: SpecialOfferEditorProps) {
  const { toast } = useToast();
  const { data: products, loading, error } = useRealtimeData<Product>('special_offers');
  const [isLoading, setIsLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [formData, setFormData] = useState<Product>({
    name: '',
    description: '',
    regularPrice: 0,
    promoPrice: 0,
    discount: '',
    label: '',
    image: ''
  });

  useEffect(() => {
    console.log('SpecialOfferEditor mounted, enabled:', enabled);
    console.log('Products loaded:', products);
  }, [enabled, products]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('Submitting product:', formData);
      
      if (products.length >= 4 && !editingProduct?.id) {
        toast({
          title: "Limite de produtos atingido",
          description: "Você só pode cadastrar até 4 produtos.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      const productData = {
        name: formData.name,
        description: formData.description,
        regularPrice: Number(formData.regularPrice),
        promoPrice: formData.promoPrice ? Number(formData.promoPrice) : null,
        discount: formData.discount || null,
        label: formData.label || null,
        image: formData.image || ''
      };

      const response = await fetch('/api/special-offers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editingProduct?.id,
          ...productData
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao salvar produto');
      }

      const result = await response.json();
      console.log('Product saved:', result);

      setFormData({
        name: '',
        description: '',
        regularPrice: 0,
        promoPrice: 0,
        discount: '',
        label: '',
        image: ''
      });
      setEditingProduct(null);
      
      toast({ 
        title: editingProduct ? "Produto atualizado" : "Produto adicionado", 
        description: `O produto foi ${editingProduct ? 'atualizado' : 'adicionado'} com sucesso` 
      });
      
      onSave({ enabled, items: products });
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      toast({
        title: "Erro ao salvar",
        description: error instanceof Error ? error.message : "Não foi possível salvar o produto",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      regularPrice: product.regularPrice,
      promoPrice: product.promoPrice || 0,
      discount: product.discount || '',
      label: product.label || '',
      image: product.image
    });
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    
    try {
      const response = await fetch(`/api/special-offers?id=${deleteTarget}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao excluir produto');
      }

      toast({
        title: "Produto excluído",
        description: "O produto foi excluído com sucesso",
      });
      setDeleteTarget(null);
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      toast({
        title: "Erro ao excluir",
        description: error instanceof Error ? error.message : "Não foi possível excluir o produto",
        variant: "destructive",
      });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Carregando produtos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Erro ao carregar produtos: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {enabled ? (
        <>
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">
                {editingProduct ? 'Editar Produto' : 'Adicionar Novo Produto'}
              </h3>
              <form onSubmit={handleSubmit} ref={formRef} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nome do Produto</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Nome do produto"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="regularPrice">Preço Regular</Label>
                    <Input
                      id="regularPrice"
                      type="number"
                      step="0.01"
                      value={formData.regularPrice}
                      onChange={(e) => setFormData(prev => ({ ...prev, regularPrice: parseFloat(e.target.value) || 0 }))}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="promoPrice">Preço Promocional</Label>
                    <Input
                      id="promoPrice"
                      type="number"
                      step="0.01"
                      value={formData.promoPrice}
                      onChange={(e) => setFormData(prev => ({ ...prev, promoPrice: parseFloat(e.target.value) || 0 }))}
                      placeholder="Opcional"
                    />
                  </div>

                  <div>
                    <Label htmlFor="discount">Desconto</Label>
                    <Input
                      id="discount"
                      value={formData.discount}
                      onChange={(e) => setFormData(prev => ({ ...prev, discount: e.target.value }))}
                      placeholder="Ex: -20%"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="label">Rótulo</Label>
                  <Input
                    id="label"
                    value={formData.label}
                    onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
                    placeholder="Ex: NEW, 2x1"
                  />
                </div>

                <div>
                  <Label>Imagem do Produto</Label>
                  <ImageUpload
                    value={formData.image}
                    onChange={(url) => setFormData(prev => ({ ...prev, image: url }))}
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  {editingProduct && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setEditingProduct(null);
                        setFormData({
                          name: '',
                          description: '',
                          regularPrice: 0,
                          promoPrice: 0,
                          discount: '',
                          label: '',
                          image: ''
                        });
                      }}
                    >
                      Cancelar Edição
                    </Button>
                  )}
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Salvando..." : editingProduct ? "Atualizar Produto" : "Adicionar Produto"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Produtos Cadastrados ({products.length}/4)</h3>
              {products.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Nenhum produto cadastrado ainda.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map((product) => (
                    <Card key={product.id} className="overflow-hidden">
                      <div className="aspect-video relative">
                        <img
                          src={product.image || '/placeholder.svg'}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder.svg';
                          }}
                        />
                        {product.promoPrice && product.promoPrice < product.regularPrice && (
                          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm">
                            Oferta Especial
                          </div>
                        )}
                        {product.label && (
                          <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded-full text-sm">
                            {product.label}
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-lg">{product.name}</h4>
                        <p className="text-sm mb-2 line-clamp-2">{product.description}</p>
                        <div className="flex items-center justify-between">
                          <div>
                            {product.promoPrice && product.promoPrice < product.regularPrice ? (
                              <>
                                <p className="text-sm line-through text-gray-500">
                                  {formatPrice(product.regularPrice)}
                                </p>
                                <p className="text-lg font-bold text-red-500">
                                  {formatPrice(product.promoPrice)}
                                </p>
                                {product.discount && (
                                  <span className="text-sm text-primary">{product.discount}</span>
                                )}
                              </>
                            ) : (
                              <p className="text-lg font-bold">{formatPrice(product.regularPrice)}</p>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" onClick={() => handleEdit(product)}>
                              Editar
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm" 
                              onClick={() => setDeleteTarget(product.id || '')}
                            >
                              Excluir
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Excluir produto</DialogTitle>
              </DialogHeader>
              <p>Tem certeza que deseja excluir este produto? Esta ação não poderá ser desfeita.</p>
              <DialogFooter className="mt-4">
                <Button variant="outline" onClick={() => setDeleteTarget(null)}>
                  Cancelar
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  Excluir
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Esta seção está desabilitada</p>
        </div>
      )}
    </div>
  );
}
