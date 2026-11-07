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
    let colorClass = "bg-[#FAF7F2] text-[#000000] border-[#EAE3D9]";
    if (status === 'delivered') colorClass = "bg-[#14382B] text-[#000000] border-[#14382B]";
    else if (status === 'dispatched' || status === 'packed') colorClass = "bg-[#EBF4EF] text-[#000000] border-[#14382B]";
    else if (status === 'cancelled') colorClass = "bg-[#C84B20]/10 text-[#C84B20] border-[#C84B20]/20";

    return (
      <span className={`px-2.5 py-0.5 border rounded-full text-xs font-bold uppercase tracking-wider ${colorClass}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-8 text-[#000000]">
      {/* Editorial Header */}
      <div className="border-b border-[#EAE3D9] pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#14382B] text-[#000000] text-xs font-bold mb-2 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#C84B20]" />
            <span>Fulfillment & Dispatch</span>
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-4xl tracking-tight text-[#000000]">
            Order Management ({totalOrders})
          </h1>
          <p className="text-xs sm:text-sm text-[#555555] font-sans mt-1">
            Dispatch queue, doorstep courier logs, and real-time transaction states.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="bg-[#000000] hover:bg-[#C84B20] text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
        >
          <Download className="w-3.5 h-3.5 text-[#14382B]" />
          <span>Export Ledger CSV</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-[#EAE3D9] shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            placeholder="Search Order # or Customer..."
            className="w-full bg-[#FAF7F2] border border-[#EAE3D9] rounded-xl py-2 pl-3.5 pr-8 text-xs text-[#000000] placeholder-[#555555] font-sans focus:outline-none focus:border-[#000000]"
          />
          <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-[#555555]" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto font-sans">
          <Filter className="w-4 h-4 text-[#555555]" />
          <span className="text-xs text-[#555555] uppercase font-bold tracking-wider">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="bg-[#FAF7F2] border border-[#EAE3D9] rounded-xl py-2 px-3 text-xs font-bold uppercase tracking-wider text-[#000000] focus:outline-none focus:border-[#000000]"
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
      <div className="bg-white border border-[#EAE3D9] rounded-3xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-20 text-center text-xs text-[#555555] font-heading font-bold uppercase tracking-wider">
            Loading order records...
          </div>
        ) : orders.length === 0 ? (
          <div className="py-20 text-center text-xs text-[#555555] font-sans">
            No orders found matching the filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm font-sans">
              <thead className="bg-[#FAF7F2] text-[#555555] uppercase text-xs tracking-wider border-b border-[#EAE3D9]">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Order # & Date</th>
                  <th className="py-3.5 px-4 font-semibold">Patron & Destination</th>
                  <th className="py-3.5 px-4 font-semibold">Weight & Units</th>
                  <th className="py-3.5 px-4 font-semibold">Gross Total</th>
                  <th className="py-3.5 px-4 font-semibold">Settlement</th>
                  <th className="py-3.5 px-4 font-semibold">Kitchen Status</th>
                  <th className="py-3.5 px-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5E0]">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-[#FAF7F2] transition-colors">
                    <td className="py-4 px-4">
                      <span className="font-mono font-bold text-[#000000] block">
                        {order.orderNumber}
                      </span>
                      <span className="text-xs text-[#555555] font-mono">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <span className="font-semibold text-[#000000] block">
                        {order.shippingAddress?.fullName}
                      </span>
                      <span className="text-xs text-[#555555]">
                        {order.shippingAddress?.city} ({order.shippingAddress?.phone})
                      </span>
                    </td>

                    <td className="py-4 px-4 text-[#555555]">
                      <span className="font-medium text-[#000000] block">
                        {order.orderItems?.length} items
                      </span>
                      <span className="text-xs font-mono">
                        {(order.totalWeightGrams / 1000).toFixed(2)} kg
                      </span>
                    </td>

                    <td className="py-4 px-4 font-heading font-black text-sm text-[#000000]">
                      ₹{order.totalAmount}
                    </td>

                    <td className="py-4 px-4">
                      <span className="font-bold uppercase text-xs block text-[#000000]">
                        {order.paymentMethod}
                      </span>
                      <span
                        className={`text-xs font-mono uppercase font-bold ${
                          order.paymentStatus === 'paid'
                            ? 'text-[#000000]'
                            : 'text-[#C84B20]'
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      {getStatusBadge(order.orderStatus)}
                    </td>

                    <td className="py-4 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <a
                          href={`/api/orders/${order._id}/invoice`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-xl border border-[#EAE3D9] text-[#555555] hover:text-[#000000] hover:border-[#000000] transition-colors"
                          title="Print Tax Invoice"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </a>
                        <Link
                          to={`/admin/orders/${order._id}`}
                          className="p-2 rounded-xl bg-[#000000] text-white hover:bg-[#C84B20] transition-colors"
                          title="Inspect Order"
                        >
                          <Eye className="w-3.5 h-3.5" />
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
        <div className="flex justify-center items-center gap-2 pt-2 font-sans text-xs">
          <button
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 border border-[#EAE3D9] bg-white rounded-full text-[#000000] font-bold uppercase text-xs disabled:opacity-40 hover:border-[#000000] cursor-pointer transition-colors"
          >
            Prev
          </button>
          <span className="px-3 py-1 text-xs text-[#555555] font-mono">
            Page {page} / {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 border border-[#EAE3D9] bg-white rounded-full text-[#000000] font-bold uppercase text-xs disabled:opacity-40 hover:border-[#000000] cursor-pointer transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
