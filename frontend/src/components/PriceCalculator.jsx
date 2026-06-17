import { useState } from 'react';
import {
  Box, Typography, Button, TextField, Chip,
  Paper, Divider, Stack, InputAdornment,
} from '@mui/material';
import { Add, Remove, WhatsApp, Scale } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '../context/LangContext';
import { orderAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

// Helper to normalize category spellings
function normalizeCategory(category) {
  const c = (category || '').toLowerCase().trim();
  if (c === 'panamkarkandu' || c === 'panangkarkandu') return 'panangkarkandu';
  if (c === 'puli' || c === 'tamarind') return 'tamarind';
  return c;
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

export default function PriceCalculator({ product }) {
  const { t, lang } = useLang();
  const { user } = useAuth();
  const [selectedWeight, setSelectedWeight] = useState(1000);
  const [quantity, setQuantity] = useState(1);
  const [customWeight, setCustomWeight] = useState('');
  const [isCustom, setIsCustom] = useState(false);

  const handleWhatsAppOrder = async (e) => {
    e.preventDefault();
    try {
      const orderPayload = {
        customerName: user?.name || 'WhatsApp Guest',
        customerPhone: user?.phone || '8825778001',
        items: [
          {
            product: product.id || Number(product._id) || 1,
            quantity: quantity,
            price: totalPrice,
            weightGrams: effectiveWeight,
          }
        ],
        totalAmount: totalPrice,
        orderType: 'whatsapp',
        notes: `Direct product order from details page: ${shortName}`
      };
      await orderAPI.create(orderPayload);
    } catch (err) {
      console.error('Failed to log order:', err);
    } finally {
      window.open(`https://wa.me/918825778001?text=${waMessage}`, '_blank');
    }
  };

  const WEIGHT_OPTIONS = lang === 'en'
    ? [
        { label: '250g', grams: 250 },
        { label: '500g', grams: 500 },
        { label: '750g', grams: 750 },
        { label: '1 kg', grams: 1000 },
        { label: '2 kg', grams: 2000 },
        { label: '3 kg', grams: 3000 },
      ]
    : [
        { label: '250 கிராம்', grams: 250 },
        { label: '500 கிராம்', grams: 500 },
        { label: '750 கிராம்', grams: 750 },
        { label: '1 கிலோ', grams: 1000 },
        { label: '2 கிலோ', grams: 2000 },
        { label: '3 கிலோ', grams: 3000 },
      ];

  const effectiveWeight = isCustom ? (parseFloat(customWeight) * 1000 || 0) : selectedWeight;
  const pricePerGram = product.pricePerKg / 1000;
  const unitPrice = pricePerGram * effectiveWeight;
  const totalPrice = unitPrice * quantity;

  const formattedWeight = isCustom
    ? `${customWeight} ${lang === 'en' ? 'kg' : 'கிலோ'}`
    : WEIGHT_OPTIONS.find(w => w.grams === selectedWeight)?.label || `${effectiveWeight} ${lang === 'en' ? 'g' : 'கிராம்'}`;

  const shortName = getShortName(product);

  const waMessage = lang === 'en'
    ? encodeURIComponent(`Hello SM Original Karupatti,\n\nProduct: ${shortName}\nQuantity: ${formattedWeight} × ${quantity}\nPrice: ₹${totalPrice.toFixed(2)}\n\nI would like to place this order.`)
    : encodeURIComponent(`வணக்கம் SM ஒரிஜினல் கருப்பட்டி,\n\nதயாரிப்பு: ${shortName}\nஅளவு: ${formattedWeight} × ${quantity}\nவிலை: ₹${totalPrice.toFixed(2)}\n\nநான் இந்த ஆர்டரை செய்ய விரும்புகிறேன்.`);

  const packSuffix = lang === 'en'
    ? `pack${quantity > 1 ? 's' : ''}`
    : 'பேக்';

  const weightLabel = effectiveWeight >= 1000
    ? `${effectiveWeight / 1000} ${lang === 'en' ? 'kg' : 'கிலோ'}`
    : `${effectiveWeight} ${lang === 'en' ? 'g' : 'கிராம்'}`;

  const kgLabel = lang === 'en' ? '/kg' : '/கிலோ';

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 4,
        border: '2px solid rgba(92,51,23,0.1)',
        background: 'linear-gradient(135deg, #FDF6EC 0%, #FFF8F0 100%)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <Scale sx={{ color: '#5C3317' }} />
        <Typography variant="h6" sx={{ fontFamily: 'Playfair Display', fontWeight: 700, color: '#5C3317' }}>
          {t.calc.selectQuantity}
        </Typography>
      </Box>

      {/* Weight selector */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
        {WEIGHT_OPTIONS.map((opt) => (
          <motion.div key={opt.grams} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Chip
              label={opt.label}
              onClick={() => { setSelectedWeight(opt.grams); setIsCustom(false); }}
              sx={{
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.9rem',
                height: 40,
                px: 1,
                bgcolor: !isCustom && selectedWeight === opt.grams ? '#5C3317' : 'white',
                color: !isCustom && selectedWeight === opt.grams ? 'white' : '#5C3317',
                border: '2px solid',
                borderColor: !isCustom && selectedWeight === opt.grams ? '#5C3317' : 'rgba(92,51,23,0.2)',
                transition: 'all 0.2s',
                '&:hover': { bgcolor: !isCustom && selectedWeight === opt.grams ? '#7D4A28' : 'rgba(92,51,23,0.05)' },
              }}
            />
          </motion.div>
        ))}
        <motion.div whileHover={{ scale: 1.05 }}>
          <Chip
            label={t.calc.custom}
            onClick={() => setIsCustom(true)}
            sx={{
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.9rem',
              height: 40,
              px: 1,
              bgcolor: isCustom ? '#D4A017' : 'white',
              color: isCustom ? 'white' : '#D4A017',
              border: '2px solid',
              borderColor: isCustom ? '#D4A017' : 'rgba(212,160,23,0.4)',
              '&:hover': { bgcolor: isCustom ? '#A07800' : 'rgba(212,160,23,0.05)' },
            }}
          />
        </motion.div>
      </Box>

      {/* Custom weight input */}
      <AnimatePresence>
        {isCustom && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
            <TextField
              label={t.calc.customWeight}
              type="number"
              value={customWeight}
              onChange={(e) => setCustomWeight(e.target.value)}
              InputProps={{
                endAdornment: <InputAdornment position="end">{lang === 'en' ? 'kg' : 'கிலோ'}</InputAdornment>,
                inputProps: { min: 0.1, step: 0.1 },
              }}
              fullWidth
              size="small"
              sx={{ mb: 2 }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <Divider sx={{ my: 2 }} />

      {/* Quantity selector */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Typography variant="body1" sx={{ fontWeight: 600, color: '#5C3317' }}>
          {t.calc.packs}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', border: '2px solid rgba(92,51,23,0.2)', borderRadius: 3, overflow: 'hidden' }}>
          <Button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            sx={{ minWidth: 40, px: 1, color: '#5C3317', borderRadius: 0 }}
          >
            <Remove fontSize="small" />
          </Button>
          <Typography sx={{ px: 2.5, fontWeight: 700, fontSize: '1.1rem', color: '#5C3317', minWidth: 36, textAlign: 'center' }}>
            {quantity}
          </Typography>
          <Button
            onClick={() => setQuantity((q) => q + 1)}
            sx={{ minWidth: 40, px: 1, color: '#5C3317', borderRadius: 0 }}
          >
            <Add fontSize="small" />
          </Button>
        </Box>
      </Box>

      {/* Price display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${effectiveWeight}-${quantity}`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <Box
            sx={{
              p: 2.5,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #5C3317 0%, #7D4A28 100%)',
              color: 'white',
              mb: 3,
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: 1 }}>
                  {t.calc.unitPrice}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: '"Outfit", "Inter", sans-serif' }}>
                  ₹{unitPrice.toFixed(2)}
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontFamily: '"Outfit", "Inter", sans-serif' }}>×{quantity}</Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: 1 }}>
                  {t.calc.totalPrice}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, fontFamily: '"Outfit", "Inter", sans-serif', color: '#D4A017' }}>
                  ₹{totalPrice.toFixed(2)}
                </Typography>
              </Box>
            </Stack>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', mt: 1, display: 'block', fontFamily: '"Inter", sans-serif' }}>
              ₹{product.pricePerKg}{kgLabel} × {weightLabel} × {quantity} {packSuffix}
            </Typography>
          </Box>
        </motion.div>
      </AnimatePresence>

      {/* WhatsApp Order only */}
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button
          onClick={handleWhatsAppOrder}
          variant="contained"
          fullWidth
          size="large"
          startIcon={<WhatsApp />}
          disabled={effectiveWeight === 0}
          sx={{
            py: 1.75,
            fontSize: '1.05rem',
            fontWeight: 700,
            bgcolor: '#25D366',
            '&:hover': { bgcolor: '#1da851', transform: 'translateY(-2px)' },
          }}
        >
          {t.calc.orderWhatsApp}
        </Button>
      </motion.div>
    </Paper>
  );
}
