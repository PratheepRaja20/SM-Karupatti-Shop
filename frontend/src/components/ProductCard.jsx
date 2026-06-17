import { motion } from 'framer-motion';
import { Card, CardMedia, CardContent, Typography, Box, Chip, Button, Rating } from '@mui/material';
import { ShoppingCart, WhatsApp } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useLang } from '../context/LangContext';
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

// Map category to local frontend image (no Cloudinary dependency)
function getProductImage(product) {
  const cat = normalizeCategory(product.category);
  const id = String(product.id || product._id || '');

  // Try to load admin-uploaded images from localStorage first
  let storedKey = null;
  if (cat === 'karupatti' || id === '1') storedKey = 'sm_product_images_karupatti';
  else if (cat === 'panangkarkandu' || id === '2') storedKey = 'sm_product_images_panangkarkandu';
  else if (cat === 'tamarind' || id === '3') storedKey = 'sm_product_images_tamarind';

  if (storedKey) {
    try {
      const stored = JSON.parse(localStorage.getItem(storedKey) || 'null');
      if (stored && stored.length > 0 && stored[0]) {
        return stored[0];
      }
    } catch {}
  }

  if (cat === 'karupatti' || id === '1') return KarupattiImg;
  if (cat === 'panangkarkandu' || id === '2') return KandImg;
  if (cat === 'tamarind' || id === '3') return TamarindImg;
  // Try existing image URL as last resort
  return product.images?.[0]?.url || KarupattiImg;
}


// Get short product name for WhatsApp messages (Karupatti, Panangkarkandu, Puli)
function getShortName(product) {
  const cat = normalizeCategory(product.category);
  const id = String(product.id || product._id || '');
  if (cat === 'karupatti' || id === '1') return 'Karupatti';
  if (cat === 'panangkarkandu' || id === '2') return 'Panangkarkandu';
  if (cat === 'tamarind' || id === '3') return 'Puli';
  return product.name || 'Product';
}

export function getLocalizedProduct(p, t) {
  if (!p) return null;
  let name = p.name;
  let description = p.description;
  // Always normalize benefits to an array first
  let benefits = p.benefits || [];
  if (typeof benefits === 'string') {
    benefits = benefits.split(',').map(b => b.trim()).filter(Boolean);
  }
  if (!Array.isArray(benefits)) benefits = [];

  const categoryLower = normalizeCategory(p.category);
  const idStr = String(p._id || p.id || '');
  const numBenefits = benefits.length || 4;

  if (categoryLower === 'karupatti' || idStr === '1') {
    name = t.prodNames.karupatti;
    description = t.prodNames.karupattiDesc;
    benefits = [
      t.prodNames.benefits.richInIron,
      t.prodNames.benefits.naturalSweetener,
      t.prodNames.benefits.boostsImmunity,
      t.prodNames.benefits.goodForDigestion,
      t.prodNames.benefits.lowGlycemicIndex,
      t.prodNames.benefits.traditionalTirunelveli,
    ].slice(0, numBenefits);
  } else if (categoryLower === 'panangkarkandu' || idStr === '2') {
    name = t.prodNames.kand;
    description = t.prodNames.kandDesc;
    benefits = [
      t.prodNames.benefits.naturalCoughRemedy,
      t.prodNames.benefits.soothesThroat,
      t.prodNames.benefits.richInVitamins,
      t.prodNames.benefits.goodForRespiratory,
      t.prodNames.benefits.traditionalMedicine,
      t.prodNames.benefits.pureUnprocessed,
    ].slice(0, numBenefits);
  } else if (categoryLower === 'tamarind' || idStr === '3') {
    name = t.prodNames.tamarind;
    description = t.prodNames.tamarindDesc;
    benefits = [
      t.prodNames.benefits.richInAntioxidants,
      t.prodNames.benefits.aidsDigestion,
      t.prodNames.benefits.vitaminCSource,
      t.prodNames.benefits.antiInflammatory,
      t.prodNames.benefits.traditionalCulinary,
      t.prodNames.benefits.noPreservatives,
    ].slice(0, numBenefits);
  }

  // Guarantee benefits is always an array of strings
  if (!Array.isArray(benefits)) benefits = [];

  return { ...p, name, description, benefits };
}

