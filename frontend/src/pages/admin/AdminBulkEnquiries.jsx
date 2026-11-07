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
    <div className="space-y-8 text-[#000000]">
      {/* Editorial Header */}
      <div className="border-b border-[#EAE3D9] pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#14382B] text-[#000000] text-xs font-bold mb-2 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#C84B20]" />
          <span>Catering & Large Assemblies</span>
        </div>
        <h1 className="font-heading font-black text-3xl sm:text-4xl tracking-tight text-[#000000]">
          Bulk Orders Enquiries ({enquiries.length})
        </h1>
        <p className="text-xs sm:text-sm text-[#555555] font-sans mt-1">
          Catering proposals, corporate gifts, wedding boxes, and high-volume dispatch logs.
        </p>
      </div>

      <div className="bg-white border border-[#EAE3D9] rounded-3xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-20 text-center text-xs text-[#555555] font-heading font-bold uppercase tracking-wider">
            Loading bulk inquiries...
          </div>
        ) : enquiries.length === 0 ? (
          <div className="py-20 text-center text-xs text-[#555555] font-sans">
            No bulk order inquiries received yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm font-sans">
              <thead className="bg-[#FAF7F2] text-[#555555] uppercase text-xs tracking-wider border-b border-[#EAE3D9]">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Contact Person</th>
                  <th className="py-3.5 px-4 font-semibold">Event Type & Date</th>
                  <th className="py-3.5 px-4 font-semibold">Volume (Kg)</th>
                  <th className="py-3.5 px-4 font-semibold">Preferred Varieties</th>
                  <th className="py-3.5 px-4 font-semibold">Destination Venue</th>
                  <th className="py-3.5 px-4 font-semibold">Progress Status</th>
                  <th className="py-3.5 px-4 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5E0]">
                {enquiries.map((enq) => (
                  <tr key={enq._id} className="hover:bg-[#FAF7F2] transition-colors">
                    <td className="py-4 px-4">
                      <span className="font-semibold text-sm text-[#000000] block">
                        {enq.name}
                      </span>
                      <span className="text-xs text-[#555555] font-mono block">
                        {enq.phone} • {enq.email}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <span className="font-medium text-[#000000] block">{enq.eventType}</span>
                      <span className="text-xs text-[#555555] font-mono">
                        {enq.eventDate ? new Date(enq.eventDate).toLocaleDateString() : 'Date TBD'}
                      </span>
                    </td>

                    <td className="py-4 px-4 font-heading font-black text-sm text-[#000000]">
                      {enq.approximateQuantityKg} kg
                    </td>

                    <td className="py-4 px-4 text-[#555555] max-w-xs">
                      {enq.preferredSnacks?.join(', ') || 'Mixed Assortment'}
                    </td>

                    <td className="py-4 px-4 text-[#555555] max-w-xs truncate">
                      {enq.deliveryAddress}, {enq.city}
                    </td>

                    <td className="py-4 px-4">
                      <select
                        value={enq.status}
                        onChange={(e) => handleStatusChange(enq._id, e.target.value)}
                        className="bg-white border border-[#EAE3D9] rounded-xl px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#000000] focus:outline-none focus:border-[#000000]"
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="quoted">Quoted</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td className="py-4 px-4 text-right">
                      <a
                        href={`https://wa.me/${enq.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                          `Namaste ${enq.name}! Thank you for your inquiry about ${enq.approximateQuantityKg}kg of snacks for your ${enq.eventType}.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 bg-[#000000] hover:bg-[#C84B20] text-white px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-[#14382B]" />
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
