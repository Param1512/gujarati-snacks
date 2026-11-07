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
      <div className="py-24 text-center">
        <div className="w-10 h-10 border-3 border-[#000000] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-bold text-[#555555]">
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
    <div className="space-y-10 text-[#000000]">
      {/* Header */}
      <div className="border-b border-[#EAE3D9] pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#14382B] text-[#000000] text-xs font-bold mb-2 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#C84B20]" />
          <span>Operational Intelligence</span>
        </div>
        <h1 className="font-heading font-black text-3xl sm:text-4xl tracking-tight text-[#000000]">
          Analytics & Performance
        </h1>
        <p className="text-xs sm:text-sm text-[#555555] font-sans mt-1">
          Real-time gross transactional metrics, daily batch dispatch volume, and gram-level storage states.
        </p>
      </div>

      {/* Primary Revenue Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-[#EAE3D9] shadow-sm space-y-3">
          <div className="flex items-center justify-between text-[#555555] text-xs font-semibold uppercase tracking-wider">
            <span>Gross Revenue</span>
            <div className="w-8 h-8 rounded-full bg-[#EBF4EF] flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-[#000000]" />
            </div>
          </div>
          <div className="font-heading font-black text-3xl sm:text-4xl text-[#000000] tracking-tight">
            ₹{totalRevenue.toLocaleString()}
          </div>
          <div className="text-xs text-[#555555] border-t border-[#EAE3D9] pt-2 font-medium">
            Confirmed & Delivered
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#EAE3D9] shadow-sm space-y-3">
          <div className="flex items-center justify-between text-[#555555] text-xs font-semibold uppercase tracking-wider">
            <span>Today's Receipts</span>
            <div className="w-8 h-8 rounded-full bg-[#EBF4EF] flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-[#000000]" />
            </div>
          </div>
          <div className="font-heading font-black text-3xl sm:text-4xl text-[#000000] tracking-tight">
            ₹{todayRevenue.toLocaleString()}
          </div>
          <div className="text-xs text-[#555555] border-t border-[#EAE3D9] pt-2 font-medium">
            Since 00:00 IST today
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#EAE3D9] shadow-sm space-y-3">
          <div className="flex items-center justify-between text-[#555555] text-xs font-semibold uppercase tracking-wider">
            <span>Monthly Run-rate</span>
            <div className="w-8 h-8 rounded-full bg-[#EBF4EF] flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-[#000000]" />
            </div>
          </div>
          <div className="font-heading font-black text-3xl sm:text-4xl text-[#000000] tracking-tight">
            ₹{monthlyRevenue.toLocaleString()}
          </div>
          <div className="text-xs text-[#555555] border-t border-[#EAE3D9] pt-2 font-medium">
            Current calendar cycle
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#EAE3D9] shadow-sm space-y-3">
          <div className="flex items-center justify-between text-[#555555] text-xs font-semibold uppercase tracking-wider">
            <span>Registered Patrons</span>
            <div className="w-8 h-8 rounded-full bg-[#EBF4EF] flex items-center justify-center">
              <Users className="w-4 h-4 text-[#000000]" />
            </div>
          </div>
          <div className="font-heading font-black text-3xl sm:text-4xl text-[#000000] tracking-tight">
            {totalCustomers}
          </div>
          <div className="text-xs text-[#555555] border-t border-[#EAE3D9] pt-2 font-medium">
            Active customer accounts
          </div>
        </div>
      </div>

      {/* Order Status Breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#EAE3D9] flex items-center justify-between shadow-xs">
          <div>
            <span className="text-xs text-[#555555] font-semibold uppercase tracking-wider block">Total Volume</span>
            <span className="font-heading font-black text-2xl text-[#000000]">{totalOrders}</span>
          </div>
          <div className="w-9 h-9 rounded-full bg-[#FAF7F2] flex items-center justify-center">
            <ShoppingBag className="w-4 h-4 text-[#000000]" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#EAE3D9] flex items-center justify-between shadow-xs">
          <div>
            <span className="text-xs text-[#C84B20] font-bold uppercase tracking-wider block">Pending Queue</span>
            <span className="font-heading font-black text-2xl text-[#C84B20]">{pendingOrders}</span>
          </div>
          <div className="w-9 h-9 rounded-full bg-rose-50 flex items-center justify-center">
            <Clock className="w-4 h-4 text-[#C84B20]" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#EAE3D9] flex items-center justify-between shadow-xs">
          <div>
            <span className="text-xs text-[#000000] font-bold uppercase tracking-wider block">Fulfilled</span>
            <span className="font-heading font-black text-2xl text-[#000000]">{deliveredOrders}</span>
          </div>
          <div className="w-9 h-9 rounded-full bg-[#EBF4EF] flex items-center justify-center">
            <CheckCircle className="w-4 h-4 text-[#000000]" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#EAE3D9] flex items-center justify-between shadow-xs">
          <div>
            <span className="text-xs text-[#555555] font-semibold uppercase tracking-wider block">Revoked</span>
            <span className="font-heading font-black text-2xl text-[#555555]">{cancelledOrders}</span>
          </div>
          <div className="w-9 h-9 rounded-full bg-[#FAF7F2] flex items-center justify-center">
            <XCircle className="w-4 h-4 text-[#555555]" />
          </div>
        </div>
      </div>

      {/* Grid: Recent Orders & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Recent Orders Ledger */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-[#EAE3D9] shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-[#EAE3D9] pb-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#555555] block">
                Fulfillment Ledger
              </span>
              <h2 className="font-heading font-black text-xl text-[#000000]">
                Recent Orders
              </h2>
            </div>
            <Link
              to="/admin/orders"
              className="text-xs font-bold text-[#000000] hover:text-[#C84B20] flex items-center gap-1 transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p className="text-xs text-[#555555] py-8 text-center font-sans">
              No recent orders recorded in the current database.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm font-sans">
                <thead>
                  <tr className="border-b border-[#EAE3D9] text-[#555555] uppercase text-xs tracking-wider">
                    <th className="py-3 px-2">Order #</th>
                    <th className="py-3 px-2">Patron</th>
                    <th className="py-3 px-2">Weight</th>
                    <th className="py-3 px-2">Amount</th>
                    <th className="py-3 px-2">Status</th>
                    <th className="py-3 px-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E5E0]">
                  {recentOrders.map((ord) => (
                    <tr key={ord._id} className="hover:bg-[#FAF7F2] transition-colors">
                      <td className="py-3.5 px-2 font-mono font-bold text-[#000000]">
                        {ord.orderNumber}
                      </td>
                      <td className="py-3.5 px-2">
                        <span className="font-semibold text-[#000000] block">
                          {ord.shippingAddress?.fullName || ord.customer?.name}
                        </span>
                        <span className="text-xs text-[#555555]">{ord.shippingAddress?.city}</span>
                      </td>
                      <td className="py-3.5 px-2 text-[#555555]">
                        {(ord.totalWeightGrams / 1000).toFixed(2)} kg ({ord.orderItems?.length} items)
                      </td>
                      <td className="py-3.5 px-2 font-heading font-black text-[#000000]">
                        ₹{ord.totalAmount}
                      </td>
                      <td className="py-3.5 px-2">
                        <span className="px-2.5 py-0.5 rounded-full border border-[#EAE3D9] bg-[#14382B] text-xs font-bold uppercase text-[#000000]">
                          {ord.orderStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-2 text-right">
                        <Link
                          to={`/admin/orders/${ord._id}`}
                          className="font-bold text-xs text-[#C84B20] hover:underline"
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
          <div className="bg-white p-6 rounded-3xl border border-[#EAE3D9] shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#EAE3D9] pb-3">
              <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-[#000000] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#C84B20]" />
                Low Stock (&lt; 2kg)
              </h3>
              <Link to="/admin/inventory" className="text-xs font-semibold text-[#000000] hover:underline">
                Manage
              </Link>
            </div>

            {lowStockProducts.length === 0 ? (
              <p className="text-xs text-[#000000] py-3 text-center border border-[#EAE3D9] bg-[#EBF4EF] rounded-2xl font-medium">
                ✓ All snack inventories are adequately stocked.
              </p>
            ) : (
              <div className="space-y-2">
                {lowStockProducts.map((inv) => (
                  <div
                    key={inv._id}
                    className="flex justify-between items-center text-xs p-3 bg-[#FAF7F2] rounded-2xl border border-[#EAE3D9]"
                  >
                    <div>
                      <span className="font-semibold text-[#000000] block">
                        {inv.product?.name}
                      </span>
                      <span className="text-xs text-[#C84B20] font-medium">
                        Available: {(inv.availableGrams / 1000).toFixed(2)} kg
                      </span>
                    </div>
                    <Link
                      to="/admin/inventory"
                      className="bg-[#000000] text-[#14382B] hover:bg-[#1a1a1a] px-3 py-1.5 rounded-full text-xs font-semibold transition-colors"
                    >
                      Restock
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bestselling Snacks */}
          <div className="bg-white p-6 rounded-3xl border border-[#EAE3D9] shadow-sm space-y-4">
            <div className="border-b border-[#EAE3D9] pb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#555555] block">
                Popularity Registry
              </span>
              <h3 className="font-heading font-black text-base text-[#000000]">
                Bestselling Snacks
              </h3>
            </div>

            {bestsellers.length === 0 ? (
              <p className="text-xs text-[#555555] py-4 text-center font-sans">
                No sales data recorded yet.
              </p>
            ) : (
              <div className="divide-y divide-[#E5E5E0]">
                {bestsellers.map((bs, i) => (
                  <div key={i} className="py-2.5 first:pt-0 last:pb-0 flex justify-between items-center text-xs sm:text-sm font-sans">
                    <div>
                      <span className="font-semibold text-[#000000] block">{bs.name}</span>
                      <span className="text-xs text-[#555555]">
                        {bs.totalQuantitySold} packs ({(bs.totalWeightSoldGrams / 1000).toFixed(1)} kg)
                      </span>
                    </div>
                    <span className="font-heading font-black text-[#000000]">
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
