import { createContext, useContext, useEffect, useState } from 'react';
import { getSiteSettings, saveSiteSettings, SiteSettings } from '@/lib/site-settings';

interface SiteSettingsContextType {
  settings: SiteSettings | null;
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<void>;
}

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

export function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      const loadedSettings = await getSiteSettings();
      if (loadedSettings) {
        setSettings(loadedSettings);
        // Aplicar a cor primária ao CSS
        document.documentElement.style.setProperty('--primary', loadedSettings.primaryColor);
      }
    };

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

  return (
    <SiteSettingsContext.Provider value={{ settings, updateSettings }}>
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