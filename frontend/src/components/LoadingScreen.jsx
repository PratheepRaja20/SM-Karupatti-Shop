import { motion, AnimatePresence } from 'framer-motion';
import { Box, Typography } from '@mui/material';
import SMLogoImg from '../assets/sm-logo.png';

export default function LoadingScreen() {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1A0F00 0%, #3A1F0A 50%, #5C3317 100%)',
          zIndex: 9999,
        }}
      >
        {/* Animated rings */}
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              borderRadius: '50%',
              border: `2px solid rgba(212,160,23,${0.25 - i * 0.05})`,
            }}
            animate={{
              width: [80 * i, 80 * i + 20, 80 * i],
              height: [80 * i, 80 * i + 20, 80 * i],
              opacity: [0.7, 0.2, 0.7],
            }}
            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1, ease: 'easeInOut' }}
          />
        ))}

        {/* Logo — circular with overflow:hidden wrapper for guaranteed clip */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.25, type: 'spring', stiffness: 260 }}
          style={{
            width: 120,
            height: 120,
            borderRadius: '50%',
            overflow: 'hidden',
            border: '3px solid rgba(212,160,23,0.7)',
            boxShadow: '0 0 40px rgba(212,160,23,0.45), 0 0 0 6px rgba(212,160,23,0.15)',
            background: 'white',
            flexShrink: 0,
          }}
        >
          <img
            src={SMLogoImg}
            alt="SM Original Karupatti"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </motion.div>

        {/* Brand name */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.2 }}
          style={{ textAlign: 'center', marginTop: 24 }}
        >
          <Typography
            variant="h5"
            sx={{
              color: '#D4A017',
              fontFamily: 'Playfair Display',
              fontWeight: 700,
              letterSpacing: 2,
            }}
          >
            SM Original Karupatti
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', mt: 0.5, letterSpacing: 1 }}>
            First Quality Original Karupatti
          </Typography>
        </motion.div>

        {/* Loading dots */}
        <Box sx={{ display: 'flex', gap: 1, mt: 4 }}>
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              style={{ width: 8, height: 8, borderRadius: '50%', background: '#D4A017' }}
              animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
            />
          ))}
        </Box>
      </motion.div>
    </AnimatePresence>
  );
}
