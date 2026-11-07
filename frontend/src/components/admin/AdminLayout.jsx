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
    <div className="min-h-screen bg-[#FAF7F2] text-[#000000] flex flex-col md:flex-row antialiased">
      {/* Jet Black Themed Sidebar */}
      <aside className="w-full md:w-64 bg-[#000000] text-white flex flex-col shrink-0 border-r border-[#1a1a1a]">
        {/* Brand Header */}
        <div className="p-6 border-b border-white/10">
          <Link to="/" className="block group">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#C84B20]" />
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#D89B2B]">
                Rajkot Kitchen Sys
              </span>
            </div>
            <div className="font-heading font-black text-xl tracking-tight text-white group-hover:text-[#D89B2B] transition-colors flex items-center gap-1.5">
              <span>Giriraj Admin</span>
              <span className="font-script text-base text-[#D89B2B]">✦</span>
            </div>
            <div className="text-[11px] text-white/60 font-sans mt-0.5">
              Farsan Management Engine
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact
              ? location.pathname === item.to
              : location.pathname.startsWith(item.to);

            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#C84B20] text-white shadow-sm font-bold'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-white/60'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/10 space-y-1 text-xs">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 text-white/80 hover:text-white transition-colors rounded-xl hover:bg-white/5 font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>View Storefront</span>
          </Link>

          <button
            onClick={logout}
            className="w-full text-left flex items-center gap-2 px-3 py-2 text-rose-300 hover:text-rose-100 transition-colors cursor-pointer rounded-xl hover:bg-rose-950/30 font-medium"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>End Session</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content Body */}
      <main className="flex-1 overflow-y-auto min-h-screen bg-[#FAF7F2]">
        <header className="bg-white border-b border-[#EAE3D9] px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#555555]">
              Console /
            </span>
            <span className="font-heading font-black text-sm sm:text-base text-[#000000]">
              Giriraj Homemade Snacks Administration
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF4EF] text-xs text-[#000000] font-bold border border-[#14382B]/60">
              <span className="w-2 h-2 rounded-full bg-[#14382B] ring-1 ring-[#000000] animate-pulse" />
              Verified Session
            </span>
            <span className="text-xs font-bold text-[#000000] hidden sm:inline">
              {user?.name}
            </span>
          </div>
        </header>

        <div className="p-6 md:p-10 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
