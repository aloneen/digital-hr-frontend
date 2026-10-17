import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const stats = [
  { key: 'dashboard.totalEmployees', value: '1,248', trend: '+8.2%', tone: 'primary' },
  { key: 'dashboard.openVacancies', value: '34', trend: '-3.1%', tone: 'neutral' },
  { key: 'dashboard.newCandidates', value: '96', trend: '+14.7%', tone: 'success' },
  { key: 'dashboard.onboarding', value: '18', trend: '+2.5%', tone: 'info' },
];

const chartData = [
  { name: 'Jan', value: 30 },
  { name: 'Feb', value: 42 },
  { name: 'Mar', value: 38 },
  { name: 'Apr', value: 58 },
  { name: 'May', value: 66 },
  { name: 'Jun', value: 82 },
  { name: 'Jul', value: 88 },
  { name: 'Aug', value: 92 },
];

const activity = [
  { titleKey: 'status.newVacancy', subtitleKey: 'status.hr', tone: 'success' },
  { titleKey: 'status.candidatesAdvanced', subtitleKey: 'status.recruiting', tone: 'primary' },
  { titleKey: 'status.onboardingUpdated', subtitleKey: 'status.operations', tone: 'warning' },
];

export default function DashboardPage() {
  const { t } = useTranslation();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700 }}>
            {t('dashboard.overview')}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.03em', mt: 0.5 }}>
            {t('dashboard.title')}
          </Typography>
        </Box>
        <Chip label={t('dashboard.updated')} color="primary" variant="outlined" sx={{ fontWeight: 700, borderRadius: 999 }} />
      </Box>

      <Grid container spacing={3} sx={{ mb: 0.5 }}>
        {stats.map((item) => {
          const chipColor = item.tone === 'success' ? 'success' : item.tone === 'info' ? 'info' : item.tone === 'primary' ? 'primary' : 'default';

          return (
            <Grid key={item.key} size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.25 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                      {t(item.key)}
                    </Typography>
                    <Chip
                      label={item.trend}
                      size="small"
                      color={chipColor}
                      variant={item.trend.startsWith('+') ? 'filled' : 'outlined'}
                      sx={{ fontWeight: 700 }}
                    />
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.04em' }}>
                    {item.value}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
                  {t('dashboard.hiringDynamics')}
                </Typography>
                <Chip label={t('dashboard.thisYear')} variant="outlined" size="small" sx={{ fontWeight: 700 }} />
              </Box>
              <Box sx={{ width: '100%', height: 320 }}>
                <ResponsiveContainer>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="hiringAreaFill" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="5%" stopColor="#168B48" stopOpacity={0.28} />
                        <stop offset="95%" stopColor="#168B48" stopOpacity={0.04} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" vertical={false} />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={12} tick={{ fill: '#64748b', fontSize: 12 }} />
                    <YAxis tickLine={false} axisLine={false} tickMargin={10} tick={{ fill: '#64748b', fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 16,
                        border: '1px solid rgba(148, 163, 184, 0.2)',
                        boxShadow: '0 20px 45px rgba(15, 23, 42, 0.08)',
                      }}
                    />
                    <Area type="monotone" dataKey="value" stroke="#168B48" strokeWidth={3} fill="url(#hiringAreaFill)" />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2.5, fontWeight: 800, letterSpacing: '-0.02em' }}>
                {t('dashboard.recentActivity')}
              </Typography>
              <List disablePadding>
                {activity.map((item) => (
                  <ListItem key={item.titleKey} disableGutters sx={{ px: 0, py: 1.4, alignItems: 'flex-start' }}>
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          width: 38,
                          height: 38,
                          bgcolor:
                            item.tone === 'success'
                              ? 'success.light'
                              : item.tone === 'warning'
                                ? 'warning.light'
                                : 'primary.light',
                          color:
                            item.tone === 'success'
                              ? 'success.dark'
                              : item.tone === 'warning'
                                ? 'warning.dark'
                                : 'primary.dark',
                          fontWeight: 700,
                        }}
                      >
                        {t(item.titleKey).charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={<Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.5 }}>{t(item.titleKey)}</Typography>}
                      secondary={<Typography variant="caption" color="text.secondary">{t(item.subtitleKey)}</Typography>}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
