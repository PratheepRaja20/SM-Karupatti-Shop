import { Box, Container, Grid, Typography, Link, Divider, IconButton, Stack } from '@mui/material';
import { Phone, Email, LocationOn, WhatsApp } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLang } from '../context/LangContext';
import SMLogoImg from '../assets/sm-logo.png';

export default function Footer() {
  const { t } = useLang();

  const footerLinks = [
    { label: t.nav.home, path: '/' },
    { label: t.nav.products, path: '/products' },
    { label: t.nav.about, path: '/about' },
    { label: t.nav.contact, path: '/contact' },
  ];
  return (
    <Box
      component="footer"
      sx={{
        background: 'linear-gradient(135deg, #1A0F00 0%, #3A1F0A 50%, #1A0F00 100%)',
        color: 'rgba(255,255,255,0.85)',
        pt: 7,
        pb: 3,
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={5}>
          {/* Brand */}
          <Grid size={{ xs: 12, md: 4 }}>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              {/* Circular logo in footer */}
              <img
                src={SMLogoImg}
                alt="SM Original Karupatti"
                style={{
                  width: 70, height: 70,
                  objectFit: 'cover',
                  borderRadius: '50%',
                  border: '2px solid rgba(212,160,23,0.5)',
                  boxShadow: '0 0 20px rgba(212,160,23,0.2)',
                  background: 'white',
                  marginBottom: 16,
                  display: 'block',
                }}
              />
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.65)', lineHeight: 1.8, maxWidth: 300 }}>
                {t.footer.tagline}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1.5, mt: 3 }}>
                <motion.div whileHover={{ scale: 1.1, rotate: 5 }}>
                  <IconButton
                    component="a" href="https://wa.me/918825778001" target="_blank"
                    sx={{ bgcolor: '#25D366', color: 'white', '&:hover': { bgcolor: '#1da851' } }}
                  >
                    <WhatsApp />
                  </IconButton>
                </motion.div>
                <motion.div whileHover={{ scale: 1.1, rotate: -5 }}>
                  <IconButton
                    component="a" href="tel:+919976941156"
                    sx={{ bgcolor: '#5C3317', color: 'white', '&:hover': { bgcolor: '#7D4A28' } }}
                  >
                    <Phone />
                  </IconButton>
                </motion.div>
              </Box>
            </motion.div>
          </Grid>

          {/* Quick Links */}
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <Typography variant="h6" sx={{ color: '#D4A017', mb: 2.5, fontFamily: 'Playfair Display' }}>
              {t.footer.quickLinks}
            </Typography>
            <Stack spacing={1}>
              {footerLinks.map((link) => (
                <Link
                  key={link.path}
                  component={RouterLink}
                  to={link.path}
                  underline="none"
                  sx={{
                    color: 'rgba(255,255,255,0.65)',
                    fontSize: '0.9rem',
                    transition: 'color 0.2s',
                    '&:hover': { color: '#D4A017' },
                  }}
                >
                  → {link.label}
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Products */}
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <Typography variant="h6" sx={{ color: '#D4A017', mb: 2.5, fontFamily: 'Playfair Display' }}>
              {t.footer.ourProducts}
            </Typography>
            <Stack spacing={1}>
              {['Karupatti (Palm Jaggery)', 'Panangkarkandu (Palm Candy)', 'Tamarind (Puli)'].map((p) => (
                <Typography key={p} variant="body2" sx={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.875rem' }}>
                  🌴 {p}
                </Typography>
              ))}
            </Stack>
          </Grid>

          {/* Contact */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h6" sx={{ color: '#D4A017', mb: 2.5, fontFamily: 'Playfair Display' }}>
              {t.footer.contactUs}
            </Typography>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                <LocationOn sx={{ color: '#D4A017', mt: 0.3, flexShrink: 0 }} />
                <Link
                  href="https://share.google/dH4k9x8ogWPACxWtD"
                  target="_blank"
                  underline="none"
                  sx={{
                    color: 'rgba(255,255,255,0.65)',
                    lineHeight: 1.7,
                    transition: 'color 0.2s',
                    '&:hover': { color: '#D4A017' }
                  }}
                >
                  Tisayanvilai - Udangudi Road,<br />
                  Thisayanvilai, Tamil Nadu - 627657
                </Link>
              </Box>
              <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                <Phone sx={{ color: '#D4A017' }} />
                <Link href="tel:+919976941156" underline="none" sx={{ color: 'rgba(255,255,255,0.65)', '&:hover': { color: '#D4A017' } }}>
                  +91 9976941156
                </Link>
              </Box>
              <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                <WhatsApp sx={{ color: '#25D366' }} />
                <Link href="https://wa.me/918825778001" target="_blank" underline="none" sx={{ color: 'rgba(255,255,255,0.65)', '&:hover': { color: '#25D366' } }}>
                  {t.common.chatWhatsApp}
                </Link>
              </Box>
              <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                <Email sx={{ color: '#D4A017' }} />
                <Link href="https://mail.google.com/mail/?view=cm&to=smkarupattishop@gmail.com" target="_blank" underline="none" sx={{ color: 'rgba(255,255,255,0.65)', '&:hover': { color: '#D4A017' } }}>
                  smkarupattishop@gmail.com
                </Link>
              </Box>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 4 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.8rem' }}>
            © {new Date().getFullYear()} {t.footer.copyright}
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.8rem' }}>
            {t.footer.tagline2}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
