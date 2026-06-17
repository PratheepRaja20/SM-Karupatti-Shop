import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Persist cart in localStorage
  useEffect(() => {
    const stored = localStorage.getItem('sm_cart');
    if (stored) setCartItems(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem('sm_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, weightGrams, quantity = 1) => {
    const pricePerGram = product.pricePerKg / 1000;
    const itemPrice = pricePerGram * weightGrams * quantity;
    const itemId = `${product.id || product._id}-${weightGrams}`;

    setCartItems((prev) => {
      const existing = prev.find((item) => item.itemId === itemId);
      if (existing) {
        toast.success('Cart updated!');
        return prev.map((item) =>
          item.itemId === itemId
            ? { ...item, quantity: item.quantity + quantity, totalPrice: (item.quantity + quantity) * pricePerGram * weightGrams }
            : item
        );
      }
      toast.success(`${product.name} added to cart!`);
      return [
        ...prev,
        {
          itemId,
          product: product.id || product._id,
          name: product.name,
          image: product.images?.[0]?.url || '',
          pricePerKg: product.pricePerKg,
          weightGrams,
          quantity,
          totalPrice: itemPrice,
        },
      ];
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => prev.filter((item) => item.itemId !== itemId));
    toast.success('Item removed from cart');
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity < 1) {
      removeFromCart(itemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.itemId === itemId) {
          const pricePerGram = item.pricePerKg / 1000;
          return { ...item, quantity, totalPrice: quantity * pricePerGram * item.weightGrams };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('sm_cart');
  };

  const cartTotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};

export default CartContext;
