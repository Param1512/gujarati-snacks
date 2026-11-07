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
    <div className="space-y-8 text-[#000000]">
      {/* Editorial Header */}
      <div className="border-b border-[#EAE3D9] pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#14382B] text-[#000000] text-xs font-bold mb-2 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#C84B20]" />
            <span>Continuous Weight Accounting</span>
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-4xl tracking-tight text-[#000000]">
            Inventory Management
          </h1>
          <p className="text-xs sm:text-sm text-[#555555] font-sans mt-1">
            Gram-for-gram continuous unit accounting. Real-time depletion as online packets are booked.
          </p>
        </div>

        {summary && (
          <div className="flex gap-6 bg-white p-4 rounded-2xl border border-[#EAE3D9] shadow-sm text-xs font-sans">
            <div>
              <span className="text-[#555555] block text-xs font-semibold uppercase tracking-wider">Gross Stock</span>
              <span className="font-heading font-black text-xl text-[#000000]">
                {summary.totalStockKg} kg
              </span>
            </div>
            <div className="border-l border-[#EAE3D9] pl-6">
              <span className="text-[#C84B20] block text-xs font-semibold uppercase tracking-wider">Low Stock</span>
              <span className="font-heading font-black text-xl text-[#C84B20]">
                {summary.lowStockCount} items
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Inventory Table */}
      <div className="bg-white border border-[#EAE3D9] rounded-3xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-20 text-center text-xs text-[#555555] font-heading font-bold uppercase tracking-wider">
            Loading inventory ledger...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm font-sans">
              <thead className="bg-[#FAF7F2] text-[#555555] uppercase text-xs tracking-wider border-b border-[#EAE3D9]">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Snack Product</th>
                  <th className="py-3.5 px-4 font-semibold">Available (Grams)</th>
                  <th className="py-3.5 px-4 font-semibold">Available (Kilograms)</th>
                  <th className="py-3.5 px-4 font-semibold">Alert Threshold</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5E0]">
                {inventoryList.map((inv) => {
                  const isLow = inv.availableGrams <= inv.lowStockThresholdGrams;
                  return (
                    <tr key={inv._id} className="hover:bg-[#FAF7F2] transition-colors">
                      <td className="py-4 px-4">
                        <span className="font-semibold text-sm text-[#000000] block">
                          {inv.product?.name}
                        </span>
                        <span className="text-xs text-[#555555] font-mono block">
                          ₹{inv.product?.pricePerKg}/kg
                        </span>
                      </td>

                      <td className="py-4 px-4 font-mono font-bold text-[#000000]">
                        {inv.availableGrams.toLocaleString()} g
                      </td>

                      <td className="py-4 px-4 font-heading font-black text-sm text-[#000000]">
                        {(inv.availableGrams / 1000).toFixed(2)} kg
                      </td>

                      <td className="py-4 px-4 text-[#555555] font-mono text-xs">
                        {(inv.lowStockThresholdGrams / 1000).toFixed(1)} kg ({inv.lowStockThresholdGrams} g)
                      </td>

                      <td className="py-4 px-4">
                        {isLow ? (
                          <span className="border border-[#C84B20]/20 bg-[#C84B20]/10 text-[#C84B20] text-xs font-bold uppercase px-2.5 py-0.5 rounded-full inline-flex items-center gap-1.5">
                            <AlertTriangle className="w-3 h-3 text-[#C84B20]" /> Low Stock
                          </span>
                        ) : (
                          <span className="border border-[#EAE3D9] bg-[#14382B] text-[#000000] text-xs font-bold uppercase px-2.5 py-0.5 rounded-full inline-flex items-center gap-1.5">
                            <CheckCircle className="w-3 h-3 text-[#000000]" /> Adequate
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleViewLogs(inv)}
                            className="p-2 rounded-xl border border-[#EAE3D9] text-[#555555] hover:text-[#000000] hover:border-[#000000] transition-colors cursor-pointer"
                            title="Audit Trail Logs"
                          >
                            <History className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setSelectedProduct(inv)}
                            className="bg-[#000000] hover:bg-[#C84B20] text-white px-3.5 py-1.5 rounded-full font-bold text-xs uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                          >
                            <Plus className="w-3.5 h-3.5 text-[#14382B]" /> Restock
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
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setSelectedProduct(null)} />
          <div className="relative bg-white max-w-md w-full p-6 sm:p-8 rounded-3xl z-10 border border-[#EAE3D9] shadow-xl space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#555555] block">
                  Batch Adjustment
                </span>
                <h3 className="font-heading font-black text-xl text-[#000000] tracking-tight">
                  {selectedProduct.product?.name}
                </h3>
              </div>
              <button onClick={() => setSelectedProduct(null)} className="text-[#555555] hover:text-[#000000] p-1.5 rounded-full hover:bg-[#FAF7F2]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#555555] font-mono bg-[#FAF7F2] p-3 rounded-xl border border-[#EAE3D9]">
              Current Available: <strong className="text-[#000000]">{selectedProduct.availableGrams} g ({(selectedProduct.availableGrams / 1000).toFixed(2)} kg)</strong>
            </p>

            {modalMessage && (
              <div className="p-3 bg-[#EBF4EF] text-[#000000] text-xs rounded-xl border border-[#14382B] font-sans font-medium">
                {modalMessage}
              </div>
            )}

            <form onSubmit={handleAdjustStock} className="space-y-4 text-xs sm:text-sm font-sans">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#000000] mb-1.5">
                  Stock Adjustment (in Grams)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    required
                    value={adjustmentGrams}
                    onChange={(e) => setAdjustmentGrams(e.target.value)}
                    placeholder="+5000 for restock, -1000 for waste"
                    className="flex-1 bg-[#FAF7F2] border border-[#EAE3D9] rounded-xl px-3.5 py-2 font-mono text-xs text-[#000000] focus:outline-none focus:border-[#000000]"
                  />
                  <span className="self-center font-mono text-xs text-[#555555]">grams</span>
                </div>
                <p className="text-[11px] text-[#555555] mt-1">
                  Positive values add freshly fried batches (5000 = 5kg); negative values record trimming.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#000000] mb-1.5">
                  Reason for Adjustment
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#EAE3D9] rounded-xl px-3.5 py-2 text-xs text-[#000000] focus:outline-none focus:border-[#000000]"
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
                  className="flex-1 bg-[#C84B20] hover:bg-[#A33A16] text-white py-2.5 rounded-full font-bold text-xs uppercase tracking-wider cursor-pointer disabled:opacity-50 transition-colors shadow-sm"
                >
                  {adjusting ? 'Saving...' : 'Apply Adjustment'}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="px-5 py-2.5 rounded-full border border-[#EAE3D9] font-bold text-xs uppercase tracking-wider text-[#555555] hover:text-[#000000] hover:border-[#000000] transition-colors"
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
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setLogsProduct(null)} />
          <div className="relative bg-white max-w-xl w-full p-6 sm:p-8 rounded-3xl z-10 border border-[#EAE3D9] shadow-xl space-y-6">
            <div className="flex justify-between items-start border-b border-[#EAE3D9] pb-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#555555] block">
                  Historical Log
                </span>
                <h3 className="font-heading font-black text-xl text-[#000000] tracking-tight">
                  Audit Trail: {logsProduct.name}
                </h3>
              </div>
              <button onClick={() => setLogsProduct(null)} className="text-[#555555] hover:text-[#000000] p-1.5 rounded-full hover:bg-[#FAF7F2]">
                <X className="w-4 h-4" />
              </button>
            </div>

            {loadingLogs ? (
              <p className="text-xs text-[#555555] py-8 text-center font-heading font-bold uppercase tracking-wider">
                Loading audit trail...
              </p>
            ) : logs.length === 0 ? (
              <p className="text-xs text-[#555555] py-8 text-center font-sans">
                No adjustment logs recorded yet.
              </p>
            ) : (
              <div className="max-h-72 overflow-y-auto space-y-2 text-xs font-sans divide-y divide-[#E5E5E0]">
                {logs.map((log, i) => (
                  <div key={i} className="pt-3 first:pt-0 flex justify-between items-center">
                    <div>
                      <span className={`font-mono font-bold ${log.adjustmentGrams > 0 ? 'text-[#000000]' : 'text-[#C84B20]'}`}>
                        {log.adjustmentGrams > 0 ? `+${log.adjustmentGrams}` : log.adjustmentGrams} g
                      </span>
                      <span className="text-xs text-[#555555] block">
                        Reason: {log.reason} {log.referenceId ? `(Ref: ${log.referenceId})` : ''}
                      </span>
                    </div>
                    <div className="text-right text-xs text-[#555555] font-mono">
                      <span>{log.previousGrams}g → {log.newGrams}g</span>
                      <span className="block">{new Date(log.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => setLogsProduct(null)}
              className="w-full py-2.5 bg-[#FAF7F2] hover:bg-white text-[#000000] border border-[#EAE3D9] rounded-full font-bold text-xs uppercase tracking-wider transition-colors"
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
