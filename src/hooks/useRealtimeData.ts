
import { useState, useEffect } from 'react';
import { collection, onSnapshot, DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function useRealtimeData<T extends DocumentData>(collectionName: string) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, collectionName),
      (snapshot) => {
        try {
          const items = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          } as unknown as T));
          
          setData(items);
          setLoading(false);
          setError(null);
        } catch (err) {
          console.error(`Erro ao carregar dados de ${collectionName}:`, err);
          setError(`Erro ao carregar dados de ${collectionName}`);
          setLoading(false);
        }
      },
      (err) => {
        console.error(`Erro na conexão com ${collectionName}:`, err);
        setError(`Erro na conexão com ${collectionName}`);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionName]);

  return { data, loading, error };
}
