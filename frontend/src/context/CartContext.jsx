import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [cartLoading, setCartLoading] = useState(false);

  // Fetch cart when user logs in
  const fetchCart = useCallback(async () => {
    if (!user) { setCart({ items: [] }); return; }
    try {
      setCartLoading(true);
      const { data } = await API.get('/cart');
      setCart(data);
    } catch {
      setCart({ items: [] });
    } finally {
      setCartLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addToCart = async (productId, qty = 1) => {
    try {
      const { data } = await API.post('/cart', { productId, qty });
      setCart(data);
      toast.success('Added to cart! 🛒');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    }
  };

  const updateQty = async (productId, qty) => {
    try {
      const { data } = await API.put(`/cart/${productId}`, { qty });
      setCart(data);
    } catch (err) {
      toast.error('Failed to update quantity');
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const { data } = await API.delete(`/cart/${productId}`);
      setCart(data);
      toast.success('Removed from cart');
    } catch {
      toast.error('Failed to remove item');
    }
  };

  const clearCart = async () => {
    try {
      await API.delete('/cart');
      setCart({ items: [] });
    } catch {}
  };

  // Cart computed values
  const cartCount = cart?.items?.reduce((sum, i) => sum + i.qty, 0) || 0;
  const cartTotal = cart?.items?.reduce((sum, i) => sum + (i.product?.price || 0) * i.qty, 0) || 0;

  return (
    <CartContext.Provider value={{ cart, cartLoading, cartCount, cartTotal, addToCart, updateQty, removeFromCart, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
};
