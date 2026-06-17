import { useState, useEffect } from 'react';
import {
  Box, Container, Grid, Typography,
  Pagination, Chip,
} from '@mui/material';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { productAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import { useLang } from '../context/LangContext';
import KarupattiImg from '../assets/karupatti.jpg';
import KandImg from '../assets/kand.jpg';
import TamarindImg from '../assets/tamarind.jpg';

const CATEGORIES = ['All', 'Karupatti', 'Panangkarkandu', 'Tamarind'];

// Helper to normalize category spellings
function normalizeCategory(category) {
  const c = (category || '').toLowerCase().trim();
  if (c === 'panamkarkandu' || c === 'panangkarkandu') return 'panangkarkandu';
  if (c === 'puli' || c === 'tamarind') return 'tamarind';
  return c;
}

// Inject local frontend images by category — no backend image dependency
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

const FALLBACK_PRODUCTS = [
  normalizeProduct({ _id: '1', id: 1, name: 'Karupatti (Palm Jaggery)', category: 'Karupatti', description: 'Pure, natural Palm Jaggery sourced directly from palm trees in Tirunelveli. Rich in minerals and completely unrefined. A healthier alternative to white sugar.', pricePerKg: 220, ratings: 5, numReviews: 48, isAvailable: true, stock: 100, benefits: ['Rich in iron', 'Natural sweetener', 'Boosts immunity', 'Good for digestion'] }),
  normalizeProduct({ _id: '2', id: 2, name: 'Panangkarkandu (Palm Candy)', category: 'Panangkarkandu', description: 'Authentic Palm Candy crystals made from pure palm sap. Naturally sweet with a distinctive flavor used in traditional medicines.', pricePerKg: 280, ratings: 5, numReviews: 32, isAvailable: true, stock: 100, benefits: ['Natural cough remedy', 'Rich in vitamins', 'Traditional medicine', 'Good for throat'] }),
  normalizeProduct({ _id: '3', id: 3, name: 'Tamarind (Puli)', category: 'Tamarind', description: 'Premium quality Tamarind from the fertile lands of Tirunelveli. Tangy, rich and perfect for cooking. Hand-picked and naturally dried.', pricePerKg: 180, ratings: 5, numReviews: 25, isAvailable: true, stock: 100, benefits: ['Rich in antioxidants', 'Aids digestion', 'Vitamin C source', 'Anti-inflammatory'] }),
];

export default function Products() {
  const [products, setProducts] = useState(FALLBACK_PRODUCTS);
  const [filtered, setFiltered] = useState(FALLBACK_PRODUCTS);
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);
  const perPage = 9;
  const { t, lang } = useLang();

  const categoryLabels = {
    en: {
      All: 'All',
      Karupatti: 'Karupatti',
      Panangkarkandu: 'Panangkarkandu',
      Tamarind: 'Tamarind'
    },
    ta: {
      All: 'அனைத்தும்',
      Karupatti: 'கருப்பட்டி',
      Panangkarkandu: 'பனங்கற்கண்டு',
      Tamarind: 'புளி'
    }
  };

  useEffect(() => {
    productAPI.getAll()
      .then(({ data }) => {
        const list = data.products || data || [];
        if (list.length > 0) {
          const normalized = list.map(normalizeProduct);
          setProducts(normalized);
          setFiltered(normalized);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    let result = [...products];
    if (category !== 'All') {
      result = result.filter((p) => normalizeCategory(p.category) === normalizeCategory(category));
    }
    setFiltered(result);
    setPage(1);
  }, [category, products]);

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <>
      <Helmet>
        <title>{t.nav.products} — SM Original Karupatti</title>
        <meta name="description" content="Browse our premium range of Palm Jaggery, Palm Candy, and Tamarind products. 100% natural and unrefined." />
      </Helmet>

      {/* Header */}
      <Box sx={{ background: 'linear-gradient(135deg, #5C3317 0%, #3A1F0A 100%)', py: 10, pt: { xs: 14, md: 18 } }}>
        <Container maxWidth="xl">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <Typography variant="overline" sx={{ color: '#D4A017', fontWeight: 700, letterSpacing: 3 }}>{t.products.ourRange}</Typography>
            <Typography variant="h2" sx={{ fontFamily: 'Playfair Display', color: 'white', mt: 1, fontSize: { xs: '2rem', md: '3rem' } }}>
              {t.products.premiumProducts}
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)', mt: 2, maxWidth: 500 }}>
              {t.products.pageDesc}
            </Typography>
          </motion.div>
        </Container>
      </Box>

      <Box className="organic-bg" sx={{ py: 6 }}>
        <Container maxWidth="xl">
          {/* Category filters */}
          <Box sx={{ display: 'flex', gap: 1.5, mb: 5, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>
            {CATEGORIES.map((c) => (
              <Chip
                key={c}
                label={categoryLabels[lang]?.[c] || c}
                onClick={() => setCategory(c)}
                sx={{
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  height: 38,
                  px: 1,
                  bgcolor: category === c ? '#5C3317' : 'white',
                  color: category === c ? 'white' : '#5C3317',
                  border: '1px solid rgba(92,51,23,0.2)',
                  '&:hover': { bgcolor: category === c ? '#7D4A28' : 'rgba(92,51,23,0.05)' },
                }}
              />
            ))}
          </Box>

          {/* Products grid / flex container */}
          <Box sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 4,
            justifyContent: 'center',
            alignItems: 'stretch',
            width: '100%'
          }}>
            {paginated.length > 0
              ? paginated.map((p, i) => (
                  <Box
                    key={p._id}
                    sx={{
                      width: { xs: '100%', sm: 'calc(50% - 16px)', md: 'calc(33.333% - 21.3px)' },
                      maxWidth: 400,
                      minWidth: 280,
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    <ProductCard product={p} index={i} />
                  </Box>
                ))
              : (
                  <Box sx={{ width: '100%', textAlign: 'center', py: 10 }}>
                    <Typography variant="h5" sx={{ color: '#8B6A4A' }}>{t.products.noProductsFound}</Typography>
                  </Box>
                )
            }
          </Box>

          {/* Pagination */}
          {filtered.length > perPage && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
              <Pagination
                count={Math.ceil(filtered.length / perPage)}
                page={page}
                onChange={(_, v) => setPage(v)}
                sx={{ '& .MuiPaginationItem-root': { color: '#5C3317' }, '& .Mui-selected': { bgcolor: '#5C3317 !important', color: 'white' } }}
              />
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
}
