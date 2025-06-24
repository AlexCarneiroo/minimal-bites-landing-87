
import { useState, useEffect } from 'react';
import { onCustomerAuthChange, getCustomerData } from '@/lib/firebase-customer-auth';
import { User } from 'firebase/auth';
import { CustomerData } from '@/lib/firebase-customer-auth';

export const useCustomerAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onCustomerAuthChange(async (user) => {
      setUser(user);
      
      if (user) {
        try {
          const data = await getCustomerData(user.uid);
          setCustomerData(data);
        } catch (error) {
          console.error('Erro ao buscar dados do cliente:', error);
          setCustomerData(null);
        }
      } else {
        setCustomerData(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, customerData, loading, isLoggedIn: !!user };
};
