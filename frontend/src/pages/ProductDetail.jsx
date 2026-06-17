import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Box, Container, Typography, Chip, Paper,
  Breadcrumbs, Divider,
} from '@mui/material';
import { CheckCircle, NavigateNext, ArrowBack } from '@mui/icons-material';
import { motion } from 'framer-motion';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { Helmet } from 'react-helmet-async';
import { productAPI } from '../services/api';
import PriceCalculator from '../components/PriceCalculator';
import { useLang } from '../context/LangContext';
import { getLocalizedProduct } from '../components/ProductCard';
import KarupattiImg from '../assets/karupatti.jpg';
import KandImg from '../assets/kand.jpg';
import TamarindImg from '../assets/tamarind.jpg';

const FALLBACK = {
  '1': { id: 1, _id: '1', name: 'Karupatti (Palm Jaggery)', description: 'Pure, natural Palm Jaggery sourced directly from palm trees in Tirunelveli. Rich in minerals and completely unrefined. A healthier alternative to white sugar with a distinctive caramel-like flavor. Made using traditional methods passed down through generations.', pricePerKg: 350, images: [{ url: KarupattiImg }, { url: KandImg }], ratings: 5, numReviews: 48, isAvailable: true, stock: 100, category: 'Karupatti', benefits: ['Rich in iron and minerals', 'Natural sweetener — no chemicals', 'Boosts immunity', 'Good for digestion', 'Low glycemic index', 'Traditional Tirunelveli product'] },
  '2': { id: 2, _id: '2', name: 'Panangkarkandu (Palm Candy)', description: 'Authentic Palm Candy crystals made from pure palm sap. Naturally sweet with a distinctive flavor. Used in traditional medicines and as a healthy sweetener. Rich in natural vitamins and minerals.', pricePerKg: 600, images: [{ url: KandImg }, { url: KarupattiImg }], ratings: 5, numReviews: 32, isAvailable: true, stock: 100, category: 'Panangkarkandu', benefits: ['Natural cough remedy', 'Soothes throat irritation', 'Rich in vitamins', 'Good for respiratory health', 'Traditional medicine ingredient', 'Pure and unprocessed'] },
  '3': { id: 3, _id: '3', name: 'Tamarind (Puli)', description: 'Premium quality Tamarind from the fertile lands of Tirunelveli. Tangy, rich and perfect for cooking. Hand-picked and naturally dried to preserve maximum flavor and nutrition.', pricePerKg: 130, images: [{ url: TamarindImg }, { url: KandImg }], ratings: 5, numReviews: 25, isAvailable: true, stock: 100, category: 'Tamarind', benefits: ['Rich in antioxidants', 'Aids digestion', 'Natural vitamin C source', 'Anti-inflammatory properties', 'Traditional culinary ingredient', 'No preservatives added'] },
};

// Helper to normalize category spellings
function normalizeCategory(category) {
  const c = (category || '').toLowerCase().trim();
  if (c === 'panamkarkandu' || c === 'panangkarkandu') return 'panangkarkandu';
  if (c === 'puli' || c === 'tamarind') return 'tamarind';
  return c;
}

// Load images: check localStorage first (admin-uploaded), then fall back to local assets
function getLocalImage(prod) {
  const cat = normalizeCategory(prod?.category);
  const sid = String(prod?.id || prod?._id || '');

  // Try to load admin-uploaded images from localStorage
  let storedKey = null;
  if (cat === 'karupatti' || sid === '1') storedKey = 'sm_product_images_karupatti';
  else if (cat === 'panangkarkandu' || sid === '2') storedKey = 'sm_product_images_panangkarkandu';
  else if (cat === 'tamarind' || sid === '3') storedKey = 'sm_product_images_tamarind';

  if (storedKey) {
    try {
      const stored = JSON.parse(localStorage.getItem(storedKey) || 'null');
      if (stored && stored.length > 0) {
        // Merge uploaded images first, then default fallback
        const defaultImg = cat === 'karupatti' || sid === '1' ? KarupattiImg
          : cat === 'panangkarkandu' || sid === '2' ? KandImg : TamarindImg;
        return [...stored.map(url => ({ url })), { url: defaultImg }];
      }
    } catch {}
  }

  // Fallback to local assets
  if (cat === 'karupatti' || sid === '1') return [{ url: KarupattiImg }, { url: KandImg }];
  if (cat === 'panangkarkandu' || sid === '2') return [{ url: KandImg }, { url: KarupattiImg }];
  if (cat === 'tamarind' || sid === '3') return [{ url: TamarindImg }, { url: KandImg }];
  return [{ url: KarupattiImg }];
}

