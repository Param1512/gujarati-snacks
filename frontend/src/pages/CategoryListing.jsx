import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { ArrowUpRight, Sparkles } from 'lucide-react';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 font-sans text-[#21191A]">
      {/* Editorial Header */}
      <div className="border-b border-[#D6B77A]/30 pb-10 mb-12">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-heading font-bold uppercase tracking-widest text-[#790B13] bg-[#FFF0DC] border border-[#D6B77A]/40 px-3.5 py-1 rounded-full shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#790B13]" />
            Traditional Kathiyawadi Cuisine
          </div>
          <h1 className="font-editorial text-4xl sm:text-6xl text-[#50000D] font-bold tracking-tight">
            Farsan <span className="italic text-[#790B13]">Collections.</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#21191A]/75 font-sans max-w-xl leading-relaxed">
            Our range of authentic Gujarati farsan organized by frying technique and grain composition. Every category is prepared fresh daily in 100% pure filtered Saurashtra groundnut oil.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-24 text-center">
          <div className="w-8 h-8 border-2 border-[#790B13] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-[#21191A]/70 font-heading font-bold uppercase tracking-wider">Loading categories...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/snacks?category=${cat.slug}`}
              className="group bg-[#FFF9F2] rounded-3xl border border-[#D6B77A]/30 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Image */}
                <div className="aspect-16/10 overflow-hidden bg-gradient-to-b from-[#FFF0DC]/50 to-[#FFF9F2] border-b border-[#D6B77A]/25 relative p-4">
                  <img
                    src={cat.imageUrl || '/images/snacks/tikha-gathiya.jpg'}
                    alt={cat.name}
                    className="w-full h-full object-cover rounded-2xl group-hover:scale-106 transition-transform duration-500 shadow-sm"
                  />
                  <div className="absolute top-6 right-6 bg-[#50000D] text-[#FFF0DC] border border-[#D6B77A]/40 font-heading font-bold text-xs uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                    {cat.productCount || 0} Snacks
                  </div>
                </div>

                <div className="p-6 space-y-2">
                  <h3 className="font-heading font-bold text-xl text-[#50000D] group-hover:text-[#790B13] transition-colors">
                    {language === 'gu' && cat.nameGujarati ? cat.nameGujarati : cat.name}
                  </h3>
                  <p className="text-xs text-[#21191A]/70 font-sans leading-relaxed line-clamp-3">
                    {cat.description}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <div className="pt-3 border-t border-[#D6B77A]/20 flex items-center justify-between font-heading font-bold text-xs uppercase tracking-wider text-[#50000D]">
                  <span>Explore All Varieties</span>
                  <ArrowUpRight className="w-4 h-4 text-[#790B13] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
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
