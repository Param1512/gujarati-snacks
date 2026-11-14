import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import {
  Search,
  Filter,
  Download,
  FileText,
  Eye,
  Sparkles,
} from 'lucide-react';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page,
        limit: 15,
      });
      if (statusFilter) queryParams.append('status', statusFilter);
      if (searchTerm) queryParams.append('search', searchTerm);

      const res = await api.get(`/orders?${queryParams.toString()}`);
      if (res.success) {
        setOrders(res.orders);
        setTotalPages(res.totalPages);
        setTotalOrders(res.total);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, searchTerm, page]);

  const handleExportCsv = () => {
    window.open('/api/orders/export/csv', '_blank');
  };

  const getStatusBadge = (status) => {
    let colorClass = "bg-[#FFF9F2] text-[#21191A] border-[#D6B77A]/30";
    if (status === 'delivered') colorClass = "bg-emerald-50 text-emerald-800 border-emerald-300";
    else if (status === 'dispatched' || status === 'packed') colorClass = "bg-[#FFF0DC] text-[#790B13] border-[#D6B77A]/60";
    else if (status === 'cancelled') colorClass = "bg-rose-50 text-rose-800 border-rose-200";

    return (
      <span className={`px-3 py-0.5 border rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${colorClass}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-8 text-[#21191A] font-sans">
      {/* Editorial Header */}
      <div className="border-b border-[#D6B77A]/20 pb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF0DC] border border-[#D6B77A]/40 text-[#790B13] text-xs font-mono uppercase tracking-widest mb-2 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#D6B77A]" />
            <span>Fulfillment & Dispatch</span>
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-5xl tracking-tight text-[#21191A] uppercase">
            Order Registry ({totalOrders})
          </h1>
          <p className="text-xs sm:text-sm text-[#21191A]/70 font-sans mt-1">
            Dispatch queue, doorstep courier logs, and real-time transaction states.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="bg-[#790B13] hover:bg-[#50000D] text-[#FFF0DC] px-6 py-3.5 rounded-full text-xs font-mono uppercase tracking-wider font-bold flex items-center gap-2 transition-all shadow-lg shadow-[#790B13]/25 cursor-pointer"
        >
          <Download className="w-4 h-4 text-[#D6B77A]" />
          <span>Export Ledger CSV</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#D6B77A]/30 shadow-md flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            placeholder="Search Order # or Customer..."
            className="w-full bg-[#FFF9F2] border border-[#D6B77A]/30 rounded-xl py-2.5 pl-4 pr-10 text-xs text-[#21191A] placeholder-[#21191A]/40 font-mono focus:outline-none focus:border-[#790B13]"
          />
          <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-[#790B13]" />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto font-mono text-xs">
          <Filter className="w-4 h-4 text-[#790B13]" />
          <span className="text-xs text-[#21191A]/70 uppercase font-bold tracking-wider">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="bg-[#FFF9F2] border border-[#D6B77A]/30 rounded-xl py-2 px-3 text-xs font-bold uppercase tracking-wider text-[#21191A] focus:outline-none focus:border-[#790B13] cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="preparing">Kitchen Preparing</option>
            <option value="packed">Packed</option>
            <option value="dispatched">Dispatched</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-[#D6B77A]/30 rounded-3xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-20 text-center text-xs text-[#790B13] font-mono font-bold uppercase tracking-widest">
            Loading order records...
          </div>
        ) : orders.length === 0 ? (
          <div className="py-20 text-center text-xs text-[#21191A]/60 font-sans">
            No orders found matching the filter criteria.
          </div>
        ) : (
          <div className="table-responsive-container">
            <table className="w-full text-left text-xs sm:text-sm font-sans min-w-[760px]">
              <thead className="bg-[#FFF9F2] text-[#21191A]/70 uppercase font-mono text-xs tracking-wider border-b border-[#D6B77A]/20">
                <tr>
                  <th className="py-4 px-5 font-bold">Order # & Date</th>
                  <th className="py-4 px-5 font-bold">Patron & Destination</th>
                  <th className="py-4 px-5 font-bold">Weight & Units</th>
                  <th className="py-4 px-5 font-bold">Gross Total</th>
                  <th className="py-4 px-5 font-bold">Settlement</th>
                  <th className="py-4 px-5 font-bold">Kitchen Status</th>
                  <th className="py-4 px-5 text-right font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D6B77A]/15 font-mono">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-[#FFF9F2] transition-colors">
                    <td className="py-4 px-5">
                      <span className="font-bold text-[#21191A] block">
                        {order.orderNumber}
                      </span>
                      <span className="text-xs text-[#21191A]/50">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </td>

                    <td className="py-4 px-5">
                      <span className="font-heading font-black text-xs uppercase text-[#21191A] block">
                        {order.shippingAddress?.fullName}
                      </span>
                      <span className="text-xs text-[#21191A]/60 font-sans">
                        {order.shippingAddress?.city} ({order.shippingAddress?.phone})
                      </span>
                    </td>

                    <td className="py-4 px-5 text-[#21191A]/70">
                      <span className="font-medium text-[#21191A] block">
                        {order.orderItems?.length} items
                      </span>
                      <span className="text-xs">
                        {(order.totalWeightGrams / 1000).toFixed(2)} kg
                      </span>
                    </td>

                    <td className="py-4 px-5 font-heading font-black text-sm text-[#790B13]">
                      ₹{order.totalAmount}
                    </td>

                    <td className="py-4 px-5">
                      <span className="font-bold uppercase text-xs block text-[#21191A]">
                        {order.paymentMethod}
                      </span>
                      <span
                        className={`text-[10px] uppercase font-bold ${
                          order.paymentStatus === 'paid'
                            ? 'text-emerald-700'
                            : 'text-[#790B13]'
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>

                    <td className="py-4 px-5">
                      {getStatusBadge(order.orderStatus)}
                    </td>

                    <td className="py-4 px-5 text-right">
                      <div className="flex justify-end gap-2">
                        <a
                          href={`/api/orders/${order._id}/invoice`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-xl border border-[#D6B77A]/40 text-[#21191A]/70 hover:text-[#790B13] hover:border-[#790B13] transition-colors"
                          title="Print Tax Invoice"
                        >
                          <FileText className="w-3.5 h-3.5 text-[#790B13]" />
                        </a>
                        <Link
                          to={`/admin/orders/${order._id}`}
                          className="p-2 rounded-xl bg-[#790B13] text-[#FFF0DC] hover:bg-[#50000D] transition-colors shadow-xs"
                          title="Inspect Order"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#D6B77A]" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-2 font-mono text-xs">
          <button
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className="px-5 py-2.5 border border-[#D6B77A]/40 bg-white rounded-full text-[#21191A] font-bold uppercase text-xs disabled:opacity-40 hover:border-[#790B13] cursor-pointer transition-colors"
          >
            Prev
          </button>
          <span className="px-4 py-1.5 text-xs text-[#21191A]/70">
            Page {page} / {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
            className="px-5 py-2.5 border border-[#D6B77A]/40 bg-white rounded-full text-[#21191A] font-bold uppercase text-xs disabled:opacity-40 hover:border-[#790B13] cursor-pointer transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
