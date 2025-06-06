
import { useState, useEffect } from 'react';
import { getFeedbacks } from '@/lib/firebase-operations';

interface Feedback {
  id: string;
  name: string;
  role?: string;
  comment: string;
  image: string;
}

export function useFeedbacks() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const feedbackList = await getFeedbacks();
        const formattedFeedbacks = feedbackList.map((feedback: any) => ({
          id: feedback.id || '',
          name: feedback.name || '',
          role: feedback.role || '',
          comment: feedback.comment || '',
          image: feedback.image || 'https://i.pravatar.cc/150?img=' + Math.floor(Math.random() * 20)
        }));
        
        setFeedbacks(formattedFeedbacks);
      } catch (error) {
        console.error('Erro ao buscar feedbacks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  return { feedbacks, loading };
}
