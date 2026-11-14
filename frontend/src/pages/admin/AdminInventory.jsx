import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  AlertTriangle,
  Plus,
  History,
  CheckCircle,
  X,
  Sparkles,
  Scale,
} from 'lucide-react';

const AdminInventory = () => {
  const [inventoryList, setInventoryList] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restock modal
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [adjustmentGrams, setAdjustmentGrams] = useState(5000);
  const [reason, setReason] = useState('manual_restock');
  const [adjusting, setAdjusting] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  // Logs modal
  const [logsProduct, setLogsProduct] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await api.get('/inventory');
      if (res.success) {
        setInventoryList(res.inventory);
        setSummary(res.summary);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleAdjustStock = async (e) => {
    e.preventDefault();
    setAdjusting(true);
    setModalMessage('');

    try {
      const res = await api.put(`/inventory/${selectedProduct.product._id}`, {
        adjustmentGrams: Number(adjustmentGrams),
        reason,
      });

      if (res.success) {
        setModalMessage('Stock adjusted successfully!');
        fetchInventory();
        setTimeout(() => {
          setSelectedProduct(null);
          setModalMessage('');
        }, 800);
      }
    } catch (err) {
      setModalMessage(err.message || 'Failed to adjust stock');
    } finally {
      setAdjusting(false);
    }
  };

  const handleViewLogs = async (inv) => {
    setLogsProduct(inv.product);
    setLoadingLogs(true);
    try {
      const res = await api.get(`/inventory/${inv.product._id}/logs`);
      if (res.success) {
        setLogs(res.logs);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingLogs(false);
    }
  };

  return (
    <div className="space-y-8 text-[#21191A] font-sans">
      {/* Editorial Header */}
      <div className="border-b border-[#D6B77A]/20 pb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF0DC] border border-[#D6B77A]/40 text-[#790B13] text-xs font-mono uppercase tracking-widest mb-2 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#D6B77A]" />
            <span>Continuous Weight Accounting</span>
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-5xl tracking-tight text-[#21191A] uppercase">
            Inventory <span className="font-serif italic font-normal lowercase text-[#790B13]">ledger</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#21191A]/70 font-sans mt-1">
            Gram-for-gram continuous unit accounting. Real-time depletion as online packets are booked.
          </p>
        </div>

        {summary && (
          <div className="flex gap-6 bg-white p-5 rounded-2xl border border-[#D6B77A]/30 shadow-md text-xs font-mono">
            <div>
              <span className="text-[#21191A]/60 block text-[10px] uppercase tracking-wider font-bold">Gross Stock</span>
              <span className="font-heading font-black text-xl text-[#790B13]">
                {summary.totalStockKg} kg
              </span>
            </div>
            <div className="border-l border-[#D6B77A]/20 pl-6">
              <span className="text-rose-700 block text-[10px] uppercase tracking-wider font-bold">Low Stock Alert</span>
              <span className="font-heading font-black text-xl text-rose-700">
                {summary.lowStockCount} items
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Inventory Table */}
      <div className="bg-white border border-[#D6B77A]/30 rounded-3xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-20 text-center text-xs text-[#790B13] font-mono font-bold uppercase tracking-widest">
            Loading inventory ledger...
          </div>
        ) : (
          <div className="table-responsive-container">
            <table className="w-full text-left text-xs sm:text-sm font-sans min-w-[720px]">
              <thead className="bg-[#FFF9F2] text-[#21191A]/70 uppercase font-mono text-xs tracking-wider border-b border-[#D6B77A]/20">
                <tr>
                  <th className="py-4 px-5 font-bold">Snack Product</th>
                  <th className="py-4 px-5 font-bold">Available (Grams)</th>
                  <th className="py-4 px-5 font-bold">Available (Kilograms)</th>
                  <th className="py-4 px-5 font-bold">Alert Threshold</th>
                  <th className="py-4 px-5 font-bold">Status</th>
                  <th className="py-4 px-5 text-right font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D6B77A]/15 font-mono">
                {inventoryList.map((inv) => {
                  const isLow = inv.availableGrams <= inv.lowStockThresholdGrams;
                  return (
                    <tr key={inv._id} className="hover:bg-[#FFF9F2] transition-colors">
                      <td className="py-4 px-5">
                        <span className="font-heading font-black text-sm uppercase text-[#21191A] block">
                          {inv.product?.name}
                        </span>
                        <span className="text-xs text-[#21191A]/50 block">
                          ₹{inv.product?.pricePerKg}/kg
                        </span>
                      </td>

                      <td className="py-4 px-5 font-bold text-[#21191A]">
                        {inv.availableGrams.toLocaleString()} g
                      </td>

                      <td className="py-4 px-5 font-heading font-black text-sm text-[#790B13]">
                        {(inv.availableGrams / 1000).toFixed(2)} kg
                      </td>

                      <td className="py-4 px-5 text-[#21191A]/60 text-xs">
                        {(inv.lowStockThresholdGrams / 1000).toFixed(1)} kg ({inv.lowStockThresholdGrams} g)
                      </td>

                      <td className="py-4 px-5">
                        {isLow ? (
                          <span className="border border-rose-300 bg-rose-50 text-rose-800 text-[10px] font-bold uppercase px-3 py-1 rounded-full inline-flex items-center gap-1.5">
                            <AlertTriangle className="w-3 h-3 text-rose-700" /> Low Stock
                          </span>
                        ) : (
                          <span className="border border-emerald-300 bg-emerald-50 text-emerald-800 text-[10px] font-bold uppercase px-3 py-1 rounded-full inline-flex items-center gap-1.5">
                            <CheckCircle className="w-3 h-3 text-emerald-700" /> Adequate
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-5 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleViewLogs(inv)}
                            className="p-2 rounded-xl border border-[#D6B77A]/40 text-[#21191A]/70 hover:text-[#790B13] hover:border-[#790B13] transition-colors cursor-pointer"
                            title="Audit Trail Logs"
                          >
                            <History className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setSelectedProduct(inv)}
                            className="bg-[#790B13] hover:bg-[#50000D] text-[#FFF0DC] px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                          >
                            <Plus className="w-3.5 h-3.5 text-[#D6B77A]" /> Restock
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Restock Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-[#21191A]/70 backdrop-blur-xs" onClick={() => setSelectedProduct(null)} />
          <div className="relative bg-[#FFF9F2] max-w-md w-full p-6 sm:p-8 rounded-3xl z-10 border border-[#D6B77A]/40 shadow-2xl space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#790B13] font-bold block mb-1">
                  Batch Adjustment
                </span>
                <h3 className="font-heading font-black text-xl text-[#21191A] uppercase tracking-tight">
                  {selectedProduct.product?.name}
                </h3>
              </div>
              <button onClick={() => setSelectedProduct(null)} className="text-[#21191A]/50 hover:text-[#790B13] p-1.5 rounded-full hover:bg-[#FFF0DC] cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#21191A]/70 font-mono bg-[#FFF0DC] p-3.5 rounded-xl border border-[#D6B77A]/40">
              Current Available: <strong className="text-[#790B13]">{selectedProduct.availableGrams} g ({(selectedProduct.availableGrams / 1000).toFixed(2)} kg)</strong>
            </p>

            {modalMessage && (
              <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-300 font-mono font-bold">
                {modalMessage}
              </div>
            )}

            <form onSubmit={handleAdjustStock} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#21191A]/70 mb-1.5">
                  Stock Adjustment (in Grams)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    required
                    value={adjustmentGrams}
                    onChange={(e) => setAdjustmentGrams(e.target.value)}
                    placeholder="+5000 for restock, -1000 for waste"
                    className="flex-1 bg-white border border-[#D6B77A]/30 rounded-xl px-4 py-2.5 font-mono text-xs text-[#21191A] focus:outline-none focus:border-[#790B13]"
                  />
                  <span className="self-center font-mono text-xs text-[#21191A]/60">grams</span>
                </div>
                <p className="text-[11px] text-[#21191A]/60 mt-1">
                  Positive values add freshly fried batches (5000 = 5kg); negative values record trimming.
                </p>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#21191A]/70 mb-1.5">
                  Reason for Adjustment
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full bg-white border border-[#D6B77A]/30 rounded-xl px-4 py-2.5 text-xs text-[#21191A] focus:outline-none focus:border-[#790B13] cursor-pointer"
                >
                  <option value="manual_restock">Fresh Batch Fried Today (Restock)</option>
                  <option value="damage_or_waste">Kitchen Waste / Crushed Batches</option>
                  <option value="manual_deduction">Inventory Correction</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={adjusting}
                  className="flex-1 bg-[#790B13] hover:bg-[#50000D] text-[#FFF0DC] py-3 rounded-full font-mono font-bold text-xs uppercase tracking-wider cursor-pointer disabled:opacity-50 transition-colors shadow-md shadow-[#790B13]/25"
                >
                  {adjusting ? 'Saving...' : 'Apply Adjustment'}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="px-6 py-3 rounded-full border border-[#D6B77A]/40 font-mono font-bold text-xs uppercase tracking-wider text-[#21191A]/70 hover:text-[#790B13] hover:border-[#790B13] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Audit Trail Modal */}
      {logsProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-[#21191A]/70 backdrop-blur-xs" onClick={() => setLogsProduct(null)} />
          <div className="relative bg-[#FFF9F2] max-w-xl w-full p-6 sm:p-8 rounded-3xl z-10 border border-[#D6B77A]/40 shadow-2xl space-y-6">
            <div className="flex justify-between items-start border-b border-[#D6B77A]/20 pb-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#790B13] font-bold block mb-1">
                  Historical Log
                </span>
                <h3 className="font-heading font-black text-xl text-[#21191A] uppercase tracking-tight">
                  Audit Trail: {logsProduct.name}
                </h3>
              </div>
              <button onClick={() => setLogsProduct(null)} className="text-[#21191A]/50 hover:text-[#790B13] p-1.5 rounded-full hover:bg-[#FFF0DC] cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            {loadingLogs ? (
              <p className="text-xs text-[#790B13] py-8 text-center font-mono font-bold uppercase tracking-wider">
                Loading audit trail...
              </p>
            ) : logs.length === 0 ? (
              <p className="text-xs text-[#21191A]/60 py-8 text-center font-sans">
                No adjustment logs recorded yet.
              </p>
            ) : (
              <div className="max-h-72 overflow-y-auto space-y-2 text-xs font-mono divide-y divide-[#D6B77A]/15">
                {logs.map((log, i) => (
                  <div key={i} className="pt-3 first:pt-0 flex justify-between items-center">
                    <div>
                      <span className={`font-bold ${log.adjustmentGrams > 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                        {log.adjustmentGrams > 0 ? `+${log.adjustmentGrams}` : log.adjustmentGrams} g
                      </span>
                      <span className="text-xs text-[#21191A]/70 block font-sans">
                        Reason: {log.reason} {log.referenceId ? `(Ref: ${log.referenceId})` : ''}
                      </span>
                    </div>
                    <div className="text-right text-xs text-[#21191A]/60 font-mono">
                      <span>{log.previousGrams}g → {log.newGrams}g</span>
                      <span className="block">{new Date(log.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => setLogsProduct(null)}
              className="w-full py-3 bg-white hover:bg-[#FFF0DC]/40 text-[#21191A] border border-[#D6B77A]/40 rounded-full font-mono font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              Close Ledger
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInventory;
