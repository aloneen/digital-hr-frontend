import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@janapost.kz');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login({ email, password });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #eef4ff 0%, #f8fafc 45%, #eef2ff 100%)',
        p: 3,
      }}
    >
      <Card
        sx={{
          width: '100%',
          maxWidth: 920,
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1.05fr 1fr' },
          overflow: 'hidden',
          border: '1px solid rgba(15, 23, 42, 0.08)',
        }}
      >
        <Box
          sx={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1f6feb 100%)',
            color: '#fff',
            p: { xs: 3, md: 5 },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <Typography variant="overline" sx={{ opacity: 0.8, letterSpacing: 1.4 }}>
            JanaPost
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 800, lineHeight: 1.1, mb: 2 }}>
            Digital HR
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: 360 }}>
            Manage employees, recruitment, onboarding and analytics from one modern people platform.
          </Typography>

          <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.18)' }} />

          <Stack spacing={1.5} sx={{ opacity: 0.9 }}>
            <Typography variant="body2">• Employee lifecycle tracking</Typography>
            <Typography variant="body2">• Hiring pipeline visibility</Typography>
            <Typography variant="body2">• Smart onboarding and HR analytics</Typography>
          </Stack>
        </Box>

        <CardContent sx={{ p: { xs: 3, md: 5 }, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
              Welcome back
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Sign in to access the workspace
            </Typography>

            <Stack spacing={2.5}>
              {error && <Alert severity="error">{error}</Alert>}

              <TextField
                label="Email"
                type="email"
                fullWidth
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />

              <TextField
                label="Password"
                type="password"
                fullWidth
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />

              <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
                {isSubmitting ? 'Signing in...' : 'Login'}
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
