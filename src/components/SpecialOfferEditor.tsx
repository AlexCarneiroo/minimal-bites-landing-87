import { useState, useEffect } from 'react';
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
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';

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
  'Hambúrguer',
  'Pizza',
  'Bebida',
  'Sorvete',
  'Porção',
  'Sobremesa',
  'Combo',
  'Outros'
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
    try {
      const productsRef = collection(db, 'products');
      const snapshot = await getDocs(productsRef);
      const productsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      setProducts(productsList);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      toast({
        title: "Erro ao carregar",
        description: "Não foi possível carregar os produtos",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const productsRef = collection(db, 'products');
      
      if (editingProduct?.id) {
        // Atualizar produto existente
        const productRef = doc(db, 'products', editingProduct.id);
        await updateDoc(productRef, {
          ...formData,
          updatedAt: new Date()
        });
        toast({
          title: "Produto atualizado",
          description: "O produto foi atualizado com sucesso",
        });
      } else {
        // Adicionar novo produto
        await addDoc(productsRef, {
          ...formData,
          createdAt: new Date()
        });
        toast({
          title: "Produto adicionado",
          description: "O produto foi adicionado com sucesso",
        });
      }

      // Limpar formulário e recarregar produtos
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
      await loadProducts();
      
      // Atualizar o estado no componente pai
      onSave({
        enabled,
        items: products
      });
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
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;

    try {
      await deleteDoc(doc(db, 'products', productId));
      toast({
        title: "Produto excluído",
        description: "O produto foi excluído com sucesso",
      });
      await loadProducts();
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
              <form onSubmit={handleSubmit} className="space-y-4">
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
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                      placeholder="0.00"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="specialPrice">Preço Especial</Label>
                    <Input
                      id="specialPrice"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.specialPrice}
                      onChange={(e) => setFormData(prev => ({ ...prev, specialPrice: parseFloat(e.target.value) }))}
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Descrição do produto"
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
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
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
                            <div className="space-y-1">
                              <p className="text-sm line-through text-gray-500">
                                {formatPrice(product.price)}
                              </p>
                              <p className="text-lg font-bold text-red-500">
                                {formatPrice(product.specialPrice)}
                              </p>
                            </div>
                          ) : (
                            <p className="text-lg font-bold">
                              {formatPrice(product.price)}
                            </p>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(product)}
                          >
                            Editar
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => product.id && handleDelete(product.id)}
                          >
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
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Esta seção está desabilitada</p>
        </div>
      )}
    </div>
  );
}
