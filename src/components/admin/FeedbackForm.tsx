
import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/ui/image-upload";
import { motion } from "framer-motion";

interface Feedback {
  id: string;
  name: string;
  role: string;
  comment: string;
  image: string;
}

interface FeedbackFormProps {
  currentFeedback: Feedback;
  setCurrentFeedback: React.Dispatch<React.SetStateAction<Feedback>>;
  editingFeedback: Feedback | null;
  setEditingFeedback: (feedback: Feedback | null) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export default function FeedbackForm({
  currentFeedback,
  setCurrentFeedback,
  editingFeedback,
  setEditingFeedback,
  onSubmit,
  isLoading
}: FeedbackFormProps) {
  const feedbackVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const handleCancel = () => {
    setEditingFeedback(null);
    setCurrentFeedback({
      id: '',
      name: '',
      role: '',
      comment: '',
      image: ''
    });
  };

  return (
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
          <form onSubmit={onSubmit} className="space-y-4">
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
                  onClick={handleCancel}
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
    </motion.div>
  );
}