export default function ProductCard({ product: rawProduct, index = 0 }) {
  const { t, lang } = useLang();
  const product = getLocalizedProduct(rawProduct, t);
  // Always use local frontend images — no Cloudinary dependency
  const imageUrl = getProductImage(rawProduct);
  // Canonical product ID: prefer numeric id (MySQL) then _id (MongoDB)
  const productId = product.id || product._id || '1';

  const shortName = getShortName(rawProduct);

  const waMessage = lang === 'en'
    ? encodeURIComponent(`Hello SM Original Karupatti,\n\nI'm interested in: ${shortName}\nPrice: ₹${product.pricePerKg}/kg\n\nPlease provide more details.`)
    : encodeURIComponent(`வணக்கம் SM ஒரிஜினல் கருப்பட்டி,\n\nநான் இதில் ஆர்வம் காட்டுகிறேன்: ${shortName}\nவிலை: ₹${product.pricePerKg}/கிலோ\n\nதயவுசெய்து கூடுதல் விவரங்களை வழங்கவும்.`);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1, type: 'spring', stiffness: 100 }}
      whileHover={{ y: -8 }}
      style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      <Card
        sx={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: '1px solid rgba(92,51,23,0.08)',
          position: 'relative',
        }}
      >
        {/* Stock badge */}
        {!product.isAvailable || product.stock === 0 ? (
          <Chip
            label={t.card.outOfStock}
            size="small"
            sx={{ position: 'absolute', top: 12, right: 12, zIndex: 2, bgcolor: 'error.main', color: 'white' }}
          />
        ) : (
          <Chip
            label={t.card.inStock}
            size="small"
            sx={{ position: 'absolute', top: 12, right: 12, zIndex: 2, bgcolor: '#2D6A2D', color: 'white' }}
          />
        )}

        {/* Image */}
        <Box className="img-zoom" sx={{ position: 'relative', overflow: 'hidden', height: 220 }}>
          <CardMedia
            component="img"
            image={imageUrl}
            alt={product.name}
            sx={{ height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
          />
          {/* Overlay */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '50%',
              background: 'linear-gradient(to top, rgba(26,15,0,0.6), transparent)',
            }}
          />
        </Box>

        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2.5 }}>
          <Typography variant="h6" sx={{ fontFamily: 'Playfair Display', fontWeight: 700, color: '#5C3317', mb: 0.5 }}>
            {product.name}
          </Typography>

          <Typography variant="body2" sx={{ color: '#8B6A4A', mb: 2, lineHeight: 1.6, flexGrow: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {product.description}
          </Typography>

          {/* Price */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" sx={{ color: '#8B6A4A', textTransform: 'uppercase', letterSpacing: 1 }}>
              {t.card.pricePerKg}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#5C3317', fontFamily: '"Outfit", "Inter", sans-serif' }}>
              ₹{product.pricePerKg}
            </Typography>
          </Box>

          {/* Benefits chips — fixed height so all cards are equal */}
          <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: 0.5, mb: 2, overflow: 'hidden', height: 26 }}>
            {Array.isArray(product.benefits) && product.benefits.slice(0, 2).map((b, bi) => (
              <Chip
                key={`benefit-${bi}`}
                label={b}
                size="small"
                sx={{ bgcolor: 'rgba(45,106,45,0.1)', color: '#2D6A2D', fontSize: '0.7rem', height: 22, flexShrink: 0 }}
              />
            ))}
          </Box>

          {/* Buttons */}
          <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
            <Button
              component={Link}
              to={`/products/${productId}`}
              variant="contained"
              color="primary"
              fullWidth
              startIcon={<ShoppingCart />}
              size="small"
              sx={{ fontSize: '0.8rem' }}
            >
              {t.card.buyNow}
            </Button>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                component="a"
                href={`https://wa.me/918825778001?text=${waMessage}`}
                target="_blank"
                variant="contained"
                sx={{
                  bgcolor: '#25D366',
                  color: 'white',
                  minWidth: 44,
                  px: 1.5,
                  '&:hover': { bgcolor: '#1da851' },
                }}
                size="small"
              >
                <WhatsApp fontSize="small" />
              </Button>
            </motion.div>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
}
