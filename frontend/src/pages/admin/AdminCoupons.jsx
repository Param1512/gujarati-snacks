import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Tag, Plus, Trash2, Sparkles, X } from 'lucide-react';

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  // New coupon form
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [discountType, setDiscountType] = useState('percentage');
  const [discountValue, setDiscountValue] = useState(10);
  const [minOrderValue, setMinOrderValue] = useState(499);
  const [maxDiscount, setMaxDiscount] = useState(150);
  const [expiryDate, setExpiryDate] = useState('');
  const [usageLimit, setUsageLimit] = useState(100);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await api.get('/coupons');
      if (res.success) setCoupons(res.coupons);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/coupons', {
        code,
        description,
        discountType,
        discountValue: Number(discountValue),
        minOrderValue: Number(minOrderValue),
        maxDiscount: maxDiscount ? Number(maxDiscount) : undefined,
        expiryDate,
        usageLimit: Number(usageLimit),
      });

      if (res.success) {
        setShowCreate(false);
        setCode('');
        setDescription('');
        fetchCoupons();
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this promotional coupon voucher?')) return;
    try {
      await api.delete(`/coupons/${id}`);
      fetchCoupons();
    } catch (e) {}
  };

  return (
    <div className="space-y-8 text-[#21191A] font-sans">
      {/* Editorial Header */}
      <div className="border-b border-[#D6B77A]/20 pb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF0DC] border border-[#D6B77A]/40 text-[#790B13] text-xs font-mono uppercase tracking-widest mb-2 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#D6B77A]" />
            <span>Promotions & Vouchers</span>
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-5xl tracking-tight text-[#21191A] uppercase">
            Coupons <span className="font-serif italic font-normal lowercase text-[#790B13]">management</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#21191A]/70 font-sans mt-1">
            Percentage markdowns, flat festive rebates, minimum checkout gates, and redemption limits.
          </p>
        </div>

        <button
          onClick={() => setShowCreate(!showCreate)}
          className="bg-[#790B13] hover:bg-[#50000D] text-[#FFF0DC] px-6 py-3.5 rounded-full text-xs font-mono uppercase tracking-wider font-bold flex items-center gap-2 transition-all shadow-lg shadow-[#790B13]/25 cursor-pointer"
        >
          {showCreate ? <X className="w-4 h-4 text-[#D6B77A]" /> : <Plus className="w-4 h-4 text-[#D6B77A]" />}
          <span>{showCreate ? 'Close Form' : 'Generate New Coupon'}</span>
        </button>
      </div>

      {/* Create Coupon Drawer/Form */}
      {showCreate && (
        <form onSubmit={handleCreateCoupon} className="bg-white p-6 sm:p-10 rounded-3xl border border-[#D6B77A]/30 shadow-xl space-y-6 text-xs sm:text-sm font-sans">
          <div className="border-b border-[#D6B77A]/20 pb-4">
            <span className="text-xs font-mono uppercase tracking-widest text-[#790B13] font-bold block mb-1">
              Promotion Config
            </span>
            <h3 className="font-heading font-black text-xl text-[#21191A] uppercase tracking-tight">
              Create Promotional Voucher
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#21191A]/70 mb-2">
                Voucher Code *
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. FESTIVE15"
                className="w-full bg-[#FFF9F2] border border-[#D6B77A]/30 rounded-xl px-4 py-3 font-mono text-xs uppercase text-[#21191A] focus:outline-none focus:border-[#790B13]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#21191A]/70 mb-2">
                Discount Mechanism *
              </label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value)}
                className="w-full bg-[#FFF9F2] border border-[#D6B77A]/30 rounded-xl px-4 py-3 text-xs text-[#21191A] focus:outline-none focus:border-[#790B13] cursor-pointer"
              >
                <option value="percentage">Percentage Markdown (%)</option>
                <option value="fixed">Fixed Deduction (₹)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#21191A]/70 mb-2">
                Discount Value *
              </label>
              <input
                type="number"
                required
                min="1"
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                className="w-full bg-[#FFF9F2] border border-[#D6B77A]/30 rounded-xl px-4 py-3 font-mono text-xs text-[#21191A] focus:outline-none focus:border-[#790B13]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#21191A]/70 mb-2">
                Minimum Cart Threshold (₹)
              </label>
              <input
                type="number"
                value={minOrderValue}
                onChange={(e) => setMinOrderValue(e.target.value)}
                className="w-full bg-[#FFF9F2] border border-[#D6B77A]/30 rounded-xl px-4 py-3 font-mono text-xs text-[#21191A] focus:outline-none focus:border-[#790B13]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#21191A]/70 mb-2">
                Max Deduction Cap (₹)
              </label>
              <input
                type="number"
                value={maxDiscount}
                onChange={(e) => setMaxDiscount(e.target.value)}
                className="w-full bg-[#FFF9F2] border border-[#D6B77A]/30 rounded-xl px-4 py-3 font-mono text-xs text-[#21191A] focus:outline-none focus:border-[#790B13]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#21191A]/70 mb-2">
                Expiration Date *
              </label>
              <input
                type="date"
                required
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full bg-[#FFF9F2] border border-[#D6B77A]/30 rounded-xl px-4 py-3 font-mono text-xs text-[#21191A] focus:outline-none focus:border-[#790B13]"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="bg-[#790B13] hover:bg-[#50000D] text-[#FFF0DC] px-8 py-3 rounded-full font-mono font-bold text-xs uppercase tracking-wider cursor-pointer transition-all shadow-md shadow-[#790B13]/25"
            >
              Issue Coupon Voucher
            </button>
            <button
              type="button"
              onClick={() => setShowCreate(false)}
              className="px-6 py-3 rounded-full border border-[#D6B77A]/40 font-mono font-bold text-xs uppercase tracking-wider text-[#21191A]/70 hover:text-[#790B13] hover:border-[#790B13] transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Coupons Table */}
      <div className="bg-white border border-[#D6B77A]/30 rounded-3xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-20 text-center text-xs text-[#790B13] font-mono font-bold uppercase tracking-widest">
            Loading coupon ledger...
          </div>
        ) : coupons.length === 0 ? (
          <div className="py-20 text-center text-xs text-[#21191A]/60 font-sans">
            No active coupons found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm font-sans">
              <thead className="bg-[#FFF9F2] text-[#21191A]/70 uppercase font-mono text-xs tracking-wider border-b border-[#D6B77A]/20">
                <tr>
                  <th className="py-4 px-5 font-bold">Coupon Voucher</th>
                  <th className="py-4 px-5 font-bold">Markdown Rate</th>
                  <th className="py-4 px-5 font-bold">Min. Order</th>
                  <th className="py-4 px-5 font-bold">Validity End</th>
                  <th className="py-4 px-5 font-bold">Redemption Count</th>
                  <th className="py-4 px-5 text-right font-bold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D6B77A]/15 font-mono">
                {coupons.map((c) => (
                  <tr key={c._id} className="hover:bg-[#FFF9F2] transition-colors">
                    <td className="py-4 px-5 font-mono font-bold text-sm text-[#21191A]">
                      <span className="px-3 py-1 bg-[#FFF0DC] border border-[#D6B77A]/40 text-[#790B13] rounded-lg">
                        {c.code}
                      </span>
                    </td>
                    <td className="py-4 px-5 font-heading font-black text-sm text-[#790B13]">
                      {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`}
                    </td>
                    <td className="py-4 px-5 text-[#21191A]/70">
                      ₹{c.minOrderValue}
                    </td>
                    <td className="py-4 px-5 text-[#21191A]/70">
                      {new Date(c.expiryDate).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-5 text-xs font-bold text-[#21191A]">
                      {c.usedCount} / {c.usageLimit}
                    </td>
                    <td className="py-4 px-5 text-right">
                      <button
                        onClick={() => handleDelete(c._id)}
                        className="text-[#21191A]/50 hover:text-rose-700 p-2 rounded-xl border border-[#D6B77A]/40 hover:border-rose-300 cursor-pointer transition-colors"
                        title="Delete Coupon"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCoupons;
