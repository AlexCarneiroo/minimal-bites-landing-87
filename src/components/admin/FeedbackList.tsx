
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import FeedbackCard from "./FeedbackCard";

interface Feedback {
  id: string;
  name: string;
  role: string;
  comment: string;
  image: string;
}

interface FeedbackListProps {
  feedbacks: Feedback[];
  onEdit: (feedback: Feedback) => void;
  onDelete: (id: string) => void;
}

export default function FeedbackList({ feedbacks, onEdit, onDelete }: FeedbackListProps) {
  return (
    <Card className="mt-6 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-4">Feedbacks Cadastrados</h3>
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {feedbacks.map((feedback, index) => (
              <FeedbackCard
                key={feedback.id}
                feedback={feedback}
                index={index}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}
