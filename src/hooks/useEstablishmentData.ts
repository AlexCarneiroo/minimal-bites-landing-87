
import { useState, useEffect } from 'react';
import { getGeneralSettings } from '@/lib/firebase-operations';

interface EstablishmentData {
  type?: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  logo: string;
  menuUrl?: string;
  mapsUrl?: string;
  featuredProduct?: {
    title: string;
    description: string;
    image: string;
    year: string;
  };
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
        // Buscar dados do general_settings que contém os dados do estabelecimento
        const generalSettings = await getGeneralSettings();
        
        if (generalSettings) {
          setData(generalSettings as EstablishmentData);
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
