
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface EstablishmentData {
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  logo: string;
  menuUrl?: string;
  mapsUrl?: string;
  schedule?: {
    weekdays: string;
    weekends: string;
    holidays: string;
  };
  socialMedia?: {
    facebook: string;
    instagram: string;
    youtube: string;
    linkedin: string;
  };
}

export function useEstablishmentData() {
  const [data, setData] = useState<EstablishmentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEstablishmentData = async () => {
      try {
        const settingsRef = doc(db, 'site_settings', 'site_settings');
        const settingsDoc = await getDoc(settingsRef);
        
        if (settingsDoc.exists()) {
          const settings = settingsDoc.data();
          if (settings.establishmentData) {
            setData(settings.establishmentData as EstablishmentData);
          }
        }
      } catch (error) {
        console.error('Erro ao buscar dados do estabelecimento:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEstablishmentData();
  }, []);

  return { data, loading };
}
