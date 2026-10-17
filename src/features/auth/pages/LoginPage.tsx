import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
  FormControlLabel,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import {
  MailOutlined,
  VisibilityOffOutlined,
  VisibilityOutlined,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/AuthLayout';
import SocialLoginButtons from '../components/SocialLoginButtons';

const demoAccounts = [
  { labelKey: 'auth.employee', email: 'employee@janapost.kz', pass: 'empl1234' },
  { labelKey: 'auth.hr', email: 'hr@janapost.kz', pass: 'hr123456' },
  { labelKey: 'auth.director', email: 'director@janapost.kz', pass: 'dir12345' },
  { labelKey: 'auth.admin', email: 'admin@janapost.kz', pass: 'admin123' },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useTranslation();

  const [email, setEmail] = useState('employee@janapost.kz');
  const [password, setPassword] = useState('empl1234');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login({ email, password });
      navigate('/', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid credentials');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectDemo = (accEmail: string, accPass: string) => {
    setEmail(accEmail);
    setPassword(accPass);
    setError('');
  };

  return (
    <AuthLayout illustrationSrc="/auth/login-illustration.png" illustrationAlt="Login Illustration">
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: '#111827', mb: 0.5, fontSize: '1.75rem' }}>
          {t('auth.signIn')}
        </Typography>
        <Typography variant="body2" sx={{ color: '#6B7280', fontSize: '0.9rem' }}>
          {t('auth.signInSubtitle')}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Box sx={{ mb: 2.5 }}>
          <Typography variant="caption" sx={{ fontWeight: 600, color: '#374151', display: 'block', mb: 0.8 }}>
            {t('auth.email')}
          </Typography>
          <TextField
            fullWidth
            type="email"
            placeholder={t('auth.placeholderEmail')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                bgcolor: '#FFFFFF',
                '& fieldset': { borderColor: '#E5E7EB' },
                '&:hover fieldset': { borderColor: '#D1D5DB' },
                '&.Mui-focused fieldset': { borderColor: '#FF5B22' },
              },
            }}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <MailOutlined sx={{ color: '#9CA3AF', fontSize: 20 }} />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" sx={{ fontWeight: 600, color: '#374151', display: 'block', mb: 0.8 }}>
            {t('auth.password')}
          </Typography>
          <TextField
            fullWidth
            type={showPassword ? 'text' : 'password'}
            placeholder={t('auth.placeholderPassword')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                bgcolor: '#FFFFFF',
                '& fieldset': { borderColor: '#E5E7EB' },
                '&:hover fieldset': { borderColor: '#D1D5DB' },
                '&.Mui-focused fieldset': { borderColor: '#FF5B22' },
              },
            }}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      onClick={() => setShowPassword((prev) => !prev)}
                      sx={{ color: '#9CA3AF' }}
                    >
                      {showPassword ? (
                        <VisibilityOutlined sx={{ fontSize: 20 }} />
                      ) : (
                        <VisibilityOffOutlined sx={{ fontSize: 20 }} />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                size="small"
                sx={{
                  color: '#D1D5DB',
                  '&.Mui-checked': { color: '#FF5B22' },
                }}
              />
            }
            label={<Typography variant="body2" sx={{ color: '#4B5563', fontSize: '0.85rem' }}>{t('auth.rememberMe')}</Typography>}
          />

          <Typography
            component={Link}
            to="/forgot-password"
            variant="body2"
            sx={{
              color: '#FF5B22',
              fontWeight: 600,
              textDecoration: 'none',
              fontSize: '0.85rem',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            {t('auth.forgotPassword')}
          </Typography>
        </Box>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={isSubmitting}
          sx={{
            bgcolor: '#FF5B22',
            '&:hover': { bgcolor: '#E04815' },
            color: '#FFFFFF',
            py: 1.3,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '0.95rem',
            fontWeight: 700,
            boxShadow: 'none',
          }}
        >
          {isSubmitting ? t('auth.signingIn') : t('auth.signIn')}
        </Button>

        <Box sx={{ textAlign: 'center', mt: 2.5 }}>
          <Typography variant="body2" sx={{ color: '#6B7280', fontSize: '0.875rem' }}>
            {t('auth.registerPrompt')}{' '}
            <Typography
              component={Link}
              to="/register"
              variant="body2"
              sx={{
                color: '#FF5B22',
                fontWeight: 700,
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              {t('auth.createAccount')}
            </Typography>
          </Typography>
        </Box>

        <SocialLoginButtons />

        <Box sx={{ mt: 3, pt: 2.5, borderTop: '1px dashed #E5E7EB', textAlign: 'center' }}>
          <Typography variant="caption" sx={{ color: '#9CA3AF', fontWeight: 600, display: 'block', mb: 1 }}>
            {t('auth.demoAccounts')}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 0.8 }}>
            {demoAccounts.map((acc) => {
              const isSelected = email === acc.email;
              return (
                <Chip
                  key={acc.email}
                  label={t(acc.labelKey)}
                  size="small"
                  onClick={() => handleSelectDemo(acc.email, acc.pass)}
                  clickable
                  sx={{
                    bgcolor: isSelected ? '#FF5B22' : '#F3F4F6',
                    color: isSelected ? '#FFFFFF' : '#374151',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    '&:hover': {
                      bgcolor: isSelected ? '#E04815' : '#E5E7EB',
                    },
                  }}
                />
              );
            })}
          </Box>
        </Box>
      </Box>
    </AuthLayout>
  );
}
