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
    <div className="space-y-8 text-[#000000]">
      {/* Editorial Header */}
      <div className="border-b border-[#EAE3D9] pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#14382B] text-[#000000] text-xs font-bold mb-2 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#C84B20]" />
            <span>Promotions & Vouchers</span>
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-4xl tracking-tight text-[#000000]">
            Coupons Management
          </h1>
          <p className="text-xs sm:text-sm text-[#555555] font-sans mt-1">
            Percentage markdowns, flat festive rebates, minimum checkout gates, and redemption limits.
          </p>
        </div>

        <button
          onClick={() => setShowCreate(!showCreate)}
          className="bg-[#000000] hover:bg-[#C84B20] text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
        >
          {showCreate ? <X className="w-4 h-4 text-[#14382B]" /> : <Plus className="w-4 h-4 text-[#14382B]" />}
          <span>{showCreate ? 'Close Form' : 'Generate New Coupon'}</span>
        </button>
      </div>

      {/* Create Coupon Drawer/Form */}
      {showCreate && (
        <form onSubmit={handleCreateCoupon} className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EAE3D9] shadow-sm space-y-6 text-xs sm:text-sm font-sans">
          <div className="border-b border-[#EAE3D9] pb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#555555] block">
              Promotion Config
            </span>
            <h3 className="font-heading font-black text-xl text-[#000000] tracking-tight">
              Create Promotional Voucher
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#000000] mb-2">
                Voucher Code *
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. FESTIVE15"
                className="w-full bg-[#FAF7F2] border border-[#EAE3D9] rounded-xl px-3.5 py-2.5 font-mono text-xs uppercase text-[#000000] focus:outline-none focus:border-[#000000]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#000000] mb-2">
                Discount Mechanism *
              </label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#EAE3D9] rounded-xl px-3.5 py-2.5 text-xs text-[#000000] focus:outline-none focus:border-[#000000]"
              >
                <option value="percentage">Percentage Markdown (%)</option>
                <option value="fixed">Fixed Deduction (₹)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#000000] mb-2">
                Discount Value *
              </label>
              <input
                type="number"
                required
                min="1"
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#EAE3D9] rounded-xl px-3.5 py-2.5 font-mono text-xs text-[#000000] focus:outline-none focus:border-[#000000]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#000000] mb-2">
                Minimum Cart Threshold (₹)
              </label>
              <input
                type="number"
                value={minOrderValue}
                onChange={(e) => setMinOrderValue(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#EAE3D9] rounded-xl px-3.5 py-2.5 font-mono text-xs text-[#000000] focus:outline-none focus:border-[#000000]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#000000] mb-2">
                Max Deduction Cap (₹)
              </label>
              <input
                type="number"
                value={maxDiscount}
                onChange={(e) => setMaxDiscount(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#EAE3D9] rounded-xl px-3.5 py-2.5 font-mono text-xs text-[#000000] focus:outline-none focus:border-[#000000]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#000000] mb-2">
                Expiration Date *
              </label>
              <input
                type="date"
                required
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#EAE3D9] rounded-xl px-3.5 py-2.5 font-mono text-xs text-[#000000] focus:outline-none focus:border-[#000000]"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="bg-[#C84B20] hover:bg-[#A33A16] text-white px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider cursor-pointer transition-colors shadow-sm"
            >
              Issue Coupon Voucher
            </button>
            <button
              type="button"
              onClick={() => setShowCreate(false)}
              className="px-5 py-2.5 rounded-full border border-[#EAE3D9] font-bold text-xs uppercase tracking-wider text-[#555555] hover:text-[#000000] hover:border-[#000000] transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Coupons Table */}
      <div className="bg-white border border-[#EAE3D9] rounded-3xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-20 text-center text-xs text-[#555555] font-heading font-bold uppercase tracking-wider">
            Loading coupon ledger...
          </div>
        ) : coupons.length === 0 ? (
          <div className="py-20 text-center text-xs text-[#555555] font-sans">
            No active coupons found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm font-sans">
              <thead className="bg-[#FAF7F2] text-[#555555] uppercase text-xs tracking-wider border-b border-[#EAE3D9]">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Coupon Voucher</th>
                  <th className="py-3.5 px-4 font-semibold">Markdown Rate</th>
                  <th className="py-3.5 px-4 font-semibold">Min. Order</th>
                  <th className="py-3.5 px-4 font-semibold">Validity End</th>
                  <th className="py-3.5 px-4 font-semibold">Redemption Count</th>
                  <th className="py-3.5 px-4 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5E0]">
                {coupons.map((c) => (
                  <tr key={c._id} className="hover:bg-[#FAF7F2] transition-colors">
                    <td className="py-4 px-4 font-mono font-bold text-sm text-[#000000]">
                      <span className="px-2.5 py-1 bg-[#FAF7F2] border border-[#EAE3D9] rounded-lg">
                        {c.code}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-heading font-black text-sm text-[#C84B20]">
                      {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`}
                    </td>
                    <td className="py-4 px-4 text-[#555555] font-mono">
                      ₹{c.minOrderValue}
                    </td>
                    <td className="py-4 px-4 text-[#555555] font-mono">
                      {new Date(c.expiryDate).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4 font-mono text-xs font-bold text-[#000000]">
                      {c.usedCount} / {c.usageLimit}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => handleDelete(c._id)}
                        className="text-[#555555] hover:text-[#C84B20] p-2 rounded-xl border border-[#EAE3D9] hover:border-[#C84B20] cursor-pointer transition-colors"
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
