import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { employeesApi } from '../api/employeesApi';
import EmployeesTable from '../components/EmployeesTable';
import EmployeeFormDialog from '../components/EmployeeFormDialog';

const employeeStatusOptions = ['ACTIVE', 'ON_LEAVE', 'TERMINATED'];

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

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          {t('employees.pageTitle')}
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialogOpen(true)}>
          {t('employees.addEmployee')}
        </Button>
      </Box>

      <EmployeeFormDialog
        open={isDialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleCreateEmployee}
      />

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
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
              <TextField
                fullWidth
                select
                label={t('employees.status')}
                value={status}
                onChange={(event) => setStatus(event.target.value)}
              >
                <MenuItem value="">{t('employees.all')}</MenuItem>
                {employeeStatusOptions.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                label={t('employees.city')}
                value={city}
                onChange={(event) => setCity(event.target.value)}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 2 }}>
              <Chip
                label={data?.totalElements ? t('employees.countLabel', { count: data.totalElements }) : t('employees.countLabel', { count: 0 })}
                color="primary"
                variant="outlined"
                sx={{ height: 56, borderRadius: 2, fontWeight: 600 }}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {isLoading ? <Typography>{t('employees.loading')}</Typography> : <EmployeesTable rows={data?.content || []} />}
    </Box>
  );
}
