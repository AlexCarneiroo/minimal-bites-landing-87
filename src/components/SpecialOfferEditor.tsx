import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ImageUpload } from "@/components/ui/image-upload";

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
import { db } from '@/lib/firebase';
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
} from 'firebase/firestore';

interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isSpecial: boolean;
  specialPrice?: number;
  createdAt?: Date;
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
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [formData, setFormData] = useState<Product>({
    name: '',
    description: '',
    price: 0,
    category: '',
    image: '',
    isSpecial: false,
    specialPrice: 0
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const productsRef = collection(db, 'products');
    const snapshot = await getDocs(productsRef);
    const productsList = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[];
    setProducts(productsList);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);


    try {
      const productsRef = collection(db, 'products');
      if (!editingProduct?.id) {
        const totalProductsSnap = await getDocs(productsRef);
        if (totalProductsSnap.size >= 4) {
          toast({
            title: "Limite de produtos atingido",
            description: "Você só pode cadastrar até 4 produtos.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
      }


      if (formData.isSpecial) {
        const specialsQuery = query(productsRef, where("isSpecial", "==", true));
        const snapshot = await getDocs(specialsQuery);
        const specialCount = snapshot.docs.filter(doc => doc.id !== editingProduct?.id).length;

        if (specialCount >= 4) {
          toast({
            title: "Limite de ofertas especiais atingido",
            description: "Você só pode ter até 4 produtos com oferta especial ativa.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
      }

      if (editingProduct?.id) {
        const productRef = doc(db, 'products', editingProduct.id);
        await updateDoc(productRef, {
          ...formData,
          updatedAt: new Date()
        });
        toast({ title: "Produto atualizado", description: "O produto foi atualizado com sucesso" });
      } else {
        await addDoc(productsRef, {
          ...formData,
          createdAt: new Date()
        });
        toast({ title: "Produto adicionado", description: "O produto foi adicionado com sucesso" });
      }

      await loadProducts();
      setFormData({
        name: '',
        description: '',
        price: 0,
        category: '',
        image: '',
        isSpecial: false,
        specialPrice: 0
      });
      setEditingProduct(null);

      const freshProductsSnap = await getDocs(productsRef);
      const freshProducts = freshProductsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];

      onSave({ enabled, items: freshProducts });
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar o produto",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData(product);
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteDoc(doc(db, 'products', deleteTarget));
      toast({
        title: "Produto excluído",
        description: "O produto foi excluído com sucesso",
      });
      await loadProducts();
      setDeleteTarget(null);
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o produto",
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
                    <Label htmlFor="category">Categoria</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="price">Preço Normal</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="specialPrice">Preço Especial</Label>
                    <Input
                      id="specialPrice"
                      type="number"
                      step="0.01"
                      value={formData.specialPrice}
                      onChange={(e) => setFormData(prev => ({ ...prev, specialPrice: parseFloat(e.target.value) }))}
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
                  <Label>Imagem do Produto</Label>
                  <ImageUpload
                    value={formData.image}
                    onChange={(url) => setFormData(prev => ({ ...prev, image: url }))}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isSpecial"
                    checked={formData.isSpecial}
                    onChange={(e) => setFormData(prev => ({ ...prev, isSpecial: e.target.checked }))}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="isSpecial">Este é um produto em oferta especial</Label>
                </div>

                <div className="flex justify-end space-x-2">
                  {editingProduct && (
                    <Button type="button" variant="outline" onClick={() => {
                      setEditingProduct(null);
                      setFormData({
                        name: '',
                        description: '',
                        price: 0,
                        category: '',
                        image: '',
                        isSpecial: false,
                        specialPrice: 0
                      });
                    }}>
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
              <h3 className="text-xl font-semibold mb-4">Produtos Cadastrados</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                  <Card key={product.id} className="overflow-hidden">
                    <div className="aspect-video relative">
                      <img
                        src={product.image || '/placeholder.png'}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      {product.isSpecial && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm">
                          Oferta Especial
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-lg">{product.name}</h4>
                      <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                      <p className="text-sm mb-2 line-clamp-2">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <div>
                          {product.isSpecial && product.specialPrice ? (
                            <>
                              <p className="text-sm line-through text-gray-500">
                                {formatPrice(product.price)}
                              </p>
                              <p className="text-lg font-bold text-red-500">
                                {formatPrice(product.specialPrice)}
                              </p>
                            </>
                          ) : (
                            <p className="text-lg font-bold">{formatPrice(product.price)}</p>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(product)}>Editar</Button>
                          <Button variant="destructive" size="sm" onClick={() => setDeleteTarget(product.id || '')}>
                            Excluir
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Excluir produto</DialogTitle>
              </DialogHeader>
              <p>Tem certeza que deseja excluir este produto? Esta ação não poderá ser desfeita.</p>
              <DialogFooter className="mt-4">
                <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancelar</Button>
                <Button variant="destructive" onClick={handleDelete}>Excluir</Button>
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
