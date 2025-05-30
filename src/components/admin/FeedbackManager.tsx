import { useState , useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ImageUpload } from "@/components/ui/image-upload";
import { collection, getDocs, addDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
interface Feedback {
  id: string;
  name: string;
  role: string;
  comment: string;
  image: string;
}

interface FeedbackManagerProps {
  onSave?: (feedbacks: Feedback[]) => void;
}

export default function FeedbackManager({ onSave }: FeedbackManagerProps) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [currentFeedback, setCurrentFeedback] = useState<Feedback>({
    id: '',
    name: '',
    role: '',
    comment: '',
    image: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const feedbacksCollection = collection(db, 'feedbacks');

      if (!currentFeedback.id) {
        // Criar novo feedback
        const newFeedback = {
          ...currentFeedback,
          createdAt: new Date()
        };

        const docRef = await addDoc(feedbacksCollection, newFeedback);
        setFeedbacks([...feedbacks, { ...newFeedback, id: docRef.id }]);
      } else {
        // Atualizar feedback existente
        const feedbackDoc = doc(db, 'feedbacks', currentFeedback.id);
        await setDoc(feedbackDoc, currentFeedback);

        const updatedFeedbacks = feedbacks.map(f =>
          f.id === currentFeedback.id ? currentFeedback : f
        );
        setFeedbacks(updatedFeedbacks);
      }

      // Limpar formulário
      setCurrentFeedback({
        id: '',
        name: '',
        role: '',
        comment: '',
        image: ''
      });

      toast({
        title: "Feedback salvo",
        description: "O feedback foi salvo com sucesso",
      });

    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar o feedback",
        variant: "destructive",
      });
      console.error("Erro ao salvar feedback no Firebase:", error);
    } finally {
      setIsSaving(false);
    }
  };


  const handleEdit = (feedback: Feedback) => {
    setCurrentFeedback(feedback);
  };

  const handleDelete = async (id: string) => {
    try {
      const updatedFeedbacks = feedbacks.filter(f => f.id !== id);
      setFeedbacks(updatedFeedbacks);
      await onSave(updatedFeedbacks);

      toast({
        title: "Feedback removido",
        description: "O feedback foi removido com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro ao remover",
        description: "Não foi possível remover o feedback",
        variant: "destructive",
      });
    }
  };
  const fetchFeedbacks = async () => {
    try {
      const feedbacksCollection = collection(db, 'feedbacks');
      const feedbackSnapshot = await getDocs(feedbacksCollection);
      const feedbackList = feedbackSnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name || '',
        role: doc.data().role || '',
        comment: doc.data().comment || '',
        image: doc.data().image || ''
      }));
      setFeedbacks(feedbackList);
    } catch (error) {
      console.error('Erro ao buscar feedbacks:', error);
    }
  };

  useEffect(() => {
  fetchFeedbacks();
}, []);



  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              {currentFeedback.id ? 'Editar Feedback' : 'Novo Feedback'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
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
                  />
                </div>

                <div>
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
                  />
                </div>

                <div>
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
                  />
                </div>
              </div>

              <div>
                <Label>Foto</Label>
                <ImageUpload
                  value={currentFeedback.image}
                  onChange={(url) => setCurrentFeedback(prev => ({
                    ...prev,
                    image: url
                  }))}
                  label="Foto do Cliente"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Salvando..." : currentFeedback.id ? "Atualizar Feedback" : "Adicionar Feedback"}
          </Button>
        </div>
      </form>

      {feedbacks.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Feedbacks Cadastrados</h3>
            <div className="space-y-4">
              {feedbacks.map(feedback => (
                <div key={feedback.id} className="flex items-start justify-between p-4 border rounded-lg">
                  <div className="flex items-start space-x-4">
                    {feedback.image && (
                      <img
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
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(feedback)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(feedback.id)}
                    >
                      Remover
                    </Button>
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