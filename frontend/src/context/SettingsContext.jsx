import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    storeName: 'Giriraj Homemade Gujarati Snacks',
    storeNameGujarati: 'ગિરિરાજ હોમમેડ ગુજરાતી નાસ્તા',
    tagline: 'Authentic Kathiyawadi Namkeen, Made Fresh Daily With Pure Groundnut Oil',
    phone: '+91 98250 12345',
    whatsappNumber: '919825012345',
    email: 'orders@girirajnasta.com',
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
      instagram: 'https://instagram.com/girirajnasta',
      facebook: 'https://facebook.com/girirajnasta',
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

