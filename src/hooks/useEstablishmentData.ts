
import { useState, useEffect } from 'react';
import { getGeneralSettings } from '@/lib/firebase-operations';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';

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
  reservationsEnabled?: boolean;
}

export const useEstablishmentData = () => {
  const [data, setData] = useState<EstablishmentData | null>(null);
  const [loading, setLoading] = useState(true);
  const { settings } = useSiteSettings();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const generalData = await getGeneralSettings();
        if (generalData) {
          setData(generalData);
        }
      } catch (error) {
        console.error('Erro ao carregar dados do estabelecimento:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Função para gerar horários disponíveis baseados no horário de funcionamento
  const generateAvailableTimes = (scheduleText: string, intervalMinutes: number = 20): string[] => {
    if (!scheduleText) return [];
    
    // Padrões para extrair horários do texto (ex: "11h às 22h", "12h às 23h")
    const timePattern = /(\d{1,2})h\s*às\s*(\d{1,2})h/;
    const match = scheduleText.match(timePattern);
    
    if (!match) return [];
    
    const startHour = parseInt(match[1]);
    const endHour = parseInt(match[2]);
    const times: string[] = [];
    
    // Gerar horários a cada 20 minutos
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += intervalMinutes) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        times.push(timeString);
      }
    }
    
    return times;
  };

  // Função para obter horários disponíveis baseados no dia da semana
  const getAvailableTimesForDate = (date: Date): string[] => {
    if (!data?.schedule) return [];
    
    const dayOfWeek = date.getDay(); // 0 = Domingo, 6 = Sábado
    
    // Se for fim de semana (Sábado = 6, Domingo = 0)
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return generateAvailableTimes(data.schedule.weekends);
    } else {
      return generateAvailableTimes(data.schedule.weekdays);
    }
  };

  return {
    data,
    loading,
    generateAvailableTimes,
    getAvailableTimesForDate
  };
};
