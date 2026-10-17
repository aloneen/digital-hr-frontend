import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { employeesApi } from '../api/employeesApi';

const statusColor: Record<string, 'success' | 'warning' | 'default'> = {
  ACTIVE: 'success',
  ON_LEAVE: 'warning',
  TERMINATED: 'default',
};

export default function EmployeeDetailPage() {
  const { id } = useParams();
  const employeeId = Number(id);

  const { data: employee, isLoading, isError } = useQuery({
    queryKey: ['employee', employeeId],
    queryFn: () => employeesApi.getById(employeeId),
    enabled: !!employeeId,
  });

  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
      </Box>
    );
  }

  if (isError || !employee) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Employee not found</Alert>
      </Box>
    );
  }

  const fullName = `${employee.firstName} ${employee.lastName}`;
  const initials = `${employee.firstName?.[0] ?? ''}${employee.lastName?.[0] ?? ''}`.toUpperCase();

  return (
    <Box sx={{ p: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Button component={Link} to="/employees" startIcon={<ArrowBackIcon />}>
          Back to employees
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 4 }}>
          <Card sx={{ overflow: 'hidden' }}>
            <Box
              sx={{
                height: 160,
                background: 'linear-gradient(135deg, #34d399 0%, #168B48 50%, #0F6433 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box
                sx={{
                  width: 112,
                  height: 112,
                  borderRadius: '50%',
                  background: '#fff',
                  border: '4px solid rgba(255,255,255,0.8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 32,
                  color: '#168B48',
                  fontWeight: 800,
                  boxShadow: '0 12px 30px rgba(15, 23, 42, 0.12)',
                }}
              >
                {initials}
              </Box>
            </Box>

            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                  {fullName}
                </Typography>
                <Chip label={employee.status} color={statusColor[employee.status] || 'default'} />
              </Box>

              <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
                <WorkIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                {employee.position}
              </Typography>

              <Stack spacing={1.5} sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationOnIcon color="action" fontSize="small" />
                  <Typography variant="body2">{employee.city || '—'}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EmailIcon color="action" fontSize="small" />
                  <Typography variant="body2">{employee.email || '—'}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PhoneIcon color="action" fontSize="small" />
                  <Typography variant="body2">{employee.phone || '—'}</Typography>
                </Box>
              </Stack>

              <Divider sx={{ my: 2 }} />

              <Stack direction="row" spacing={1}>
                <Button variant="contained" fullWidth>
                  Edit info
                </Button>
                <Button variant="outlined" fullWidth>
                  Message
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 8 }}>
          <Stack spacing={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                  Basic information
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="caption" color="text.secondary">Department</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>{employee.departmentId}</Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="caption" color="text.secondary">Hire date</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>{employee.hireDate || '—'}</Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="caption" color="text.secondary">Birth date</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>{employee.birthDate || '—'}</Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="caption" color="text.secondary">IIN</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>{employee.iin || '—'}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                  Performance overview
                </Typography>
                <Stack spacing={2}>
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2" color="text.secondary">Productivity</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>81%</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={81} color="success" sx={{ height: 10, borderRadius: 999 }} />
                  </Box>
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2" color="text.secondary">Engagement</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>76%</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={76} color="warning" sx={{ height: 10, borderRadius: 999 }} />
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
