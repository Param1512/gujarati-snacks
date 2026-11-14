import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useLanguage } from '../../context/LanguageContext';
import { useSettings } from '../../context/SettingsContext';
import {
  ShoppingBag,
  Heart,
  User,
  Search,
  Menu,
  X,
  LayoutDashboard,
  LogOut,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { totalItemsCount, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const { t, language } = useLanguage();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [userDropdown, setUserDropdown] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
      setSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { label: t('allSnacks') || 'Shop Snacks', path: '/snacks' },
    { label: t('categories') || 'Categories', path: '/categories' },
    { label: t('comboBuilder') || 'Custom Box', path: '/combo-builder', badge: 'Hamper' },
    { label: t('bulkOrders') || 'Bulk Orders', path: '/bulk-orders' },
    { label: t('aboutUs') || 'Our Story', path: '/about-us' },
    { label: t('contactUs') || 'Contact', path: '/contact-us' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FFF9F2]/95 backdrop-blur-md text-[#21191A] border-b border-[#D6B77A]/25 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Brand Identity / Premium Emblem */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#790B13] to-[#50000D] text-[#FFF0DC] border border-[#D6B77A]/40 flex items-center justify-center font-heading font-bold text-xl shadow-md group-hover:scale-105 transition-all">
              <span className="font-gujarati text-lg leading-none font-bold text-[#D6B77A]">ગી</span>
            </div>
            <div>
              <div className="font-heading font-black text-2xl tracking-tight text-[#50000D] flex items-center gap-1.5 leading-none">
                <span>
                  {language === 'gu' && settings.storeNameGujarati
                    ? settings.storeNameGujarati
                    : 'Giriraj'}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#D6B77A]" />
              </div>
              <span className="text-[10px] uppercase tracking-widest text-[#790B13] font-bold block mt-1 font-heading">
                Authentic Homemade • Rajkot
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7 text-xs font-heading font-bold uppercase tracking-wider">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative py-1.5 transition-colors flex items-center gap-1.5 ${
                    isActive ? 'text-[#790B13]' : 'text-[#21191A]/80 hover:text-[#790B13]'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="text-[9px] px-2 py-0.5 bg-[#FFF0DC] text-[#790B13] border border-[#D6B77A]/40 rounded-full font-bold tracking-wider">
                      {link.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#790B13] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons: Search, Wishlist, Account, Cart */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Desktop Quick Search Toggle */}
            <div className="relative">
              {searchOpen ? (
                <form
                  onSubmit={handleSearch}
                  className="flex items-center bg-white border border-[#D6B77A]/40 rounded-full px-3.5 py-1.5 shadow-sm"
                >
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search snacks, gathiya..."
                    autoFocus
                    className="bg-transparent text-xs text-[#21191A] placeholder-[#21191A]/40 focus:outline-none w-36 sm:w-48 font-sans"
                  />
                  <button type="submit" className="text-[#50000D] hover:text-[#790B13] p-1 cursor-pointer">
                    <Search className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="text-[#21191A]/40 hover:text-[#21191A] p-1 ml-1 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setSearchOpen(true)}
                  className="p-2.5 rounded-full text-[#21191A]/70 hover:text-[#790B13] hover:bg-[#FFF0DC] transition-colors cursor-pointer"
                  title="Search snacks"
                >
                  <Search className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Wishlist Link */}
            <Link
              to="/wishlist"
              className="relative p-2.5 rounded-full text-[#21191A]/70 hover:text-[#790B13] hover:bg-[#FFF0DC] transition-colors"
              title="Saved Items"
            >
              <Heart className="w-4 h-4" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 font-heading text-[10px] font-bold bg-[#790B13] text-[#FFF0DC] w-4 h-4 rounded-full flex items-center justify-center leading-none shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* User Account / Profile */}
            <div className="relative">
              {isAuthenticated ? (
                <div>
                  <button
                    onClick={() => setUserDropdown(!userDropdown)}
                    className="flex items-center gap-2 text-xs font-heading font-bold text-[#50000D] bg-[#FFF0DC] border border-[#D6B77A]/40 rounded-full px-3.5 py-2 hover:bg-[#790B13] hover:text-[#FFF0DC] transition-all cursor-pointer shadow-xs"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">
                      {user?.name?.split(' ')[0] || 'Account'}
                    </span>
                  </button>

                  {userDropdown && (
                    <div className="absolute right-0 mt-2 w-56 bg-white text-[#21191A] rounded-2xl shadow-xl py-2 z-50 text-xs font-heading border border-[#D6B77A]/30">
                      <div className="px-4 py-3 border-b border-[#D6B77A]/20 bg-[#FFF9F2]">
                        <p className="text-[10px] text-[#790B13] uppercase tracking-wider font-bold">Patron Account</p>
                        <p className="font-bold text-[#21191A] truncate text-sm">{user?.name}</p>
                        <p className="text-[11px] text-[#21191A]/60 truncate">{user?.email}</p>
                      </div>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdown(false)}
                          className="flex items-center justify-between px-4 py-2.5 text-[#790B13] hover:bg-[#FFF0DC] transition-colors font-bold"
                        >
                          <span className="flex items-center gap-2">
                            <LayoutDashboard className="w-3.5 h-3.5" />
                            Admin Console
                          </span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      )}

                      <Link
                        to="/profile"
                        onClick={() => setUserDropdown(false)}
                        className="flex items-center gap-2 px-4 py-2 text-[#21191A] hover:bg-[#FFF0DC] transition-colors font-medium"
                      >
                        <User className="w-3.5 h-3.5 text-[#790B13]" />
                        Profile & Addresses
                      </Link>

                      <Link
                        to="/my-orders"
                        onClick={() => setUserDropdown(false)}
                        className="flex items-center gap-2 px-4 py-2 text-[#21191A] hover:bg-[#FFF0DC] transition-colors font-medium"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 text-[#790B13]" />
                        My Orders & Tracking
                      </Link>

                      <button
                        onClick={() => {
                          setUserDropdown(false);
                          logout();
                        }}
                        className="w-full text-left flex items-center gap-2 px-4 py-2 text-rose-700 hover:bg-rose-50 border-t border-[#D6B77A]/20 mt-1 cursor-pointer transition-colors font-semibold"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 text-xs font-heading font-bold uppercase tracking-wider text-[#50000D] bg-[#FFF0DC] hover:bg-[#790B13] hover:text-[#FFF0DC] border border-[#D6B77A]/40 rounded-full px-4 py-2 transition-all shadow-xs"
                >
                  <User className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t('login')}</span>
                </Link>
              )}
            </div>

            {/* Shopping Bag Trigger in Deep Burgundy Luxury Style */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 bg-[#50000D] hover:bg-[#790B13] text-[#FFF0DC] px-4 py-2 rounded-full border border-[#D6B77A]/40 transition-all cursor-pointer shadow-sm active:scale-95"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 text-[#D6B77A]" />
              <span className="font-heading text-xs font-bold text-[#FFF0DC]">
                {totalItemsCount}
              </span>
            </button>

            {/* Mobile Navigation Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#50000D] hover:bg-[#FFF0DC] rounded-full cursor-pointer"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FFF9F2] border-t border-[#D6B77A]/30 px-6 py-6 space-y-5 animate-in fade-in duration-200">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by snack name..."
              className="w-full bg-white border border-[#D6B77A]/40 rounded-full py-2.5 px-4 text-xs text-[#21191A] placeholder-[#21191A]/40 focus:outline-none focus:border-[#790B13]"
            />
            <button
              type="submit"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#50000D]"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          <div className="flex flex-col space-y-3 font-heading text-xs uppercase tracking-wider font-bold">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 text-[#21191A] hover:text-[#790B13] flex items-center justify-between border-b border-[#D6B77A]/20"
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className="text-[9px] bg-[#FFF0DC] text-[#790B13] border border-[#D6B77A]/40 px-2 py-0.5 rounded-full font-bold">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
            <Link
              to="/track-order"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-[#21191A]/70 hover:text-[#790B13] border-b border-[#D6B77A]/20"
            >
              Track Order
            </Link>
            <Link
              to="/faq"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-[#21191A]/70 hover:text-[#790B13]"
            >
              FAQ & Policies
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
