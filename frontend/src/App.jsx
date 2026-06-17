import { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import { AnimatePresence, motion } from 'framer-motion';
import theme from './theme/theme';
import { AuthProvider } from './context/AuthContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingButtons from './components/FloatingButtons';
import LoadingScreen from './components/LoadingScreen';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';
import { LangProvider } from './context/LangContext';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));

const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));

const Profile = lazy(() => import('./pages/Profile'));
const Contact = lazy(() => import('./pages/Contact'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

function PageWrapper({ children }) {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// Scroll to top on every route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AppContent() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');
  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <ScrollToTop />
      {!isAuthPage && !isAdminPage && <Navbar />}
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Suspense fallback={<LoadingScreen />}>
          <PageWrapper>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />

              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route path="/contact" element={<Contact />} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="/admin/*" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            </Routes>
          </PageWrapper>
        </Suspense>
      </Box>
      {!isAuthPage && !isAdminPage && <Footer />}
      {!isAuthPage && <FloatingButtons />}
    </Box>
  );
}

export default function App() {
  const [appLoading, setAppLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setAppLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <HelmetProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LangProvider>
        <AuthProvider>
            <Router>
              <AnimatePresence>
                {appLoading && <LoadingScreen key="loader" />}
              </AnimatePresence>
              {!appLoading && <AppContent />}
              <Toaster
                position="top-right"
                toastOptions={{
                  style: {
                    background: '#FDF6EC',
                    color: '#5C3317',
                    border: '1px solid rgba(92,51,23,0.15)',
                    borderRadius: 12,
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 500,
                  },
                  success: { iconTheme: { primary: '#2D6A2D', secondary: '#FDF6EC' } },
                  error: { iconTheme: { primary: '#d32f2f', secondary: '#FDF6EC' } },
                }}
              />
            </Router>
        </AuthProvider>
        </LangProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}
