import { motion } from 'framer-motion';
import { Tooltip } from '@mui/material';
import { WhatsApp, Phone } from '@mui/icons-material';

export default function FloatingButtons() {
  return (
    <>
      {/* WhatsApp */}
      <Tooltip title="Order on WhatsApp" placement="left">
        <motion.a
          href="https://wa.me/918825778001?text=Hello%20SM%20Original%20Karupatti%2C%20I%27m%20interested%20in%20your%20products.%20Please%20share%20details."
          target="_blank"
          rel="noopener noreferrer"
          className="floating-btn floating-wa"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.5, type: 'spring', stiffness: 200 }}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.95 }}
        >
          <WhatsApp sx={{ fontSize: 28 }} />
        </motion.a>
      </Tooltip>

      {/* Call */}
      <Tooltip title="Call Us Now" placement="left">
        <motion.a
          href="tel:+919976941156"
          className="floating-btn floating-call"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.8, type: 'spring', stiffness: 200 }}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.95 }}
        >
          <Phone sx={{ fontSize: 26 }} />
        </motion.a>
      </Tooltip>
    </>
  );
}
