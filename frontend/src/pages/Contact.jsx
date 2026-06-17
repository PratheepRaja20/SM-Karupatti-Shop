import { useState } from 'react';
import {
  Box, Container, Grid, Typography, TextField, Button, Paper, Alert,
  InputAdornment, Snackbar,
} from '@mui/material';
import { Person, Phone, Email, Message, LocationOn, WhatsApp } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Helmet } from 'react-helmet-async';
import { contactAPI } from '../services/api';
import { useLang } from '../context/LangContext';

const schema = yup.object({
  name: yup.string().required('Name is required').min(2, 'Too short'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().required('Phone number is required'),
  message: yup.string().required('Message is required').min(10, 'Too short'),
});

const CONTACT_INFO = [
  { icon: <LocationOn sx={{ fontSize: 28, color: '#D4A017' }} />, title: 'Address', value: 'Tisayanvilai - Udangudi Road, Thisayanvilai, Tamil Nadu - 627657', href: 'https://share.google/dH4k9x8ogWPACxWtD' },
  { icon: <Phone sx={{ fontSize: 28, color: '#D4A017' }} />, title: 'Phone', value: '+91 9976941156', href: 'tel:+919976941156' },
  { icon: <WhatsApp sx={{ fontSize: 28, color: '#25D366' }} />, title: 'WhatsApp', value: '+91 8825778001', href: 'https://wa.me/918825778001' },
  { icon: <Email sx={{ fontSize: 28, color: '#D4A017' }} />, title: 'Email', value: 'smkarupattishop@gmail.com', href: 'https://mail.google.com/mail/?view=cm&to=smkarupattishop@gmail.com' },
];

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const { t } = useLang();

  const { register, handleSubmit, reset, formState: { errors } } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      await contactAPI.submit(data);
      setSuccess(true);
      reset();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Us — SM Original Karupatti</title>
        <meta name="description" content="Contact SM Original Karupatti. Located in Thisayanvilai, Tamil Nadu. Call or WhatsApp +91 9976941156." />
      </Helmet>

      {/* Header */}
      <Box sx={{ background: 'linear-gradient(135deg, #5C3317 0%, #3A1F0A 100%)', py: 10, pt: { xs: 14, md: 18 } }}>
        <Container maxWidth="xl">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <Typography variant="overline" sx={{ color: '#D4A017', fontWeight: 700, letterSpacing: 3 }}>{t.contact.getInTouch}</Typography>
            <Typography variant="h2" sx={{ fontFamily: 'Playfair Display', color: 'white', mt: 1, fontSize: { xs: '2rem', md: '3rem' } }}>
              {t.contact.contactUs}
            </Typography>
          </motion.div>
        </Container>
      </Box>

      <Box className="organic-bg" sx={{ py: 8 }}>
        <Container maxWidth="xl">
          <Grid container spacing={6}>
            {/* Contact info */}
            <Grid size={{ xs: 12, md: 5 }}>
              <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                <Typography variant="h4" sx={{ fontFamily: 'Playfair Display', color: '#5C3317', fontWeight: 700, mb: 3 }}>
                  {t.contact.letsConnect}
                </Typography>
                <Typography variant="body1" sx={{ color: '#8B6A4A', mb: 5, lineHeight: 1.9 }}>
                  {t.contact.contactDesc}
                </Typography>

                <Grid container spacing={3}>
                  {[
                    { icon: <LocationOn sx={{ fontSize: 28, color: '#D4A017' }} />, title: t.contact.address, value: 'Tisayanvilai - Udangudi Road, Thisayanvilai, Tamil Nadu - 627657', href: 'https://share.google/dH4k9x8ogWPACxWtD' },
                    { icon: <Phone sx={{ fontSize: 28, color: '#D4A017' }} />, title: t.contact.phone, value: '+91 9976941156', href: 'tel:+919976941156' },
                    { icon: <WhatsApp sx={{ fontSize: 28, color: '#25D366' }} />, title: t.contact.whatsapp, value: '+91 8825778001', href: 'https://wa.me/918825778001' },
                    { icon: <Email sx={{ fontSize: 28, color: '#D4A017' }} />, title: t.contact.email, value: 'smkarupattishop@gmail.com', href: 'https://mail.google.com/mail/?view=cm&to=smkarupattishop@gmail.com' },
                  ].map((info, i) => (
                    <Grid size={12} key={i}>
                      <motion.div whileHover={{ x: 8 }} transition={{ duration: 0.2 }}>
                        <Paper
                          component={info.href ? 'a' : 'div'}
                          href={info.href}
                          target={info.href?.startsWith('http') ? '_blank' : undefined}
                          sx={{
                            p: 3, display: 'flex', gap: 2, alignItems: 'flex-start',
                            border: '1px solid rgba(92,51,23,0.08)', textDecoration: 'none',
                            cursor: info.href ? 'pointer' : 'default',
                            transition: 'all 0.2s',
                            '&:hover': info.href ? { borderColor: '#D4A017', bgcolor: 'rgba(212,160,23,0.03)' } : {},
                          }}
                        >
                          <Box sx={{ mt: 0.5 }}>{info.icon}</Box>
                          <Box>
                            <Typography variant="overline" sx={{ color: '#8B6A4A', fontWeight: 700, letterSpacing: 1.5, fontSize: '0.7rem' }}>{info.title}</Typography>
                            <Typography variant="body1" sx={{ color: '#5C3317', fontWeight: 500, mt: 0.3 }}>{info.value}</Typography>
                          </Box>
                        </Paper>
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              </motion.div>
            </Grid>
 
            {/* Contact form */}
            <Grid size={{ xs: 12, md: 7 }}>
              <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, border: '1px solid rgba(92,51,23,0.1)' }}>
                  <Typography variant="h5" sx={{ fontFamily: 'Playfair Display', color: '#5C3317', fontWeight: 700, mb: 4 }}>
                    {t.contact.sendUsMessage}
                  </Typography>
 
                  {success && (
                    <Alert severity="success" sx={{ mb: 3, borderRadius: 3 }}>
                      {t.contact.successMsg}
                    </Alert>
                  )}
                  {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>{error}</Alert>}
 
                  <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField label={t.contact.yourName} fullWidth {...register('name')} error={!!errors.name} helperText={errors.name?.message}
                          InputProps={{ startAdornment: <InputAdornment position="start"><Person sx={{ color: '#5C3317' }} /></InputAdornment> }} />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField label={t.contact.mobileNumber} fullWidth {...register('phone')} error={!!errors.phone} helperText={errors.phone?.message}
                          InputProps={{ startAdornment: <InputAdornment position="start"><Phone sx={{ color: '#5C3317' }} /></InputAdornment> }} />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <TextField label={t.contact.emailAddress} type="email" fullWidth {...register('email')} error={!!errors.email} helperText={errors.email?.message}
                          InputProps={{ startAdornment: <InputAdornment position="start"><Email sx={{ color: '#5C3317' }} /></InputAdornment> }} />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <TextField label={t.contact.yourMessage} multiline rows={5} fullWidth {...register('message')} error={!!errors.message} helperText={errors.message?.message}
                          InputProps={{ startAdornment: <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}><Message sx={{ color: '#5C3317' }} /></InputAdornment> }} />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button type="submit" variant="contained" color="primary" size="large" fullWidth disabled={loading} sx={{ py: 1.75, fontWeight: 700, fontSize: '1rem' }}>
                            {loading ? t.contact.sending : t.contact.sendMessageBtn}
                          </Button>
                        </motion.div>
                      </Grid>
                    </Grid>
                  </Box>
                </Paper>
              </motion.div>
            </Grid>
          </Grid>
        </Container>

        {/* Interactive Google Map */}
        <Container maxWidth="xl" sx={{ mt: 8 }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
            <Typography variant="h4" sx={{ fontFamily: 'Playfair Display', color: '#5C3317', fontWeight: 700, mb: 4, textAlign: 'center' }}>
              Location
            </Typography>
            <Paper 
              sx={{ borderRadius: 4, overflow: 'hidden', border: '1px solid rgba(92,51,23,0.1)', height: { xs: 300, md: 450 }, display: 'block', position: 'relative' }}
            >
              <iframe
                src="https://maps.google.com/maps?q=8.3361797,77.8659716&t=k&z=17&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="SM Original Karupatti Store Location"
              />
              <a 
                href="https://www.google.com/maps/dir//SM+karupatti+shop,+Tisayanvilai+-+Udangudi+Rd,+Thisayanvilai,+Tamil+Nadu+627657/@13.0475255,80.2086732,10z/data=!4m8!4m7!1m0!1m5!1m1!1s0x3b047f9029d81585:0x66468f115f493d0b!2m2!1d77.8659716!2d8.3361797?entry=ttu&g_ep=EgoyMDI2MDYxMy4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  zIndex: 10,
                  cursor: 'pointer'
                }}
                aria-label="Get directions to SM Original Karupatti Store"
              />
            </Paper>
          </motion.div>
        </Container>
      </Box>
    </>
  );
}
