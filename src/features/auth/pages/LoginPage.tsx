import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const demoAccounts = [
  { label: 'Сотрудник (Личный кабинет)', email: 'employee@janapost.kz', pass: 'empl1234', color: 'primary' },
  { label: 'HR Специалист', email: 'hr@janapost.kz', pass: 'hr123456', color: 'success' },
  { label: 'Директор филиала', email: 'director@janapost.kz', pass: 'dir12345', color: 'secondary' },
  { label: 'Администратор системы', email: 'admin@janapost.kz', pass: 'admin123', color: 'default' },
] as const;

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('employee@janapost.kz');
  const [password, setPassword] = useState('empl1234');
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
      setError(err instanceof Error ? err.message : 'Login failed');
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
          maxWidth: 960,
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1.05fr 1fr' },
          overflow: 'hidden',
          borderRadius: 3,
          boxShadow: '0 12px 36px rgba(15, 23, 42, 0.12)',
          border: '1px solid rgba(15, 23, 42, 0.08)',
        }}
      >
        <Box
          sx={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e40af 100%)',
            color: '#fff',
            p: { xs: 3, md: 5 },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <Typography variant="overline" sx={{ opacity: 0.8, letterSpacing: 1.5, fontWeight: 700 }}>
            JanaPost Digital HR
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 800, lineHeight: 1.15, mb: 2 }}>
            Одна платформа для сотрудника
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: 380, lineHeight: 1.6 }}>
            Личный кабинет с балансом отпуска, HR-сервисы, Академия Jana Academy, база знаний AI Jana и сквозная интеграция с 1С и Documentolog.
          </Typography>

          <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.18)' }} />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, opacity: 0.9 }}>
            <Typography variant="body2">• Личный кабинет и остаток отпуска онлайн</Typography>
            <Typography variant="body2">• Заявки на отпуск/аванс со связкой с 1С и Documentolog</Typography>
            <Typography variant="body2">• Корпоративная академия Jana Academy с прогрессом</Typography>
            <Typography variant="body2">• AI Jana HR-ассистент без галлюцинаций</Typography>
          </Box>
        </Box>

        <CardContent sx={{ p: { xs: 3, md: 4.5 }, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>
              Вход в систему
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
              Выберите тестовую роль или введите учетные данные:
            </Typography>

            {/* Quick Demo Role Selection Chips */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 1 }}>
                Быстрый вход для проверки жюри:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                {demoAccounts.map((acc) => {
                  const isSelected = email === acc.email;
                  return (
                    <Chip
                      key={acc.email}
                      label={acc.label}
                      onClick={() => handleSelectDemo(acc.email, acc.pass)}
                      clickable
                      color={isSelected ? 'primary' : 'default'}
                      variant={isSelected ? 'filled' : 'outlined'}
                      size="small"
                      sx={{ fontWeight: 600, fontSize: '0.75rem' }}
                    />
                  );
                })}
              </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {error && <Alert severity="error">{error}</Alert>}

              <TextField
                label="Корпоративный Email"
                type="email"
                fullWidth
                size="small"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />

              <TextField
                label="Пароль"
                type="password"
                fullWidth
                size="small"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={isSubmitting}
                sx={{
                  bgcolor: '#2563eb',
                  '&:hover': { bgcolor: '#1d4ed8' },
                  textTransform: 'none',
                  fontWeight: 700,
                  py: 1.2,
                  borderRadius: 2,
                }}
              >
                {isSubmitting ? 'Вход в аккаунт...' : 'Войти в личный кабинет'}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
