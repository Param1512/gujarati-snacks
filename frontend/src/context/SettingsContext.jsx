import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import {
  PRIMARY_WHATSAPP_NUMBER,
  PRIMARY_PHONE_DISPLAY,
  RECIPIENT_DISPLAY_NAME,
} from '../config/whatsapp';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    storeName: 'Gujarati Homemade Nasta & Snacks',
    storeNameGujarati: 'ગુજરાતી હોમમેડ નાસ્તા અને સ્નેક્સ',
    tagline: 'Authentic Kathiyawadi Namkeen, Made Fresh Daily With Pure Groundnut Oil',
    phone: PRIMARY_PHONE_DISPLAY,
    whatsappRecipientName: RECIPIENT_DISPLAY_NAME,
    whatsappNumber: PRIMARY_WHATSAPP_NUMBER,
    email: 'orders@gujaratinasta.com',
    address: {
      shopNo: 'Shop 4, Shreeji Complex',
      street: '150 Feet Ring Road',
      area: 'Near Indira Circle',
      city: 'Rajkot',
      state: 'Gujarat',
      pincode: '360005',
    },
    operatingStatus: 'open',
    allowCashOnDelivery: true,
    deliveryCharges: {
      localRajkot: 30,
      standardShipping: 70,
      customerPickup: 0,
    },
    freeDeliveryThreshold: 999,
    supportedPincodes: ['360001', '360002', '360003', '360004', '360005'],
    socialLinks: {
      instagram: 'https://instagram.com/gujaratinasta',
      facebook: 'https://facebook.com/gujaratinasta',
    },
    policies: {},
  });

  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const data = await api.get('/settings');
      if (data.success && data.settings) {
        setSettings(data.settings);
      }
    } catch (e) {
      console.warn('Could not fetch settings from backend:', e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        loading,
        refetchSettings: fetchSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);

