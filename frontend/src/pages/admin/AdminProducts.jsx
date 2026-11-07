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
    if (!window.confirm(`Are you sure you want to delete ${name}? This will remove it from the store.`)) {
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
    <div className="space-y-8 text-[#000000]">
      {/* Editorial Header */}
      <div className="border-b border-[#EAE3D9] pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#14382B] text-[#000000] text-xs font-bold mb-2 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#C84B20]" />
            <span>Catalog Management</span>
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-4xl tracking-tight text-[#000000]">
            Snack Catalog ({products.length})
          </h1>
          <p className="text-xs sm:text-sm text-[#555555] font-sans mt-1">
            Active and archived snack recipes, unit rates per kilogram, and package specifications.
          </p>
        </div>

        <Link
          to="/admin/products/new"
          className="bg-[#000000] hover:bg-[#C84B20] text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4 text-[#14382B]" />
          <span>Add New Snack</span>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-[#EAE3D9] shadow-sm flex items-center gap-3">
        <Search className="w-4 h-4 text-[#555555]" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search snack by title or URL slug..."
          className="w-full text-xs sm:text-sm bg-transparent focus:outline-none text-[#000000] placeholder-[#555555] font-sans"
        />
      </div>

      {/* Products Table */}
      <div className="bg-white border border-[#EAE3D9] rounded-3xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-20 text-center text-xs text-[#555555] font-heading font-bold uppercase tracking-wider">
            Loading snack database...
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-xs text-[#555555] font-sans">
            No snacks found matching your search.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm font-sans">
              <thead className="bg-[#FAF7F2] text-[#555555] uppercase text-xs tracking-wider border-b border-[#EAE3D9]">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Snack Image & Title</th>
                  <th className="py-3.5 px-4 font-semibold">Category</th>
                  <th className="py-3.5 px-4 font-semibold">Price / kg</th>
                  <th className="py-3.5 px-4 font-semibold">Inventory Stock</th>
                  <th className="py-3.5 px-4 font-semibold">Pack Sizes</th>
                  <th className="py-3.5 px-4 font-semibold">Labels</th>
                  <th className="py-3.5 px-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5E0]">
                {filtered.map((product) => {
                  const stockGrams = product.inventory?.availableGrams ?? 0;
                  const stockKg = (stockGrams / 1000).toFixed(2);
                  const isLow = stockGrams <= 2000;

                  return (
                    <tr key={product._id} className="hover:bg-[#FAF7F2] transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.images?.[0]?.url || '/images/snacks/tikha-gathiya.jpg'}
                            alt=""
                            className="w-12 h-12 rounded-xl object-cover border border-[#EAE3D9] shrink-0"
                          />
                          <div>
                            <span className="font-semibold text-sm text-[#000000] block">
                              {product.name}
                            </span>
                            <span className="text-xs text-[#555555] font-mono block">
                              /{product.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 font-bold text-xs text-[#000000]">
                        {product.category?.name || 'Snacks'}
                      </td>

                      <td className="py-4 px-4 font-heading font-black text-sm text-[#000000]">
                        ₹{product.pricePerKg}/kg
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`font-mono block text-xs ${
                            isLow ? 'text-[#C84B20] font-bold' : 'text-[#000000] font-bold'
                          }`}
                        >
                          {stockKg} kg ({stockGrams} g)
                        </span>
                        {isLow && (
                          <span className="inline-block mt-0.5 text-xs border border-[#C84B20]/20 bg-[#C84B20]/10 text-[#C84B20] px-2 py-0.5 rounded-full font-bold uppercase">
                            Low Stock
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-4 text-[#555555]">
                        <div className="flex gap-1 flex-wrap max-w-xs font-mono text-xs">
                          {product.weightOptions?.map((w) => (
                            <span
                              key={w.weightGrams}
                              className="border border-[#EAE3D9] bg-[#FAF7F2] rounded-md px-1.5 py-0.5 text-[#000000]"
                            >
                              {w.label}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex gap-1">
                          {product.isBestseller && (
                            <span className="border border-[#000000] bg-[#000000] text-[#14382B] text-xs font-bold uppercase px-2 py-0.5 rounded-full">
                              Bestseller
                            </span>
                          )}
                          {product.isCombo && (
                            <span className="border border-[#C84B20] bg-[#C84B20] text-white text-xs font-bold uppercase px-2 py-0.5 rounded-full">
                              Combo
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Link
                            to={`/admin/products/edit/${product._id}`}
                            className="p-2 rounded-xl border border-[#EAE3D9] text-[#000000] hover:border-[#000000] transition-colors"
                            title="Edit Product"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => handleDelete(product._id, product.name)}
                            className="p-2 rounded-xl border border-[#EAE3D9] text-[#555555] hover:text-[#C84B20] hover:border-[#C84B20] cursor-pointer transition-colors"
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
