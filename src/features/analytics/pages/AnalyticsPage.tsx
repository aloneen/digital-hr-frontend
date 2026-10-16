import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
} from '@mui/material';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '../api/analyticsApi';

const COLORS = ['#1f6feb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function AnalyticsPage() {
  const { data: dashboard, isLoading: loadingDashboard } = useQuery({
    queryKey: ['analytics-dashboard'],
    queryFn: analyticsApi.getDashboard,
  });

  const { data: headcount, isLoading: loadingHeadcount } = useQuery({
    queryKey: ['analytics-headcount'],
    queryFn: analyticsApi.getHeadcount,
  });

  const { data: vacancyStats, isLoading: loadingVacancyStats } = useQuery({
    queryKey: ['analytics-vacancy-stats'],
    queryFn: analyticsApi.getVacancyStats,
  });

  const { data: hiring, isLoading: loadingHiring } = useQuery({
    queryKey: ['analytics-hiring'],
    queryFn: analyticsApi.getHiring,
  });

  const { data: turnover, isLoading: loadingTurnover } = useQuery({
    queryKey: ['analytics-turnover'],
    queryFn: analyticsApi.getTurnover,
  });

  const hiringTrend = (hiring || []).map((item) => ({
    ...item,
    label: monthNames[(item.month ?? 1) - 1] || `M${item.month}`,
  }));

  const turnoverTrend = (turnover || []).map((item) => ({
    ...item,
    label: monthNames[(item.month ?? 1) - 1] || `M${item.month}`,
  }));

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        Analytics
      </Typography>

      {loadingDashboard ? (
        <Typography>Loading dashboard...</Typography>
      ) : dashboard ? (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Total employees
                </Typography>
                <Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>
                  {dashboard.totalEmployees}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Active employees
                </Typography>
                <Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>
                  {dashboard.activeEmployees}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Open vacancies
                </Typography>
                <Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>
                  {dashboard.openVacancies}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Onboarding in progress
                </Typography>
                <Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>
                  {dashboard.onboardingInProgress}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : null}

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                Headcount by city
              </Typography>
              {loadingHeadcount ? (
                <Typography>Loading...</Typography>
              ) : (
                <Box sx={{ width: '100%', height: 280 }}>
                  <ResponsiveContainer>
                    <BarChart data={headcount || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="city" tickLine={false} axisLine={false} />
                      <YAxis tickLine={false} axisLine={false} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#1f6feb" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                Vacancy status summary
              </Typography>
              {loadingVacancyStats ? (
                <Typography>Loading...</Typography>
              ) : (
                <Box sx={{ width: '100%', height: 280 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={vacancyStats || []}
                        dataKey="count"
                        nameKey="status"
                        innerRadius={50}
                        outerRadius={90}
                        paddingAngle={3}
                      >
                        {(vacancyStats || []).map((entry, index) => (
                          <Cell key={entry.status} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                Hiring dynamics
              </Typography>
              {loadingHiring ? (
                <Typography>Loading...</Typography>
              ) : (
                <Box sx={{ width: '100%', height: 280 }}>
                  <ResponsiveContainer>
                    <AreaChart data={hiringTrend}>
                      <defs>
                        <linearGradient id="hiringFill" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="label" tickLine={false} axisLine={false} />
                      <YAxis tickLine={false} axisLine={false} />
                      <Tooltip />
                      <Area type="monotone" dataKey="count" stroke="#10b981" fill="url(#hiringFill)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                Hiring vs turnover
              </Typography>
              {loadingTurnover ? (
                <Typography>Loading...</Typography>
              ) : (
                <Box sx={{ width: '100%', height: 280 }}>
                  <ResponsiveContainer>
                    <ComposedChart data={turnoverTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="label" tickLine={false} axisLine={false} />
                      <YAxis tickLine={false} axisLine={false} />
                      <Tooltip />
                      <Bar dataKey="hired" fill="#1f6feb" barSize={14} radius={[4, 4, 0, 0]} />
                      <Line type="monotone" dataKey="terminated" stroke="#ef4444" strokeWidth={3} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
