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
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const stats = [
  { label: 'Total employees', value: '1,248', trend: '+8.2%' },
  { label: 'Open vacancies', value: '34', trend: '-3.1%' },
  { label: 'New candidates', value: '96', trend: '+14.7%' },
  { label: 'Onboarding in progress', value: '18', trend: '+2.5%' },
];

const chartData = [
  { name: 'Jan', value: 30 },
  { name: 'Feb', value: 42 },
  { name: 'Mar', value: 38 },
  { name: 'Apr', value: 58 },
  { name: 'May', value: 66 },
  { name: 'Jun', value: 82 },
  { name: 'Jul', value: 88 },
];

const activity = [
  { title: 'New vacancy approved', subtitle: 'HR · 2 hours ago', tone: 'success' },
  { title: '3 candidates advanced to interview', subtitle: 'Recruiting · 6 hours ago', tone: 'primary' },
  { title: 'Employee onboarding checklist updated', subtitle: 'Operations · today', tone: 'warning' },
];

export default function DashboardPage() {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Overview
        </Typography>
        <Chip label="Updated 2 mins ago" color="primary" variant="outlined" />
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        {stats.map((item) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={item.label}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    {item.label}
                  </Typography>
                  <Chip label={item.trend} size="small" color={item.trend.startsWith('+') ? 'success' : 'default'} />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {item.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                Hiring dynamics
              </Typography>
              <Box sx={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorUv" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="5%" stopColor="#1f6feb" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#1f6feb" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Area type="monotone" dataKey="value" stroke="#1f6feb" fill="url(#colorUv)" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                Recent activity
              </Typography>
              <List disablePadding>
                {activity.map((item) => (
                  <ListItem key={item.title} disableGutters sx={{ px: 0, py: 1.5 }}>
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          width: 36,
                          height: 36,
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
                        }}
                      >
                        {item.title.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {item.title}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          {item.subtitle}
                        </Typography>
                      }
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
