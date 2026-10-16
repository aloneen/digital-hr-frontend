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
import { employeesApi } from '../api/employeesApi';
import EmployeesTable from '../components/EmployeesTable';
import EmployeeFormDialog from '../components/EmployeeFormDialog';

const employeeStatusOptions = ['ACTIVE', 'ON_LEAVE', 'TERMINATED'];

export default function EmployeesPage() {
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
          Employees
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialogOpen(true)}>
          Add employee
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
                label="Search by name"
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
                label="Status"
                value={status}
                onChange={(event) => setStatus(event.target.value)}
              >
                <MenuItem value="">All</MenuItem>
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
                label="City"
                value={city}
                onChange={(event) => setCity(event.target.value)}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 2 }}>
              <Chip
                label={data?.totalElements ? `${data.totalElements} employees` : '0 employees'}
                color="primary"
                variant="outlined"
                sx={{ height: 56, borderRadius: 2, fontWeight: 600 }}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {isLoading ? (
        <Typography>Loading employees...</Typography>
      ) : (
        <EmployeesTable rows={data?.content || []} />
      )}
    </Box>
  );
}
