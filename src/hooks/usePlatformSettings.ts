import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SocialLinks {
  twitter: string;
  linkedin: string;
  facebook: string;
  instagram: string;
  youtube: string;
  tiktok: string;
  telegram: string;
}

interface ContactInfo {
  email: string;
  phone: string;
  address: string;
  whatsapp: string;
}

interface MpesaDetails {
  paybill: string;
  till_number: string;
  account_name: string;
  instructions: string;
}

interface PaystackConfig {
  public_key: string;
  enabled: boolean;
}

interface SiteInfo {
  name: string;
  tagline: string;
  about: string;
}

interface FooterLinks {
  platform: Array<{ label: string; href: string }>;
  resources: Array<{ label: string; href: string }>;
  legal: Array<{ label: string; href: string }>;
}

export interface PlatformSettings {
  social_links: SocialLinks;
  contact_info: ContactInfo;
  mpesa_details: MpesaDetails;
  paystack_config: PaystackConfig;
  site_info: SiteInfo;
  footer_links: FooterLinks;
}

const defaultSettings: PlatformSettings = {
  social_links: {
    twitter: '',
    linkedin: '',
    facebook: '',
    instagram: '',
    youtube: '',
    tiktok: '',
    telegram: ''
  },
  contact_info: {
    email: 'support@supplychainke.com',
    phone: '',
    address: '',
    whatsapp: ''
  },
  mpesa_details: {
    paybill: '',
    till_number: '',
    account_name: 'SupplyChainKE',
    instructions: 'Send payment to the paybill/till number and enter the transaction code below'
  },
  paystack_config: {
    public_key: '',
    enabled: false
  },
  site_info: {
    name: 'SupplyChainKE',
    tagline: 'Your Supply Chain Career Partner',
    about: ''
  },
  footer_links: {
    platform: [],
    resources: [],
    legal: []
  }
};

export const usePlatformSettings = () => {
  const [settings, setSettings] = useState<PlatformSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('platform_settings')
        .select('setting_key, setting_value')
        .eq('is_public', true);

      if (error) {
        console.error('Error fetching platform settings:', error);
        return;
      }

      if (data && data.length > 0) {
        const newSettings = { ...defaultSettings };
        
        data.forEach((row: { setting_key: string; setting_value: unknown }) => {
          switch (row.setting_key) {
            case 'social_links':
              newSettings.social_links = row.setting_value as SocialLinks;
              break;
            case 'contact_info':
              newSettings.contact_info = row.setting_value as ContactInfo;
              break;
            case 'mpesa_details':
              newSettings.mpesa_details = row.setting_value as MpesaDetails;
              break;
            case 'site_info':
              newSettings.site_info = row.setting_value as SiteInfo;
              break;
            case 'footer_links':
              newSettings.footer_links = row.setting_value as FooterLinks;
              break;
          }
        });
        
        setSettings(newSettings);
      }
    } catch (error) {
      console.error('Error loading platform settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key: string, value: unknown) => {
    try {
      const { error } = await supabase
        .from('platform_settings')
        .update({ 
          setting_value: value as Record<string, unknown>,
          updated_at: new Date().toISOString()
        })
        .eq('setting_key', key);

      if (error) throw error;
      
      await fetchSettings();
      return true;
    } catch (error) {
      console.error('Error updating setting:', error);
      return false;
    }
  };

  return {
    settings,
    loading,
    updateSetting,
    refetch: fetchSettings
  };
};
