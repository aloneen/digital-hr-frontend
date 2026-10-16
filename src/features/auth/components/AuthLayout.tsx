import { Box, Typography } from '@mui/material';
import type { ReactNode } from 'react';

type AuthLayoutProps = {
  illustrationSrc: string;
  illustrationAlt: string;
  children: ReactNode;
  inCard?: boolean;
};

export default function AuthLayout({
  illustrationSrc,
  illustrationAlt,
  children,
  inCard = false,
}: AuthLayoutProps) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        bgcolor: '#FFFFFF',
      }}
    >
      {/* Left Column: Peach illustration panel */}
      <Box
        sx={{
          width: { xs: '100%', md: '50%' },
          minHeight: { xs: 260, md: '100vh' },
          bgcolor: '#FEF1EB',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 3, md: 6 },
          position: 'relative',
        }}
      >
        <Box
          component="img"
          src={illustrationSrc}
          alt={illustrationAlt}
          sx={{
            maxWidth: '100%',
            maxHeight: { xs: 260, sm: 360, md: 540, lg: 620 },
            objectFit: 'contain',
            filter: 'drop-shadow(0 10px 25px rgba(250, 84, 28, 0.08))',
          }}
        />
      </Box>

      {/* Right Column: Clean white form container */}
      <Box
        sx={{
          width: { xs: '100%', md: '50%' },
          minHeight: { xs: 'auto', md: '100vh' },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: { xs: 3, sm: 5, md: 6, lg: 8 },
          overflowY: 'auto',
        }}
      >
        {/* Top Spacer or Header */}
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mb: { xs: 2, md: 3 } }}>
          <Box
            component="img"
            src="/auth/smarthr-logo.png"
            alt="SmartHR"
            sx={{
              height: 34,
              objectFit: 'contain',
              cursor: 'pointer',
            }}
          />
        </Box>

        {/* Center Content / Form */}
        <Box
          sx={{
            width: '100%',
            maxWidth: 440,
            ...(inCard && {
              p: { xs: 3, sm: 4 },
              borderRadius: 3,
              boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
              border: '1px solid #F3F4F6',
            }),
          }}
        >
          {children}
        </Box>

        {/* Footer */}
        <Box sx={{ mt: { xs: 4, md: 3 }, textAlign: 'center' }}>
          <Typography variant="caption" sx={{ color: '#6B7280', fontSize: '0.8rem' }}>
            Copyright @2026 - SmartHR (JanaPost)
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