export default function ProductDetail() {
  const { id } = useParams();
  const { t } = useLang();
  const navigate = useNavigate();
  const [rawProduct, setRawProduct] = useState(FALLBACK[id] || null);
  const [activeImg, setActiveImg] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [customImages, setCustomImages] = useState([]); // admin-uploaded images from localStorage

  // Load admin-uploaded images from localStorage on mount or product update
  useEffect(() => {
    const cat = normalizeCategory(rawProduct?.category || FALLBACK[id]?.category);
    if (!cat) {
      setCustomImages([]);
      return;
    }
    const key = `sm_product_images_${cat}`;
    try {
      const stored = JSON.parse(localStorage.getItem(key) || 'null');
      if (stored && stored.length > 0) setCustomImages(stored);
      else setCustomImages([]);
    } catch { setCustomImages([]); }
  }, [id, rawProduct?.category]);


  const product = getLocalizedProduct(rawProduct, t);

  useEffect(() => {
    setRawProduct(FALLBACK[id] || null);
    setActiveImg(0);
    productAPI.getOne(id)
      .then((res) => {
        const p = res?.data?.product || res?.data;
        if (p) {
          const normalized = {
            ...p,
            _id: String(p.id || p._id || id),
            id: p.id || Number(id),
            images: getLocalImage(p),
          };
          setRawProduct(normalized);
        }
      })
      .catch(() => {});
  }, [id]);

  // Build final images: custom uploaded first, then ALL default images (keep originals)
  // Deduplicate so same image never shows twice
  const defaultImages = getLocalImage(rawProduct);
  const allImages = customImages.length > 0
    ? [...customImages.map(url => ({ url })), ...defaultImages]
    : defaultImages;
  const seen = new Set();
  const images = allImages.filter(img => {
    if (seen.has(img.url)) return false;
    seen.add(img.url);
    return true;
  });

  // Auto-slideshow every 3.5 seconds
  useEffect(() => {
    if (images.length <= 1) return;
    setActiveImg(0);
    const timer = setInterval(() => {
      setActiveImg((prev) => (prev + 1) % images.length);
    }, 3500);
    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images.length, id]);

  if (!product) return <Box sx={{ pt: 15, textAlign: 'center' }}><Typography>Product not found</Typography></Box>;

  const normCat = normalizeCategory(product.category);
  const categoryLabel = normCat === 'karupatti'
    ? (t.prodNames.karupatti.split(' ')[0])
    : normCat === 'panangkarkandu'
      ? (t.prodNames.kand.split(' ')[0])
      : normCat === 'tamarind'
        ? (t.prodNames.tamarind.split(' ')[0])
        : product.category;

  return (
    <>
      <Helmet>
        <title>{product.name} — SM Original Karupatti</title>
        <meta name="description" content={product.description?.substring(0, 160)} />
      </Helmet>

      <Box sx={{ pt: { xs: 9, md: 10 }, pb: 8 }} className="organic-bg">
        <Container maxWidth="xl">

          {/* Back Button */}
          <Box sx={{ mb: 2 }}>
            <motion.div whileHover={{ x: -4 }} style={{ display: 'inline-block' }}>
              <Box
                onClick={() => navigate(-1)}
                sx={{
                  display: 'inline-flex', alignItems: 'center', gap: 0.75,
                  cursor: 'pointer', color: '#5C3317', fontWeight: 600,
                  fontSize: '0.9rem', py: 0.75, px: 1.5, borderRadius: 2,
                  border: '1px solid rgba(92,51,23,0.2)',
                  '&:hover': { bgcolor: 'rgba(92,51,23,0.06)' },
                  transition: 'all 0.2s',
                }}
              >
                <ArrowBack fontSize="small" /> {t.detail.products}
              </Box>
            </motion.div>
          </Box>

          {/* Breadcrumbs */}
          <Breadcrumbs separator={<NavigateNext fontSize="small" />} sx={{ mb: 4, color: '#8B6A4A' }}>
            <Link to="/" style={{ color: '#8B6A4A', textDecoration: 'none' }}>{t.detail.home}</Link>
            <Link to="/products" style={{ color: '#8B6A4A', textDecoration: 'none' }}>{t.detail.products}</Link>
            <Typography color="#5C3317">{product.name}</Typography>
          </Breadcrumbs>

          {/* Two-column layout: Image left, Info right */}
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 6, alignItems: 'flex-start' }}>

            {/* LEFT — Image Gallery */}
            <Box sx={{ flex: '0 0 auto', width: { xs: '100%', md: '42%' } }}>
              <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                <Box
                  className="img-zoom"
                  sx={{ borderRadius: 4, overflow: 'hidden', cursor: 'zoom-in', mb: 2, boxShadow: 6, height: { xs: 280, md: 420 } }}
                  onClick={() => setLightboxOpen(true)}
                >
                  <img
                    src={images[activeImg]?.url}
                    alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Box>
                <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                  {images.map((img, i) => (
                    <motion.div key={i} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                      <Box
                        onClick={() => setActiveImg(i)}
                        sx={{
                          width: 80, height: 80, borderRadius: 2, overflow: 'hidden', cursor: 'pointer',
                          border: activeImg === i ? '3px solid #D4A017' : '3px solid transparent',
                          transition: 'border-color 0.2s',
                        }}
                      >
                        <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </Box>
                    </motion.div>
                  ))}
                </Box>
              </motion.div>
            </Box>

            {/* RIGHT — Product Info */}
            <Box sx={{ flex: '1 1 auto', minWidth: 0 }}>
              <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                <Chip label={categoryLabel} sx={{ bgcolor: 'rgba(45,106,45,0.1)', color: '#2D6A2D', fontWeight: 600, mb: 2 }} />
                <Typography variant="h3" sx={{ fontFamily: 'Playfair Display', fontWeight: 800, color: '#5C3317', mb: 1.5, fontSize: { xs: '1.8rem', md: '2.4rem' } }}>
                  {product.name}
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Chip
                    label={product.isAvailable && product.stock > 0 ? t.card.inStock : t.card.outOfStock}
                    size="small"
                    sx={{ bgcolor: product.isAvailable ? 'rgba(45,106,45,0.1)' : 'rgba(211,47,47,0.1)', color: product.isAvailable ? '#2D6A2D' : '#d32f2f' }}
                  />
                </Box>

                {/* Price */}
                <Box sx={{ mb: 3, p: 2, bgcolor: 'rgba(92,51,23,0.05)', borderRadius: 3, display: 'inline-block' }}>
                  <Typography variant="caption" sx={{ color: '#8B6A4A', textTransform: 'uppercase', letterSpacing: 1 }}>{t.detail.pricePerKg}</Typography>
                  <Typography variant="h3" sx={{ fontFamily: '"Outfit", "Inter", sans-serif', fontWeight: 800, color: '#5C3317', lineHeight: 1.1 }}>
                    ₹{product.pricePerKg}
                  </Typography>
                </Box>

                <Typography variant="body1" sx={{ color: '#5C4033', lineHeight: 1.9, mb: 3 }}>
                  {product.description}
                </Typography>

                <Divider sx={{ my: 3 }} />

                {/* Price Calculator */}
                <PriceCalculator product={product} />
              </motion.div>
            </Box>

          </Box>

          {/* Benefits section */}
          <Box sx={{ mt: 8 }}>
            <Typography variant="h5" sx={{ fontFamily: 'Playfair Display', color: '#5C3317', fontWeight: 700, mb: 3 }}>
              {t.detail.benefits}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {product.benefits?.map((b, i) => (
                <Box key={i} sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 8px)', md: '1 1 calc(33% - 11px)' } }}>
                  <Paper sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2, border: '1px solid rgba(92,51,23,0.08)' }}>
                    <CheckCircle sx={{ color: '#2D6A2D', flexShrink: 0 }} />
                    <Typography variant="body1" sx={{ color: '#5C3317', fontWeight: 500 }}>{b}</Typography>
                  </Paper>
                </Box>
              ))}
            </Box>
          </Box>

        </Container>
      </Box>

      {/* Lightbox */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={images.map((img) => ({ src: img.url }))}
        index={activeImg}
      />
    </>
  );
}
