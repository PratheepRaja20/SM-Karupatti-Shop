import { Box, Container, Typography, Grid, Button, IconButton, Paper, Divider, Chip, Avatar, Stack } from '@mui/material';
import { Add, Remove, Delete, ShoppingCart, WhatsApp } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../services/api';

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();

  const waMessage = encodeURIComponent(
    `Hello SM Original Karupatti,\n\nI would like to place the following order:\n\n${cartItems.map((item) => `• ${item.name} - ${item.weightGrams >= 1000 ? item.weightGrams / 1000 + 'kg' : item.weightGrams + 'g'} × ${item.quantity} = ₹${item.totalPrice.toFixed(2)}`).join('\n')}\n\nTotal: ₹${cartTotal.toFixed(2)}\n\nCustomer Name: ${user?.name || 'Guest'}\nMobile: ${user?.phone || ''}\n\nPlease confirm my order.`
  );

  const handleWhatsAppOrder = async (e) => {
    e.preventDefault();
    try {
      const orderPayload = {
        customerName: user?.name || 'WhatsApp Guest',
        customerPhone: user?.phone || '8825778001',
        items: cartItems.map((item) => ({
          product: item.product,
          quantity: item.quantity,
          price: item.totalPrice,
          weightGrams: item.weightGrams,
        })),
        totalAmount: cartTotal,
        orderType: 'whatsapp',
        notes: `Cart checkout via WhatsApp`
      };
      await orderAPI.create(orderPayload);
      clearCart();
    } catch (err) {
      console.error('Failed to log order:', err);
    } finally {
      window.open(`https://wa.me/918825778001?text=${waMessage}`, '_blank');
    }
  };

  if (cartItems.length === 0) return (
    <>
      <Helmet><title>Cart — SM Original Karupatti</title></Helmet>
      <Box sx={{ pt: 15, pb: 8, textAlign: 'center', minHeight: '100vh' }} className="organic-bg">
        <Container maxWidth="sm">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <ShoppingCart sx={{ fontSize: 100, color: 'rgba(92,51,23,0.15)', mb: 3 }} />
            <Typography variant="h4" sx={{ fontFamily: 'Playfair Display', color: '#5C3317', mb: 2 }}>Your cart is empty</Typography>
            <Typography variant="body1" sx={{ color: '#8B6A4A', mb: 4 }}>Explore our premium natural products and add them to your cart.</Typography>
            <Button component={Link} to="/products" variant="contained" color="primary" size="large">Browse Products</Button>
          </motion.div>
        </Container>
      </Box>
    </>
  );

  return (
    <>
      <Helmet><title>Cart — SM Original Karupatti</title></Helmet>
      <Box className="organic-bg" sx={{ pt: { xs: 10, md: 11 }, pb: 8, minHeight: '100vh' }}>
        <Container maxWidth="xl">
          <Typography variant="h3" sx={{ fontFamily: 'Playfair Display', color: '#5C3317', mb: 5, fontWeight: 800 }}>
            Shopping Cart
          </Typography>

          <Grid container spacing={4}>
            {/* Cart Items */}
            <Grid item xs={12} md={8}>
              <AnimatePresence>
                {cartItems.map((item) => (
                  <motion.div
                    key={item.itemId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Paper sx={{ p: 3, mb: 2, display: 'flex', gap: 3, alignItems: 'center', flexWrap: 'wrap', border: '1px solid rgba(92,51,23,0.08)' }}>
                      {/* Image */}
                      <Box sx={{ width: 90, height: 90, borderRadius: 3, overflow: 'hidden', flexShrink: 0 }}>
                        <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </Box>

                      {/* Info */}
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" sx={{ fontFamily: 'Playfair Display', color: '#5C3317', fontWeight: 700 }}>{item.name}</Typography>
                        <Chip label={item.weightGrams >= 1000 ? `${item.weightGrams / 1000}kg` : `${item.weightGrams}g`} size="small" sx={{ my: 0.5, bgcolor: 'rgba(92,51,23,0.08)', color: '#5C3317' }} />
                        <Typography variant="body2" sx={{ color: '#8B6A4A' }}>₹{item.pricePerKg}/kg</Typography>
                      </Box>

                      {/* Quantity */}
                      <Box sx={{ display: 'flex', alignItems: 'center', border: '2px solid rgba(92,51,23,0.2)', borderRadius: 3, overflow: 'hidden' }}>
                        <IconButton size="small" onClick={() => updateQuantity(item.itemId, item.quantity - 1)} sx={{ color: '#5C3317' }}><Remove fontSize="small" /></IconButton>
                        <Typography sx={{ px: 2, fontWeight: 700, color: '#5C3317' }}>{item.quantity}</Typography>
                        <IconButton size="small" onClick={() => updateQuantity(item.itemId, item.quantity + 1)} sx={{ color: '#5C3317' }}><Add fontSize="small" /></IconButton>
                      </Box>

                      {/* Price */}
                      <Typography variant="h6" sx={{ fontWeight: 800, color: '#5C3317', minWidth: 80, textAlign: 'right' }}>
                        ₹{item.totalPrice.toFixed(2)}
                      </Typography>

                      {/* Delete */}
                      <IconButton onClick={() => removeFromCart(item.itemId)} sx={{ color: 'error.main' }}>
                        <Delete />
                      </IconButton>
                    </Paper>
                  </motion.div>
                ))}
              </AnimatePresence>

              <Button onClick={clearCart} variant="text" color="error" sx={{ mt: 1 }}>Clear All Items</Button>
            </Grid>

            {/* Summary */}
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, borderRadius: 4, border: '2px solid rgba(212,160,23,0.2)', position: 'sticky', top: 90 }}>
                <Typography variant="h5" sx={{ fontFamily: 'Playfair Display', color: '#5C3317', mb: 3, fontWeight: 700 }}>
                  Order Summary
                </Typography>

                <Stack spacing={2} sx={{ mb: 3 }}>
                  {cartItems.map((item) => (
                    <Box key={item.itemId} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" sx={{ color: '#8B6A4A' }}>
                        {item.name} ({item.weightGrams >= 1000 ? item.weightGrams / 1000 + 'kg' : item.weightGrams + 'g'} ×{item.quantity})
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#5C3317' }}>₹{item.totalPrice.toFixed(2)}</Typography>
                    </Box>
                  ))}
                </Stack>

                <Divider sx={{ mb: 3 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                  <Typography variant="h6" sx={{ fontFamily: 'Playfair Display', color: '#5C3317', fontWeight: 700 }}>Total</Typography>
                  <Typography variant="h4" sx={{ fontFamily: 'Playfair Display', fontWeight: 800, color: '#5C3317' }}>₹{cartTotal.toFixed(2)}</Typography>
                </Box>

                <Stack spacing={2}>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={handleWhatsAppOrder}
                      variant="contained"
                      fullWidth
                      size="large"
                      startIcon={<WhatsApp />}
                      sx={{ py: 1.75, bgcolor: '#25D366', '&:hover': { bgcolor: '#1da851' }, fontWeight: 700, fontSize: '1rem' }}
                    >
                      Order via WhatsApp
                    </Button>
                  </motion.div>
                  <Typography variant="caption" sx={{ color: '#8B6A4A', textAlign: 'center' }}>
                    Secure ordering via WhatsApp with automatic order details
                  </Typography>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}
