import { db } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export interface SiteSettings {
  // Configurações Gerais
  establishmentData: {
    name: string;
    description: string;
    address: string;
    phone: string;
    email: string;
    logo: string;
    schedule: {
      weekdays: string;
      weekends: string;
      holidays: string;
    };
    socialMedia: {
      facebook: string;
      instagram: string;
      youtube: string;
      linkedin: string;
    };
  };

  // Aparência
  primaryColor: string;
  logo: string;
  heroImage: string;

  // Sobre Nós
  about: {
    title: string;
    description: string;
    image: string;
  };

  // Feedbacks
  feedbacks: Array<{
    id: string;
    name: string;
    photo: string;
    message: string;
    rating: number;
  }>;

  // Ofertas Especiais
  specialOffers: Array<{
    id: string;
    name: string;
    description: string;
    regularPrice: number;
    promoPrice: number | null;
    discount: string | null;
    label: string | null;
    image: string;
  }>;

  // Footer
  footer: {
    copyright: string;
    companyName: string;
    additionalText: string;
  };
}

const SETTINGS_DOC_ID = 'site_settings';

export async function saveSiteSettings(settings: Partial<SiteSettings>) {
  try {
    const settingsRef = doc(db, 'site_settings', SETTINGS_DOC_ID);
    await setDoc(settingsRef, settings, { merge: true });
    console.log('Configurações salvas com sucesso:', settings);
    return true;
  } catch (error) {
    console.error('Erro ao salvar configurações:', error);
    return false;
  }
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    const settingsRef = doc(db, 'site_settings', SETTINGS_DOC_ID);
    const settingsDoc = await getDoc(settingsRef);
    
    if (settingsDoc.exists()) {
      const data = settingsDoc.data() as SiteSettings;
      console.log('Configurações carregadas:', data);
      return data;
    }
    
    console.log('Nenhuma configuração encontrada');
    return null;
  } catch (error) {
    console.error('Erro ao buscar configurações:', error);
    return null;
  }
} 