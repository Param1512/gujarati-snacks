import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [wishlistProductIds, setWishlistProductIds] = useState(() => {
    try {
      const saved = localStorage.getItem('gujarati_wishlist_ids');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // If logged in, sync with backend
  useEffect(() => {
    if (isAuthenticated) {
      api
        .get('/wishlist')
        .then((data) => {
          if (data.success && data.products) {
            const ids = data.products.map((p) => (p._id ? p._id : p));
            setWishlistProductIds(ids);
            localStorage.setItem('gujarati_wishlist_ids', JSON.stringify(ids));
          }
        })
        .catch(() => {});
    }
  }, [isAuthenticated]);

  const toggleWishlist = async (productId) => {
    const isPresent = wishlistProductIds.includes(productId);
    let updated;
    if (isPresent) {
      updated = wishlistProductIds.filter((id) => id !== productId);
      if (isAuthenticated) {
        api.delete(`/wishlist/${productId}`).catch(() => {});
      }
    } else {
      updated = [...wishlistProductIds, productId];
      if (isAuthenticated) {
        api.post(`/wishlist/${productId}`).catch(() => {});
      }
    }
    setWishlistProductIds(updated);
    localStorage.setItem('gujarati_wishlist_ids', JSON.stringify(updated));
  };

  const isInWishlist = (productId) => wishlistProductIds.includes(productId);

  return (
    <WishlistContext.Provider
      value={{
        wishlistProductIds,
        toggleWishlist,
        isInWishlist,
        wishlistCount: wishlistProductIds.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);

