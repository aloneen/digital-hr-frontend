import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  LinearProgress,
  Typography,
} from '@mui/material';
import {
  BeachAccess,
  Business,
  CalendarMonth,
  Email,
  LocationOn,
  Psychology,
  School,
  SupervisorAccount,
  Work,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { profileApi } from '../api/profileApi';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['profile'],
    queryFn: profileApi.getProfile,
  });

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !profile) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{t('profile.loadError')}</Typography>
      </Box>
    );
  }

  const vacationTotal = profile.vacationDaysTotal ?? 24;
  const vacationUsed = profile.vacationDaysUsed ?? 0;
  const vacationLeft = profile.vacationDaysLeft ?? Math.max(0, vacationTotal - vacationUsed);
  const vacationPercent = Math.min(100, Math.round((vacationUsed / (vacationTotal || 1)) * 100));

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 1, md: 2 } }}>
      <Card
        sx={{
          mb: 3,
          p: 3,
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          color: '#fff',
          borderRadius: 3,
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 3,
            alignItems: { xs: 'flex-start', sm: 'center' },
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: 'primary.main',
                fontSize: '2rem',
                fontWeight: 700,
                boxShadow: '0 4px 12px rgba(31,111,235,0.4)',
              }}
            >
              {profile.fullName?.charAt(0) || profile.email?.charAt(0).toUpperCase() || 'U'}
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#fff' }}>
                {profile.fullName || profile.email}
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mt: 0.5 }}>
                {profile.position || t('profile.employeeDefault')}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                <Chip
                  label={profile.role}
                  size="small"
                  sx={{
                    bgcolor: 'rgba(56, 189, 248, 0.2)',
                    color: '#38bdf8',
                    fontWeight: 600,
                    border: '1px solid rgba(56, 189, 248, 0.4)',
                  }}
                />
                <Chip
                  label={profile.company || 'АО «JanaPost»'}
                  size="small"
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    color: '#fff',
                  }}
                />
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'row', sm: 'column' },
              gap: 1,
              width: { xs: '100%', sm: 'auto' },
            }}
          >
            <Button
              variant="contained"
              startIcon={<BeachAccess />}
              onClick={() => navigate('/requests')}
              sx={{
                bgcolor: '#168B48',
                '&:hover': { bgcolor: '#11703A' },
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: 2,
              }}
            >
              {t('profile.createRequest')}
            </Button>
            <Button
              variant="outlined"
              startIcon={<Psychology />}
              onClick={() => navigate('/ai-assistant')}
              sx={{
                borderColor: 'rgba(255,255,255,0.4)',
                color: '#fff',
                '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.05)' },
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: 2,
              }}
            >
              {t('profile.askAi')}
            </Button>
          </Box>
        </Box>
      </Card>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ borderRadius: 3, height: '100%', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Work sx={{ color: 'primary.main' }} /> {t('profile.employeeInfo')}
              </Typography>
              <Divider sx={{ mb: 2.5 }} />

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Business sx={{ color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      {t('profile.department')}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {profile.departmentName || t('profile.headOffice')}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <LocationOn sx={{ color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      {t('profile.location')}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {profile.city || 'Almaty'}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <SupervisorAccount sx={{ color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      {t('profile.manager')}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                      {profile.managerName || t('profile.defaultManager')}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <CalendarMonth sx={{ color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      {t('profile.hireDate')}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {profile.hireDate || '01.02.2023'}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Email sx={{ color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      {t('profile.email')}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {profile.email}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BeachAccess sx={{ color: '#0ea5e9' }} /> {t('profile.vacationBalance')}
                  </Typography>
                  <Chip
                    label={t('profile.year', { year: '2026' })}
                    size="small"
                    sx={{ bgcolor: '#e0f2fe', color: '#0369a1', fontWeight: 600 }}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {t('profile.vacationDescription')}
                </Typography>

                <Box sx={{ bgcolor: '#f8fafc', p: 2, borderRadius: 2, mb: 2, border: '1px solid #e2e8f0' }}>
                  <Grid container spacing={2} sx={{ textAlign: 'center' }}>
                    <Grid size={{ xs: 4 }}>
                      <Typography variant="caption" color="text.secondary">
                        {t('profile.vacationTotal')}
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 800, color: '#334155' }}>
                        {vacationTotal}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {t('profile.days')}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 4 }}>
                      <Typography variant="caption" color="text.secondary">
                        {t('profile.vacationUsed')}
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 800, color: '#f59e0b' }}>
                        {vacationUsed}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {t('profile.days')}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 4 }}>
                      <Typography variant="caption" color="text.secondary">
                        {t('profile.vacationLeft')}
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 800, color: '#168B48' }}>
                        {vacationLeft}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {t('profile.days')}
                      </Typography>
                    </Grid>
                  </Grid>

                  <Box sx={{ mt: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">
                        {t('profile.usedPercent', { percent: vacationPercent })}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {t('profile.leftPercent', { percent: 100 - vacationPercent })}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={vacationPercent}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: '#e2e8f0',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: vacationPercent > 80 ? '#ef4444' : '#0ea5e9',
                        },
                      }}
                    />
                  </Box>
                </Box>

                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => navigate('/requests')}
                  sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
                >
                  {t('profile.requestLeaveOrAdvance')}
                </Button>
              </CardContent>
            </Card>

            <Card sx={{ borderRadius: 3, boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <School sx={{ color: '#8b5cf6' }} /> Jana Academy
                  </Typography>
                  <Chip
                    label={t('profile.lmsCorporate')}
                    size="small"
                    sx={{ bgcolor: '#f3e8ff', color: '#7e22ce', fontWeight: 600 }}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {t('profile.learningProgress')}
                </Typography>

                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid size={{ xs: 6 }}>
                    <Box sx={{ p: 2, bgcolor: '#faf5ff', borderRadius: 2, border: '1px solid #f3e8ff', textAlign: 'center' }}>
                      <Typography variant="h4" sx={{ fontWeight: 800, color: '#7e22ce' }}>
                        {profile.activeCoursesCount ?? 2}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {t('profile.coursesInProgress')}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Box sx={{ p: 2, bgcolor: '#f0fdf4', borderRadius: 2, border: '1px solid #dcfce7', textAlign: 'center' }}>
                      <Typography variant="h4" sx={{ fontWeight: 800, color: '#16a34a' }}>
                        {profile.completedCoursesCount ?? 1}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {t('profile.completedCourses')}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => navigate('/academy')}
                  sx={{
                    bgcolor: '#7e22ce',
                    '&:hover': { bgcolor: '#6b21a8' },
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: 2,
                  }}
                >
                  {t('profile.goToAcademy')}
                </Button>
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
