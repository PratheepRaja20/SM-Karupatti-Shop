import { useState, useEffect, useRef } from 'react';
import {
  Box, Container, Grid, Typography, Button, Paper, Rating,
  Avatar, Stack, Chip,
} from '@mui/material';
import { motion, useInView, animate } from 'framer-motion';
import { ArrowForward } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { productAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import { useLang } from '../context/LangContext';
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

// Inject local frontend images by category
function getLocalImage(p) {
  const cat = normalizeCategory(p.category);
  const sid = String(p.id || p._id || '');
  if (cat === 'karupatti' || sid === '1') return [{ url: KarupattiImg }];
  if (cat === 'panangkarkandu' || sid === '2') return [{ url: KandImg }];
  if (cat === 'tamarind' || sid === '3') return [{ url: TamarindImg }];
  return [{ url: KarupattiImg }];
}

function normalizeProduct(p) {
  return {
    ...p,
    _id: String(p.id || p._id || ''),
    id: p.id || Number(p._id),
    images: getLocalImage(p),
    benefits: Array.isArray(p.benefits)
      ? p.benefits
      : typeof p.benefits === 'string'
        ? p.benefits.split(',').map(b => b.trim()).filter(Boolean)
        : [],
  };
}

const HERO_SLIDES = [
  { img: KarupattiImg, title: 'Pure Palm Jaggery', subtitle: 'Karupatti', tag: 'Traditional Sweetness' },
  { img: KandImg, title: 'Natural Palm Candy', subtitle: 'Panangkarkandu', tag: 'Therapeutic Goodness' },
  { img: TamarindImg, title: 'Premium Tamarind', subtitle: 'Puli', tag: 'Tangy Tradition' },
];

const STATS = [
  { value: 500, suffix: '+', labelKey: 'statsCustomers' },
  { value: 3, suffix: '', labelKey: 'statsProducts' },
  { value: 10, suffix: '+', labelKey: 'statsYears' },
];



// Animated counter using Framer Motion — no external CountUp needed
function StatCounter({ value, suffix, label }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(0, value, {
      duration: 2,
      ease: 'easeOut',
      onUpdate: (v) => setDisplay(Math.floor(v)),
    });
    return controls.stop;
  }, [isInView, value]);

  return (
    <Box ref={ref} sx={{ textAlign: 'center' }}>
      <Typography variant="h3" sx={{ fontFamily: 'Playfair Display', fontWeight: 800, color: '#D4A017' }}>
        {display}{suffix}
      </Typography>
      <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)', mt: 0.5 }}>
        {label}
      </Typography>
    </Box>
  );
}

