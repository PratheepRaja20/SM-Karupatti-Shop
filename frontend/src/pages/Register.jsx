import { useState } from 'react';
import { Box, Typography, TextField, Button, Paper, Link as MuiLink, InputAdornment, IconButton, Divider } from '@mui/material';
import { Email, Lock, Person, Phone, Visibility, VisibilityOff } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../context/AuthContext';
import SMLogoImg from '../assets/sm-logo.png';
import KandImg from '../assets/kand.jpg';
import SMLogoCircle from '../components/SMLogoCircle';

const schema = yup.object({
  name: yup.string().required('Name is required').min(2, 'Too short'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().required('Phone number is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required(),
  confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required(),
});

export default function Register() {
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await registerUser({ name: data.name, email: data.email, phone: data.phone, password: data.password });
      toast.success(`Welcome, ${res.user.name}! 🌴`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>Register — SM Original Karupatti</title></Helmet>
      <Box sx={{ minHeight: '100vh', display: 'flex' }}>
        <Box
          sx={{
            flex: 1, display: { xs: 'none', md: 'flex' }, flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            background: `linear-gradient(135deg, rgba(45,106,45,0.85) 0%, rgba(26,15,0,0.8) 100%), url(${KandImg}) center/cover`,
            p: 6,
          }}
        >
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }} style={{ marginBottom: 32 }}>
            <SMLogoCircle size={120} />
          </motion.div>
          <Typography variant="h3" sx={{ fontFamily: 'Playfair Display', color: 'white', textAlign: 'center', fontWeight: 700, mb: 2 }}>
            Join SM Original Karupatti
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)', textAlign: 'center', lineHeight: 1.8 }}>
            Get exclusive access to premium natural products and special offers
          </Typography>
        </Box>

        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FDF6EC', p: { xs: 3, md: 6 } }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ width: '100%', maxWidth: 440 }}>
            <Box sx={{ display: { md: 'none' }, textAlign: 'center', mb: 4 }}>
              <SMLogoCircle size={80} style={{ margin: '0 auto' }} />
            </Box>

            <Typography variant="h4" sx={{ fontFamily: 'Playfair Display', color: '#5C3317', fontWeight: 800, mb: 0.5 }}>Create Account</Typography>
            <Typography variant="body1" sx={{ color: '#8B6A4A', mb: 4 }}>Join us and order fresh natural products</Typography>

            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
              <TextField label="Full Name" fullWidth sx={{ mb: 2.5 }} {...register('name')} error={!!errors.name} helperText={errors.name?.message}
                InputProps={{ startAdornment: <InputAdornment position="start"><Person sx={{ color: '#5C3317' }} /></InputAdornment> }} />
              <TextField label="Email Address" type="email" fullWidth sx={{ mb: 2.5 }} {...register('email')} error={!!errors.email} helperText={errors.email?.message}
                InputProps={{ startAdornment: <InputAdornment position="start"><Email sx={{ color: '#5C3317' }} /></InputAdornment> }} />
              <TextField label="Phone Number" fullWidth sx={{ mb: 2.5 }} {...register('phone')} error={!!errors.phone} helperText={errors.phone?.message}
                InputProps={{ startAdornment: <InputAdornment position="start"><Phone sx={{ color: '#5C3317' }} /></InputAdornment> }} />
              <TextField label="Password" type={showPass ? 'text' : 'password'} fullWidth sx={{ mb: 2.5 }} {...register('password')} error={!!errors.password} helperText={errors.password?.message}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Lock sx={{ color: '#5C3317' }} /></InputAdornment>,
                  endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowPass(!showPass)}>{showPass ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment>,
                }} />
              <TextField label="Confirm Password" type={showPass ? 'text' : 'password'} fullWidth sx={{ mb: 3 }} {...register('confirmPassword')} error={!!errors.confirmPassword} helperText={errors.confirmPassword?.message}
                InputProps={{ startAdornment: <InputAdornment position="start"><Lock sx={{ color: '#5C3317' }} /></InputAdornment> }} />

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button type="submit" variant="contained" color="primary" fullWidth size="large" disabled={loading} sx={{ py: 1.75, fontSize: '1rem', fontWeight: 700 }}>
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </motion.div>
            </Box>

            <Divider sx={{ my: 3 }}><Typography variant="body2" sx={{ color: '#8B6A4A' }}>or</Typography></Divider>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: '#8B6A4A' }}>
                Already have an account?{' '}
                <MuiLink component={Link} to="/login" sx={{ color: '#5C3317', fontWeight: 700, textDecoration: 'none' }}>Sign In</MuiLink>
              </Typography>
            </Box>
          </motion.div>
        </Box>
      </Box>
    </>
  );
}
