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
import PlaceIcon from '@mui/icons-material/Place';
import BusinessIcon from '@mui/icons-material/Business';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { vacanciesApi } from '../api/vacanciesApi';
import VacancyFormDialog from '../components/VacancyFormDialog';
import type { VacancyUpdateRequest } from '../../../shared/types/vacancy';

const statusColor: Record<string, 'success' | 'warning' | 'default'> = {
  OPEN: 'success',
  ON_HOLD: 'warning',
  CLOSED: 'default',
};

export default function VacancyDetailPage() {
  const { id } = useParams();
  const vacancyId = Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const { data: vacancy, isLoading, isError } = useQuery({
    queryKey: ['vacancy', vacancyId],
    queryFn: () => vacanciesApi.getById(vacancyId),
    enabled: !!vacancyId,
  });

  const updateMutation = useMutation({
    mutationFn: (payload: VacancyUpdateRequest) => vacanciesApi.update(vacancyId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vacancy', vacancyId] });
      queryClient.invalidateQueries({ queryKey: ['vacancies'] });
      setSnackbar({ open: true, message: 'Вакансия успешно обновлена', severity: 'success' });
    },
    onError: (err: Error) => {
      setSnackbar({ open: true, message: err.message || 'Ошибка обновления', severity: 'error' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => vacanciesApi.delete(vacancyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vacancies'] });
      navigate('/vacancies');
    },
    onError: (err: Error) => {
      setSnackbar({ open: true, message: err.message || 'Ошибка удаления', severity: 'error' });
    },
  });

  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
      </Box>
    );
  }

  if (isError || !vacancy) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Vacancy not found</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Button component={Link} to="/vacancies" startIcon={<ArrowBackIcon />}>
          Back to vacancies
        </Button>

        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => setIsEditOpen(true)}
          >
            Редактировать
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteOutlinedIcon />}
            onClick={() => setIsDeleteOpen(true)}
          >
            Удалить
          </Button>
        </Stack>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, mb: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                  {vacancy.title}
                </Typography>
                <Chip label={vacancy.status} color={statusColor[vacancy.status] || 'default'} />
              </Box>

              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {vacancy.description || 'No description provided.'}
              </Typography>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BusinessIcon color="action" fontSize="small" />
                  <Typography variant="body2">Department: {vacancy.departmentId}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PlaceIcon color="action" fontSize="small" />
                  <Typography variant="body2">{vacancy.city || 'Remote'}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <MonetizationOnIcon color="action" fontSize="small" />
                  <Typography variant="body2">{vacancy.salaryRange || 'Negotiable'}</Typography>
                </Box>
              </Stack>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                Requirements
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {vacancy.requirements || 'Requirements are not specified yet.'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                Vacancy summary
              </Typography>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="caption" color="text.secondary">Status</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>{vacancy.status}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Location</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>{vacancy.city || 'Remote'}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Salary</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>{vacancy.salaryRange || 'Negotiable'}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Department</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>{vacancy.departmentId}</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Edit Dialog */}
      <VacancyFormDialog
        open={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSubmit={async (payload) => {
          await updateMutation.mutateAsync(payload as VacancyUpdateRequest);
        }}
        initialData={vacancy}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onClose={() => setIsDeleteOpen(false)}>
        <DialogTitle sx={{ fontWeight: 700 }}>Удалить вакансию?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Вы уверены, что хотите удалить вакансию «{vacancy.title}»? Если у вакансии есть связанные кандидаты, она будет переведена в закрытый статус.
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
            {deleteMutation.isPending ? 'Удаление...' : 'Удалить'}
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
