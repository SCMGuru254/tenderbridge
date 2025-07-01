
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AppSettings {
  supply_chain_tags: string[];
  experience_levels: Array<{id: string, label: string}>;
  social_links: Array<{platform: string, url: string}>;
  job_sources: Array<{id: string, name: string}>;
}

const defaultSettings: AppSettings = {
  supply_chain_tags: [
    "Logistics", "Procurement", "Inventory", "Warehousing", "Transportation",
    "Supplier Management", "Demand Planning", "Risk Management", "Sustainability",
    "Technology", "Analytics", "Optimization", "Quality Control", "Compliance"
  ],
  experience_levels: [
    { id: "entry", label: "Entry Level (0-2 years)" },
    { id: "mid", label: "Mid Level (3-5 years)" },
    { id: "senior", label: "Senior Level (6-10 years)" },
    { id: "executive", label: "Executive Level (10+ years)" }
  ],
  social_links: [
    { platform: "Facebook", url: "https://www.facebook.com/people/SupplyChain-Ke/61575329135959/" },
    { platform: "Twitter", url: "https://twitter.com/supplychainke" },
    { platform: "Instagram", url: "https://www.instagram.com/supplychainke" },
    { platform: "Telegram", url: "https://t.me/supplychainke" }
  ],
  job_sources: [
    { id: "LinkedIn", name: "LinkedIn" },
    { id: "BrighterMonday", name: "Brighter Monday" },
    { id: "MyJobMag", name: "My Job Mag" },
    { id: "Fuzu", name: "Fuzu" },
    { id: "JobsInKenya", name: "Jobs In Kenya" }
  ]
};

export const useAppSettings = () => {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('app_settings')
          .select('*')
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching app settings:', error);
        } else if (data) {
          setSettings({
            supply_chain_tags: data.supply_chain_tags || defaultSettings.supply_chain_tags,
            experience_levels: data.experience_levels || defaultSettings.experience_levels,
            social_links: data.social_links || defaultSettings.social_links,
            job_sources: data.job_sources || defaultSettings.job_sources
          });
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const updateSettings = async (newSettings: Partial<AppSettings>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      
      const { error } = await supabase
        .from('app_settings')
        .upsert({
          id: 1,
          ...updatedSettings,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error updating settings:', error);
        return false;
      }

      setSettings(updatedSettings);
      return true;
    } catch (error) {
      console.error('Error updating settings:', error);
      return false;
    }
  };

  return {
    settings,
    loading,
    updateSettings
  };
};
