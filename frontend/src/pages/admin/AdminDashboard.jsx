import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import {
  DollarSign,
  ShoppingBag,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Sparkles,
} from 'lucide-react';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/admin/analytics')
      .then((res) => {
        if (res.success) setData(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-24 text-center font-sans">
        <div className="w-10 h-10 border-2 border-[#790B13] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-mono uppercase tracking-widest text-[#790B13]">
          Aggregating Kitchen Ledger...
        </p>
      </div>
    );
  }

  const {
    totalRevenue = 0,
    todayRevenue = 0,
    monthlyRevenue = 0,
    totalOrders = 0,
    pendingOrders = 0,
    deliveredOrders = 0,
    cancelledOrders = 0,
    totalCustomers = 0,
    bestsellers = [],
    lowStockProducts = [],
    recentOrders = [],
  } = data || {};

  return (
    <div className="space-y-10 text-[#21191A] font-sans">
      {/* Header */}
      <div className="border-b border-[#D6B77A]/20 pb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF0DC] border border-[#D6B77A]/40 text-[#790B13] text-xs font-mono uppercase tracking-widest mb-2 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#D6B77A]" />
            <span>Executive Operational Intelligence</span>
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-5xl tracking-tight text-[#21191A] uppercase">
            Analytics & <span className="font-serif italic font-normal lowercase text-[#790B13]">performance</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#21191A]/70 font-sans mt-1">
            Real-time gross transactional metrics, dispatch volume, and gram-level storage states.
          </p>
        </div>
      </div>

      {/* Primary Revenue Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-7 rounded-3xl border border-[#D6B77A]/30 shadow-md space-y-4 hover:border-[#790B13]/30 transition-colors">
          <div className="flex items-center justify-between text-[#21191A]/70 text-xs font-mono uppercase tracking-wider">
            <span>Gross Revenue</span>
            <div className="w-9 h-9 rounded-full bg-[#FFF0DC] border border-[#D6B77A]/40 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-[#790B13]" />
            </div>
          </div>
          <div className="font-heading font-black text-3xl sm:text-4xl text-[#790B13] tracking-tight">
            ₹{totalRevenue.toLocaleString()}
          </div>
          <div className="text-xs font-mono text-[#21191A]/60 border-t border-[#D6B77A]/20 pt-3">
            Confirmed & Delivered
          </div>
        </div>

        <div className="bg-white p-7 rounded-3xl border border-[#D6B77A]/30 shadow-md space-y-4 hover:border-[#790B13]/30 transition-colors">
          <div className="flex items-center justify-between text-[#21191A]/70 text-xs font-mono uppercase tracking-wider">
            <span>Today's Receipts</span>
            <div className="w-9 h-9 rounded-full bg-[#FFF0DC] border border-[#D6B77A]/40 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-[#790B13]" />
            </div>
          </div>
          <div className="font-heading font-black text-3xl sm:text-4xl text-[#21191A] tracking-tight">
            ₹{todayRevenue.toLocaleString()}
          </div>
          <div className="text-xs font-mono text-[#21191A]/60 border-t border-[#D6B77A]/20 pt-3">
            Since 00:00 IST today
          </div>
        </div>

        <div className="bg-white p-7 rounded-3xl border border-[#D6B77A]/30 shadow-md space-y-4 hover:border-[#790B13]/30 transition-colors">
          <div className="flex items-center justify-between text-[#21191A]/70 text-xs font-mono uppercase tracking-wider">
            <span>Monthly Run-rate</span>
            <div className="w-9 h-9 rounded-full bg-[#FFF0DC] border border-[#D6B77A]/40 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-[#790B13]" />
            </div>
          </div>
          <div className="font-heading font-black text-3xl sm:text-4xl text-[#21191A] tracking-tight">
            ₹{monthlyRevenue.toLocaleString()}
          </div>
          <div className="text-xs font-mono text-[#21191A]/60 border-t border-[#D6B77A]/20 pt-3">
            Current calendar cycle
          </div>
        </div>

        <div className="bg-white p-7 rounded-3xl border border-[#D6B77A]/30 shadow-md space-y-4 hover:border-[#790B13]/30 transition-colors">
          <div className="flex items-center justify-between text-[#21191A]/70 text-xs font-mono uppercase tracking-wider">
            <span>Registered Patrons</span>
            <div className="w-9 h-9 rounded-full bg-[#FFF0DC] border border-[#D6B77A]/40 flex items-center justify-center">
              <Users className="w-4 h-4 text-[#790B13]" />
            </div>
          </div>
          <div className="font-heading font-black text-3xl sm:text-4xl text-[#21191A] tracking-tight">
            {totalCustomers}
          </div>
          <div className="text-xs font-mono text-[#21191A]/60 border-t border-[#D6B77A]/20 pt-3">
            Active customer accounts
          </div>
        </div>
      </div>

      {/* Order Status Breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-[#D6B77A]/30 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-xs text-[#21191A]/70 font-mono uppercase tracking-wider block">Total Volume</span>
            <span className="font-heading font-black text-2xl text-[#21191A] mt-1 block">{totalOrders}</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#FFF9F2] border border-[#D6B77A]/30 flex items-center justify-center">
            <ShoppingBag className="w-5 h-5 text-[#790B13]" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#D6B77A]/30 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-xs text-[#790B13] font-mono uppercase tracking-wider font-bold block">Pending Queue</span>
            <span className="font-heading font-black text-2xl text-[#790B13] mt-1 block">{pendingOrders}</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#FFF0DC] border border-[#D6B77A]/40 flex items-center justify-center">
            <Clock className="w-5 h-5 text-[#790B13]" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#D6B77A]/30 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-xs text-emerald-800 font-mono uppercase tracking-wider font-bold block">Fulfilled</span>
            <span className="font-heading font-black text-2xl text-emerald-800 mt-1 block">{deliveredOrders}</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-300 flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-emerald-700" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#D6B77A]/30 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-xs text-[#21191A]/50 font-mono uppercase tracking-wider block">Revoked</span>
            <span className="font-heading font-black text-2xl text-[#21191A]/50 mt-1 block">{cancelledOrders}</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center">
            <XCircle className="w-5 h-5 text-rose-700" />
          </div>
        </div>
      </div>

      {/* Grid: Recent Orders & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Recent Orders Ledger */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-[#D6B77A]/30 shadow-xl space-y-6">
          <div className="flex justify-between items-center border-b border-[#D6B77A]/20 pb-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#790B13] font-bold block">
                Fulfillment Ledger
              </span>
              <h2 className="font-heading font-black text-xl text-[#21191A] uppercase tracking-tight">
                Recent Consignments
              </h2>
            </div>
            <Link
              to="/admin/orders"
              className="text-xs font-mono uppercase tracking-wider font-bold text-[#790B13] hover:underline flex items-center gap-1.5 transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#D6B77A]" />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p className="text-xs text-[#21191A]/60 py-8 text-center font-sans">
              No recent orders recorded in the current database.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm font-sans">
                <thead>
                  <tr className="border-b border-[#D6B77A]/20 text-[#21191A]/70 uppercase font-mono text-xs tracking-wider">
                    <th className="py-3 px-3">Order #</th>
                    <th className="py-3 px-3">Patron</th>
                    <th className="py-3 px-3">Weight</th>
                    <th className="py-3 px-3">Amount</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D6B77A]/15 font-mono">
                  {recentOrders.map((ord) => (
                    <tr key={ord._id} className="hover:bg-[#FFF9F2] transition-colors">
                      <td className="py-4 px-3 font-bold text-[#21191A]">
                        {ord.orderNumber}
                      </td>
                      <td className="py-4 px-3">
                        <span className="font-heading font-black text-xs text-[#21191A] uppercase block">
                          {ord.shippingAddress?.fullName || ord.customer?.name}
                        </span>
                        <span className="text-xs text-[#21191A]/60 font-sans">{ord.shippingAddress?.city}</span>
                      </td>
                      <td className="py-4 px-3 text-[#21191A]/70">
                        {(ord.totalWeightGrams / 1000).toFixed(2)} kg ({ord.orderItems?.length} items)
                      </td>
                      <td className="py-4 px-3 font-heading font-black text-sm text-[#790B13]">
                        ₹{ord.totalAmount}
                      </td>
                      <td className="py-4 px-3">
                        <span className="px-3 py-1 rounded-full border border-[#D6B77A]/40 bg-[#FFF0DC] text-[10px] font-bold uppercase text-[#790B13]">
                          {ord.orderStatus}
                        </span>
                      </td>
                      <td className="py-4 px-3 text-right">
                        <Link
                          to={`/admin/orders/${ord._id}`}
                          className="font-bold text-xs uppercase tracking-wider text-[#790B13] hover:underline"
                        >
                          Review →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Side Panel: Inventory Alerts & Bestsellers */}
        <div className="lg:col-span-4 space-y-6">
          {/* Low Stock Warning Box */}
          <div className="bg-white p-6 rounded-3xl border border-[#D6B77A]/30 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-[#D6B77A]/20 pb-3">
              <h3 className="font-heading font-black text-xs uppercase tracking-wider text-[#21191A] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#790B13]" />
                Low Stock (&lt; 2kg)
              </h3>
              <Link to="/admin/inventory" className="text-xs font-mono uppercase tracking-wider font-bold text-[#790B13] hover:underline">
                Manage
              </Link>
            </div>

            {lowStockProducts.length === 0 ? (
              <p className="text-xs text-[#21191A]/70 py-4 text-center border border-[#D6B77A]/30 bg-[#FFF0DC] rounded-2xl font-mono">
                ✓ All snack inventories are adequately stocked.
              </p>
            ) : (
              <div className="space-y-2.5">
                {lowStockProducts.map((inv) => (
                  <div
                    key={inv._id}
                    className="flex justify-between items-center text-xs p-3.5 bg-[#FFF9F2] rounded-2xl border border-[#D6B77A]/30"
                  >
                    <div>
                      <span className="font-heading font-black uppercase text-[#21191A] block">
                        {inv.product?.name}
                      </span>
                      <span className="text-xs font-mono text-[#790B13] font-bold">
                        Available: {(inv.availableGrams / 1000).toFixed(2)} kg
                      </span>
                    </div>
                    <Link
                      to="/admin/inventory"
                      className="bg-[#790B13] text-[#FFF0DC] hover:bg-[#50000D] px-3.5 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider font-bold transition-colors"
                    >
                      Restock
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bestselling Snacks */}
          <div className="bg-white p-6 rounded-3xl border border-[#D6B77A]/30 shadow-md space-y-4">
            <div className="border-b border-[#D6B77A]/20 pb-3">
              <span className="text-xs font-mono uppercase tracking-widest text-[#790B13] font-bold block mb-1">
                Popularity Registry
              </span>
              <h3 className="font-heading font-black text-base uppercase text-[#21191A]">
                Bestselling Snacks
              </h3>
            </div>

            {bestsellers.length === 0 ? (
              <p className="text-xs text-[#21191A]/60 py-4 text-center font-sans">
                No sales data recorded yet.
              </p>
            ) : (
              <div className="divide-y divide-[#D6B77A]/15 font-sans">
                {bestsellers.map((bs, i) => (
                  <div key={i} className="py-3 first:pt-0 last:pb-0 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-heading font-black uppercase text-[#21191A] block">{bs.name}</span>
                      <span className="text-xs font-mono text-[#21191A]/60 mt-0.5 block">
                        {bs.totalQuantitySold} packs ({(bs.totalWeightSoldGrams / 1000).toFixed(1)} kg)
                      </span>
                    </div>
                    <span className="font-heading font-black text-sm text-[#790B13]">
                      ₹{bs.totalRevenue.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
