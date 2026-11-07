import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Star, Check, X, Sparkles } from 'lucide-react';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await api.get('/reviews');
      if (res.success) setReviews(res.reviews);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      await api.put(`/reviews/${id}/status`, { status });
      fetchReviews();
    } catch (e) {
      alert('Error updating review');
    }
  };

  return (
    <div className="space-y-8 text-[#000000]">
      {/* Editorial Header */}
      <div className="border-b border-[#EAE3D9] pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#14382B] text-[#000000] text-xs font-bold mb-2 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#C84B20]" />
          <span>Quality Feedback & Moderation</span>
        </div>
        <h1 className="font-heading font-black text-3xl sm:text-4xl tracking-tight text-[#000000]">
          Reviews Moderation ({reviews.length})
        </h1>
        <p className="text-xs sm:text-sm text-[#555555] font-sans mt-1">
          Verified patron testimonials, star assessments, and community feedback publishing queue.
        </p>
      </div>

      <div className="bg-white border border-[#EAE3D9] rounded-3xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-20 text-center text-xs text-[#555555] font-heading font-bold uppercase tracking-wider">
            Loading reviews ledger...
          </div>
        ) : reviews.length === 0 ? (
          <div className="py-20 text-center text-xs text-[#555555] font-sans">
            No customer reviews submitted yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm font-sans">
              <thead className="bg-[#FAF7F2] text-[#555555] uppercase text-xs tracking-wider border-b border-[#EAE3D9]">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Snack Item</th>
                  <th className="py-3.5 px-4 font-semibold">Patron</th>
                  <th className="py-3.5 px-4 font-semibold">Rating</th>
                  <th className="py-3.5 px-4 font-semibold">Feedback Critique</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 text-right font-semibold">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5E0]">
                {reviews.map((rev) => (
                  <tr key={rev._id} className="hover:bg-[#FAF7F2] transition-colors">
                    <td className="py-4 px-4 font-heading font-bold text-sm text-[#000000]">
                      {rev.product?.name}
                    </td>

                    <td className="py-4 px-4">
                      <span className="font-semibold text-[#000000] block">{rev.userName}</span>
                      {rev.isVerifiedPurchase && (
                        <span className="text-xs text-[#000000] font-mono">
                          ✓ Verified Purchase
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex text-[#D89B2B]">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-[#D89B2B]" />
                        ))}
                      </div>
                    </td>

                    <td className="py-4 px-4 max-w-sm text-[#555555]">
                      {rev.title && <strong className="block text-[#000000] font-bold">{rev.title}</strong>}
                      <span className="line-clamp-2 leading-relaxed">{rev.comment}</span>
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`px-2.5 py-0.5 border text-xs font-bold rounded-full uppercase tracking-wider ${
                          rev.status === 'approved'
                            ? 'border-[#14382B] bg-[#14382B] text-[#000000]'
                            : rev.status === 'rejected'
                            ? 'border-[#C84B20]/20 bg-[#C84B20]/10 text-[#C84B20]'
                            : 'border-[#EAE3D9] bg-[#FAF7F2] text-[#000000]'
                        }`}
                      >
                        {rev.status}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-right">
                      <div className="flex justify-end gap-1.5">
                        {rev.status !== 'approved' && (
                          <button
                            onClick={() => handleStatusUpdate(rev._id, 'approved')}
                            className="bg-[#000000] hover:bg-[#14382B] hover:text-[#000000] text-white p-2 rounded-xl cursor-pointer transition-colors"
                            title="Approve Review"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {rev.status !== 'rejected' && (
                          <button
                            onClick={() => handleStatusUpdate(rev._id, 'rejected')}
                            className="bg-[#FAF7F2] hover:bg-[#C84B20] hover:text-white text-[#555555] p-2 rounded-xl cursor-pointer border border-[#EAE3D9] transition-colors"
                            title="Reject Review"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
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

export default AdminReviews;
