import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  MenuItem,
  Snackbar,
  Alert,
  TextField,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { vacanciesApi } from '../api/vacanciesApi';
import VacanciesList from '../components/VacanciesList';
import VacancyFormDialog from '../components/VacancyFormDialog';
import type { Vacancy, VacancyCreateRequest, VacancyUpdateRequest } from '../../../shared/types/vacancy';

const vacancyStatuses = ['OPEN', 'CLOSED', 'ON_HOLD'];

export default function VacanciesPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [status, setStatus] = useState('');
  const [city, setCity] = useState('');

  // Dialog state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVacancy, setEditingVacancy] = useState<Vacancy | null>(null);

  // Delete confirmation
  const [deletingVacancy, setDeletingVacancy] = useState<Vacancy | null>(null);

  // Feedback notification
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const params = useMemo(
    () => ({
      status: status || undefined,
      city: city || undefined,
      page: 0,
      size: 50,
    }),
    [city, status],
  );

  const { data, isLoading } = useQuery({
    queryKey: ['vacancies', params],
    queryFn: () => vacanciesApi.getAll(params),
  });

  const createMutation = useMutation({
    mutationFn: (payload: VacancyCreateRequest) => vacanciesApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vacancies'] });
      setSnackbar({ open: true, message: 'Вакансия успешно создана', severity: 'success' });
    },
    onError: (err: Error) => {
      setSnackbar({ open: true, message: err.message || 'Ошибка создания вакансии', severity: 'error' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: VacancyUpdateRequest }) =>
      vacanciesApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vacancies'] });
      setSnackbar({ open: true, message: 'Вакансия успешно обновлена', severity: 'success' });
    },
    onError: (err: Error) => {
      setSnackbar({ open: true, message: err.message || 'Ошибка обновления вакансии', severity: 'error' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => vacanciesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vacancies'] });
      setSnackbar({ open: true, message: 'Вакансия удалена/закрыта', severity: 'success' });
    },
    onError: (err: Error) => {
      setSnackbar({ open: true, message: err.message || 'Ошибка удаления вакансии', severity: 'error' });
    },
  });

  const handleOpenCreate = () => {
    setEditingVacancy(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (vacancy: Vacancy) => {
    setEditingVacancy(vacancy);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (payload: VacancyCreateRequest | VacancyUpdateRequest) => {
    if (editingVacancy) {
      await updateMutation.mutateAsync({ id: editingVacancy.id, payload });
    } else {
      await createMutation.mutateAsync(payload as VacancyCreateRequest);
    }
  };

  const handleConfirmDelete = async () => {
    if (deletingVacancy) {
      await deleteMutation.mutateAsync(deletingVacancy.id);
      setDeletingVacancy(null);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          {t('vacancies.pageTitle')}
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreate}>
          {t('vacancies.addVacancy')}
        </Button>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                select
                label={t('vacancies.status')}
                value={status}
                onChange={(event) => setStatus(event.target.value)}
              >
                <MenuItem value="">{t('vacancies.all')}</MenuItem>
                {vacancyStatuses.map((item) => (
                  <MenuItem key={item} value={item}>
                    {t(`vacancies.statuses.${item.toLowerCase()}`, item)}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label={t('vacancies.city')}
                value={city}
                onChange={(event) => setCity(event.target.value)}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {isLoading ? (
        <Typography>{t('vacancies.loading')}</Typography>
      ) : (
        <VacanciesList
          vacancies={data?.content || []}
          onEdit={handleOpenEdit}
          onDelete={(vac) => setDeletingVacancy(vac)}
        />
      )}

      {/* Create / Edit Dialog */}
      <VacancyFormDialog
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingVacancy}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={Boolean(deletingVacancy)} onClose={() => setDeletingVacancy(null)}>
        <DialogTitle sx={{ fontWeight: 700 }}>Удалить вакансию?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Вы уверены, что хотите удалить вакансию «{deletingVacancy?.title}»? Если у вакансии есть кандидаты, она будет переведена в статус закрытой (CLOSED).
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeletingVacancy(null)}>Отмена</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Удалить
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
