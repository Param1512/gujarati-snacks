import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { ArrowUpRight, Leaf } from 'lucide-react';

const CategoryListing = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();

  useEffect(() => {
    api
      .get('/categories')
      .then((res) => {
        if (res.success) setCategories(res.categories);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 font-sans text-[#000000]">
      {/* Header */}
      <div className="border-b border-[#EAE3D9] pb-8 mb-12">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-heading font-black uppercase tracking-wider text-[#000000] bg-[#14382B] px-3.5 py-1 rounded-full shadow-xs">
            <Leaf className="w-3.5 h-3.5 text-[#000000]" />
            Traditional Kathiyawadi Cuisine
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-5xl text-[#000000] tracking-tight">
            Snack <span className="text-[#C84B20]">Categories</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#555555] font-sans max-w-xl leading-relaxed">
            Our range of authentic Gujarati farsan organized by frying technique and grain composition. Every category is prepared fresh in 100% pure Sing-Tel.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-24 text-center">
          <div className="w-8 h-8 border-2 border-[#000000] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-[#555555] font-heading font-bold">Loading categories...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/snacks?category=${cat.slug}`}
              className="group bg-white rounded-3xl border border-[#EAE3D9] overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Image */}
                <div className="aspect-16/10 overflow-hidden bg-[#FAF7F2] border-b border-[#EAE3D9] relative p-4">
                  <img
                    src={cat.imageUrl || '/images/snacks/tikha-gathiya.jpg'}
                    alt={cat.name}
                    className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-6 right-6 bg-[#000000] text-[#14382B] font-heading font-bold text-xs px-3 py-1 rounded-full shadow-sm">
                    {cat.productCount || 0} Snacks
                  </div>
                </div>

                <div className="p-6 space-y-2">
                  <h3 className="font-heading font-extrabold text-xl text-[#000000] group-hover:text-[#C84B20] transition-colors">
                    {language === 'gu' && cat.nameGujarati ? cat.nameGujarati : cat.name}
                  </h3>
                  <p className="text-xs text-[#555555] font-sans leading-relaxed line-clamp-3">
                    {cat.description}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <div className="pt-3 border-t border-[#EAE3D9] flex items-center justify-between font-heading font-bold text-xs text-[#000000]">
                  <span>Explore All Varieties</span>
                  <ArrowUpRight className="w-4 h-4 text-[#C84B20] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryListing;
