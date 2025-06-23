
import { useState, useEffect } from 'react';
import { onAuthChange } from '@/lib/firebase-auth';
import { User } from 'firebase/auth';

export const useAdminAuth = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setUser(user);
      setIsAdmin(!!user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { isAdmin, loading, user };
};
