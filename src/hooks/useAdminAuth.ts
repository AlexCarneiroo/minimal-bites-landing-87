
import { useState, useEffect } from 'react';
import { onAuthChange } from '@/lib/firebase-auth';
import { User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const useAdminAuth = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (user) => {
      setUser(user);
      
      if (user) {
        try {
          // Verificar se o usuário é admin através do campo isAdmin
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          const userData = userDoc.data();
          const isUserAdmin = userData?.isAdmin === 1;
          setIsAdmin(isUserAdmin);
        } catch (error) {
          console.error('Erro ao verificar permissões de admin:', error);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { isAdmin, loading, user };
};
