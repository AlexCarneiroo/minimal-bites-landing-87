
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
}

export function useEstablishmentData() {
  const { settings, loading } = useSiteSettings();
  const data = settings?.establishmentData ?? null;

  return { data, loading };
}
