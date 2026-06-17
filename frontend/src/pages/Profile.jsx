import { useState, useEffect } from 'react';
import {
  Box, Container, Grid, Typography, Paper, Avatar, Button,
  TextField, Tab, Tabs, Chip, Divider, Stack, LinearProgress,
} from '@mui/material';
import { Person, ShoppingBag, Edit, Save, Cancel } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { authAPI, orderAPI } from '../services/api';

const STATUS_COLORS = { pending: 'warning', confirmed: 'info', processing: 'info', shipped: 'primary', delivered: 'success', cancelled: 'error' };

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [tab, setTab] = useState(0);
  const [editing, setEditing] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });

  useEffect(() => {
    orderAPI.getMyOrders().then(({ data }) => setOrders(data.orders || [])).catch(() => {}).finally(() => setOrdersLoading(false));
  }, []);

  const handleSave = async () => {
    try {
      const { data } = await authAPI.updateProfile(form);
      updateUser(data.user);
      setEditing(false);
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to update profile');
    }
  };

  return (
    <>
      <Helmet><title>My Profile — SM Original Karupatti</title></Helmet>
      <Box className="organic-bg" sx={{ pt: { xs: 10, md: 11 }, pb: 8, minHeight: '100vh' }}>
        <Container maxWidth="xl">
          <Grid container spacing={4}>
            {/* Sidebar */}
            <Grid item xs={12} md={3}>
              <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
                <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 4, border: '1px solid rgba(92,51,23,0.1)' }}>
                  <Avatar sx={{ width: 90, height: 90, mx: 'auto', mb: 2, bgcolor: '#5C3317', fontSize: '2rem', fontWeight: 700 }}>
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </Avatar>
                  <Typography variant="h6" sx={{ fontFamily: 'Playfair Display', fontWeight: 700, color: '#5C3317' }}>{user?.name}</Typography>
                  <Typography variant="body2" sx={{ color: '#8B6A4A', mb: 1 }}>{user?.email}</Typography>
                  <Chip label={user?.role === 'admin' ? 'Admin' : 'Customer'} size="small" sx={{ bgcolor: user?.role === 'admin' ? '#5C3317' : 'rgba(45,106,45,0.1)', color: user?.role === 'admin' ? 'white' : '#2D6A2D' }} />
                  <Divider sx={{ my: 3 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h5" sx={{ fontWeight: 800, color: '#5C3317' }}>{orders.length}</Typography>
                      <Typography variant="caption" sx={{ color: '#8B6A4A' }}>Orders</Typography>
                    </Box>
                  </Box>
                </Paper>
              </motion.div>
            </Grid>

            {/* Main content */}
            <Grid item xs={12} md={9}>
              <Paper sx={{ borderRadius: 4, overflow: 'hidden', border: '1px solid rgba(92,51,23,0.1)' }}>
                <Tabs
                  value={tab}
                  onChange={(_, v) => setTab(v)}
                  sx={{ borderBottom: '2px solid rgba(92,51,23,0.08)', px: 3, bgcolor: 'rgba(92,51,23,0.02)', '& .Mui-selected': { color: '#5C3317 !important' }, '& .MuiTabs-indicator': { bgcolor: '#D4A017', height: 3 } }}
                >
                  <Tab label="My Profile" icon={<Person />} iconPosition="start" />
                  <Tab label="Order History" icon={<ShoppingBag />} iconPosition="start" />
                </Tabs>

                <Box sx={{ p: 4 }}>
                  {tab === 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                        <Typography variant="h5" sx={{ fontFamily: 'Playfair Display', color: '#5C3317', fontWeight: 700 }}>Personal Information</Typography>
                        {!editing ? (
                          <Button startIcon={<Edit />} onClick={() => setEditing(true)} variant="outlined" sx={{ borderColor: '#5C3317', color: '#5C3317' }}>Edit Profile</Button>
                        ) : (
                          <Stack direction="row" spacing={1}>
                            <Button startIcon={<Save />} onClick={handleSave} variant="contained" color="primary">Save</Button>
                            <Button startIcon={<Cancel />} onClick={() => setEditing(false)} variant="outlined" color="error">Cancel</Button>
                          </Stack>
                        )}
                      </Box>

                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label="Full Name"
                            value={editing ? form.name : user?.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            fullWidth
                            InputProps={{ readOnly: !editing }}
                            sx={{ '& .MuiInputBase-root': { bgcolor: editing ? 'white' : 'rgba(92,51,23,0.02)' } }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField label="Email Address" value={user?.email} fullWidth InputProps={{ readOnly: true }} sx={{ '& .MuiInputBase-root': { bgcolor: 'rgba(92,51,23,0.02)' } }} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label="Phone Number"
                            value={editing ? form.phone : user?.phone || ''}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            fullWidth
                            InputProps={{ readOnly: !editing }}
                            sx={{ '& .MuiInputBase-root': { bgcolor: editing ? 'white' : 'rgba(92,51,23,0.02)' } }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField label="Role" value={user?.role} fullWidth InputProps={{ readOnly: true }} sx={{ '& .MuiInputBase-root': { bgcolor: 'rgba(92,51,23,0.02)' } }} />
                        </Grid>
                      </Grid>
                    </motion.div>
                  )}

                  {tab === 1 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <Typography variant="h5" sx={{ fontFamily: 'Playfair Display', color: '#5C3317', fontWeight: 700, mb: 4 }}>Order History</Typography>
                      {ordersLoading ? (
                        <LinearProgress sx={{ borderRadius: 2 }} />
                      ) : orders.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 6 }}>
                          <ShoppingBag sx={{ fontSize: 60, color: 'rgba(92,51,23,0.15)', mb: 2 }} />
                          <Typography variant="h6" sx={{ color: '#8B6A4A' }}>No orders yet</Typography>
                          <Typography variant="body2" sx={{ color: '#8B6A4A' }}>Your orders will appear here once you place an order.</Typography>
                        </Box>
                      ) : (
                        orders.map((order) => (
                          <Paper key={order.id || order._id} sx={{ p: 3, mb: 2, border: '1px solid rgba(92,51,23,0.08)', borderRadius: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                              <Typography variant="body2" sx={{ color: '#8B6A4A' }}>Order #{String(order.id || order._id || '').slice(-8).toUpperCase()}</Typography>
                              <Chip label={order.status} size="small" color={STATUS_COLORS[order.status] || 'default'} />
                            </Box>
                            {order.items?.map((item, i) => {
                              const itemName = item.name || 'Original Karupatti';
                              const itemWeight = item.weightGrams || 1000;
                              const formattedWeight = itemWeight >= 1000 ? (itemWeight / 1000) + 'kg' : itemWeight + 'g';
                              return (
                                <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                  <Typography variant="body2">{itemName} ({formattedWeight} ×{item.quantity})</Typography>
                                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#5C3317' }}>₹{item.totalPrice?.toFixed(2)}</Typography>
                                </Box>
                              );
                            })}
                            <Divider sx={{ my: 1.5 }} />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="caption" sx={{ color: '#8B6A4A' }}>{new Date(order.createdAt).toLocaleDateString()}</Typography>
                              <Typography variant="body1" sx={{ fontWeight: 700, color: '#5C3317' }}>₹{order.totalAmount?.toFixed(2)}</Typography>
                            </Box>
                          </Paper>
                        ))
                      )}
                    </motion.div>
                  )}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}
