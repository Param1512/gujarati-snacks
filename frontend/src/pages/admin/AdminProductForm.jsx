import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { ArrowLeft, Save, Sparkles } from 'lucide-react';

const AdminProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form state
  const [name, setName] = useState('');
  const [nameGujarati, setNameGujarati] = useState('');
  const [category, setCategory] = useState('');
  const [pricePerKg, setPricePerKg] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [shelfLife, setShelfLife] = useState('60 days from packaging');
  const [storageInstructions, setStorageInstructions] = useState('Store in an airtight container in a cool, dry place.');
  const [initialStockGrams, setInitialStockGrams] = useState(15000);
  const [lowStockThresholdGrams, setLowStockThresholdGrams] = useState(2000);
  const [isBestseller, setIsBestseller] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    // Fetch categories
    api.get('/categories').then((res) => {
      if (res.success) {
        setCategories(res.categories);
        if (!isEditMode && res.categories.length > 0) {
          setCategory(res.categories[0]._id);
        }
      }
    });

    if (isEditMode) {
      setLoading(true);
      api
        .get(`/products/${id}`)
        .then((res) => {
          if (res.success && res.product) {
            const p = res.product;
            setName(p.name);
            setNameGujarati(p.nameGujarati || '');
            setCategory(p.category?._id || p.category);
            setPricePerKg(p.pricePerKg);
            setDescription(p.description);
            setImageUrl(p.images?.[0]?.url || '');
            setShelfLife(p.shelfLife || '');
            setStorageInstructions(p.storageInstructions || '');
            setIsBestseller(p.isBestseller || false);
            setIsFeatured(p.isFeatured || false);
            setIsActive(p.isActive !== undefined ? p.isActive : true);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [id, isEditMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const payload = {
        name,
        nameGujarati,
        category,
        pricePerKg: Number(pricePerKg),
        description,
        images: imageUrl ? [{ url: imageUrl, isPrimary: true }] : [],
        shelfLife,
        storageInstructions,
        isBestseller,
        isFeatured,
        isActive,
        weightOptions: [
          { weightGrams: 250, label: '250 g', isActive: true },
          { weightGrams: 500, label: '500 g', isActive: true },
          { weightGrams: 1000, label: '1 kg', isActive: true },
          { weightGrams: 2000, label: '2 kg', isActive: true },
        ],
      };

      if (!isEditMode) {
        payload.initialStockGrams = Number(initialStockGrams);
        payload.lowStockThresholdGrams = Number(lowStockThresholdGrams);
        await api.post('/products', payload);
      } else {
        await api.put(`/products/${id}`, payload);
      }

      navigate('/admin/products');
    } catch (err) {
      setErrorMessage(err.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-[#21191A] font-sans">
      {/* Editorial Top Bar */}
      <div className="border-b border-[#D6B77A]/20 pb-6 flex items-center justify-between">
        <Link
          to="/admin/products"
          className="text-xs font-mono uppercase tracking-widest text-[#790B13] hover:underline flex items-center gap-2 font-bold"
        >
          <ArrowLeft className="w-4 h-4 text-[#D6B77A]" /> Return to Catalog
        </Link>
        <span className="text-xs font-mono text-[#21191A]/50">
          {isEditMode ? 'EDIT_MODE // PRODUCT_RECORD' : 'CREATE_MODE // NEW_SNACK'}
        </span>
      </div>

      <div className="bg-white p-6 sm:p-12 rounded-3xl border border-[#D6B77A]/30 shadow-xl space-y-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF0DC] border border-[#D6B77A]/40 text-[#790B13] text-xs font-mono uppercase tracking-widest mb-2 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#D6B77A]" />
            <span>Master Recipe Record</span>
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-4xl text-[#21191A] uppercase tracking-tight">
            {isEditMode ? `Edit ${name}` : 'Register New Gujarati Snack'}
          </h1>
          <p className="text-xs sm:text-sm text-[#21191A]/70 font-sans mt-1">
            Define pricing on a strict per-kilogram base. The checkout engine computes gram-for-gram prices dynamically.
          </p>
        </div>

        {errorMessage && (
          <div className="p-4 bg-rose-50 text-rose-800 text-xs font-mono rounded-2xl border border-rose-200">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 text-xs sm:text-sm font-sans">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#21191A]/70 mb-2">
                Snack Name (English) *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Tikha Gathiya"
                className="w-full bg-[#FFF9F2] border border-[#D6B77A]/30 rounded-xl px-4 py-3 text-xs sm:text-sm text-[#21191A] focus:outline-none focus:border-[#790B13]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#21191A]/70 mb-2">
                Snack Name (Gujarati script)
              </label>
              <input
                type="text"
                value={nameGujarati}
                onChange={(e) => setNameGujarati(e.target.value)}
                placeholder="e.g. તીખા ગાંઠીયા"
                className="w-full bg-[#FFF9F2] border border-[#D6B77A]/30 rounded-xl px-4 py-3 text-xs sm:text-sm text-[#21191A] font-gujarati focus:outline-none focus:border-[#790B13]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#21191A]/70 mb-2">
                Category *
              </label>
              <select
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#FFF9F2] border border-[#D6B77A]/30 rounded-xl px-4 py-3 text-xs sm:text-sm text-[#21191A] focus:outline-none focus:border-[#790B13] cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#21191A]/70 mb-2">
                Price Per Kilogram (₹/kg) *
              </label>
              <input
                type="number"
                required
                min="1"
                value={pricePerKg}
                onChange={(e) => setPricePerKg(e.target.value)}
                placeholder="e.g. 500"
                className="w-full bg-[#FFF9F2] border border-[#D6B77A]/30 rounded-xl px-4 py-3 text-xs sm:text-sm font-mono font-bold text-[#790B13] focus:outline-none focus:border-[#790B13]"
              />
            </div>
          </div>

          {/* Dynamic Price Preview helper */}
          {pricePerKg && (
            <div className="bg-[#FFF0DC] p-5 rounded-2xl border border-[#D6B77A]/40 space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-[#790B13] font-bold block">
                Calculated Patron Weight Tiers:
              </span>
              <div className="grid grid-cols-4 gap-3 text-center text-xs font-mono">
                <div className="bg-white p-3 rounded-xl border border-[#D6B77A]/30">
                  <span className="text-[#21191A]/60 block text-xs">250g</span>
                  <span className="font-heading font-black text-sm text-[#790B13]">₹{Math.round((pricePerKg * 250) / 1000)}</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-[#D6B77A]/30">
                  <span className="text-[#21191A]/60 block text-xs">500g</span>
                  <span className="font-heading font-black text-sm text-[#790B13]">₹{Math.round((pricePerKg * 500) / 1000)}</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-[#D6B77A]/30">
                  <span className="text-[#21191A]/60 block text-xs">1kg</span>
                  <span className="font-heading font-black text-sm text-[#790B13]">₹{Math.round(pricePerKg)}</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-[#D6B77A]/30">
                  <span className="text-[#21191A]/60 block text-xs">2kg</span>
                  <span className="font-heading font-black text-sm text-[#790B13]">₹{Math.round(pricePerKg * 2)}</span>
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#21191A]/70 mb-2">
              Description & Tasting Notes *
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe taste profile, sing-tel frying, hing balance, and texture..."
              className="w-full bg-[#FFF9F2] border border-[#D6B77A]/30 rounded-xl p-4 text-xs sm:text-sm text-[#21191A] focus:outline-none focus:border-[#790B13]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#21191A]/70 mb-2">
              Image URL *
            </label>
            <input
              type="text"
              required
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="/images/snacks/tikha-gathiya.jpg or https://..."
              className="w-full bg-[#FFF9F2] border border-[#D6B77A]/30 rounded-xl px-4 py-3 text-xs font-mono text-[#21191A] focus:outline-none focus:border-[#790B13]"
            />
          </div>

          {!isEditMode && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-3 border-t border-[#D6B77A]/20">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#21191A]/70 mb-2">
                  Initial Stock (Grams) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={initialStockGrams}
                  onChange={(e) => setInitialStockGrams(e.target.value)}
                  placeholder="15000 (15 kg)"
                  className="w-full bg-[#FFF9F2] border border-[#D6B77A]/30 rounded-xl px-4 py-3 text-xs font-mono text-[#21191A] focus:outline-none focus:border-[#790B13]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#21191A]/70 mb-2">
                  Low Stock Threshold (Grams)
                </label>
                <input
                  type="number"
                  value={lowStockThresholdGrams}
                  onChange={(e) => setLowStockThresholdGrams(e.target.value)}
                  placeholder="2000 (2 kg)"
                  className="w-full bg-[#FFF9F2] border border-[#D6B77A]/30 rounded-xl px-4 py-3 text-xs font-mono text-[#21191A] focus:outline-none focus:border-[#790B13]"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#21191A]/70 mb-2">
                Shelf Life
              </label>
              <input
                type="text"
                value={shelfLife}
                onChange={(e) => setShelfLife(e.target.value)}
                placeholder="60 days from packaging"
                className="w-full bg-[#FFF9F2] border border-[#D6B77A]/30 rounded-xl px-4 py-3 text-xs sm:text-sm text-[#21191A] focus:outline-none focus:border-[#790B13]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#21191A]/70 mb-2">
                Storage Instructions
              </label>
              <input
                type="text"
                value={storageInstructions}
                onChange={(e) => setStorageInstructions(e.target.value)}
                placeholder="Store in an airtight container..."
                className="w-full bg-[#FFF9F2] border border-[#D6B77A]/30 rounded-xl px-4 py-3 text-xs sm:text-sm text-[#21191A] focus:outline-none focus:border-[#790B13]"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-6 pt-4 border-t border-[#D6B77A]/20">
            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-mono uppercase tracking-wider text-[#21191A] font-bold">
              <input
                type="checkbox"
                checked={isBestseller}
                onChange={(e) => setIsBestseller(e.target.checked)}
                className="accent-[#790B13] w-4 h-4 rounded"
              />
              <span>Mark as Bestseller</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-mono uppercase tracking-wider text-[#21191A] font-bold">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="accent-[#790B13] w-4 h-4 rounded"
              />
              <span>Feature on Homepage</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-mono uppercase tracking-wider text-[#21191A] font-bold">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="accent-[#790B13] w-4 h-4 rounded"
              />
              <span>Active / Open for Sale</span>
            </label>
          </div>

          <div className="flex gap-4 pt-4 border-t border-[#D6B77A]/20">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#790B13] hover:bg-[#50000D] text-[#FFF0DC] px-8 py-3.5 rounded-full font-mono uppercase tracking-widest font-bold text-xs flex items-center gap-2 cursor-pointer transition-all shadow-lg shadow-[#790B13]/25 disabled:opacity-50"
            >
              <Save className="w-4 h-4 text-[#D6B77A]" />
              <span>{loading ? 'Saving...' : 'Commit Product Record'}</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/products')}
              className="px-6 py-3.5 rounded-full border border-[#D6B77A]/40 font-mono uppercase tracking-wider font-bold text-xs text-[#21191A]/70 hover:text-[#790B13] hover:border-[#790B13] transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProductForm;
