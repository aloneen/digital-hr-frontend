import { Box, Button, Typography } from '@mui/material';
import { Check } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';

export default function AuthSuccessPage() {
  const navigate = useNavigate();

  return (
    <AuthLayout
      illustrationSrc="/auth/success-illustration.png"
      illustrationAlt="Success Illustration"
    >
      <Box sx={{ textAlign: 'center', py: { xs: 2, md: 4 } }}>
        {/* Green Checkmark Circle */}
        <Box
          sx={{
            width: 52,
            height: 52,
            borderRadius: '50%',
            bgcolor: '#168B48',
            color: '#FFFFFF',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2.5,
            boxShadow: '0 4px 14px rgba(22, 139, 72, 0.3)',
          }}
        >
          <Check sx={{ fontSize: 32, stroke: '#FFFFFF', strokeWidth: 1.5 }} />
        </Box>

        <Typography variant="h5" sx={{ fontWeight: 800, color: '#111827', mb: 1, fontSize: '1.75rem' }}>
          Success
        </Typography>

        <Typography variant="body2" sx={{ color: '#6B7280', fontSize: '0.95rem', mb: 4 }}>
          Your new password has been successfully saved
        </Typography>

        <Button
          fullWidth
          variant="contained"
          onClick={() => navigate('/login')}
          sx={{
            bgcolor: '#168B48',
            '&:hover': { bgcolor: '#11703A' },
            color: '#FFFFFF',
            py: 1.3,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '0.95rem',
            fontWeight: 700,
            boxShadow: 'none',
          }}
        >
          Back to Sign In
        </Button>
      </Box>
    </AuthLayout>
  );
}
