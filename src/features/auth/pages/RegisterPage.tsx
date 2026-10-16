import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import {
  MailOutlined,
  PersonOutlined,
  VisibilityOffOutlined,
  VisibilityOutlined,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import SocialLoginButtons from '../components/SocialLoginButtons';

export default function RegisterPage() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!agreeTerms) {
      setError('Please agree to Terms & Privacy policy');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/email-verification');
    }, 600);
  };

  return (
    <AuthLayout
      illustrationSrc="/auth/register-illustration.png"
      illustrationAlt="Register Illustration"
    >
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: '#111827', mb: 0.5, fontSize: '1.75rem' }}>
          Sign Up
        </Typography>
        <Typography variant="body2" sx={{ color: '#6B7280', fontSize: '0.9rem' }}>
          Please enter your details to sign up
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        {/* Name */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" sx={{ fontWeight: 600, color: '#374151', display: 'block', mb: 0.8 }}>
            Name
          </Typography>
          <TextField
            fullWidth
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
                    <PersonOutlined sx={{ color: '#9CA3AF', fontSize: 20 }} />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>

        {/* Email */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" sx={{ fontWeight: 600, color: '#374151', display: 'block', mb: 0.8 }}>
            Email Address
          </Typography>
          <TextField
            fullWidth
            type="email"
            placeholder="Enter your email"
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

        {/* Password */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" sx={{ fontWeight: 600, color: '#374151', display: 'block', mb: 0.8 }}>
            Password
          </Typography>
          <TextField
            fullWidth
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
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

        {/* Confirm Password */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" sx={{ fontWeight: 600, color: '#374151', display: 'block', mb: 0.8 }}>
            Confirm Password
          </Typography>
          <TextField
            fullWidth
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      sx={{ color: '#9CA3AF' }}
                    >
                      {showConfirmPassword ? (
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

        {/* Agree terms */}
        <Box sx={{ mb: 2.5 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                size="small"
                sx={{
                  color: '#D1D5DB',
                  '&.Mui-checked': { color: '#FF5B22' },
                }}
              />
            }
            label={
              <Typography variant="body2" sx={{ color: '#4B5563', fontSize: '0.85rem' }}>
                Agree to{' '}
                <Typography component="span" sx={{ color: '#FF5B22', fontWeight: 600, fontSize: '0.85rem' }}>
                  Terms & Privacy
                </Typography>
              </Typography>
            }
          />
        </Box>

        {/* Sign Up Button */}
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
          {isSubmitting ? 'Signing Up...' : 'Sign Up'}
        </Button>

        {/* Back to Sign In Link */}
        <Box sx={{ textAlign: 'center', mt: 2.5 }}>
          <Typography variant="body2" sx={{ color: '#6B7280', fontSize: '0.875rem' }}>
            Already have an account?{' '}
            <Typography
              component={Link}
              to="/login"
              variant="body2"
              sx={{
                color: '#FF5B22',
                fontWeight: 700,
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              Sign In
            </Typography>
          </Typography>
        </Box>

        <SocialLoginButtons />
      </Box>
    </AuthLayout>
  );
}
