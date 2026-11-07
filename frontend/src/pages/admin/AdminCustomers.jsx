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
    <div className="space-y-8 text-[#000000]">
      {/* Editorial Header */}
      <div className="border-b border-[#EAE3D9] pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#14382B] text-[#000000] text-xs font-bold mb-2 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#C84B20]" />
          <span>Patron Directory</span>
        </div>
        <h1 className="font-heading font-black text-3xl sm:text-4xl tracking-tight text-[#000000]">
          Registered Customers ({customers.length})
        </h1>
        <p className="text-xs sm:text-sm text-[#555555] font-sans mt-1">
          Shopper accounts, historical order counts, cumulative expenditures, and access permissions.
        </p>
      </div>

      <div className="bg-white border border-[#EAE3D9] rounded-3xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-20 text-center text-xs text-[#555555] font-heading font-bold uppercase tracking-wider">
            Loading patron directory...
          </div>
        ) : customers.length === 0 ? (
          <div className="py-20 text-center text-xs text-[#555555] font-sans">
            No customers registered yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm font-sans">
              <thead className="bg-[#FAF7F2] text-[#555555] uppercase text-xs tracking-wider border-b border-[#EAE3D9]">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Patron Name</th>
                  <th className="py-3.5 px-4 font-semibold">Electronic Mail</th>
                  <th className="py-3.5 px-4 font-semibold">Phone Number</th>
                  <th className="py-3.5 px-4 font-semibold">Orders Placed</th>
                  <th className="py-3.5 px-4 font-semibold">Cumulative Spend</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5E0]">
                {customers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-[#FAF7F2] transition-colors">
                    <td className="py-4 px-4 font-heading font-bold text-sm text-[#000000]">
                      {cust.name}
                    </td>
                    <td className="py-4 px-4 text-[#555555] font-mono text-xs">
                      {cust.email}
                    </td>
                    <td className="py-4 px-4 text-[#555555] font-mono text-xs">
                      {cust.phone || '—'}
                    </td>
                    <td className="py-4 px-4 font-heading font-semibold text-xs text-[#000000]">
                      {cust.ordersCount} orders
                    </td>
                    <td className="py-4 px-4 font-heading font-black text-sm text-[#000000]">
                      ₹{cust.totalSpent.toLocaleString()}
                    </td>
                    <td className="py-4 px-4">
                      {cust.isActive ? (
                        <span className="border border-[#EAE3D9] bg-[#14382B] text-[#000000] text-xs font-bold uppercase px-2.5 py-0.5 rounded-full">
                          Active
                        </span>
                      ) : (
                        <span className="border border-[#C84B20]/20 bg-[#C84B20]/10 text-[#C84B20] text-xs font-bold uppercase px-2.5 py-0.5 rounded-full">
                          Suspended
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => handleToggleStatus(cust.id)}
                        className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full transition-colors cursor-pointer ${
                          cust.isActive
                            ? 'text-[#C84B20] hover:bg-[#C84B20]/10'
                            : 'text-[#000000] hover:bg-[#14382B]'
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
