import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Sparkles,
} from 'lucide-react';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/products?limit=50');
      if (res.success) setProducts(res.products);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}? This will remove it from the catalog.`)) {
      return;
    }
    try {
      const res = await api.delete(`/products/${id}`);
      if (res.success) {
        setProducts(products.filter((p) => p._id !== id));
      }
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 text-[#21191A] font-sans">
      {/* Editorial Header */}
      <div className="border-b border-[#D6B77A]/20 pb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF0DC] border border-[#D6B77A]/40 text-[#790B13] text-xs font-mono uppercase tracking-widest mb-2 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#D6B77A]" />
            <span>Catalog Management</span>
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-5xl tracking-tight text-[#21191A] uppercase">
            Snack Catalog ({products.length})
          </h1>
          <p className="text-xs sm:text-sm text-[#21191A]/70 font-sans mt-1">
            Active and archived snack recipes, unit rates per kilogram, and package specifications.
          </p>
        </div>

        <Link
          to="/admin/products/new"
          className="bg-[#790B13] hover:bg-[#50000D] text-[#FFF0DC] px-6 py-3.5 rounded-full text-xs font-mono uppercase tracking-wider font-bold flex items-center gap-2 transition-all shadow-lg shadow-[#790B13]/25"
        >
          <Plus className="w-4 h-4 text-[#D6B77A]" />
          <span>Add New Snack</span>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#D6B77A]/30 shadow-sm flex items-center gap-3">
        <Search className="w-4 h-4 text-[#790B13]" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search snack by title or URL slug..."
          className="w-full text-xs sm:text-sm bg-transparent focus:outline-none text-[#21191A] placeholder-[#21191A]/40 font-sans"
        />
      </div>

      {/* Products Table */}
      <div className="bg-white border border-[#D6B77A]/30 rounded-3xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-20 text-center text-xs text-[#790B13] font-mono font-bold uppercase tracking-widest">
            Loading snack database...
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-xs text-[#21191A]/60 font-sans">
            No snacks found matching your search query.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm font-sans">
              <thead className="bg-[#FFF9F2] text-[#21191A]/70 uppercase font-mono text-xs tracking-wider border-b border-[#D6B77A]/20">
                <tr>
                  <th className="py-4 px-5 font-bold">Snack Image & Title</th>
                  <th className="py-4 px-5 font-bold">Category</th>
                  <th className="py-4 px-5 font-bold">Price / kg</th>
                  <th className="py-4 px-5 font-bold">Inventory Stock</th>
                  <th className="py-4 px-5 font-bold">Pack Sizes</th>
                  <th className="py-4 px-5 font-bold">Labels</th>
                  <th className="py-4 px-5 text-right font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D6B77A]/15 font-mono">
                {filtered.map((product) => {
                  const stockGrams = product.inventory?.availableGrams ?? 0;
                  const stockKg = (stockGrams / 1000).toFixed(2);
                  const isLow = stockGrams <= 2000;

                  return (
                    <tr key={product._id} className="hover:bg-[#FFF9F2] transition-colors">
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3.5">
                          <img
                            src={product.images?.[0]?.url || '/images/snacks/tikha-gathiya.jpg'}
                            alt=""
                            className="w-12 h-12 rounded-xl object-cover border border-[#D6B77A]/30 shrink-0"
                          />
                          <div>
                            <span className="font-heading font-black text-xs sm:text-sm text-[#21191A] uppercase block">
                              {product.name}
                            </span>
                            <span className="text-[11px] text-[#21191A]/50 block">
                              /{product.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-5 font-bold text-xs text-[#21191A]">
                        {product.category?.name || 'Snacks'}
                      </td>

                      <td className="py-4 px-5 font-heading font-black text-sm text-[#790B13]">
                        ₹{product.pricePerKg}/kg
                      </td>

                      <td className="py-4 px-5">
                        <span
                          className={`block text-xs ${
                            isLow ? 'text-rose-700 font-bold' : 'text-[#21191A] font-bold'
                          }`}
                        >
                          {stockKg} kg ({stockGrams} g)
                        </span>
                        {isLow && (
                          <span className="inline-block mt-0.5 text-[10px] border border-rose-300 bg-rose-50 text-rose-800 px-2.5 py-0.5 rounded-full font-bold uppercase">
                            Low Stock
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-5 text-[#21191A]/70">
                        <div className="flex gap-1.5 flex-wrap max-w-xs text-[11px]">
                          {product.weightOptions?.map((w) => (
                            <span
                              key={w.weightGrams}
                              className="border border-[#D6B77A]/30 bg-[#FFF9F2] rounded-md px-2 py-0.5 text-[#21191A]"
                            >
                              {w.label}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="py-4 px-5">
                        <div className="flex gap-1.5">
                          {product.isBestseller && (
                            <span className="border border-[#D6B77A]/40 bg-[#FFF0DC] text-[#790B13] text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full">
                              Bestseller
                            </span>
                          )}
                          {product.isCombo && (
                            <span className="border border-[#790B13] bg-[#790B13] text-[#FFF0DC] text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full">
                              Combo
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-5 text-right">
                        <div className="flex justify-end gap-2">
                          <Link
                            to={`/admin/products/edit/${product._id}`}
                            className="p-2 rounded-xl border border-[#D6B77A]/40 text-[#21191A] hover:border-[#790B13] hover:text-[#790B13] transition-colors"
                            title="Edit Product"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => handleDelete(product._id, product.name)}
                            className="p-2 rounded-xl border border-[#D6B77A]/40 text-[#21191A]/50 hover:text-rose-700 hover:border-rose-300 cursor-pointer transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
