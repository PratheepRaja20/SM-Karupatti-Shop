import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#5C3317',
      light: '#7D4A28',
      dark: '#3A1F0A',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#D4A017',
      light: '#E8C040',
      dark: '#A07800',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#2D6A2D',
      light: '#4A9A4A',
      dark: '#1A4A1A',
    },
    background: {
      default: '#FDF6EC',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1A0F00',
      secondary: '#5C4033',
    },
    divider: 'rgba(92, 51, 23, 0.12)',
  },
  typography: {
    fontFamily: '"Inter", "Outfit", sans-serif',
    h1: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 600,
    },
    h4: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 600,
    },
    h5: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 600,
    },
    h6: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 600,
    },
    button: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 600,
      letterSpacing: '0.05em',
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0 1px 3px rgba(92,51,23,0.08)',
    '0 2px 6px rgba(92,51,23,0.10)',
    '0 4px 12px rgba(92,51,23,0.12)',
    '0 6px 16px rgba(92,51,23,0.14)',
    '0 8px 20px rgba(92,51,23,0.16)',
    '0 10px 24px rgba(92,51,23,0.18)',
    '0 12px 28px rgba(92,51,23,0.18)',
    '0 14px 32px rgba(92,51,23,0.18)',
    '0 16px 36px rgba(92,51,23,0.18)',
    '0 18px 40px rgba(92,51,23,0.20)',
    '0 20px 44px rgba(92,51,23,0.20)',
    '0 22px 48px rgba(92,51,23,0.20)',
    '0 24px 52px rgba(92,51,23,0.20)',
    '0 26px 56px rgba(92,51,23,0.22)',
    '0 28px 60px rgba(92,51,23,0.22)',
    '0 30px 64px rgba(92,51,23,0.22)',
    '0 32px 68px rgba(92,51,23,0.22)',
    '0 34px 72px rgba(92,51,23,0.24)',
    '0 36px 76px rgba(92,51,23,0.24)',
    '0 38px 80px rgba(92,51,23,0.24)',
    '0 40px 84px rgba(92,51,23,0.24)',
    '0 42px 88px rgba(92,51,23,0.26)',
    '0 44px 92px rgba(92,51,23,0.26)',
    '0 46px 96px rgba(92,51,23,0.26)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 50,
          padding: '10px 28px',
          fontSize: '0.95rem',
          fontWeight: 600,
          transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 24px rgba(92,51,23,0.3)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #5C3317 0%, #7D4A28 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #7D4A28 0%, #9A5E35 100%)',
          },
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #D4A017 0%, #E8C040 100%)',
          color: '#1A0F00',
          '&:hover': {
            background: 'linear-gradient(135deg, #A07800 0%, #C8900A 100%)',
            color: '#fff',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(92,51,23,0.08)',
          transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 40px rgba(92,51,23,0.18)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#D4A017',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#5C3317',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 20px rgba(92,51,23,0.12)',
        },
      },
    },
  },
});

export default theme;
