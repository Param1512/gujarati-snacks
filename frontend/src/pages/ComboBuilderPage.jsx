import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Plus,
  Minus,
  Trash2,
  Check,
  Sparkles,
  Package,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';

const ComboBuilderPage = () => {
  const { addToCart, setIsCartOpen } = useCart();
  const { language } = useLanguage();

  const [availableSnacks, setAvailableSnacks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Selected combo items state: [ { product, weightGrams, quantity } ]
  const [selectedItems, setSelectedItems] = useState([]);
  const [calculating, setCalculating] = useState(false);
  const [comboSummary, setComboSummary] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [addedMessage, setAddedMessage] = useState(false);

  useEffect(() => {
    api
      .get('/products?limit=30')
      .then((res) => {
        if (res.success) {
          const individualSnacks = res.products.filter((p) => !p.isCombo);
          setAvailableSnacks(individualSnacks);

          const gathiya = individualSnacks.find((p) => p.slug === 'tikha-gathiya');
          const sevMamra = individualSnacks.find((p) => p.slug === 'sev-mamra');
          const pohaChevdo = individualSnacks.find((p) => p.slug === 'plain-poha-chevdo');

          const initialCombo = [];
          if (gathiya) initialCombo.push({ product: gathiya, weightGrams: 250, quantity: 1 });
          if (sevMamra) initialCombo.push({ product: sevMamra, weightGrams: 250, quantity: 1 });
          if (pohaChevdo) initialCombo.push({ product: pohaChevdo, weightGrams: 500, quantity: 1 });

          if (initialCombo.length > 0) {
            setSelectedItems(initialCombo);
          }
        }
      })
      .finally(() => setLoading(false));
  }, []);

  // Server-side dynamic combo pricing endpoint
  useEffect(() => {
    if (selectedItems.length === 0) {
      setComboSummary(null);
      return;
    }

    const calculateBackendPrice = async () => {
      setCalculating(true);
      setErrorMessage('');
      try {
        const payload = selectedItems.map((it) => ({
          productId: it.product._id,
          weightGrams: it.weightGrams,
          quantity: it.quantity,
        }));

        const res = await api.post('/products/custom-combo/calculate', { items: payload });
        if (res.success) {
          setComboSummary(res.comboSummary);
        }
      } catch (err) {
        setErrorMessage(err.message || 'Error calculating combo price');
      } finally {
        setCalculating(false);
      }
    };

    calculateBackendPrice();
  }, [selectedItems]);

  const handleAddSnackToCombo = (product) => {
    setSelectedItems((prev) => {
      const exists = prev.find((it) => it.product._id === product._id && it.weightGrams === 250);
      if (exists) {
        return prev.map((it) =>
          it.product._id === product._id && it.weightGrams === 250
            ? { ...it, quantity: it.quantity + 1 }
            : it
        );
      }
      return [...prev, { product, weightGrams: 250, quantity: 1 }];
    });
  };

  const handleUpdateItemWeight = (idx, weightGrams) => {
    setSelectedItems((prev) => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], weightGrams: Number(weightGrams) };
      return updated;
    });
  };

  const handleUpdateItemQuantity = (idx, delta) => {
    setSelectedItems((prev) => {
      const updated = [...prev];
      const newQty = updated[idx].quantity + delta;
      if (newQty <= 0) {
        return prev.filter((_, i) => i !== idx);
      }
      updated[idx] = { ...updated[idx], quantity: newQty };
      return updated;
    });
  };

  const handleRemoveFromCombo = (idx) => {
    setSelectedItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleAddComboToCart = () => {
    if (!comboSummary) return;

    comboSummary.items.forEach((item) => {
      addToCart(
        {
          _id: item.product,
          name: item.name,
          pricePerKg: item.pricePerKg,
          images: [{ url: item.imageUrl }],
          isCombo: true,
        },
        item.weightGrams,
        item.quantity
      );
    });

    setAddedMessage(true);
    setTimeout(() => setAddedMessage(false), 2000);
    setIsCartOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12 font-sans text-[#21191A]">
      
      {/* Editorial Header */}
      <div className="border-b border-[#D6B77A]/30 pb-10">
        <span className="font-heading text-xs font-bold uppercase tracking-widest text-[#790B13] block mb-2">
          Bespoke Gifting & Family Boxes
        </span>
        <h1 className="font-editorial text-4xl sm:text-6xl text-[#50000D] font-bold tracking-tight">
          Custom Kathiyawadi <span className="italic text-[#790B13]">Snack Hamper.</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#21191A]/75 font-sans max-w-xl mt-3 leading-relaxed">
          Curate your bespoke Gujarati tea-time hamper. Select individual handmade snacks and preferred weights (250g, 500g, 1kg, 2kg). Exact pricing is dynamically calculated on our backend engine.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Available Snacks Picker */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between border-b border-[#D6B77A]/20 pb-3 font-heading text-xs uppercase tracking-wider">
            <span className="font-bold text-[#50000D]">
              Step 01 / Select Snacks To Combine
            </span>
            <span className="text-[#21191A]/60 font-bold">[{availableSnacks.length} Varieties]</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {availableSnacks.map((product) => {
              const isInCombo = selectedItems.some((it) => it.product._id === product._id);
              return (
                <div
                  key={product._id}
                  className={`p-4 bg-[#FFF9F2] rounded-3xl border transition-all flex flex-col justify-between shadow-xs ${
                    isInCombo ? 'border-[#50000D] bg-[#FFF0DC]/40' : 'border-[#D6B77A]/30 hover:border-[#790B13]'
                  }`}
                >
                  <div className="flex gap-3.5 items-center mb-3">
                    <img
                      src={product.images?.[0]?.url || '/images/snacks/tikha-gathiya.jpg'}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-2xl border border-[#D6B77A]/25 shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="font-heading font-bold text-sm text-[#21191A] truncate">
                        {language === 'gu' && product.nameGujarati ? product.nameGujarati : product.name}
                      </h4>
                      <span className="font-mono text-xs text-[#50000D] font-bold block mt-0.5">
                        ₹{product.pricePerKg}/kg
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAddSnackToCombo(product)}
                    className="w-full bg-white hover:bg-[#50000D] text-[#50000D] hover:text-[#FFF0DC] py-2.5 rounded-full text-xs font-heading font-bold uppercase tracking-wider border border-[#D6B77A]/40 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Include in Box</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Dynamic Combo Box & Calculations */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#FFF9F2] p-6 sm:p-7 rounded-3xl border border-[#D6B77A]/35 shadow-sm space-y-5 sticky top-28 font-heading">
            <div className="flex items-center justify-between border-b border-[#D6B77A]/25 pb-3.5">
              <h2 className="font-bold text-sm uppercase tracking-wider text-[#50000D]">
                Your Bespoke Hamper
              </h2>
              <span className="text-xs font-bold bg-[#FFF0DC] text-[#790B13] border border-[#D6B77A]/30 px-3 py-0.5 rounded-full uppercase tracking-wider text-[10px]">
                {selectedItems.length} Selections
              </span>
            </div>

            {errorMessage && (
              <div className="p-3 bg-rose-50 text-rose-700 rounded-xl text-xs font-sans">
                {errorMessage}
              </div>
            )}

            {selectedItems.length === 0 ? (
              <div className="text-center py-12 text-[#21191A]/60 text-xs">
                Your hamper is empty. Add snacks from the left to configure weights.
              </div>
            ) : (
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {selectedItems.map((item, idx) => {
                  const itemCost = Math.round((item.product.pricePerKg * item.weightGrams) / 1000);
                  return (
                    <div
                      key={idx}
                      className="p-3.5 bg-white rounded-2xl border border-[#D6B77A]/30 space-y-2 text-xs"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-[#21191A] truncate">
                          {item.product.name}
                        </span>
                        <button
                          onClick={() => handleRemoveFromCombo(idx)}
                          className="text-[#21191A]/40 hover:text-[#790B13] p-0.5 cursor-pointer transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-1">
                        <select
                          value={item.weightGrams}
                          onChange={(e) => handleUpdateItemWeight(idx, e.target.value)}
                          className="bg-[#FFF9F2] border border-[#D6B77A]/35 rounded-lg py-1 px-2.5 text-xs font-mono text-[#21191A] focus:outline-none focus:border-[#790B13]"
                        >
                          <option value="250">250g</option>
                          <option value="500">500g</option>
                          <option value="1000">1kg</option>
                          <option value="2000">2kg</option>
                        </select>

                        <div className="flex items-center border border-[#D6B77A]/35 rounded-full bg-[#FFF9F2]">
                          <button
                            onClick={() => handleUpdateItemQuantity(idx, -1)}
                            className="p-1 px-2.5 text-[#21191A] hover:bg-[#FFF0DC] rounded-l-full cursor-pointer transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-mono font-bold text-[#21191A]">{item.quantity}</span>
                          <button
                            onClick={() => handleUpdateItemQuantity(idx, 1)}
                            className="p-1 px-2.5 text-[#21191A] hover:bg-[#FFF0DC] rounded-r-full cursor-pointer transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="font-bold text-sm text-[#50000D]">
                          ₹{itemCost * item.quantity}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Calculations Summary */}
            {comboSummary && (
              <div className="pt-4 border-t border-[#D6B77A]/25 space-y-3 text-xs">
                <div className="flex justify-between text-[#21191A]/70 uppercase tracking-wider text-[11px] font-bold">
                  <span>Total Net Weight:</span>
                  <span className="font-mono font-bold text-[#21191A]">
                    {comboSummary.comboTotalKg} kg ({comboSummary.comboTotalGrams} g)
                  </span>
                </div>

                <div className="pt-2 border-t border-[#D6B77A]/20 flex justify-between items-baseline">
                  <span className="font-bold text-xs uppercase tracking-wider text-[#21191A]">
                    Total Calculated Price:
                  </span>
                  <span className="font-black text-3xl text-[#790B13]">
                    {calculating ? '...' : `₹${comboSummary.comboTotal}`}
                  </span>
                </div>

                <button
                  onClick={handleAddComboToCart}
                  disabled={selectedItems.length === 0}
                  className="w-full mt-2 bg-[#50000D] hover:bg-[#790B13] text-[#FFF0DC] border border-[#D6B77A]/40 py-4 rounded-full text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-40"
                >
                  {addedMessage ? (
                    <>
                      <Check className="w-4 h-4 text-[#D6B77A]" />
                      <span>Added to Bag!</span>
                    </>
                  ) : (
                    <span>Add Custom Box • ₹{comboSummary.comboTotal}</span>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComboBuilderPage;
