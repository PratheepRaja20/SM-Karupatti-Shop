import { useState, useEffect } from 'react';
import {
  Box, Container, Grid, Typography, Paper, Button, Avatar, Chip,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Tab, Tabs, LinearProgress, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, FormControl, InputLabel,
  Select, MenuItem, Switch, FormControlLabel, Alert, Divider,
  Pagination,
} from '@mui/material';
import {
  Dashboard, Inventory, People, ShoppingBag, ContactMail,
  Add, Edit, Delete, CheckCircle, Cancel, Visibility, TrendingUp, WhatsApp,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { adminAPI, productAPI, contactAPI, orderAPI } from '../services/api';
import SMLogoImg from '../assets/sm-logo.png';
import KarupattiImg from '../assets/karupatti.jpg';
import KandImg from '../assets/kand.jpg';
import TamarindImg from '../assets/tamarind.jpg';

// Helper to normalize category spellings
function normalizeCategory(category) {
  const c = (category || '').toLowerCase().trim();
  if (c === 'panamkarkandu' || c === 'panangkarkandu') return 'panangkarkandu';
  if (c === 'puli' || c === 'tamarind') return 'tamarind';
  return c;
}

// Map category/ID to local frontend image
function getProductImage(product) {
  const cat = normalizeCategory(product.category);
  const id = String(product.id || product._id || '');

  // Try to load admin-uploaded images from localStorage first
  let storedKey = null;
  if (cat === 'karupatti' || id === '1') storedKey = 'sm_product_images_karupatti';
  else if (cat === 'panangkarkandu' || id === '2') storedKey = 'sm_product_images_panangkarkandu';
  else if (cat === 'tamarind' || id === '3') storedKey = 'sm_product_images_tamarind';

  if (storedKey) {
    try {
      const stored = JSON.parse(localStorage.getItem(storedKey) || 'null');
      if (stored && stored.length > 0 && stored[0]) {
        return stored[0];
      }
    } catch {}
  }

  if (cat === 'karupatti' || id === '1') return KarupattiImg;
  if (cat === 'panangkarkandu' || id === '2') return KandImg;
  if (cat === 'tamarind' || id === '3') return TamarindImg;
  return product.images?.[0]?.url || KarupattiImg;
}


const STATUS_COLORS = { pending: 'warning', confirmed: 'info', processing: 'info', shipped: 'primary', delivered: 'success', cancelled: 'error' };

function StatCard({ icon, title, value, color, delay = 0 }) {
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
      <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 3, border: '1px solid rgba(92,51,23,0.08)', borderLeft: `4px solid ${color}` }}>
        <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: `${color}15`, color }}>{icon}</Box>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#5C3317', fontFamily: '"Outfit", "Inter", sans-serif' }}>{value}</Typography>
          <Typography variant="body2" sx={{ color: '#8B6A4A' }}>{title}</Typography>
        </Box>
      </Paper>
    </motion.div>
  );
}

