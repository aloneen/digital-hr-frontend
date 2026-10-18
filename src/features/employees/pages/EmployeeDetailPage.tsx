import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  LinearProgress,
  Snackbar,
  Stack,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import EditIcon from '@mui/icons-material/Edit';
import ChatIcon from '@mui/icons-material/Chat';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { employeesApi } from '../api/employeesApi';
import EmployeeFormDialog from '../components/EmployeeFormDialog';
import SendMessageDialog from '../components/SendMessageDialog';
import type { EmployeeUpdateRequest } from '../../../shared/types/employee';

const statusColor: Record<string, 'success' | 'warning' | 'default'> = {
  ACTIVE: 'success',
  ON_LEAVE: 'warning',
  TERMINATED: 'default',
};

export default function EmployeeDetailPage() {
  const { id } = useParams();
  const employeeId = Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const { data: employee, isLoading, isError } = useQuery({
    queryKey: ['employee', employeeId],
    queryFn: () => employeesApi.getById(employeeId),
    enabled: !!employeeId,
  });

  const updateMutation = useMutation({
    mutationFn: (payload: EmployeeUpdateRequest) => employeesApi.update(employeeId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee', employeeId] });
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      setSnackbar({ open: true, message: 'Данные сотрудника успешно обновлены', severity: 'success' });
    },
    onError: (err: Error) => {
      setSnackbar({ open: true, message: err.message || 'Ошибка обновления', severity: 'error' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => employeesApi.delete(employeeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      setSnackbar({ open: true, message: 'Сотрудник переведен в статус уволенных (TERMINATED)', severity: 'success' });
      navigate('/employees');
    },
    onError: (err: Error) => {
      setSnackbar({ open: true, message: err.message || 'Ошибка увольнения сотрудника', severity: 'error' });
    },
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
        <Alert severity="error">Сотрудник не найден</Alert>
      </Box>
    );
  }

  const fullName = `${employee.firstName} ${employee.lastName}`;
  const initials = `${employee.firstName?.[0] ?? ''}${employee.lastName?.[0] ?? ''}`.toUpperCase();

  return (
    <Box sx={{ p: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Button component={Link} to="/employees" startIcon={<ArrowBackIcon />}>
          К списку сотрудников
        </Button>

        {employee.status !== 'TERMINATED' && (
          <Button
            variant="outlined"
            color="error"
            startIcon={<PersonRemoveIcon />}
            onClick={() => setIsDeleteOpen(true)}
          >
            Уволить сотрудника
          </Button>
        )}
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
                <Typography variant="h5" sx={{ fontWeight: 800 }}>
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
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<EditIcon />}
                  onClick={() => setIsEditOpen(true)}
                >
                  Изменить
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<ChatIcon />}
                  onClick={() => setIsMessageOpen(true)}
                >
                  Написать
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
                  Основная информация
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="caption" color="text.secondary">ID Подразделения</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>{employee.departmentId}</Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="caption" color="text.secondary">Дата найма</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>{employee.hireDate || '—'}</Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="caption" color="text.secondary">Дата рождения</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>{employee.birthDate || '—'}</Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="caption" color="text.secondary">ИИН</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>{employee.iin || '—'}</Typography>
                  </Grid>
                  {employee.terminationDate && (
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="caption" color="error">Дата увольнения</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: 'error.main' }}>
                        {employee.terminationDate}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                  Эффективность и статус
                </Typography>
                <Stack spacing={2}>
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2" color="text.secondary">Продуктивность</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>81%</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={81} color="success" sx={{ height: 10, borderRadius: 999 }} />
                  </Box>
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2" color="text.secondary">Вовлеченность</Typography>
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

      {/* Edit Employee Dialog */}
      <EmployeeFormDialog
        open={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSubmit={async (payload) => {
          await updateMutation.mutateAsync(payload as EmployeeUpdateRequest);
        }}
        initialData={employee}
      />

      {/* Send Message Dialog */}
      <SendMessageDialog
        open={isMessageOpen}
        onClose={() => setIsMessageOpen(false)}
        employee={employee}
        onSuccess={() => {
          setSnackbar({ open: true, message: 'Сообщение успешно отправлено сотруднику', severity: 'success' });
        }}
      />

      {/* Terminate Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onClose={() => setIsDeleteOpen(false)}>
        <DialogTitle sx={{ fontWeight: 700 }}>Уволить сотрудника?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Вы уверены, что хотите перевести сотрудника «{fullName}» в статус TERMINATED (уволен)? Будет зафиксирована текущая дата увольнения и создана запись в аудит-логе.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setIsDeleteOpen(false)}>Отмена</Button>
          <Button
            onClick={() => deleteMutation.mutate()}
            color="error"
            variant="contained"
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? 'Увольнение...' : 'Уволить'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
