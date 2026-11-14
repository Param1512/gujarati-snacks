import React from 'react';
import { Link, useLocation, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Boxes,
  Users,
  Tag,
  Star,
  Layers,
  Settings,
  ArrowLeft,
  LogOut,
  Sparkles,
} from 'lucide-react';

const AdminLayout = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/login?redirect=/admin" replace />;
  }

  const navLinks = [
    { to: '/admin', label: 'Analytics Overview', icon: LayoutDashboard, exact: true },
    { to: '/admin/products', label: 'Snack Catalog', icon: Package },
    { to: '/admin/orders', label: 'Fulfillment & Orders', icon: ShoppingBag },
    { to: '/admin/inventory', label: 'Grams Inventory', icon: Boxes },
    { to: '/admin/customers', label: 'Patron Directory', icon: Users },
    { to: '/admin/coupons', label: 'Coupons & Vouchers', icon: Tag },
    { to: '/admin/reviews', label: 'Reviews Moderation', icon: Star },
    { to: '/admin/bulk-enquiries', label: 'Bulk Enquiries', icon: Layers },
    { to: '/admin/settings', label: 'Workshop Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#FFF9F2] text-[#21191A] flex flex-col md:flex-row antialiased font-sans selection:bg-[#790B13] selection:text-white">
      {/* Luxury Burgundy Themed Sidebar */}
      <aside className="w-full md:w-68 bg-[#3A000A] text-[#FFF0DC] flex flex-col shrink-0 border-r border-[#D6B77A]/20">
        {/* Brand Header */}
        <div className="p-6 border-b border-[#D6B77A]/15">
          <Link to="/" className="block group">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-[#D6B77A] ring-2 ring-[#790B13]" />
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#D6B77A] font-bold">
                Rajkot Kitchen Console
              </span>
            </div>
            <div className="font-heading font-black text-xl tracking-tight text-white group-hover:text-[#D6B77A] transition-colors flex items-center gap-2">
              <span className="uppercase">Giriraj Executive</span>
              <span className="font-serif italic text-base text-[#D6B77A]">✦</span>
            </div>
            <div className="text-[11px] text-[#FFF0DC]/60 font-sans mt-0.5">
              Artisanal Farsan Operations
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1.5 flex-1 overflow-y-auto">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact
              ? location.pathname === item.to
              : location.pathname.startsWith(item.to);

            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-mono uppercase tracking-wider transition-all ${
                  isActive
                    ? 'bg-[#790B13] text-[#FFF0DC] border border-[#D6B77A]/40 shadow-md font-bold'
                    : 'text-[#FFF0DC]/70 hover:text-[#FFF0DC] hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#D6B77A]' : 'text-[#FFF0DC]/50'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#D6B77A]/15 space-y-1 text-xs font-mono uppercase tracking-wider">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2.5 text-[#FFF0DC]/70 hover:text-white transition-colors rounded-xl hover:bg-white/5 font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#D6B77A]" />
            <span>Storefront Portal</span>
          </Link>

          <button
            onClick={logout}
            className="w-full text-left flex items-center gap-2 px-3 py-2.5 text-rose-300 hover:text-rose-100 transition-colors cursor-pointer rounded-xl hover:bg-rose-950/40 font-medium"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>End Session</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content Body */}
      <main className="flex-1 overflow-y-auto min-h-screen bg-[#FFF9F2]">
        <header className="bg-white border-b border-[#D6B77A]/20 px-8 py-5 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono uppercase tracking-widest text-[#790B13] font-bold">
              Console /
            </span>
            <span className="font-heading font-black text-sm sm:text-base text-[#21191A] uppercase tracking-tight">
              Executive Administration
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFF0DC] text-xs font-mono uppercase text-[#790B13] font-bold border border-[#D6B77A]/40">
              <span className="w-2 h-2 rounded-full bg-[#790B13] ring-2 ring-[#D6B77A] animate-pulse" />
              Verified Artisan Session
            </span>
            <span className="text-xs font-mono font-bold text-[#21191A] hidden sm:inline">
              {user?.name}
            </span>
          </div>
        </header>

        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
