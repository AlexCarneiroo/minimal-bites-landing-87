
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { saveFeedback, getFeedbacks, deleteFeedback } from '@/lib/firebase-operations';
import { motion, AnimatePresence } from "framer-motion";
import FeedbackForm from "./FeedbackForm";
import FeedbackList from "./FeedbackList";

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
            <FeedbackForm
              currentFeedback={currentFeedback}
              setCurrentFeedback={setCurrentFeedback}
              editingFeedback={editingFeedback}
              setEditingFeedback={setEditingFeedback}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />

            <FeedbackList
              feedbacks={feedbacks}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
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
