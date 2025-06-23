
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface Feedback {
  id: string;
  name: string;
  role: string;
  comment: string;
  image: string;
}

interface FeedbackCardProps {
  feedback: Feedback;
  index: number;
  onEdit: (feedback: Feedback) => void;
  onDelete: (id: string) => void;
}

export default function FeedbackCard({ feedback, index, onEdit, onDelete }: FeedbackCardProps) {
  return (
    <motion.div
      key={`feedback-card-${feedback.id || index}`}
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
            onClick={() => onEdit(feedback)}
            className="transition-all duration-200 hover:bg-gray-100"
          >
            Editar
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(feedback.id)}
            className="transition-all duration-200 bg-red-600 hover:bg-red-700 text-white"
          >
            Remover
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
