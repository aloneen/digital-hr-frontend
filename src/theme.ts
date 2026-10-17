import { createTheme } from '@mui/material/styles';

export const appTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#ff6a3d',
      light: '#fff3ee',
      dark: '#ef5328',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#0f172a',
      light: '#e2e8f0',
    },
    background: {
      default: '#f4f7fb',
      paper: '#ffffff',
    },
    text: {
      primary: '#111827',
      secondary: '#64748b',
    },
    info: {
      main: '#2563eb',
    },
    success: {
      main: '#10b981',
    },
    warning: {
      main: '#f59e0b',
    },
    error: {
      main: '#ef4444',
    },
  },
  shape: {
    borderRadius: 16,
  },
  typography: {
    fontFamily: 'Inter, Roboto, "Segoe UI", sans-serif',
    h1: { fontWeight: 800, letterSpacing: '-0.04em' },
    h2: { fontWeight: 800, letterSpacing: '-0.04em' },
    h3: { fontWeight: 800, letterSpacing: '-0.03em' },
    h4: { fontWeight: 800, letterSpacing: '-0.03em' },
    h5: { fontWeight: 700, letterSpacing: '-0.02em' },
    h6: { fontWeight: 700, letterSpacing: '-0.02em' },
    button: { fontWeight: 700, textTransform: 'none' },
  },
  shadows: [
    'none',
    '0px 1px 2px rgba(15, 23, 42, 0.05)',
    '0px 6px 16px rgba(15, 23, 42, 0.06)',
    '0px 10px 24px rgba(15, 23, 42, 0.07)',
    '0px 16px 34px rgba(15, 23, 42, 0.07)',
    '0px 20px 40px rgba(15, 23, 42, 0.08)',
    '0px 24px 50px rgba(15, 23, 42, 0.08)',
    '0px 26px 56px rgba(15, 23, 42, 0.09)',
    '0px 28px 62px rgba(15, 23, 42, 0.09)',
    '0px 32px 72px rgba(15, 23, 42, 0.10)',
    '0px 36px 80px rgba(15, 23, 42, 0.10)',
    '0px 42px 90px rgba(15, 23, 42, 0.11)',
    '0px 46px 100px rgba(15, 23, 42, 0.12)',
    '0px 52px 110px rgba(15, 23, 42, 0.12)',
    '0px 56px 120px rgba(15, 23, 42, 0.12)',
    '0px 60px 130px rgba(15, 23, 42, 0.13)',
    '0px 66px 140px rgba(15, 23, 42, 0.13)',
    '0px 72px 150px rgba(15, 23, 42, 0.13)',
    '0px 78px 160px rgba(15, 23, 42, 0.14)',
    '0px 84px 170px rgba(15, 23, 42, 0.14)',
    '0px 90px 180px rgba(15, 23, 42, 0.14)',
    '0px 96px 190px rgba(15, 23, 42, 0.14)',
    '0px 102px 200px rgba(15, 23, 42, 0.14)',
    '0px 108px 210px rgba(15, 23, 42, 0.14)',
    '0px 114px 220px rgba(15, 23, 42, 0.14)',
  ] as any,
  components: {
    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          border: '1px solid rgba(148, 163, 184, 0.14)',
          borderRadius: 18,
          backgroundImage: 'none',
          boxShadow: '0 14px 28px rgba(15, 23, 42, 0.04)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          color: '#0f172a',
          boxShadow: '0 10px 30px rgba(15, 23, 42, 0.04)',
          borderBottom: '1px solid rgba(148, 163, 184, 0.2)',
          backdropFilter: 'blur(18px)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontWeight: 700,
          letterSpacing: '0.01em',
          boxShadow: 'none',
          textTransform: 'none',
          paddingTop: 10,
          paddingBottom: 10,
          background: 'linear-gradient(135deg, #ff6a3d 0%, #ff8a5d 100%)',
          color: '#ffffff',
          '&:hover': {
            background: 'linear-gradient(135deg, #f25d30 0%, #f77a47 100%)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          fontWeight: 600,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: '#ffffff',
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
          '& fieldset': {
            borderColor: 'rgba(148, 163, 184, 0.45)',
          },
          '&:hover fieldset': {
            borderColor: 'rgba(255, 106, 61, 0.45)',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#ff6a3d',
            boxShadow: '0 0 0 3px rgba(255, 106, 61, 0.12)',
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: '1px solid rgba(148, 163, 184, 0.18)',
          boxShadow: '0 18px 50px rgba(15, 23, 42, 0.08)',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          marginBottom: 2,
        },
      },
    },
  },
});
