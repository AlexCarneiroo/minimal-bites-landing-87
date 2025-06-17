
import { getAppearanceSettings, getGeneralSettings } from './firebase-operations';

export interface SiteSettings {
  primaryColor: string;
  heroImage: string;
  establishmentData?: any;
  sectionVisibility?: {
    featuredItems: boolean;
    testimonials: boolean;
  };
  about?: {
    title: string;
    description: string;
    images: string[];
    spaceImages: string[];
  };
  feedbacks?: {
    enabled: boolean;
    items: any[];
  };
  specialOffers?: {
    enabled: boolean;
    items: any[];
  };
  footer?: {
    copyright: string;
    companyName: string;
    additionalText: string;
  };
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    const [appearanceData, generalData] = await Promise.all([
      getAppearanceSettings(),
      getGeneralSettings()
    ]);

    return {
      primaryColor: appearanceData?.primaryColor || '#0066cc',
      heroImage: appearanceData?.heroImage || '',
      establishmentData: generalData || null,
      sectionVisibility: generalData?.sectionVisibility || {
        featuredItems: true,
        testimonials: true
      },
      about: generalData?.about,
      feedbacks: generalData?.feedbacks,
      specialOffers: generalData?.specialOffers,
      footer: generalData?.footer
    };
  } catch (error) {
    console.error('Erro ao carregar configurações do site:', error);
    return null;
  }
}

export async function saveSiteSettings(settings: Partial<SiteSettings>): Promise<void> {
  // Esta função pode ser expandida se necessário para salvar configurações específicas
}
