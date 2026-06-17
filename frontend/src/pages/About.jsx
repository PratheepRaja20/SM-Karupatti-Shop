import { Box, Container, Grid, Typography, Paper, Button, Chip, Stack, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  CheckCircle, EmojiNature, NaturePeople, Favorite,
  LocationOn, Phone, ArrowForward,
} from '@mui/icons-material';
import { useLang } from '../context/LangContext';
import SMLogoImg from '../assets/sm-logo.png';
import KarupattiImg from '../assets/karupatti.jpg';
import KandImg from '../assets/kand.jpg';
import TamarindImg from '../assets/tamarind.jpg';

export default function About() {
  const { t, lang } = useLang();

  const VALUES = [
    { icon: <EmojiNature sx={{ fontSize: 44 }} />, title: t.about.valNaturalTitle, desc: t.about.valNaturalDesc },
    { icon: <NaturePeople sx={{ fontSize: 44 }} />, title: t.about.valTradTitle, desc: t.about.valTradDesc },
    { icon: <Favorite sx={{ fontSize: 44 }} />, title: t.about.valLoveTitle, desc: t.about.valLoveDesc },
    { icon: <CheckCircle sx={{ fontSize: 44 }} />, title: t.about.valQualityTitle, desc: t.about.valQualityDesc },
  ];

  const PRODUCTS = [
    { img: KarupattiImg, name: t.prodNames.karupatti, subname: t.about.karupattiSub, price: t.about.karupattiPrice, desc: t.prodNames.karupattiDesc, color: '#8B4513' },
    { img: KandImg, name: t.prodNames.kand, subname: t.about.kandSub, price: t.about.kandPrice, desc: t.prodNames.kandDesc, color: '#D4A017' },
    { img: TamarindImg, name: t.prodNames.tamarind, subname: t.about.tamarindSub, price: t.about.tamarindPrice, desc: t.prodNames.tamarindDesc, color: '#6B4226' },
  ];

  const MILESTONES = [
    { year: '10+', label: t.about.yearsOfExperience },
    { year: '500+', label: t.about.happyCustomers },
    { year: '3', label: t.about.premiumProducts },
  ];

  const tags = lang === 'en'
    ? ['100% Natural', 'No Preservatives', 'Traditional Methods', 'Direct from Source']
    : ['100% இயற்கையானது', 'பதப்படுத்திகள் இல்லை', 'பாரம்பரிய முறைகள்', 'நேரடி தயாரிப்பு', 'இந்தியா முழுவதும் டெலிவரி'];

  return (
    <>
      <Helmet>
        <title>{t.about.aboutUs} — SM Original Karupatti | Thisayanvilai</title>
        <meta name="description" content="Learn about SM Original Karupatti - the story, values, and mission behind Tirunelveli's finest natural palm products." />
      </Helmet>

      {/* ─── HERO ─── */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1A0F00 0%, #3A1F0A 50%, #5C3317 100%)',
          py: { xs: 10, md: 14 },
          pt: { xs: 14, md: 18 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative rings */}
        {[200, 350, 500].map((size, i) => (
          <Box
            key={i}
            sx={{
              position: 'absolute',
              right: -size / 3,
              top: '50%',
              transform: 'translateY(-50%)',
              width: size,
              height: size,
              borderRadius: '50%',
              border: `1px solid rgba(212,160,23,${0.12 - i * 0.03})`,
              pointerEvents: 'none',
            }}
          />
        ))}

        {/* Circular logo watermark — top right */}
        <Box
          sx={{
            position: 'absolute',
            right: { xs: 20, md: 80 },
            top: '50%',
            transform: 'translateY(-50%)',
            display: { xs: 'none', md: 'block' },
            opacity: 0.15,
          }}
        >
          <motion.img
            src={SMLogoImg}
            alt=""
            style={{ width: 260, height: 260, borderRadius: '50%', objectFit: 'cover' }}
            animate={{ rotate: [0, 8, 0, -8, 0] }}
            transition={{ duration: 10, repeat: Infinity }}
          />
        </Box>

        <Container maxWidth="xl">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Chip
              label={t.about.ourStory}
              sx={{ bgcolor: 'rgba(212,160,23,0.2)', color: '#D4A017', fontWeight: 700, mb: 3, border: '1px solid rgba(212,160,23,0.3)' }}
            />
            <Typography
              variant="h1"
              sx={{
                fontFamily: 'Playfair Display',
                color: 'white',
                fontSize: { xs: '2.5rem', md: '4.5rem' },
                fontWeight: 800,
                maxWidth: 650,
                lineHeight: 1.15,
                mb: 3,
              }}
            >
              {t.about.heroTitle1}<br />
              <Box component="span" sx={{ color: '#D4A017' }}>{t.about.heroTitle2}</Box>
            </Typography>
            <Typography
              variant="h6"
              sx={{ color: 'rgba(255,255,255,0.7)', maxWidth: 550, fontWeight: 400, lineHeight: 1.9, mb: 5 }}
            >
              {t.about.heroSubtitle}
            </Typography>

            {/* Stats row */}
            <Stack direction={{ xs: 'row' }} spacing={{ xs: 3, md: 6 }} flexWrap="wrap" useFlexGap>
              {MILESTONES.map((m, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontFamily: 'Playfair Display', color: '#D4A017', fontWeight: 800 }}>
                      {m.year}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' }}>
                      {m.label}
                    </Typography>
                  </Box>
                </motion.div>
              ))}
            </Stack>
          </motion.div>
        </Container>
      </Box>

      {/* ─── BRAND STORY ─── */}
      <Box className="organic-bg" sx={{ py: 8 }}>
        <Container maxWidth="xl">
          <Grid container spacing={6} alignItems="center">
            {/* Left — image collage */}
            <Grid size={{ xs: 12, md: 6 }}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <Box sx={{ position: 'relative', height: { xs: 320, md: 420 } }}>
                  {/* Main large image */}
                  <Box
                    sx={{
                      position: 'absolute', top: 0, left: 0, width: '65%', height: '70%',
                      borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(92,51,23,0.25)',
                    }}
                    className="img-zoom"
                  >
                    <img src={KarupattiImg} alt="Karupatti" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </Box>
                  {/* Top right */}
                  <Box
                    sx={{
                      position: 'absolute', top: 0, right: 0, width: '32%', height: '48%',
                      borderRadius: '20px', overflow: 'hidden', boxShadow: '0 12px 40px rgba(92,51,23,0.2)',
                    }}
                    className="img-zoom"
                  >
                    <img src={KandImg} alt="Palm Candy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </Box>
                  {/* Bottom right */}
                  <Box
                    sx={{
                      position: 'absolute', bottom: 0, right: 0, width: '32%', height: '48%',
                      borderRadius: '20px', overflow: 'hidden', boxShadow: '0 12px 40px rgba(92,51,23,0.2)',
                    }}
                    className="img-zoom"
                  >
                    <img src={TamarindImg} alt="Tamarind" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </Box>
                  {/* Logo badge */}
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 16, left: 16,
                      width: 90, height: 90,
                      zIndex: 5,
                      filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.3))',
                    }}
                  >
                    <img
                      src={SMLogoImg}
                      alt="SM Original Karupatti"
                      style={{
                        width: 90, height: 90,
                        objectFit: 'cover',
                        borderRadius: '50%',
                        border: '3px solid #D4A017',
                        background: 'white',
                        boxShadow: '0 4px 20px rgba(92,51,23,0.3)',
                      }}
                    />
                  </Box>

                </Box>
              </motion.div>
            </Grid>

            {/* Right — text */}
            <Grid size={{ xs: 12, md: 6 }}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <Typography variant="overline" sx={{ color: '#D4A017', fontWeight: 700, letterSpacing: 3 }}>
                  {t.about.whoWeAre}
                </Typography>
                <Typography
                  variant="h2"
                  sx={{ fontFamily: 'Playfair Display', color: '#5C3317', mt: 1.5, mb: 3, fontSize: { xs: '1.8rem', md: '2.8rem' } }}
                >
                  {t.about.smTitle}
                </Typography>
                <Typography variant="body1" sx={{ color: '#8B6A4A', lineHeight: 2, mb: 3 }}>
                  {t.about.p1}
                </Typography>
                <Typography variant="body1" sx={{ color: '#8B6A4A', lineHeight: 2, mb: 4 }}>
                  {t.about.p2}
                </Typography>

                {/* Tags */}
                <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 4 }}>
                  {tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      sx={{ bgcolor: 'rgba(45,106,45,0.1)', color: '#2D6A2D', fontWeight: 600, border: '1px solid rgba(45,106,45,0.2)' }}
                    />
                  ))}
                </Box>

                {/* Address */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 2 }}>
                  <LocationOn sx={{ color: '#D4A017', mt: 0.3 }} />
                  <Typography variant="body2" sx={{ color: '#8B6A4A', lineHeight: 1.7 }}>
                    Tisayanvilai - Udangudi Road, Thisayanvilai, Tamil Nadu - 627657
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
                  <Phone sx={{ color: '#D4A017' }} />
                  <Typography variant="body2" sx={{ color: '#8B6A4A', fontWeight: 600 }}>
                    +91 9976941156
                  </Typography>
                </Box>

                <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                  <Button component={Link} to="/products" variant="contained" color="primary" size="large" endIcon={<ArrowForward />}>
                    {t.about.browseProducts}
                  </Button>
                  <Button
                    component="a" href="https://wa.me/918825778001" target="_blank"
                    variant="outlined"
                    size="large"
                    sx={{ borderColor: '#5C3317', color: '#5C3317', '&:hover': { borderColor: '#D4A017', color: '#D4A017' } }}
                  >
                    {t.about.whatsappUs}
                  </Button>
                </Stack>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ─── VALUES ─── */}
      <Box sx={{ background: 'linear-gradient(135deg, #5C3317 0%, #3A1F0A 100%)', py: 12 }}>
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <Typography variant="overline" sx={{ color: '#D4A017', fontWeight: 700, letterSpacing: 3 }}>{t.about.ourValues}</Typography>
              <Typography variant="h2" sx={{ fontFamily: 'Playfair Display', color: 'white', mt: 1, fontSize: { xs: '2rem', md: '2.8rem' } }}>
                {t.about.valuesTitle}
              </Typography>
              <Box sx={{ width: 80, height: 4, bgcolor: '#D4A017', mx: 'auto', mt: 2, borderRadius: 2 }} />
            </motion.div>
          </Box>
          <Grid container spacing={4}>
            {VALUES.map((v, i) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  whileHover={{ y: -10 }}
                >
                  <Paper
                    sx={{
                      p: 4, textAlign: 'center', height: '100%',
                      background: 'rgba(255,255,255,0.05)',
                      backdropFilter: 'blur(12px)',
                      border: '1px solid rgba(212,160,23,0.2)',
                      borderRadius: 4,
                      transition: 'border-color 0.3s',
                      '&:hover': { borderColor: 'rgba(212,160,23,0.5)' },
                    }}
                  >
                    <Box
                      sx={{
                        width: 80, height: 80,
                        borderRadius: '50%',
                        bgcolor: 'rgba(212,160,23,0.15)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        mx: 'auto', mb: 3,
                        color: '#D4A017',
                        border: '1px solid rgba(212,160,23,0.3)',
                      }}
                    >
                      {v.icon}
                    </Box>
                    <Typography variant="h6" sx={{ fontFamily: 'Playfair Display', color: 'white', fontWeight: 700, mb: 1.5 }}>
                      {v.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.9 }}>
                      {v.desc}
                    </Typography>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ─── PRODUCTS SHOWCASE ─── */}
      <Box className="organic-bg" sx={{ py: 8 }}>
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <Typography variant="overline" sx={{ color: '#D4A017', fontWeight: 700, letterSpacing: 3 }}>{t.about.ourProducts2}</Typography>
              <Typography variant="h2" sx={{ fontFamily: 'Playfair Display', color: '#5C3317', mt: 1, fontSize: { xs: '2rem', md: '2.8rem' } }}>
                {t.about.showcaseTitle}
              </Typography>
              <Box sx={{ width: 80, height: 4, bgcolor: '#D4A017', mx: 'auto', mt: 2, borderRadius: 2 }} />
            </motion.div>
          </Box>
          <Grid container spacing={4}>
            {PRODUCTS.map((p, i) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  whileHover={{ y: -10 }}
                >
                  <Paper
                    sx={{
                      overflow: 'hidden',
                      borderRadius: 4,
                      border: '1px solid rgba(92,51,23,0.1)',
                      boxShadow: '0 4px 24px rgba(92,51,23,0.08)',
                      height: '100%',
                      transition: 'box-shadow 0.3s',
                      '&:hover': { boxShadow: '0 12px 48px rgba(92,51,23,0.18)' },
                    }}
                  >
                    <Box className="img-zoom" sx={{ height: 240, overflow: 'hidden', position: 'relative' }}>
                      <img src={p.img} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <Box
                        sx={{
                          position: 'absolute', top: 16, right: 16,
                          bgcolor: 'white', borderRadius: 2,
                          px: 1.5, py: 0.5,
                        }}
                      >
                        <Typography variant="body2" sx={{ color: p.color, fontWeight: 700 }}>{p.price}</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ p: 3.5 }}>
                      <Typography variant="h5" sx={{ fontFamily: 'Playfair Display', color: '#5C3317', fontWeight: 700, mb: 0.5 }}>
                        {p.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#D4A017', fontWeight: 600, mb: 2, letterSpacing: 0.5 }}>
                        {p.subname}
                      </Typography>
                      <Divider sx={{ mb: 2, borderColor: 'rgba(92,51,23,0.1)' }} />
                      <Typography variant="body2" sx={{ color: '#8B6A4A', mb: 3, lineHeight: 1.8 }}>
                        {p.desc}
                      </Typography>
                      <Button
                        component={Link}
                        to="/products"
                        variant="contained"
                        color="primary"
                        size="medium"
                        fullWidth
                        endIcon={<ArrowForward />}
                        sx={{ borderRadius: 2 }}
                      >
                        {t.about.shopNow}
                      </Button>
                    </Box>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ─── CTA ─── */}
      <Box sx={{ background: 'linear-gradient(135deg, #3A1F0A 0%, #5C3317 100%)', py: 10 }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
            {/* Circular logo in CTA */}
            <img
              src={SMLogoImg}
              alt="SM Original Karupatti"
              style={{
                width: 90, height: 90,
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid rgba(212,160,23,0.6)',
                boxShadow: '0 0 30px rgba(212,160,23,0.3)',
                background: 'white',
                marginBottom: 24,
              }}
            />
            <Typography variant="h3" sx={{ fontFamily: 'Playfair Display', color: 'white', mb: 2, fontSize: { xs: '1.8rem', md: '2.5rem' } }}>
              {t.about.tasteTradition}
            </Typography>
            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.7)', mb: 5, fontWeight: 400, lineHeight: 1.9 }}>
              {t.about.ctaDesc}
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button
                component="a" href="https://wa.me/918825778001" target="_blank"
                variant="contained"
                size="large"
                sx={{ bgcolor: '#25D366', '&:hover': { bgcolor: '#1da851' }, py: 2, px: 5, fontSize: '1rem' }}
              >
                {t.about.orderWhatsApp}
              </Button>
              <Button
                component={Link} to="/products"
                variant="outlined"
                size="large"
                sx={{ color: '#D4A017', borderColor: '#D4A017', py: 2, px: 5, fontSize: '1rem', '&:hover': { borderColor: '#E8C040', color: '#E8C040' } }}
              >
                {t.about.browseProducts}
              </Button>
            </Stack>
          </motion.div>
        </Container>
      </Box>
    </>
  );
}
