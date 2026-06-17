import { useState } from 'react';
import { Box, Typography, TextField, Button, Link as MuiLink, InputAdornment, IconButton } from '@mui/material';
import { Email, Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../context/AuthContext';
import SMLogoImg from '../assets/sm-logo.png';
import KarupattiImg from '../assets/karupatti.jpg';
import SMLogoCircle from '../components/SMLogoCircle';

const schema = yup.object({
  email: yup.string().required('Email or Username is required'),
  password: yup.string().required('Password is required'),
});

export default function Login() {
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await login(data.email, data.password);
      toast.success(`Welcome back, ${res.user.name}! 🌴`);
      navigate(res.user.role === 'admin' ? '/admin' : from);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>Login — SM Original Karupatti</title></Helmet>
      <Box sx={{ minHeight: '100vh', display: 'flex' }}>
        {/* Left: Image panel */}
        <Box
          sx={{
            flex: 1, display: { xs: 'none', md: 'flex' }, flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            background: `linear-gradient(135deg, rgba(26,15,0,0.8) 0%, rgba(92,51,23,0.6) 100%), url(${KarupattiImg}) center/cover`,
            p: 6,
          }}
        >
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }} style={{ marginBottom: 32 }}>
            <SMLogoCircle size={120} />
          </motion.div>
          <Typography variant="h3" sx={{ fontFamily: 'Playfair Display', color: 'white', textAlign: 'center', fontWeight: 700, mb: 2 }}>
            SM Original Karupatti
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)', textAlign: 'center', lineHeight: 1.8 }}>
            First Quality Original Karupatti from the Land of Tradition
          </Typography>
        </Box>

        {/* Right: Form */}
        <Box
          sx={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: '#FDF6EC', p: { xs: 3, md: 6 },
          }}
        >
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ width: '100%', maxWidth: 440 }}>
            {/* Mobile logo */}
            <Box sx={{ display: { md: 'none' }, textAlign: 'center', mb: 4 }}>
              <SMLogoCircle size={80} style={{ margin: '0 auto' }} />
            </Box>

            <Typography variant="h4" sx={{ fontFamily: 'Playfair Display', color: '#5C3317', fontWeight: 800, mb: 0.5 }}>
              Welcome Back!
            </Typography>
            <Typography variant="body1" sx={{ color: '#8B6A4A', mb: 4 }}>
              Sign in to your account to continue
            </Typography>

            <Box component="form" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
              <TextField
                label="Email Address"
                type="text"
                fullWidth
                sx={{ mb: 3 }}
                autoComplete="off"
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
                InputProps={{ startAdornment: <InputAdornment position="start"><Email sx={{ color: '#5C3317' }} /></InputAdornment> }}
              />
              <TextField
                label="Password"
                type={showPass ? 'text' : 'password'}
                fullWidth
                sx={{ mb: 1 }}
                autoComplete="new-password"
                {...register('password')}
                error={!!errors.password}
                helperText={errors.password?.message}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Lock sx={{ color: '#5C3317' }} /></InputAdornment>,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPass(!showPass)}>{showPass ? <VisibilityOff /> : <Visibility />}</IconButton>
                    </InputAdornment>
                  ),
                }}
              />


              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button type="submit" variant="contained" color="primary" fullWidth size="large" disabled={loading}
                  sx={{ py: 1.75, fontSize: '1rem', fontWeight: 700 }}>
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </motion.div>
            </Box>
          </motion.div>
        </Box>
      </Box>
    </>
  );
}