export default function AdminDashboard() {
  const [tab, setTab] = useState(0);
  const [analytics, setAnalytics] = useState(null);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [ordersPage, setOrdersPage] = useState(1);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productDialog, setProductDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({ name: '', description: '', pricePerKg: '', category: 'Karupatti', stock: '', benefits: '', isAvailable: true, isFeatured: false });
  const [productImages, setProductImages] = useState([]);
  const [savedImages, setSavedImages] = useState([]); // existing localStorage images

  const loadData = async () => {
    setLoading(true);
    try {
      const [dashRes, pRes, uRes, oRes, cRes] = await Promise.all([
        adminAPI.getDashboard(),
        productAPI.getAll(),
        adminAPI.getUsers(),
        orderAPI.getAll(),
        contactAPI.getAll(),
      ]);
      setAnalytics(dashRes.data.analytics);
      setProducts(pRes.data.products || []);
      setUsers(uRes.data.users || []);
      setOrders(oRes.data.orders || []);
      setContacts(cRes.data.contacts || []);
    } catch (e) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const openAddProduct = () => {
    setEditingProduct(null);
    setProductForm({ name: '', description: '', pricePerKg: '', category: 'Karupatti', stock: '', benefits: '', isAvailable: true, isFeatured: false });
    setProductImages([]);
    setSavedImages([]);
    setProductDialog(true);
  };

  const openEditProduct = (p) => {
    setEditingProduct(p);
    
    let displayCategory = p.category || 'Karupatti';
    const normCat = normalizeCategory(displayCategory);
    if (normCat === 'panangkarkandu') displayCategory = 'Panangkarkandu';
    else if (normCat === 'tamarind') displayCategory = 'Tamarind';
    else if (normCat === 'karupatti') displayCategory = 'Karupatti';

    setProductForm({
      name: p.name,
      description: p.description,
      pricePerKg: p.pricePerKg,
      category: displayCategory,
      stock: p.stock,
      benefits: Array.isArray(p.benefits) ? p.benefits.join(', ') : p.benefits || '',
      isAvailable: p.isAvailable,
      isFeatured: p.isFeatured
    });
    setProductImages([]);
    // Load existing images from localStorage
    const key = `sm_product_images_${normCat}`;
    try {
      const stored = JSON.parse(localStorage.getItem(key) || 'null');
      setSavedImages(stored && stored.length > 0 ? stored : []);
    } catch { setSavedImages([]); }
    setProductDialog(true);
  };

  // Delete a single saved image from localStorage
  const handleDeleteSavedImage = (index) => {
    const category = editingProduct?.category || productForm.category || 'Karupatti';
    const key = `sm_product_images_${normalizeCategory(category)}`;
    const updated = savedImages.filter((_, i) => i !== index);
    setSavedImages(updated);
    if (updated.length === 0) localStorage.removeItem(key);
    else {
      try {
        localStorage.setItem(key, JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to update localStorage after delete:', err);
      }
    }
    toast.success('Image removed!');
  };

  // Convert and compress file to base64 string
  const fileToBase64 = (file) => new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.onerror = () => resolve(event.target.result);
    };
    reader.onerror = () => resolve('');
  });

  const handleSaveProduct = async () => {
    // 1) If images selected, save them to localStorage as base64
    if (productImages.length > 0) {
      try {
        const category = productForm.category || (editingProduct?.category) || 'Karupatti';
        const base64Images = await Promise.all(productImages.map(fileToBase64));
        localStorage.setItem(`sm_product_images_${normalizeCategory(category)}`, JSON.stringify(base64Images));
        toast.success(`${base64Images.length} image(s) saved locally!`);
      } catch (err) {
        console.error('Failed to save images locally:', err);
        toast.error('Failed to save images locally (storage limit exceeded). Try a smaller image.');
      }
    }

    // 2) Send product data to backend (without images — no Cloudinary)
    const formData = new FormData();
    const productData = {
      name: productForm.name,
      description: productForm.description,
      pricePerKg: parseFloat(productForm.pricePerKg) || 0,
      category: productForm.category,
      stock: parseInt(productForm.stock, 10) || 0,
      benefits: productForm.benefits,
      isAvailable: productForm.isAvailable,
      isFeatured: productForm.isFeatured,
    };
    formData.append('data', new Blob([JSON.stringify(productData)], { type: 'application/json' }));
    try {
      if (editingProduct) {
        await productAPI.update(editingProduct.id || editingProduct._id, formData);
        toast.success('Product updated!');
      } else {
        await productAPI.create(formData);
        toast.success('Product created!');
      }
      setProductDialog(false);
      loadData();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to save product');
    }
  };


  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await productAPI.delete(id);
      toast.success('Product deleted');
      loadData();
    } catch { toast.error('Delete failed'); }
  };

  const handleDeleteContact = async (id) => {
    try { await contactAPI.delete(id); toast.success('Deleted'); loadData(); } catch { toast.error('Failed'); }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await contactAPI.markRead(id);
      loadData();
    } catch {
      toast.error('Failed to mark message as read');
    }
  };

  const STATUS_BG = {
    pending: 'rgba(237, 108, 2, 0.1)',
    confirmed: 'rgba(2, 136, 209, 0.1)',
    processing: 'rgba(2, 136, 209, 0.1)',
    shipped: 'rgba(21, 101, 192, 0.1)',
    delivered: 'rgba(46, 125, 50, 0.1)',
    cancelled: 'rgba(211, 47, 47, 0.1)'
  };

  const STATUS_TEXT = {
    pending: '#ed6c02',
    confirmed: '#0288d1',
    processing: '#0288d1',
    shipped: '#1565c0',
    delivered: '#2e7d32',
    cancelled: '#d32f2f'
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try { await adminAPI.deleteUser(id); toast.success('User deleted'); loadData(); } catch { toast.error('Failed'); }
  };

  const handleOrderStatus = async (id, status) => {
    try {
      await orderAPI.updateStatus(id, status.toUpperCase());
      toast.success('Status updated');
      loadData();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const TABS = [
    { label: 'Dashboard', icon: <Dashboard /> },
    { label: 'Products', icon: <Inventory /> },
    { label: 'Orders', icon: <ShoppingBag /> },
    { label: 'Users', icon: <People /> },
    { label: 'Messages', icon: <ContactMail /> },
  ];

  return (
    <>
      <Helmet><title>Admin Dashboard — SM Original Karupatti</title></Helmet>
      <Box sx={{ minHeight: '100vh', background: '#F8F1E9' }}>
        {/* Admin header */}
        <Box sx={{ background: 'linear-gradient(135deg, #1A0F00 0%, #3A1F0A 100%)', py: 2.5 }}>
          <Container maxWidth="xl" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <div style={{
              width: 44, height: 44,
              borderRadius: '50%',
              overflow: 'hidden',
              border: '2px solid rgba(212,160,23,0.6)',
              boxShadow: '0 2px 10px rgba(255,255,255,0.1)',
              background: 'white',
              flexShrink: 0,
            }}>
              <img src={SMLogoImg} alt="SM" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
            <Box>
              <Typography variant="h6" sx={{ color: 'white', fontFamily: 'Playfair Display', fontWeight: 700 }}>Admin Dashboard</Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>SM Original Karupatti</Typography>
            </Box>
          </Container>
        </Box>

        <Container maxWidth="xl" sx={{ py: 4 }}>
          {/* Tabs */}
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ mb: 4, bgcolor: 'white', borderRadius: 3, p: 0.5, boxShadow: 1, '& .Mui-selected': { color: '#5C3317 !important' }, '& .MuiTabs-indicator': { bgcolor: '#D4A017', height: 3, borderRadius: 2 } }}
          >
            {TABS.map((t) => <Tab key={t.label} label={t.label} icon={t.icon} iconPosition="start" sx={{ fontWeight: 600, minHeight: 52 }} />)}
          </Tabs>

          {loading && <LinearProgress sx={{ mb: 3, borderRadius: 2 }} />}

          {/* Dashboard tab */}
          {tab === 0 && analytics && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}><StatCard icon={<People />} title="Total Users" value={analytics.totalUsers} color="#5C3317" delay={0} /></Grid>
                <Grid item xs={12} sm={6} md={3}><StatCard icon={<Inventory />} title="Total Products" value={analytics.totalProducts} color="#D4A017" delay={0.1} /></Grid>
                <Grid item xs={12} sm={6} md={3}><StatCard icon={<ShoppingBag />} title="Total Orders" value={analytics.totalOrders} color="#2D6A2D" delay={0.2} /></Grid>
                <Grid item xs={12} sm={6} md={3}><StatCard icon={<TrendingUp />} title="Total Revenue" value={`₹${analytics.totalRevenue?.toFixed(0) || 0}`} color="#7B1FA2" delay={0.3} /></Grid>
              </Grid>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid rgba(92,51,23,0.08)' }}>
                    <Typography variant="h6" sx={{ fontFamily: 'Playfair Display', color: '#5C3317', fontWeight: 700, mb: 3 }}>Recent Orders</Typography>
                    {analytics.recentOrders?.map((o) => (
                      <Box key={o.id || o._id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, pb: 2, borderBottom: '1px solid rgba(92,51,23,0.05)' }}>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#5C3317' }}>{o.customerName}</Typography>
                          <Typography variant="caption" sx={{ color: '#8B6A4A' }}>{new Date(o.createdAt).toLocaleString()}</Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Chip label={o.status} size="small" color={STATUS_COLORS[o.status] || 'default'} />
                          <Typography variant="body2" sx={{ fontWeight: 700, color: '#5C3317', mt: 0.5 }}>₹{o.totalAmount}</Typography>
                        </Box>
                      </Box>
                    ))}
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid rgba(92,51,23,0.08)' }}>
                    <Typography variant="h6" sx={{ fontFamily: 'Playfair Display', color: '#5C3317', fontWeight: 700, mb: 3 }}>Quick Stats</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" sx={{ color: '#8B6A4A' }}>Unread Messages</Typography>
                      <Chip label={analytics.unreadContacts} size="small" color="error" />
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </motion.div>
          )}

          {/* Products tab */}
          {tab === 1 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h5" sx={{ fontFamily: 'Playfair Display', color: '#5C3317', fontWeight: 700 }}>Products ({products.length})</Typography>
                <Button startIcon={<Add />} variant="contained" color="primary" onClick={openAddProduct}>Add Product</Button>
              </Box>
              <TableContainer component={Paper} sx={{ borderRadius: 4, border: '1px solid rgba(92,51,23,0.08)' }}>
                <Table>
                  <TableHead sx={{ bgcolor: 'rgba(92,51,23,0.04)' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, color: '#5C3317' }}>Product</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#5C3317' }}>Category</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#5C3317' }}>Price/kg</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#5C3317' }}>Stock</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#5C3317' }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#5C3317' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {products.map((p) => (
                      <TableRow key={p.id || p._id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ width: 44, height: 44, borderRadius: 2, overflow: 'hidden' }}><img src={getProductImage(p)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></Box>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 700, color: '#5C3317' }}>{p.name}</Typography>
                              <Typography variant="caption" sx={{ color: '#8B6A4A' }}>ID: {String(p.id || p._id || '').slice(-6)}</Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell><Chip label={p.category} size="small" sx={{ bgcolor: 'rgba(45,106,45,0.1)', color: '#2D6A2D' }} /></TableCell>
                        <TableCell><Typography sx={{ fontWeight: 700, color: '#5C3317' }}>₹{p.pricePerKg}</Typography></TableCell>
                        <TableCell>{p.stock}</TableCell>
                        <TableCell><Chip label={p.isAvailable ? 'Available' : 'Unavailable'} size="small" color={p.isAvailable ? 'success' : 'error'} /></TableCell>
                        <TableCell>
                          <IconButton onClick={() => openEditProduct(p)} sx={{ color: '#D4A017' }}><Edit /></IconButton>
                          <IconButton onClick={() => handleDeleteProduct(p.id || p._id)} sx={{ color: 'error.main' }}><Delete /></IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </motion.div>
          )}

          {/* Orders tab */}
          {tab === 2 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Typography variant="h5" sx={{ fontFamily: 'Playfair Display', color: '#5C3317', fontWeight: 700, mb: 3 }}>Orders ({orders.length})</Typography>
              <TableContainer component={Paper} sx={{ borderRadius: 4, border: '1px solid rgba(92,51,23,0.08)' }}>
                <Table>
                  <TableHead sx={{ bgcolor: 'rgba(92,51,23,0.04)' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, color: '#5C3317' }}>Order ID</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#5C3317' }}>Customer & Items</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#5C3317' }}>Amount</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#5C3317' }}>Type</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#5C3317' }}>Date & Time</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#5C3317' }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#5C3317' }}>Update</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orders.slice((ordersPage - 1) * 10, ordersPage * 10).map((o) => (
                      <TableRow key={o.id || o._id} hover>
                        <TableCell><Typography variant="caption" sx={{ fontWeight: 700, fontFamily: 'monospace' }}>#{String(o.id || o._id || '').slice(-8).toUpperCase()}</Typography></TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>{o.customerName}</Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="caption" sx={{ color: '#8B6A4A' }}>{o.customerPhone}</Typography>
                            <IconButton
                              component="a"
                              href={`https://wa.me/91${o.customerPhone?.replace(/\D/g, '')}`}
                              target="_blank"
                              size="small"
                              sx={{ color: '#25D366', p: 0.2 }}
                              title="Chat on WhatsApp"
                            >
                              <WhatsApp sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Box>
                          <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {o.items?.map((item, idx) => {
                              const itemName = item.name || 'Original Karupatti';
                              const itemWeight = item.weightGrams || 1000;
                              const formattedWeight = itemWeight >= 1000 ? (itemWeight / 1000) + 'kg' : itemWeight + 'g';
                              return (
                                <Chip
                                  key={idx}
                                  label={`${itemName} (${formattedWeight}) × ${item.quantity}`}
                                  size="small"
                                  sx={{ bgcolor: 'rgba(92,51,23,0.06)', color: '#5C3317', fontSize: '0.7rem', height: 20 }}
                                />
                              );
                            })}
                          </Box>
                        </TableCell>
                        <TableCell><Typography sx={{ fontWeight: 700, color: '#5C3317' }}>₹{o.totalAmount?.toFixed(2)}</Typography></TableCell>
                        <TableCell><Chip label={o.orderType} size="small" sx={{ bgcolor: o.orderType === 'whatsapp' ? 'rgba(37,211,102,0.1)' : 'rgba(92,51,23,0.1)', color: o.orderType === 'whatsapp' ? '#25D366' : '#5C3317' }} /></TableCell>
                        <TableCell><Typography variant="caption">{new Date(o.createdAt).toLocaleString()}</Typography></TableCell>
                        <TableCell><Chip label={o.status} size="small" color={STATUS_COLORS[o.status?.toLowerCase()] || 'default'} /></TableCell>
                        <TableCell>
                          <Select
                            value={o.status?.toLowerCase()}
                            size="small"
                            onChange={(e) => handleOrderStatus(o.id || o._id, e.target.value)}
                            sx={{
                              minWidth: 120,
                              fontSize: '0.8rem',
                              bgcolor: STATUS_BG[o.status?.toLowerCase()] || 'transparent',
                              color: STATUS_TEXT[o.status?.toLowerCase()] || 'inherit',
                              fontWeight: 600,
                              borderRadius: 2,
                              '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: STATUS_TEXT[o.status?.toLowerCase()] || 'rgba(0,0,0,0.2)'
                              },
                              '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: STATUS_TEXT[o.status?.toLowerCase()] || 'rgba(0,0,0,0.2)'
                              }
                            }}
                          >
                            {['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => (
                              <MenuItem key={s} value={s} sx={{ fontSize: '0.8rem', textTransform: 'capitalize' }}>{s}</MenuItem>
                            ))}
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              {orders.length > 10 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                  <Pagination
                    count={Math.ceil(orders.length / 10)}
                    page={ordersPage}
                    onChange={(_, v) => setOrdersPage(v)}
                    sx={{ '& .MuiPaginationItem-root': { color: '#5C3317' }, '& .Mui-selected': { bgcolor: '#5C3317 !important', color: 'white' } }}
                  />
                </Box>
              )}
            </motion.div>
          )}

          {/* Users tab */}
          {tab === 3 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Typography variant="h5" sx={{ fontFamily: 'Playfair Display', color: '#5C3317', fontWeight: 700, mb: 3 }}>Users ({users.length})</Typography>
              <TableContainer component={Paper} sx={{ borderRadius: 4, border: '1px solid rgba(92,51,23,0.08)' }}>
                <Table>
                  <TableHead sx={{ bgcolor: 'rgba(92,51,23,0.04)' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, color: '#5C3317' }}>User</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#5C3317' }}>Email</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#5C3317' }}>Phone</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#5C3317' }}>Role</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#5C3317' }}>Joined</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#5C3317' }}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((u) => (
                      <TableRow key={u.id || u._id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar sx={{ bgcolor: '#5C3317', width: 32, height: 32, fontSize: '0.85rem' }}>{u.name?.charAt(0)}</Avatar>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>{u.name}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell><Typography variant="body2">{u.email}</Typography></TableCell>
                        <TableCell><Typography variant="body2">{u.phone || '—'}</Typography></TableCell>
                        <TableCell><Chip label={u.role} size="small" color={u.role === 'admin' ? 'error' : 'default'} /></TableCell>
                        <TableCell><Typography variant="caption">{new Date(u.createdAt).toLocaleDateString()}</Typography></TableCell>
                        <TableCell>
                          {u.role !== 'admin' && <IconButton onClick={() => handleDeleteUser(u.id || u._id)} sx={{ color: 'error.main' }}><Delete /></IconButton>}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </motion.div>
          )}

          {/* Contact messages tab */}
          {tab === 4 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Typography variant="h5" sx={{ fontFamily: 'Playfair Display', color: '#5C3317', fontWeight: 700, mb: 3 }}>Messages ({contacts.length})</Typography>
              {contacts.map((c) => (
                <Paper
                  key={c.id || c._id}
                  onClick={() => !c.isRead && handleMarkAsRead(c.id || c._id)}
                  sx={{
                    p: 3, mb: 2,
                    border: '1px solid rgba(92,51,23,0.08)',
                    borderRadius: 3,
                    borderLeft: c.isRead ? '4px solid #E0D0B8' : '4px solid #5C3317',
                    cursor: c.isRead ? 'default' : 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': !c.isRead ? { boxShadow: '0 4px 12px rgba(92,51,23,0.08)' } : {}
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, flexWrap: 'wrap', gap: 1 }}>
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 700, color: '#5C3317' }}>{c.name}</Typography>
                      <Typography variant="caption" sx={{ color: '#8B6A4A' }}>{c.email} · {c.phone}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <Chip label={c.isRead ? 'Read' : 'New'} size="small" color={c.isRead ? 'default' : 'error'} />
                      {!c.isRead && (
                        <Button
                          size="small"
                          variant="text"
                          onClick={(e) => { e.stopPropagation(); handleMarkAsRead(c.id || c._id); }}
                          sx={{ color: '#5C3317', fontWeight: 700, fontSize: '0.75rem', py: 0 }}
                        >
                          Mark Read
                        </Button>
                      )}
                      <Typography variant="caption" sx={{ color: '#8B6A4A' }}>{new Date(c.createdAt).toLocaleDateString()}</Typography>
                      <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleDeleteContact(c.id || c._id); }} sx={{ color: 'error.main' }}><Delete /></IconButton>
                    </Box>
                  </Box>
                  <Typography variant="body2" sx={{ color: '#5C4033', lineHeight: 1.7 }}>{c.message}</Typography>
                </Paper>
              ))}
            </motion.div>
          )}
        </Container>
      </Box>

      {/* Product Dialog */}
      <Dialog open={productDialog} onClose={() => setProductDialog(false)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
        <DialogTitle sx={{ fontFamily: 'Playfair Display', color: '#5C3317', fontWeight: 700 }}>
          {editingProduct ? 'Edit Product' : 'Add New Product'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={6}>
              <TextField label="Product Name" fullWidth value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })} label="Category">
                  {['Karupatti', 'Panangkarkandu', 'Tamarind'].map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField label="Description" multiline rows={3} fullWidth value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Price per KG (₹)" type="number" fullWidth value={productForm.pricePerKg} onChange={(e) => setProductForm({ ...productForm, pricePerKg: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Stock (kg)" type="number" fullWidth value={productForm.stock} onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Benefits (comma separated)" fullWidth value={productForm.benefits} onChange={(e) => setProductForm({ ...productForm, benefits: e.target.value })} placeholder="Rich in iron, Natural sweetener, ..." />
            </Grid>
            <Grid item xs={12}>
              {/* Show existing saved images with delete buttons */}
              {savedImages.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" sx={{ color: '#8B6A4A', fontWeight: 600, mb: 1, display: 'block' }}>Current Images (click ✕ to remove)</Typography>
                  <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                    {savedImages.map((src, i) => (
                      <Box key={i} sx={{ position: 'relative', width: 80, height: 80 }}>
                        <img src={src} alt={`img-${i}`} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, border: '2px solid rgba(92,51,23,0.2)' }} />
                        <Box
                          onClick={() => handleDeleteSavedImage(i)}
                          sx={{
                            position: 'absolute', top: -6, right: -6,
                            width: 22, height: 22, borderRadius: '50%',
                            bgcolor: '#d32f2f', color: 'white',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', fontSize: '13px', fontWeight: 700,
                            boxShadow: 2, '&:hover': { bgcolor: '#b71c1c' },
                          }}
                        >✕</Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
              <Button variant="outlined" component="label" fullWidth sx={{ py: 1.5, borderStyle: 'dashed', borderColor: '#5C3317', color: '#5C3317' }}>
                Upload Product Images
                <input type="file" multiple accept="image/*" hidden onChange={(e) => setProductImages(Array.from(e.target.files))} />
              </Button>
              {productImages.length > 0 && <Typography variant="caption" sx={{ color: '#2D6A2D', mt: 1, display: 'block' }}>{productImages.length} image(s) selected</Typography>}
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel control={<Switch checked={productForm.isAvailable} onChange={(e) => setProductForm({ ...productForm, isAvailable: e.target.checked })} sx={{ '& .Mui-checked': { color: '#5C3317' } }} />} label="Available" />
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel control={<Switch checked={productForm.isFeatured} onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })} />} label="Featured" />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setProductDialog(false)} color="inherit">Cancel</Button>
          <Button onClick={handleSaveProduct} variant="contained" color="primary" sx={{ fontWeight: 700 }}>
            {editingProduct ? 'Update Product' : 'Create Product'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
