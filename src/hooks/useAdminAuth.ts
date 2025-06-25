
import { useState, useEffect } from 'react';
import { onCustomerAuthChange, getCustomerData } from '@/lib/firebase-customer-auth';
import { User } from 'firebase/auth';

export const useAdminAuth = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onCustomerAuthChange(async (user) => {
      setUser(user);
      
      if (user) {
        try {
          // Verificar se o usuário é admin através do campo isAdmin na coleção customers
          const customerData = await getCustomerData(user.uid);
          const isUserAdmin = customerData?.isAdmin === 1;
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
