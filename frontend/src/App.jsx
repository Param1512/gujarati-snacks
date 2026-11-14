import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { LanguageProvider } from './context/LanguageContext';
import { SettingsProvider } from './context/SettingsContext';

// Common Components
import AnnouncementBar from './components/common/AnnouncementBar';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import CartDrawer from './components/cart/CartDrawer';
import WhatsAppButton from './components/common/WhatsAppButton';

// Customer Pages
import Home from './pages/Home';
import AllSnacks from './pages/AllSnacks';
import CategoryListing from './pages/CategoryListing';
import ProductDetails from './pages/ProductDetails';
import SearchResults from './pages/SearchResults';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import Login from './pages/Login';
import OrderTracking from './pages/OrderTracking';
import Wishlist from './pages/Wishlist';
import ComboBuilderPage from './pages/ComboBuilderPage';
import BulkOrders from './pages/BulkOrders';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import FAQ from './pages/FAQ';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import ShippingRefundPolicy from './pages/ShippingRefundPolicy';

// Admin Pages
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminProductForm from './pages/admin/AdminProductForm';
import AdminOrders from './pages/admin/AdminOrders';
import AdminOrderDetail from './pages/admin/AdminOrderDetail';
import AdminInventory from './pages/admin/AdminInventory';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminCoupons from './pages/admin/AdminCoupons';
import AdminReviews from './pages/admin/AdminReviews';
import AdminBulkEnquiries from './pages/admin/AdminBulkEnquiries';
import AdminSettings from './pages/admin/AdminSettings';

// Customer Storefront Layout
const StorefrontLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9F2] text-[#21191A] selection:bg-[#790B13] selection:text-[#FFF0DC]">
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <WhatsAppButton />
    </div>
  );
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FFF9F2] text-[#21191A] flex items-center justify-center p-6 text-center">
          <div className="max-w-md bg-white p-8 rounded-3xl border border-[#D6B77A]/40 shadow-xl space-y-4">
            <h1 className="font-heading font-black text-2xl text-[#50000D] uppercase">
              Gujarati Nasta & Snacks
            </h1>
            <p className="text-sm text-[#21191A]/70">
              Something went wrong loading this view. Please reload or return to home.
            </p>
            <button
              onClick={() => (window.location.href = '/')}
              className="px-6 py-2.5 rounded-full bg-[#790B13] text-[#FFF0DC] font-heading font-bold text-xs uppercase tracking-wider cursor-pointer"
            >
              Reload Storefront
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <LanguageProvider>
          <SettingsProvider>
            <CartProvider>
              <WishlistProvider>
                <Router>
                  <Routes>
                    {/* Public Storefront Routes */}
                    <Route element={<StorefrontLayout />}>
                      <Route path="/" element={<Home />} />
                      <Route path="/snacks" element={<AllSnacks />} />
                      <Route path="/snacks/:identifier" element={<ProductDetails />} />
                      <Route path="/categories" element={<CategoryListing />} />
                      <Route path="/search" element={<SearchResults />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/checkout" element={<Checkout />} />
                      <Route path="/order-confirmed/:orderNumber" element={<OrderConfirmationPage />} />
                      <Route path="/order/:orderId" element={<OrderConfirmationPage />} />
                      <Route path="/admin/login" element={<Login />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Navigate to="/" replace />} />
                      <Route path="/profile" element={<Navigate to="/" replace />} />
                      <Route path="/my-orders" element={<Navigate to="/" replace />} />
                      <Route path="/track-order" element={<OrderTracking />} />
                      <Route path="/track/:orderNumber" element={<OrderTracking />} />
                      <Route path="/wishlist" element={<Wishlist />} />
                      <Route path="/combo-builder" element={<ComboBuilderPage />} />
                      <Route path="/bulk-orders" element={<BulkOrders />} />
                      <Route path="/about-us" element={<AboutUs />} />
                      <Route path="/contact-us" element={<ContactUs />} />
                      <Route path="/faq" element={<FAQ />} />
                      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                      <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
                      <Route path="/shipping-refund-policy" element={<ShippingRefundPolicy />} />
                    </Route>

                    {/* Protected Admin Routes */}
                    <Route path="/admin" element={<AdminLayout />}>
                      <Route index element={<AdminDashboard />} />
                      <Route path="products" element={<AdminProducts />} />
                      <Route path="products/new" element={<AdminProductForm />} />
                      <Route path="products/edit/:id" element={<AdminProductForm />} />
                      <Route path="orders" element={<AdminOrders />} />
                      <Route path="orders/:id" element={<AdminOrderDetail />} />
                      <Route path="inventory" element={<AdminInventory />} />
                      <Route path="customers" element={<AdminCustomers />} />
                      <Route path="coupons" element={<AdminCoupons />} />
                      <Route path="reviews" element={<AdminReviews />} />
                      <Route path="bulk-enquiries" element={<AdminBulkEnquiries />} />
                      <Route path="settings" element={<AdminSettings />} />
                    </Route>
                  </Routes>
                </Router>
              </WishlistProvider>
            </CartProvider>
          </SettingsProvider>
        </LanguageProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