export default function Home() {
  const [products, setProducts] = useState([]);
  const [heroIdx, setHeroIdx] = useState(0);
  const { t } = useLang();

  useEffect(() => {
    productAPI.getAll({ featured: 'true' })
      .then(({ data }) => {
        const list = data.products || data || [];
        if (list.length > 0) setProducts(list.map(normalizeProduct));
      })
      .catch(() => { });
    const timer = setInterval(() => setHeroIdx((i) => (i + 1) % HERO_SLIDES.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const current = HERO_SLIDES[heroIdx];

  return (
    <>
      <Helmet>
        <title>SM Original Karupatti —First Quality Original Palm Jaggery | Thisayanvilai</title>
        <meta name="description" content="Buy pure, natural Palm Jaggery (Karupatti), Palm Candy (Panangkarkandu), and Tamarind (Puli) from SM Original Karupatti, Thisayanvilai, Tamil Nadu. 5-star rated traditional products." />
      </Helmet>

      {/* ─── HERO ─── */}
      <Box sx={{ position: 'relative', height: '100vh', minHeight: 600, overflow: 'hidden' }}>
        {HERO_SLIDES.map((slide, i) => (
          <motion.div
            key={i}
            style={{ position: 'absolute', inset: 0 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: i === heroIdx ? 1 : 0 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
          >
            <Box
              sx={{
                position: 'absolute', inset: 0,
                backgroundImage: `url(${slide.img})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          </motion.div>
        ))}

        <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(26,15,0,0.75) 0%, rgba(26,15,0,0.4) 100%)' }} />

        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', alignItems: 'center' }}>
          <Box sx={{ maxWidth: 700 }}>
            <motion.div
              key={heroIdx}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <Chip label={current.tag} sx={{ bgcolor: '#D4A017', color: '#1A0F00', fontWeight: 700, mb: 3, fontSize: '0.85rem' }} />
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.5rem', md: '4rem', lg: '5rem' },
                  fontFamily: 'Playfair Display',
                  fontWeight: 800,
                  color: 'white',
                  lineHeight: 1.1,
                  mb: 1,
                }}
              >
                {current.title}
              </Typography>
              <Typography variant="h4" sx={{ color: '#D4A017', fontFamily: 'Playfair Display', fontStyle: 'italic', mb: 3 }}>
                {current.subtitle}
              </Typography>
              <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)', mb: 4, maxWidth: 500, lineHeight: 1.7, fontWeight: 400 }}>
                {t.home.heroSubtitle}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    component={Link} to="/products"
                    variant="contained" color="secondary"
                    size="large"
                    endIcon={<ArrowForward />}
                    sx={{ py: 1.75, px: 4, fontSize: '1rem', color: '#1A0F00', fontWeight: 700 }}
                  >
                    {t.home.shopNow}
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    component="a" href="https://wa.me/918825778001" target="_blank"
                    variant="outlined"
                    size="large"
                    sx={{ py: 1.75, px: 4, fontSize: '1rem', color: 'white', borderColor: 'white', borderWidth: 2, '&:hover': { borderColor: '#D4A017', color: '#D4A017', borderWidth: 2 } }}
                  >
                    {t.home.orderWhatsApp}
                  </Button>
                </motion.div>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 4 }}>
                <Rating value={5} readOnly sx={{ color: '#D4A017' }} />
                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>
                  {t.home.trustedBy}
                </Typography>
              </Box>
            </motion.div>
          </Box>
        </Container>

        {/* Logo watermark — circular */}
        <Box sx={{ position: 'absolute', bottom: 40, right: 40, display: { xs: 'none', md: 'block' }, zIndex: 2 }}>
          <motion.img
            src={SMLogoImg}
            alt="SM Logo"
            style={{
              width: 90, height: 90,
              borderRadius: '50%',
              objectFit: 'cover',
              opacity: 0.25,
              border: '2px solid rgba(255,255,255,0.4)',
            }}
            animate={{ rotate: [0, 5, 0, -5, 0] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
        </Box>

        {/* Hero dots */}
        <Box sx={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 1, zIndex: 3 }}>
          {HERO_SLIDES.map((_, i) => (
            <motion.div
              key={i}
              onClick={() => setHeroIdx(i)}
              style={{ cursor: 'pointer', borderRadius: 50, background: i === heroIdx ? '#D4A017' : 'rgba(255,255,255,0.4)' }}
              animate={{ width: i === heroIdx ? 32 : 10, height: 10 }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </Box>
      </Box>

      {/* ─── BRAND STORY ─── */}
      <Box className="organic-bg" sx={{ py: 10 }}>
        <Container maxWidth="xl">
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
                <Typography variant="overline" sx={{ color: '#D4A017', fontWeight: 700, letterSpacing: 3 }}>{t.home.ourStory}</Typography>
                <Typography variant="h2" sx={{ fontFamily: 'Playfair Display', color: '#5C3317', mt: 1, mb: 3, fontSize: { xs: '2rem', md: '3rem' } }}>
                  {t.home.fromPalmToTable}
                </Typography>
                <Typography variant="body1" sx={{ color: '#8B6A4A', lineHeight: 1.9, mb: 3 }}>
                  {t.home.storyP1}
                </Typography>
                <Typography variant="body1" sx={{ color: '#8B6A4A', lineHeight: 1.9, mb: 4 }}>
                  {t.home.storyP2}
                </Typography>
                <Button component={Link} to="/about" variant="contained" color="primary" endIcon={<ArrowForward />} size="large">
                  {t.home.learnMore}
                </Button>
              </motion.div>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
                <Grid container spacing={2}>
                  {[KarupattiImg, KandImg, TamarindImg, KarupattiImg].map((img, i) => (
                    <Grid size={6} key={i}>
                      <Box
                        className="img-zoom"
                        sx={{
                          borderRadius: i === 0 ? '60% 40% 40% 60% / 60% 60% 40% 40%' : i === 1 ? '40% 60% 60% 40% / 40% 40% 60% 60%' : i === 2 ? '60% 40% 60% 40% / 40% 60% 40% 60%' : '40% 60% 40% 60% / 60% 40% 60% 40%',
                          overflow: 'hidden',
                          height: 180,
                          boxShadow: 4,
                        }}
                      >
                        <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ─── STATS ─── */}
      <Box sx={{ background: 'linear-gradient(135deg, #5C3317 0%, #3A1F0A 100%)', py: 8 }}>
        <Container maxWidth="xl">
          <Grid container spacing={4} justifyContent="center">
            {STATS.map((stat, i) => (
              <Grid size={{ xs: 6, md: 3 }} key={i}>
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}>
                  <StatCounter value={stat.value} suffix={stat.suffix} label={t.home[stat.labelKey]} />
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ─── FEATURED PRODUCTS ─── */}
      <Box sx={{ py: 10, background: '#FFF8F0' }}>
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', mb: 7 }}>
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <Typography variant="overline" sx={{ color: '#D4A017', fontWeight: 700, letterSpacing: 3 }}>{t.home.ourProducts}</Typography>
              <Typography variant="h2" sx={{ fontFamily: 'Playfair Display', color: '#5C3317', mt: 1, fontSize: { xs: '2rem', md: '2.8rem' } }}>
                {t.home.premiumProducts}
              </Typography>
              <Box sx={{ width: 80, height: 4, bgcolor: '#D4A017', mx: 'auto', mt: 2, borderRadius: 2 }} />
            </motion.div>
          </Box>
          <Grid container spacing={4}>
            {(products.length > 0 ? products : [
              normalizeProduct({ _id: '1', id: 1, name: 'Karupatti (Palm Jaggery)', category: 'Karupatti', description: 'Pure, natural Palm Jaggery sourced directly from palm trees in Tirunelveli. Rich in minerals and completely unrefined.', pricePerKg: 220, ratings: 5, numReviews: 48, isAvailable: true, stock: 100, benefits: ['Rich in iron', 'Natural sweetener', 'Boosts immunity'] }),
              normalizeProduct({ _id: '2', id: 2, name: 'Panangkarkandu (Palm Candy)', category: 'Panangkarkandu', description: 'Authentic Palm Candy crystals made from pure palm sap. Naturally sweet with a distinctive flavor.', pricePerKg: 280, ratings: 5, numReviews: 32, isAvailable: true, stock: 100, benefits: ['Natural cough remedy', 'Rich in vitamins', 'Traditional medicine'] }),
              normalizeProduct({ _id: '3', id: 3, name: 'Tamarind (Puli)', category: 'Tamarind', description: 'Premium quality Tamarind from the fertile lands of Tirunelveli. Tangy, rich and perfect for cooking.', pricePerKg: 180, ratings: 5, numReviews: 25, isAvailable: true, stock: 100, benefits: ['Rich in antioxidants', 'Aids digestion', 'Vitamin C source'] }),
            ]).map((p, i) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={p._id || p.id}>
                <ProductCard product={p} index={i} />
              </Grid>
            ))}
          </Grid>
          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Button component={Link} to="/products" variant="contained" color="primary" size="large" endIcon={<ArrowForward />}>
              {t.home.viewAllProducts}
            </Button>
          </Box>
        </Container>
      </Box>



      {/* ─── CTA ─── */}
      <Box className="organic-bg" sx={{ py: 10 }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <Typography variant="overline" sx={{ color: '#D4A017', fontWeight: 700, letterSpacing: 3 }}>{t.home.getInTouch}</Typography>
            <Typography variant="h2" sx={{ fontFamily: 'Playfair Display', color: '#5C3317', mt: 1, mb: 2, fontSize: { xs: '2rem', md: '3rem' } }}>
              {t.home.orderFresh}
            </Typography>
            <Typography variant="h6" sx={{ color: '#8B6A4A', mb: 5, fontWeight: 400, lineHeight: 1.7 }}>
              {t.home.orderFreshDesc}
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button
                component="a" href="https://wa.me/918825778001" target="_blank"
                variant="contained"
                size="large"
                sx={{ bgcolor: '#25D366', '&:hover': { bgcolor: '#1da851' }, py: 2, px: 5, fontSize: '1.05rem' }}
              >
                {t.home.whatsappUs}
              </Button>
              <Button
                component={Link} to="/contact"
                variant="contained" color="primary"
                size="large"
                sx={{ py: 2, px: 5, fontSize: '1.05rem' }}
              >
                {t.home.sendMessage}
              </Button>
            </Stack>
          </motion.div>
        </Container>
      </Box>
    </>
  );
}
