import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar, Toolbar, Box, IconButton, Drawer, List, ListItem,
  ListItemText, ListItemIcon, Avatar, Menu, MenuItem, Divider, Container,
  useScrollTrigger, Tooltip,
} from '@mui/material';
import {
  Menu as MenuIcon, Close, Home, Info, Store,
  ContactPhone, Person, Logout, Dashboard, Phone,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

import { useLang } from '../context/LangContext';
import SMLogoImg from '../assets/sm-logo.png';

const navLinks = [
  { label: 'Home', path: '/', icon: <Home /> },
  { label: 'Products', path: '/products', icon: <Store /> },
  { label: 'About', path: '/about', icon: <Info /> },
  { label: 'Contact', path: '/contact', icon: <ContactPhone /> },
];

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout, isAdmin } = useAuth();

  const { lang, toggle, t } = useLang();
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { label: t.nav.home, path: '/', icon: <Home /> },
    { label: t.nav.products, path: '/products', icon: <Store /> },
    { label: t.nav.about, path: '/about', icon: <Info /> },
    { label: t.nav.contact, path: '/contact', icon: <ContactPhone /> },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setAnchorEl(null);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: scrolled
            ? 'rgba(255,252,245,0.92)'
            : 'rgba(255,252,245,0.75)',
          backdropFilter: 'blur(16px)',
          borderBottom: scrolled ? '1px solid rgba(92,51,23,0.1)' : 'none',
          transition: 'all 0.4s ease',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: 'space-between', py: 0.5 }}>
            {/* Logo */}
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', gap: 10 }}>
                <div style={{
                  width: 52, height: 52,
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '2px solid rgba(212,160,23,0.4)',
                  boxShadow: '0 2px 10px rgba(92,51,23,0.18)',
                  background: 'white',
                  flexShrink: 0,
                }}>
                  <img src={SMLogoImg} alt="SM Original Karupatti" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </div>
              </Link>
            </motion.div>

            {/* Desktop Nav */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.5, alignItems: 'center' }}>
              {navLinks.map((link) => (
                <motion.div key={link.path} whileHover={{ y: -2 }}>
                  <Link
                    to={link.path}
                    style={{
                      textDecoration: 'none',
                      padding: '8px 16px',
                      borderRadius: 50,
                      fontSize: '0.9rem',
                      fontWeight: isActive(link.path) ? 700 : 500,
                      color: isActive(link.path) ? '#5C3317' : '#5C4033',
                      background: isActive(link.path) ? 'rgba(92,51,23,0.08)' : 'transparent',
                      transition: 'all 0.2s',
                      display: 'block',
                    }}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              {/* Language Toggle */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Box
                  onClick={toggle}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    ml: 1,
                    cursor: 'pointer',
                    borderRadius: 50,
                    border: '1.5px solid rgba(92,51,23,0.25)',
                    overflow: 'hidden',
                    userSelect: 'none',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    height: 32,
                  }}
                >
                  <Box sx={{ px: 1.5, py: 0.5, bgcolor: lang === 'en' ? '#5C3317' : 'transparent', color: lang === 'en' ? 'white' : '#5C3317', transition: 'all 0.3s' }}>EN</Box>
                  <Box sx={{ px: 1.5, py: 0.5, bgcolor: lang === 'ta' ? '#5C3317' : 'transparent', color: lang === 'ta' ? 'white' : '#5C3317', transition: 'all 0.3s', fontFamily: 'inherit' }}>தமிழ்</Box>
                </Box>
              </motion.div>
            </Box>

            {/* Right Icons */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>

              {/* User menu */}
              {user ? (
                <>
                  <Tooltip title={user.name}>
                    <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                      <Avatar
                        sx={{
                          width: 36,
                          height: 36,
                          bgcolor: '#5C3317',
                          fontSize: '0.85rem',
                          fontWeight: 700,
                        }}
                      >
                        {user.name?.charAt(0)?.toUpperCase()}
                      </Avatar>
                    </IconButton>
                  </Tooltip>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={() => setAnchorEl(null)}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    PaperProps={{
                      sx: { mt: 1, borderRadius: 3, minWidth: 180, boxShadow: '0 8px 30px rgba(92,51,23,0.15)' },
                    }}
                  >
                    <MenuItem component={Link} to="/profile" onClick={() => setAnchorEl(null)}>
                      <ListItemIcon><Person fontSize="small" /></ListItemIcon>
                      {t.nav.myProfile}
                    </MenuItem>
                    {isAdmin && (
                      <MenuItem component={Link} to="/admin" onClick={() => setAnchorEl(null)}>
                        <ListItemIcon><Dashboard fontSize="small" /></ListItemIcon>
                        {t.nav.adminPanel}
                      </MenuItem>
                    )}
                    <Divider />
                    <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                      <ListItemIcon><Logout fontSize="small" color="error" /></ListItemIcon>
                      {t.nav.logout}
                    </MenuItem>
                  </Menu>
                </>
              ) : null}

              {/* Mobile hamburger */}
              <IconButton
                sx={{ display: { md: 'none' }, color: '#5C3317' }}
                onClick={() => setDrawerOpen(true)}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: 280, background: '#FDF6EC' } }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <div style={{
              width: 44, height: 44,
              borderRadius: '50%',
              overflow: 'hidden',
              border: '2px solid rgba(212,160,23,0.4)',
              boxShadow: '0 2px 8px rgba(92,51,23,0.15)',
              background: 'white',
              flexShrink: 0,
            }}>
              <img src={SMLogoImg} alt="SM Karupatti" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
            <IconButton onClick={() => setDrawerOpen(false)}><Close /></IconButton>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <List>
            {navLinks.map((link) => (
              <ListItem
                key={link.path}
                component={Link}
                to={link.path}
                onClick={() => setDrawerOpen(false)}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  color: isActive(link.path) ? '#5C3317' : '#5C4033',
                  bgcolor: isActive(link.path) ? 'rgba(92,51,23,0.08)' : 'transparent',
                  textDecoration: 'none',
                  '&:hover': { bgcolor: 'rgba(92,51,23,0.05)' },
                }}
              >
                <ListItemIcon sx={{ color: '#5C3317', minWidth: 36 }}>{link.icon}</ListItemIcon>
                <ListItemText primary={link.label} primaryTypographyProps={{ fontWeight: isActive(link.path) ? 700 : 500 }} />
              </ListItem>
            ))}
          </List>
          {/* Mobile Language Toggle */}
          <Box
            onClick={toggle}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              borderRadius: 50,
              border: '1.5px solid rgba(92,51,23,0.25)',
              overflow: 'hidden',
              userSelect: 'none',
              fontSize: '0.85rem',
              fontWeight: 700,
              mx: 1,
              mb: 1,
            }}
          >
            <Box sx={{ flex: 1, textAlign: 'center', py: 1, bgcolor: lang === 'en' ? '#5C3317' : 'transparent', color: lang === 'en' ? 'white' : '#5C3317', transition: 'all 0.3s' }}>EN</Box>
            <Box sx={{ flex: 1, textAlign: 'center', py: 1, bgcolor: lang === 'ta' ? '#5C3317' : 'transparent', color: lang === 'ta' ? 'white' : '#5C3317', transition: 'all 0.3s' }}>தமிழ்</Box>
          </Box>
          <Divider sx={{ my: 2 }} />
          {user ? (
            <Box>
              <ListItem component={Link} to="/profile" onClick={() => setDrawerOpen(false)} sx={{ borderRadius: 2, textDecoration: 'none', color: '#5C4033' }}>
                <ListItemIcon sx={{ minWidth: 36 }}><Person /></ListItemIcon>
                <ListItemText primary="My Profile" />
              </ListItem>
              {isAdmin && (
                <ListItem component={Link} to="/admin" onClick={() => setDrawerOpen(false)} sx={{ borderRadius: 2, textDecoration: 'none', color: '#5C4033' }}>
                  <ListItemIcon sx={{ minWidth: 36 }}><Dashboard /></ListItemIcon>
                  <ListItemText primary="Admin Panel" />
                </ListItem>
              )}
              <ListItem button onClick={() => { handleLogout(); setDrawerOpen(false); }} sx={{ borderRadius: 2, color: 'error.main' }}>
                <ListItemIcon sx={{ minWidth: 36 }}><Logout color="error" /></ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItem>
            </Box>
          ) : null}
          <Box
            component="a"
            href="tel:+919976941156"
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              mt: 2,
              p: 1.5,
              borderRadius: 3,
              border: '2px solid #5C3317',
              color: '#5C3317',
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            <Phone /> +91 9976941156
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
