
import { getAppearanceSettings, getGeneralSettings } from './firebase-operations';

export interface SiteSettings {
  primaryColor: string;
  heroImage: string;
  establishmentData?: any;
  sectionVisibility?: {
    featuredItems: boolean;
    testimonials: boolean;
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
      }
    };
  } catch (error) {
    console.error('Erro ao carregar configurações do site:', error);
    return null;
  }
}

export async function saveSiteSettings(settings: Partial<SiteSettings>): Promise<void> {
  // Esta função pode ser expandida se necessário para salvar configurações específicas
  console.log('Configurações salvas:', settings);
}
