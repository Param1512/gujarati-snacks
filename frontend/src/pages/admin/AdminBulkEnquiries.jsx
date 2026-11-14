import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { MessageCircle, Sparkles } from 'lucide-react';

const AdminBulkEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const res = await api.get('/bulk-orders');
      if (res.success) setEnquiries(res.enquiries);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/bulk-orders/${id}/status`, { status });
      fetchEnquiries();
    } catch (e) {
      alert('Error updating status');
    }
  };

  return (
    <div className="space-y-8 text-[#21191A] font-sans">
      {/* Editorial Header */}
      <div className="border-b border-[#D6B77A]/20 pb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF0DC] border border-[#D6B77A]/40 text-[#790B13] text-xs font-mono uppercase tracking-widest mb-2 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#D6B77A]" />
            <span>Catering & Large Assemblies</span>
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-5xl tracking-tight text-[#21191A] uppercase">
            Wholesale <span className="font-serif italic font-normal lowercase text-[#790B13]">commissions</span> ({enquiries.length})
          </h1>
          <p className="text-xs sm:text-sm text-[#21191A]/70 font-sans mt-1">
            Catering proposals, corporate gifts, wedding boxes, and high-volume dispatch logs.
          </p>
        </div>
      </div>

      <div className="bg-white border border-[#D6B77A]/30 rounded-3xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-20 text-center text-xs text-[#790B13] font-mono font-bold uppercase tracking-widest">
            Loading bulk inquiries...
          </div>
        ) : enquiries.length === 0 ? (
          <div className="py-20 text-center text-xs text-[#21191A]/60 font-sans">
            No bulk order inquiries received yet.
          </div>
        ) : (
          <div className="table-responsive-container">
            <table className="w-full text-left text-xs sm:text-sm font-sans min-w-[700px]">
              <thead className="bg-[#FFF9F2] text-[#21191A]/70 uppercase font-mono text-xs tracking-wider border-b border-[#D6B77A]/20">
                <tr>
                  <th className="py-4 px-5 font-bold">Contact Person</th>
                  <th className="py-4 px-5 font-bold">Event Type & Date</th>
                  <th className="py-4 px-5 font-bold">Volume (Kg)</th>
                  <th className="py-4 px-5 font-bold">Preferred Varieties</th>
                  <th className="py-4 px-5 font-bold">Destination Venue</th>
                  <th className="py-4 px-5 font-bold">Progress Status</th>
                  <th className="py-4 px-5 text-right font-bold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D6B77A]/15 font-sans">
                {enquiries.map((enq) => (
                  <tr key={enq._id} className="hover:bg-[#FFF9F2] transition-colors">
                    <td className="py-4 px-5">
                      <span className="font-heading font-black text-xs uppercase text-[#21191A] block">
                        {enq.name}
                      </span>
                      <span className="text-xs text-[#21191A]/60 font-mono block mt-0.5">
                        {enq.phone} • {enq.email}
                      </span>
                    </td>

                    <td className="py-4 px-5">
                      <span className="font-bold text-xs uppercase text-[#21191A] block">{enq.eventType}</span>
                      <span className="text-xs text-[#21191A]/60 font-mono">
                        {enq.eventDate ? new Date(enq.eventDate).toLocaleDateString() : 'Date TBD'}
                      </span>
                    </td>

                    <td className="py-4 px-5 font-heading font-black text-sm text-[#790B13]">
                      {enq.approximateQuantityKg} kg
                    </td>

                    <td className="py-4 px-5 text-[#21191A]/80 max-w-xs text-xs">
                      {enq.preferredSnacks?.join(', ') || 'Mixed Assortment'}
                    </td>

                    <td className="py-4 px-5 text-[#21191A]/70 max-w-xs truncate text-xs">
                      {enq.deliveryAddress}, {enq.city}
                    </td>

                    <td className="py-4 px-5">
                      <select
                        value={enq.status}
                        onChange={(e) => handleStatusChange(enq._id, e.target.value)}
                        className="bg-white border border-[#D6B77A]/30 rounded-xl px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#21191A] focus:outline-none focus:border-[#790B13] cursor-pointer"
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="quoted">Quoted</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td className="py-4 px-5 text-right">
                      <a
                        href={`https://wa.me/${enq.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                          `Namaste ${enq.name}! Thank you for your inquiry about ${enq.approximateQuantityKg}kg of snacks for your ${enq.eventType}.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 bg-[#790B13] hover:bg-[#50000D] text-[#FFF0DC] px-4 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-colors shadow-xs"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-[#D6B77A]" />
                        WhatsApp
                      </a>
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

export default AdminBulkEnquiries;
