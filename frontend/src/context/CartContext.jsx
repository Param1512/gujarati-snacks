import React, { createContext, useContext, useState, useEffect } from 'react';
import { PRIMARY_WHATSAPP_NUMBER, buildWhatsAppLink } from '../config/whatsapp';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('gujarati_snacks_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [coupon, setCoupon] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('gujarati_snacks_cart', JSON.stringify(items));
    } catch (e) {
      console.error('Failed to sync cart to localStorage', e);
    }
  }, [items]);

  // Calculate unit price based on weight and price per kg
  const calculatePrice = (pricePerKg, weightGrams) => {
    return Math.round((pricePerKg * weightGrams) / 1000);
  };

  const getWeightLabel = (weightGrams) => {
    const map = {
      250: '250 g',
      500: '500 g',
      1000: '1 kg',
      2000: '2 kg',
    };
    return map[weightGrams] || `${weightGrams} g`;
  };

  const addToCart = (product, weightGrams = 500, quantity = 1) => {
    const unitPrice = calculatePrice(product.pricePerKg, weightGrams);
    const itemKey = `${product._id}_${weightGrams}`;

    setItems((prevItems) => {
      const existingIdx = prevItems.findIndex((item) => item.itemKey === itemKey);

      if (existingIdx > -1) {
        const updated = [...prevItems];
        const newQty = updated[existingIdx].quantity + quantity;
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: newQty,
          itemSubtotal: unitPrice * newQty,
          totalGrams: weightGrams * newQty,
        };
        return updated;
      } else {
        const newItem = {
          itemKey,
          productId: product._id,
          name: product.name,
          slug: product.slug,
          pricePerKg: product.pricePerKg,
          weightGrams,
          weightLabel: getWeightLabel(weightGrams),
          unitPrice,
          quantity,
          itemSubtotal: unitPrice * quantity,
          totalGrams: weightGrams * quantity,
          imageUrl: product.images?.[0]?.url || '',
          isCombo: product.isCombo || false,
        };
        return [...prevItems, newItem];
      }
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (itemKey) => {
    setItems((prev) => prev.filter((item) => item.itemKey !== itemKey));
  };

  const updateQuantity = (itemKey, delta) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.itemKey === itemKey) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            return {
              ...item,
              quantity: newQty,
              itemSubtotal: item.unitPrice * newQty,
              totalGrams: item.weightGrams * newQty,
            };
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const clearCart = () => {
    setItems([]);
    setCoupon(null);
  };

  // Subtotals and summaries
  const subtotal = items.reduce((sum, item) => sum + item.itemSubtotal, 0);
  const totalGrams = items.reduce((sum, item) => sum + item.totalGrams, 0);
  const totalKg = (totalGrams / 1000).toFixed(2);
  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Generate WhatsApp cart message for Deepa Bhansali
  const getWhatsAppCartMessage = (phoneNumber = PRIMARY_WHATSAPP_NUMBER) => {
    if (items.length === 0) return '';
    let msg = `*Namaste Deepaji (Gujarati Homemade Nasta & Snacks)!* 🥟\n\nI want to order the following fresh homemade snacks:\n\n`;
    items.forEach((item, idx) => {
      msg += `${idx + 1}. *${item.name}* (${item.weightLabel}) x ${item.quantity} = ₹${item.itemSubtotal}\n`;
    });
    msg += `\n*Total Snacks Subtotal:* ₹${subtotal}`;
    msg += `\n*Total Weight:* ${totalKg} kg`;
    msg += `\n\nPlease confirm availability and delivery to my location!`;

    return buildWhatsAppLink(phoneNumber, msg);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        totalGrams,
        totalKg,
        totalItemsCount,
        coupon,
        setCoupon,
        isCartOpen,
        setIsCartOpen,
        getWhatsAppCartMessage,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

