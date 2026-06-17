import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CircularProgress, Box } from '@mui/material';

export function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress sx={{ color: '#5C3317' }} /></Box>;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress sx={{ color: '#5C3317' }} /></Box>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
}
