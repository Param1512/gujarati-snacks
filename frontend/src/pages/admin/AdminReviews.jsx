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
    <div className="space-y-8 text-[#21191A] font-sans">
      {/* Editorial Header */}
      <div className="border-b border-[#D6B77A]/20 pb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF0DC] border border-[#D6B77A]/40 text-[#790B13] text-xs font-mono uppercase tracking-widest mb-2 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#D6B77A]" />
            <span>Quality Feedback & Moderation</span>
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-5xl tracking-tight text-[#21191A] uppercase">
            Reviews <span className="font-serif italic font-normal lowercase text-[#790B13]">moderation</span> ({reviews.length})
          </h1>
          <p className="text-xs sm:text-sm text-[#21191A]/70 font-sans mt-1">
            Verified patron testimonials, star assessments, and community feedback publishing queue.
          </p>
        </div>
      </div>

      <div className="bg-white border border-[#D6B77A]/30 rounded-3xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-20 text-center text-xs text-[#790B13] font-mono font-bold uppercase tracking-widest">
            Loading reviews ledger...
          </div>
        ) : reviews.length === 0 ? (
          <div className="py-20 text-center text-xs text-[#21191A]/60 font-sans">
            No customer reviews submitted yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm font-sans">
              <thead className="bg-[#FFF9F2] text-[#21191A]/70 uppercase font-mono text-xs tracking-wider border-b border-[#D6B77A]/20">
                <tr>
                  <th className="py-4 px-5 font-bold">Snack Item</th>
                  <th className="py-4 px-5 font-bold">Patron</th>
                  <th className="py-4 px-5 font-bold">Rating</th>
                  <th className="py-4 px-5 font-bold">Feedback Critique</th>
                  <th className="py-4 px-5 font-bold">Status</th>
                  <th className="py-4 px-5 text-right font-bold">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D6B77A]/15 font-sans">
                {reviews.map((rev) => (
                  <tr key={rev._id} className="hover:bg-[#FFF9F2] transition-colors">
                    <td className="py-4 px-5 font-heading font-black text-xs uppercase text-[#21191A]">
                      {rev.product?.name}
                    </td>

                    <td className="py-4 px-5">
                      <span className="font-bold text-xs uppercase text-[#21191A] block">{rev.userName}</span>
                      {rev.isVerifiedPurchase && (
                        <span className="text-[10px] text-emerald-800 font-mono font-bold">
                          ✓ Verified Purchase
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-5">
                      <div className="flex text-[#D6B77A]">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-[#D6B77A]" />
                        ))}
                      </div>
                    </td>

                    <td className="py-4 px-5 max-w-sm text-[#21191A]/80 text-xs">
                      {rev.title && <strong className="block text-[#21191A] font-bold uppercase mb-0.5">{rev.title}</strong>}
                      <span className="line-clamp-2 leading-relaxed">{rev.comment}</span>
                    </td>

                    <td className="py-4 px-5">
                      <span
                        className={`px-3 py-1 border text-[10px] font-mono font-bold rounded-full uppercase tracking-wider ${
                          rev.status === 'approved'
                            ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                            : rev.status === 'rejected'
                            ? 'border-rose-300 bg-rose-50 text-rose-800'
                            : 'border-[#D6B77A]/40 bg-[#FFF0DC] text-[#790B13]'
                        }`}
                      >
                        {rev.status}
                      </span>
                    </td>

                    <td className="py-4 px-5 text-right">
                      <div className="flex justify-end gap-2">
                        {rev.status !== 'approved' && (
                          <button
                            onClick={() => handleStatusUpdate(rev._id, 'approved')}
                            className="bg-emerald-700 hover:bg-emerald-800 text-white p-2 rounded-xl cursor-pointer transition-colors shadow-xs"
                            title="Approve Review"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {rev.status !== 'rejected' && (
                          <button
                            onClick={() => handleStatusUpdate(rev._id, 'rejected')}
                            className="bg-[#FFF9F2] hover:bg-rose-700 hover:text-white text-[#21191A]/70 p-2 rounded-xl cursor-pointer border border-[#D6B77A]/30 transition-colors shadow-xs"
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
