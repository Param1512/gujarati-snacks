import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Users, Sparkles } from 'lucide-react';

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/customers');
      if (res.success) setCustomers(res.customers);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleToggleStatus = async (id) => {
    try {
      await api.put(`/admin/customers/${id}/status`);
      fetchCustomers();
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
            <span>Patron Directory</span>
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-5xl tracking-tight text-[#21191A] uppercase">
            Patron Roster ({customers.length})
          </h1>
          <p className="text-xs sm:text-sm text-[#21191A]/70 font-sans mt-1">
            Shopper accounts, historical order counts, cumulative expenditures, and access permissions.
          </p>
        </div>
      </div>

      <div className="bg-white border border-[#D6B77A]/30 rounded-3xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-20 text-center text-xs text-[#790B13] font-mono font-bold uppercase tracking-widest">
            Loading patron directory...
          </div>
        ) : customers.length === 0 ? (
          <div className="py-20 text-center text-xs text-[#21191A]/60 font-sans">
            No customers registered yet.
          </div>
        ) : (
          <div className="table-responsive-container">
            <table className="w-full text-left text-xs sm:text-sm font-sans min-w-[700px]">
              <thead className="bg-[#FFF9F2] text-[#21191A]/70 uppercase font-mono text-xs tracking-wider border-b border-[#D6B77A]/20">
                <tr>
                  <th className="py-4 px-5 font-bold">Patron Name</th>
                  <th className="py-4 px-5 font-bold">Electronic Mail</th>
                  <th className="py-4 px-5 font-bold">Phone Number</th>
                  <th className="py-4 px-5 font-bold">Orders Placed</th>
                  <th className="py-4 px-5 font-bold">Cumulative Spend</th>
                  <th className="py-4 px-5 font-bold">Status</th>
                  <th className="py-4 px-5 text-right font-bold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D6B77A]/15 font-mono">
                {customers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-[#FFF9F2] transition-colors">
                    <td className="py-4 px-5 font-heading font-black text-xs sm:text-sm uppercase text-[#21191A]">
                      {cust.name}
                    </td>
                    <td className="py-4 px-5 text-[#21191A]/70 text-xs">
                      {cust.email}
                    </td>
                    <td className="py-4 px-5 text-[#21191A]/70 text-xs">
                      {cust.phone || '—'}
                    </td>
                    <td className="py-4 px-5 font-bold text-xs text-[#21191A]">
                      {cust.ordersCount} orders
                    </td>
                    <td className="py-4 px-5 font-heading font-black text-sm text-[#790B13]">
                      ₹{cust.totalSpent.toLocaleString()}
                    </td>
                    <td className="py-4 px-5">
                      {cust.isActive ? (
                        <span className="border border-emerald-300 bg-emerald-50 text-emerald-800 text-[10px] font-bold uppercase px-3 py-1 rounded-full">
                          Active
                        </span>
                      ) : (
                        <span className="border border-rose-300 bg-rose-50 text-rose-800 text-[10px] font-bold uppercase px-3 py-1 rounded-full">
                          Suspended
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-5 text-right">
                      <button
                        onClick={() => handleToggleStatus(cust.id)}
                        className={`text-xs font-mono uppercase tracking-wider font-bold px-3 py-1 rounded-full transition-colors cursor-pointer ${
                          cust.isActive
                            ? 'text-rose-700 hover:bg-rose-50'
                            : 'text-emerald-700 hover:bg-emerald-50'
                        }`}
                      >
                        {cust.isActive ? 'Suspend' : 'Reinstate'}
                      </button>
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

export default AdminCustomers;
