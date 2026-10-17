import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import { VisibilityOffOutlined, VisibilityOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate strength (0 to 5)
  const strength = Math.min(
    5,
    (password.length >= 8 ? 2 : password.length > 4 ? 1 : 0) +
      (/[0-9]/.test(password) ? 1 : 0) +
      (/[A-Z]/.test(password) ? 1 : 0) +
      (/[^A-Za-z0-9]/.test(password) ? 1 : 0),
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      setError('Please fill in both password fields');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/auth-success');
    }, 600);
  };

  return (
    <AuthLayout
      illustrationSrc="/auth/reset-illustration.png"
      illustrationAlt="Reset Password Illustration"
    >
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: '#111827', mb: 1, fontSize: '1.75rem' }}>
          Reset Password
        </Typography>
        <Typography variant="body2" sx={{ color: '#6B7280', fontSize: '0.9rem' }}>
          Your new password must be different from previous used passwords.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        {/* Password */}
        <Box sx={{ mb: 1.5 }}>
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
                '&.Mui-focused fieldset': { borderColor: '#168B48' },
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

        {/* 5 Segment Password Strength Bars */}
        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
          {[1, 2, 3, 4, 5].map((seg) => (
            <Box
              key={seg}
              sx={{
                flex: 1,
                height: 4,
                borderRadius: 2,
                bgcolor:
                  strength >= seg
                    ? strength >= 4
                      ? '#168B48'
                      : strength >= 2
                        ? '#F59E0B'
                        : '#EF4444'
                    : '#E5E7EB',
                transition: 'background-color 0.2s',
              }}
            />
          ))}
        </Box>

        <Typography variant="caption" sx={{ color: '#9CA3AF', fontSize: '0.75rem', display: 'block', mb: 2.5 }}>
          Use 8 or more characters with a mix of letters, numbers & symbols.
        </Typography>

        {/* Confirm Password */}
        <Box sx={{ mb: 3 }}>
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
                '&.Mui-focused fieldset': { borderColor: '#168B48' },
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

        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={isSubmitting}
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
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </Box>
    </AuthLayout>
  );
}
