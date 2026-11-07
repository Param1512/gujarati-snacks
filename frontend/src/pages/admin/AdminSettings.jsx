import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useSettings } from '../../context/SettingsContext';
import { Save, CheckCircle2, Sparkles } from 'lucide-react';

const AdminSettings = () => {
  const { refetchSettings } = useSettings();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Form states
  const [storeName, setStoreName] = useState('');
  const [storeNameGujarati, setStoreNameGujarati] = useState('');
  const [tagline, setTagline] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [email, setEmail] = useState('');
  const [operatingStatus, setOperatingStatus] = useState('open');
  const [allowCashOnDelivery, setAllowCashOnDelivery] = useState(true);
  const [localRajkotDelivery, setLocalRajkotDelivery] = useState(30);
  const [standardShipping, setStandardShipping] = useState(70);
  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState(999);

  // Address
  const [shopNo, setShopNo] = useState('');
  const [street, setStreet] = useState('');
  const [area, setArea] = useState('');
  const [city, setCity] = useState('Rajkot');
  const [state, setState] = useState('Gujarat');
  const [pincode, setPincode] = useState('360005');

  useEffect(() => {
    api
      .get('/settings')
      .then((res) => {
        if (res.success && res.settings) {
          const s = res.settings;
          setStoreName(s.storeName);
          setStoreNameGujarati(s.storeNameGujarati || '');
          setTagline(s.tagline);
          setPhone(s.phone);
          setWhatsappNumber(s.whatsappNumber);
          setEmail(s.email);
          setOperatingStatus(s.operatingStatus || 'open');
          setAllowCashOnDelivery(s.allowCashOnDelivery !== undefined ? s.allowCashOnDelivery : true);
          setLocalRajkotDelivery(s.deliveryCharges?.localRajkot || 30);
          setStandardShipping(s.deliveryCharges?.standardShipping || 70);
          setFreeDeliveryThreshold(s.freeDeliveryThreshold || 999);

          if (s.address) {
            setShopNo(s.address.shopNo || '');
            setStreet(s.address.street || '');
            setArea(s.address.area || '');
            setCity(s.address.city || 'Rajkot');
            setState(s.address.state || 'Gujarat');
            setPincode(s.address.pincode || '360005');
          }
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const payload = {
        storeName,
        storeNameGujarati,
        tagline,
        phone,
        whatsappNumber,
        email,
        operatingStatus,
        allowCashOnDelivery,
        deliveryCharges: {
          localRajkot: Number(localRajkotDelivery),
          standardShipping: Number(standardShipping),
          customerPickup: 0,
        },
        freeDeliveryThreshold: Number(freeDeliveryThreshold),
        address: {
          shopNo,
          street,
          area,
          city,
          state,
          pincode,
        },
      };

      const res = await api.put('/settings', payload);
      if (res.success) {
        setMessage('Store settings updated and synchronized successfully!');
        refetchSettings();
      }
    } catch (err) {
      setMessage('Failed: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-[#000000]">
      {/* Editorial Header */}
      <div className="border-b border-[#EAE3D9] pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#14382B] text-[#000000] text-xs font-bold mb-2 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#C84B20]" />
          <span>Workshop Master Parameters</span>
        </div>
        <h1 className="font-heading font-black text-3xl sm:text-4xl tracking-tight text-[#000000]">
          Store Settings & Logistics
        </h1>
        <p className="text-xs sm:text-sm text-[#555555] font-sans mt-1">
          Brand identity, Rajkot kitchen location, dispatch tariffs, and payment gateways.
        </p>
      </div>

      {message && (
        <div className="p-4 bg-[#EBF4EF] text-[#000000] text-xs rounded-2xl border border-[#14382B] font-sans flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-[#000000]" />
          <span>{message}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white p-6 sm:p-12 rounded-3xl border border-[#EAE3D9] shadow-sm space-y-8 text-xs sm:text-sm font-sans">
        {/* Brand Identity */}
        <div className="space-y-4">
          <div className="border-b border-[#EAE3D9] pb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#555555] block">
              Section 01
            </span>
            <h2 className="font-heading font-black text-base text-[#000000]">
              Brand Nomenclature & Tagline
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#000000] mb-2">
                Brand Name (English) *
              </label>
              <input
                type="text"
                required
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#EAE3D9] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#000000] focus:outline-none focus:border-[#000000]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#000000] mb-2">
                Brand Name (Gujarati script)
              </label>
              <input
                type="text"
                value={storeNameGujarati}
                onChange={(e) => setStoreNameGujarati(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#EAE3D9] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#000000] font-gujarati focus:outline-none focus:border-[#000000]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#000000] mb-2">
              Brand Descriptor / Subtitle
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#EAE3D9] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#000000] focus:outline-none focus:border-[#000000]"
            />
          </div>
        </div>

        {/* Contact Numbers & WhatsApp */}
        <div className="space-y-4 pt-4 border-t border-[#EAE3D9]">
          <div className="border-b border-[#EAE3D9] pb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#555555] block">
              Section 02
            </span>
            <h2 className="font-heading font-black text-base text-[#000000]">
              Dispatch Desk & Digital Channels
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#000000] mb-2">
                Voice Contact *
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#EAE3D9] rounded-xl px-3.5 py-2.5 text-xs font-mono text-[#000000] focus:outline-none focus:border-[#000000]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#000000] mb-2">
                WhatsApp API Key Number *
              </label>
              <input
                type="text"
                required
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="919825012345"
                className="w-full bg-[#FAF7F2] border border-[#EAE3D9] rounded-xl px-3.5 py-2.5 text-xs font-mono text-[#000000] focus:outline-none focus:border-[#000000]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#000000] mb-2">
                Orders Email *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#EAE3D9] rounded-xl px-3.5 py-2.5 text-xs font-mono text-[#000000] focus:outline-none focus:border-[#000000]"
              />
            </div>
          </div>
        </div>

        {/* Rajkot Kitchen Address */}
        <div className="space-y-4 pt-4 border-t border-[#EAE3D9]">
          <div className="border-b border-[#EAE3D9] pb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#555555] block">
              Section 03
            </span>
            <h2 className="font-heading font-black text-base text-[#000000]">
              Physical Kitchen Location
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#000000] mb-2">
                Unit / Counter No.
              </label>
              <input
                type="text"
                value={shopNo}
                onChange={(e) => setShopNo(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#EAE3D9] rounded-xl px-3.5 py-2.5 text-xs text-[#000000] focus:outline-none focus:border-[#000000]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#000000] mb-2">
                Street / Avenue
              </label>
              <input
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#EAE3D9] rounded-xl px-3.5 py-2.5 text-xs text-[#000000] focus:outline-none focus:border-[#000000]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#000000] mb-2">
                Area / Locality
              </label>
              <input
                type="text"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#EAE3D9] rounded-xl px-3.5 py-2.5 text-xs text-[#000000] focus:outline-none focus:border-[#000000]"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#000000] mb-2">
                City
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#EAE3D9] rounded-xl px-3.5 py-2.5 text-xs text-[#000000] focus:outline-none focus:border-[#000000]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#000000] mb-2">
                State
              </label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#EAE3D9] rounded-xl px-3.5 py-2.5 text-xs text-[#000000] focus:outline-none focus:border-[#000000]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#000000] mb-2">
                Postal Code
              </label>
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#EAE3D9] rounded-xl px-3.5 py-2.5 text-xs font-mono text-[#000000] focus:outline-none focus:border-[#000000]"
              />
            </div>
          </div>
        </div>

        {/* Delivery Rates & Payment Rules */}
        <div className="space-y-4 pt-4 border-t border-[#EAE3D9]">
          <div className="border-b border-[#EAE3D9] pb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#555555] block">
              Section 04
            </span>
            <h2 className="font-heading font-black text-base text-[#000000]">
              Courier Tariffs & Gateway Policy
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#000000] mb-2">
                Rajkot Local Delivery (₹)
              </label>
              <input
                type="number"
                value={localRajkotDelivery}
                onChange={(e) => setLocalRajkotDelivery(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#EAE3D9] rounded-xl px-3.5 py-2.5 text-xs font-mono text-[#000000] focus:outline-none focus:border-[#000000]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#000000] mb-2">
                Gujarat / Interstate Express (₹)
              </label>
              <input
                type="number"
                value={standardShipping}
                onChange={(e) => setStandardShipping(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#EAE3D9] rounded-xl px-3.5 py-2.5 text-xs font-mono text-[#000000] focus:outline-none focus:border-[#000000]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#000000] mb-2">
                Complimentary Delivery Threshold (₹)
              </label>
              <input
                type="number"
                value={freeDeliveryThreshold}
                onChange={(e) => setFreeDeliveryThreshold(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#EAE3D9] rounded-xl px-3.5 py-2.5 text-xs font-mono text-[#000000] focus:outline-none focus:border-[#000000]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#000000] mb-2">
                Kitchen Operational State
              </label>
              <select
                value={operatingStatus}
                onChange={(e) => setOperatingStatus(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#EAE3D9] rounded-xl px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#000000] focus:outline-none focus:border-[#000000]"
              >
                <option value="open">Open (Accepting Orders)</option>
                <option value="taking_preorders">Taking Pre-orders Only</option>
                <option value="closed">Closed Temporarily</option>
              </select>
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-xs">
                <input
                  type="checkbox"
                  checked={allowCashOnDelivery}
                  onChange={(e) => setAllowCashOnDelivery(e.target.checked)}
                  className="accent-[#000000] w-4 h-4 rounded"
                />
                <span className="uppercase tracking-wider text-[#000000]">
                  Authorize Cash on Delivery (COD) Checkouts
                </span>
              </label>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-[#EAE3D9]">
          <button
            type="submit"
            disabled={saving}
            className="bg-[#C84B20] hover:bg-[#A33A16] text-white px-8 py-3 rounded-full font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors shadow-sm disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Synchronizing...' : 'Save Configuration'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
