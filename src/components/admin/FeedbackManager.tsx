
import { useState , useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ImageUpload } from "@/components/ui/image-upload";
import { saveFeedback, getFeedbacks, deleteFeedback } from '@/lib/firebase-operations';
import { motion, AnimatePresence } from "framer-motion";

interface Feedback {
  id: string;
  name: string;
  role: string;
  comment: string;
  image: string;
}

interface FeedbackManagerProps {
  enabled: boolean;
  onSave: (data: any) => void;
}

export default function FeedbackManager({ enabled, onSave }: FeedbackManagerProps) {
  const { toast } = useToast();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingFeedback, setEditingFeedback] = useState<Feedback | null>(null);
  const [currentFeedback, setCurrentFeedback] = useState<Feedback>({
    id: '',
    name: '',
    role: '',
    comment: '',
    image: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (editingFeedback?.id) {
        // Para editar, vamos deletar o antigo e criar um novo
        await deleteFeedback(editingFeedback.id);
      }
      
      const feedbackId = await saveFeedback({
        name: currentFeedback.name,
        role: currentFeedback.role,
        comment: currentFeedback.comment,
        image: currentFeedback.image
      });
      
      if (feedbackId) {
        toast({
          title: editingFeedback ? "Feedback atualizado" : "Feedback adicionado",
          description: `O feedback foi ${editingFeedback ? 'atualizado' : 'adicionado'} com sucesso`,
        });

        // Limpar formulário e recarregar feedbacks
        setCurrentFeedback({
          id: '',
          name: '',
          role: '',
          comment: '',
          image: ''
        });
        setEditingFeedback(null);
        await loadFeedbacks();
        
        // Atualizar o estado no componente pai
        onSave({
          enabled,
          items: feedbacks
        });
      } else {
        throw new Error('Erro ao salvar feedback');
      }
    } catch (error) {
      console.error('Erro ao salvar feedback:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar o feedback",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (feedback: Feedback) => {
    setCurrentFeedback(feedback);
    setEditingFeedback(feedback);
  };

  const handleDelete = async (id: string) => {
    try {
      const success = await deleteFeedback(id);
      if (success) {
        await loadFeedbacks();
        onSave({
          enabled,
          items: feedbacks.filter(f => f.id !== id)
        });

        toast({
          title: "Feedback removido",
          description: "O feedback foi removido com sucesso",
        });
      } else {
        throw new Error('Erro ao deletar feedback');
      }
    } catch (error) {
      toast({
        title: "Erro ao remover",
        description: "Não foi possível remover o feedback",
        variant: "destructive",
      });
    }
  };

  const loadFeedbacks = async () => {
    try {
      const feedbackList = await getFeedbacks();
      console.log('Raw feedback data:', feedbackList);
      
      const formattedFeedbacks = feedbackList.map((feedback: any) => ({
        id: feedback.id || '',
        name: feedback.name || '',
        role: feedback.role || '',
        comment: feedback.comment || '',
        image: feedback.image || ''
      }));
      
      console.log('Formatted feedbacks:', formattedFeedbacks);
      setFeedbacks(formattedFeedbacks);
    } catch (error) {
      console.error('Erro ao buscar feedbacks:', error);
    }
  };

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const feedbackVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 }
  };

  return (
    <div className="space-y-6">
      {enabled ? (
        <AnimatePresence mode="wait">
          <motion.div
            variants={feedbackVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">
                  {editingFeedback ? 'Editar Feedback' : 'Adicionar Novo Feedback'}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <Label htmlFor="name">Nome</Label>
                        <Input
                          id="name"
                          value={currentFeedback.name}
                          onChange={(e) => setCurrentFeedback(prev => ({
                            ...prev,
                            name: e.target.value
                          }))}
                          placeholder="Nome do cliente"
                          required
                          className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                        />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <Label htmlFor="role">Cargo/Função</Label>
                        <Input
                          id="role"
                          value={currentFeedback.role}
                          onChange={(e) => setCurrentFeedback(prev => ({
                            ...prev,
                            role: e.target.value
                          }))}
                          placeholder="Ex: Cliente, Colaborador, etc."
                          required
                          className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                        />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <Label htmlFor="comment">Comentário</Label>
                        <Textarea
                          id="comment"
                          value={currentFeedback.comment}
                          onChange={(e) => setCurrentFeedback(prev => ({
                            ...prev,
                            comment: e.target.value
                          }))}
                          placeholder="Comentário do cliente"
                          rows={4}
                          required
                          className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                        />
                      </motion.div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <Label>Foto</Label>
                      <ImageUpload
                        value={currentFeedback.image}
                        onChange={(url) => setCurrentFeedback(prev => ({
                          ...prev,
                          image: url
                        }))}
                        label="Foto do Cliente"
                      />
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex justify-end space-x-2"
                  >
                    {editingFeedback && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setEditingFeedback(null);
                          setCurrentFeedback({
                            id: '',
                            name: '',
                            role: '',
                            comment: '',
                            image: ''
                          });
                        }}
                        className="transition-all duration-200 hover:bg-gray-100"
                      >
                        Cancelar Edição
                      </Button>
                    )}
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="transition-all duration-200 hover:scale-105 bg-primary hover:bg-primary/90 text-white"
                    >
                      {isLoading ? "Salvando..." : editingFeedback ? "Atualizar Feedback" : "Adicionar Feedback"}
                    </Button>
                  </motion.div>
                </form>
              </CardContent>
            </Card>

            <Card className="mt-6 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Feedbacks Cadastrados</h3>
                <div className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {feedbacks.map((feedback, index) => (
                      <motion.div
                        key={feedback.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start justify-between p-4 border rounded-lg hover:shadow-md transition-shadow duration-200"
                      >
                        <div className="flex items-start space-x-4">
                          {feedback.image && (
                            <motion.img
                              whileHover={{ scale: 1.1 }}
                              src={feedback.image}
                              alt={feedback.name}
                              className="w-16 h-16 rounded-full object-cover"
                            />
                          )}
                          <div>
                            <h4 className="font-semibold">{feedback.name}</h4>
                            <p className="text-sm text-gray-500">{feedback.role}</p>
                            <p className="mt-2">{feedback.comment}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(feedback)}
                              className="transition-all duration-200 hover:bg-gray-100"
                            >
                              Editar
                            </Button>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(feedback.id)}
                              className="transition-all duration-200 bg-red-600 hover:bg-red-700 text-white"
                            >
                              Remover
                            </Button>
                          </motion.div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="text-center py-8"
        >
          <p className="text-muted-foreground">Esta seção está desabilitada</p>
        </motion.div>
      )}
    </div>
  );
}
