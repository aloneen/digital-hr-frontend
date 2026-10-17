import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  InputAdornment,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { employeesApi } from '../api/employeesApi';
import EmployeeFormDialog from '../components/EmployeeFormDialog';

const employeeStatusOptions = ['ACTIVE', 'ON_LEAVE', 'TERMINATED'];

const avatarPalette = ['#168B48', '#ffd166', '#7bdff2', '#8ecae6', '#b8f2e6', '#ffafcc', '#cdb4db', '#90be6d'];

export default function EmployeesPage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [city, setCity] = useState('');
  const [isDialogOpen, setDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const createEmployeeMutation = useMutation({
    mutationFn: (payload: Parameters<typeof employeesApi.create>[0]) => employeesApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });

  const handleCreateEmployee = async (payload: Parameters<typeof employeesApi.create>[0]) => {
    await createEmployeeMutation.mutateAsync(payload);
  };

  const params = useMemo(
    () => ({
      search: search || undefined,
      city: city || undefined,
      status: status || undefined,
      page: 0,
      size: 20,
      sort: 'lastName,asc',
    }),
    [city, search, status],
  );

  const { data, isLoading } = useQuery({
    queryKey: ['employees', params],
    queryFn: () => employeesApi.getAll(params),
  });

  const employees = data?.content || [];
  const totalEmployees = data?.totalElements || employees.length;
  const activeEmployees = employees.filter((employee) => employee.status === 'ACTIVE').length;
  const inactiveEmployees = employees.filter((employee) => employee.status !== 'ACTIVE').length;
  const newJoiners = employees.filter((employee) => {
    if (!employee.hireDate) return false;
    const diffDays = (Date.now() - new Date(employee.hireDate).getTime()) / (1000 * 60 * 60 * 24);
    return diffDays <= 30;
  }).length;

  return (
    <Box sx={{ p: 0.5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, gap: 2, flexWrap: 'wrap' }}>
        <Typography variant='h4' sx={{ fontWeight: 800, letterSpacing: '-0.04em' }}>
          Employee
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button variant='outlined' startIcon={<DownloadIcon />} sx={{ minWidth: 120 }}>
            Export
          </Button>
          <Button variant='contained' startIcon={<AddIcon />} onClick={() => setDialogOpen(true)}>
            Add New Employee
          </Button>
        </Box>
      </Box>

      <EmployeeFormDialog open={isDialogOpen} onClose={() => setDialogOpen(false)} onSubmit={handleCreateEmployee} />

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ p: 0, height: '100%' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 2.25 }}>
              <Box sx={{ width: 44, height: 44, borderRadius: 2, background: 'linear-gradient(135deg, #1EA657, #168B48)', display: 'grid', placeItems: 'center', color: '#fff', fontWeight: 800 }}>
                ☺
              </Box>
              <Box>
                <Typography variant='h6' sx={{ fontWeight: 800 }}>{totalEmployees}</Typography>
                <Typography variant='caption' color='text.secondary'>Total Employees</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ p: 0, height: '100%' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 2.25 }}>
              <Box sx={{ width: 44, height: 44, borderRadius: 2, background: 'linear-gradient(135deg, #5eead4, #10b981)', display: 'grid', placeItems: 'center', color: '#fff', fontWeight: 800 }}>
                ✓
              </Box>
              <Box>
                <Typography variant='h6' sx={{ fontWeight: 800 }}>{activeEmployees}</Typography>
                <Typography variant='caption' color='text.secondary'>Active</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ p: 0, height: '100%' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 2.25 }}>
              <Box sx={{ width: 44, height: 44, borderRadius: 2, background: 'linear-gradient(135deg, #fca5a5, #ef4444)', display: 'grid', placeItems: 'center', color: '#fff', fontWeight: 800 }}>
                ×
              </Box>
              <Box>
                <Typography variant='h6' sx={{ fontWeight: 800 }}>{inactiveEmployees}</Typography>
                <Typography variant='caption' color='text.secondary'>Inactive</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ p: 0, height: '100%' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 2.25 }}>
              <Box sx={{ width: 44, height: 44, borderRadius: 2, background: 'linear-gradient(135deg, #93c5fd, #2563eb)', display: 'grid', placeItems: 'center', color: '#fff', fontWeight: 800 }}>
                +
              </Box>
              <Box>
                <Typography variant='h6' sx={{ fontWeight: 800 }}>{newJoiners}</Typography>
                <Typography variant='caption' color='text.secondary'>New Joiners</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ py: 2 }}>
          <Grid container spacing={2} sx={{ alignItems: 'center' }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label={t('employees.searchByName')}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <TextField fullWidth select label='Designation' value={status} onChange={(event) => setStatus(event.target.value)}>
                <MenuItem value=''>{t('employees.all')}</MenuItem>
                {employeeStatusOptions.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <TextField fullWidth label={t('employees.city')} value={city} onChange={(event) => setCity(event.target.value)} />
            </Grid>

            <Grid size={{ xs: 12, md: 2 }}>
              <Chip
                label={data?.totalElements ? t('employees.countLabel', { count: data.totalElements }) : t('employees.countLabel', { count: 0 })}
                color='primary'
                variant='outlined'
                sx={{ height: 56, borderRadius: 2, fontWeight: 600, width: '100%' }}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
        <Typography variant='h5' sx={{ fontWeight: 800 }}>Employees Grid</Typography>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField select size='small' value='designation' sx={{ minWidth: 160 }}>
            <MenuItem value='designation'>Designation</MenuItem>
          </TextField>
          <TextField select size='small' value='last7days' sx={{ minWidth: 180 }}>
            <MenuItem value='last7days'>Sort By : Last 7 Days</MenuItem>
          </TextField>
        </Box>
      </Box>

      {isLoading ? (
        <Typography>{t('employees.loading')}</Typography>
      ) : (
        <Grid container spacing={2.5} sx={{ alignItems: 'stretch' }}>
          {employees.map((employee, index) => {
            const fullName = `${employee.firstName} ${employee.lastName}`;
            const initials = `${employee.firstName?.[0] ?? ''}${employee.lastName?.[0] ?? ''}`.toUpperCase();
            const progressValue = Math.min(100, Math.max(10, (index + 1) * 12 + (employee.status === 'ACTIVE' ? 18 : 8)));
            const done = Math.round((progressValue / 100) * 30);
            const projects = 20 + (index % 4) * 10;
            const color = avatarPalette[index % avatarPalette.length];

            return (
              <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={employee.id}>
                <Paper
                  component={Link}
                  to={`/employees/${employee.id}`}
                  sx={{
                    p: 2.25,
                    borderRadius: 3,
                    border: '1px solid rgba(148, 163, 184, 0.18)',
                    textDecoration: 'none',
                    color: 'inherit',
                    display: 'block',
                    height: '100%',
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.96) 100%)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
                    '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 18px 30px rgba(15, 23, 42, 0.08)', borderColor: 'rgba(37, 99, 235, 0.24)' },
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.25 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                      <Box sx={{ width: 46, height: 46, borderRadius: '50%', background: `linear-gradient(135deg, ${color}, ${color}bb)`, color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 800, boxShadow: '0 10px 18px rgba(15, 23, 42, 0.08)' }}>
                        {initials}
                      </Box>
                      <Box>
                        <Chip
                          label={employee.status || 'ACTIVE'}
                          size="small"
                          sx={{
                            bgcolor: employee.status === 'ACTIVE' ? 'rgba(22,163,74,0.12)' : employee.status === 'ON_LEAVE' ? 'rgba(245,158,11,0.12)' : 'rgba(239,68,68,0.12)',
                            color: employee.status === 'ACTIVE' ? '#15803d' : employee.status === 'ON_LEAVE' ? '#b45309' : '#b91c1c',
                            fontWeight: 700,
                            borderRadius: 999,
                            height: 24,
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>

                  <Typography variant='h6' sx={{ fontWeight: 800, textAlign: 'left', mb: 0.5, letterSpacing: '-0.02em' }}>
                    {fullName}
                  </Typography>
                  <Typography variant='caption' color='text.secondary' sx={{ display: 'block', textAlign: 'left', mb: 2 }}>
                    {employee.position || 'Software Developer'}
                  </Typography>

                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 1, mb: 2, textAlign: 'left' }}>
                    <Box>
                      <Typography variant='caption' color='text.secondary'>Projects</Typography>
                      <Typography variant='subtitle2' sx={{ fontWeight: 700 }}>{projects}</Typography>
                    </Box>
                    <Box>
                      <Typography variant='caption' color='text.secondary'>Done</Typography>
                      <Typography variant='subtitle2' sx={{ fontWeight: 700 }}>{done}</Typography>
                    </Box>
                    <Box>
                      <Typography variant='caption' color='text.secondary'>Progress</Typography>
                      <Typography variant='subtitle2' sx={{ fontWeight: 700 }}>{progressValue}%</Typography>
                    </Box>
                  </Box>

                  <Box sx={{ height: 8, borderRadius: 999, backgroundColor: 'rgba(148,163,184,0.2)', overflow: 'hidden' }}>
                    <Box sx={{ height: '100%', width: `${progressValue}%`, borderRadius: 999, background: employee.status === 'ACTIVE' ? 'linear-gradient(90deg, #17c964, #2dd4bf)' : employee.status === 'ON_LEAVE' ? 'linear-gradient(90deg, #f59e0b, #fbbf24)' : 'linear-gradient(90deg, #ef4444, #f87171)' }} />
                  </Box>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
}
