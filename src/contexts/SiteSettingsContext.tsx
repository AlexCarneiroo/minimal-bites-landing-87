
import { createContext, useContext, useEffect, useState } from 'react';
import { getSiteSettings, saveSiteSettings, SiteSettings } from '@/lib/site-settings';
import { getAppearanceSettings, getGeneralSettings } from '@/lib/firebase-operations';

interface SiteSettingsContextType {
  settings: SiteSettings | null;
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<void>;
  refreshSettings: () => Promise<void>;
}

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

export function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  const loadSettings = async () => {
    try {
      // Carregar configurações de aparência e gerais do Firebase
      const [appearanceData, generalData] = await Promise.all([
        getAppearanceSettings(),
        getGeneralSettings()
      ]);

      // Combinar as configurações
      const combinedSettings: SiteSettings = {
        primaryColor: appearanceData?.primaryColor || '#0066cc',
        heroImage: appearanceData?.heroImage || '',
        establishmentData: generalData || null,
        sectionVisibility: generalData?.sectionVisibility || {
          featuredItems: true,
          testimonials: true
        }
      };

      setSettings(combinedSettings);
      
      // Aplicar a cor primária ao CSS
      if (combinedSettings.primaryColor) {
        document.documentElement.style.setProperty('--primary', combinedSettings.primaryColor);
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    try {
      await saveSiteSettings(newSettings);
      setSettings(prev => prev ? { ...prev, ...newSettings } : null);
      
      // Atualizar a cor primária no CSS quando ela mudar
      if (newSettings.primaryColor) {
        document.documentElement.style.setProperty('--primary', newSettings.primaryColor);
      }
    } catch (error) {
      console.error('Erro ao atualizar configurações:', error);
    }
  };

  const refreshSettings = async () => {
    await loadSettings();
  };

  return (
    <SiteSettingsContext.Provider value={{ settings, updateSettings, refreshSettings }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  const context = useContext(SiteSettingsContext);
  if (context === undefined) {
    throw new Error('useSiteSettings deve ser usado dentro de um SiteSettingsProvider');
  }
  return context;
}
