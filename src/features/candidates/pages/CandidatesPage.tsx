import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  InputAdornment,
  MenuItem,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  WorkOutlined as WorkIcon,
  PeopleOutlined as PeopleIcon,
} from '@mui/icons-material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { candidatesApi } from '../api/candidatesApi';
import { vacanciesApi } from '../../vacancies/api/vacanciesApi';
import CandidateBoard from '../components/CandidateBoard';

export default function CandidatesPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [selectedVacancyId, setSelectedVacancyId] = useState<string>('1');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // New Candidate Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    notes: '',
  });

  const [toast, setToast] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Fetch real vacancies
  const { data: vacanciesData, isLoading: loadingVacancies } = useQuery({
    queryKey: ['vacancies-list'],
    queryFn: () => vacanciesApi.getAll({ size: 100 }),
  });

  const vacancies = useMemo(() => vacanciesData?.content || [], [vacanciesData]);

  // If vacancies load and none selected, select first
  useEffect(() => {
    if (vacancies.length > 0 && (!selectedVacancyId || selectedVacancyId === '1')) {
      const exists = vacancies.some((v) => String(v.id) === selectedVacancyId);
      if (!exists) {
        setSelectedVacancyId(String(vacancies[0].id));
      }
    }
  }, [vacancies, selectedVacancyId]);

  const vacancyNumber = useMemo(() => Number(selectedVacancyId || 1), [selectedVacancyId]);

  // Fetch candidates for selected vacancy
  const { data: candidates, isLoading: loadingCandidates } = useQuery({
    queryKey: ['candidates', vacancyNumber],
    queryFn: () => candidatesApi.getByVacancy(vacancyNumber),
  });

  // Filter candidates by search
  const filteredCandidates = useMemo(() => {
    if (!candidates) return [];
    if (!searchQuery.trim()) return candidates;
    const q = searchQuery.toLowerCase();
    return candidates.filter(
      (c) =>
        c.firstName?.toLowerCase().includes(q) ||
        c.lastName?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.notes?.toLowerCase().includes(q)
    );
  }, [candidates, searchQuery]);

  // Create candidate mutation
  const createMutation = useMutation({
    mutationFn: (newCandidate: typeof formData & { vacancyId: number }) =>
      candidatesApi.create(newCandidate),
    onSuccess: (res) => {
      void queryClient.invalidateQueries({ queryKey: ['candidates', vacancyNumber] });
      setIsAddDialogOpen(false);
      setFormData({ firstName: '', lastName: '', email: '', phone: '', notes: '' });
      setToast({
        open: true,
        message: `${res.firstName} ${res.lastName} — ${t('candidates.createSuccess')}`,
        severity: 'success',
      });
    },
    onError: (err) => {
      setToast({
        open: true,
        message: 'Ошибка при добавлении кандидата',
        severity: 'error',
      });
      console.error(err);
    },
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName.trim() || !formData.lastName.trim()) return;

    createMutation.mutate({
      ...formData,
      vacancyId: vacancyNumber,
    });
  };

  const selectedVacancy = vacancies.find((v) => v.id === vacancyNumber);

  return (
    <Box>
      {/* Page Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.02em', color: '#111827' }}>
            {t('candidates.pageTitle')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Канбан-доска подбора персонала с поддержкой Drag & Drop
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsAddDialogOpen(true)}
          sx={{
            bgcolor: '#168B48',
            '&:hover': { bgcolor: '#11703A' },
            textTransform: 'none',
            fontWeight: 700,
            borderRadius: 2,
            px: 2.5,
            py: 1.1,
            boxShadow: 'none',
          }}
        >
          {t('candidates.addCandidate')}
        </Button>
      </Box>

      {/* Filter and Vacancy Selector Bar */}
      <Card sx={{ mb: 3, borderRadius: 3 }}>
        <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
          <Grid container spacing={2} sx={{ alignItems: 'center' }}>
            {/* Vacancy selector */}
            <Grid size={{ xs: 12, md: 5 }}>
              <TextField
                fullWidth
                select
                size="small"
                label={t('candidates.vacancy')}
                value={selectedVacancyId}
                onChange={(event) => setSelectedVacancyId(event.target.value)}
                disabled={loadingVacancies}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <WorkIcon sx={{ color: '#168B48', fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  },
                }}
              >
                {vacancies.length > 0 ? (
                  vacancies.map((v) => (
                    <MenuItem key={v.id} value={String(v.id)}>
                      {v.title} ({v.city || 'Алматы'})
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="1">Курьер (Алматы)</MenuItem>
                )}
              </TextField>
            </Grid>

            {/* Candidate Search */}
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Поиск по имени, email или заметкам..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: '#9CA3AF', fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>

            {/* Quick summary */}
            <Grid size={{ xs: 12, md: 3 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: { xs: 'flex-start', md: 'flex-end' },
                  gap: 1.5,
                }}
              >
                <PeopleIcon sx={{ color: '#168B48' }} />
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#374151' }}>
                  {filteredCandidates.length}{' '}
                  <Typography component="span" variant="caption" sx={{ color: '#6B7280' }}>
                    кандидатов в воронке
                  </Typography>
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Kanban Board Area */}
      {loadingCandidates ? (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 8, gap: 2 }}>
          <CircularProgress size={28} sx={{ color: '#168B48' }} />
          <Typography variant="body2" color="text.secondary">
            {t('candidates.loading')}
          </Typography>
        </Box>
      ) : (
        <CandidateBoard candidates={filteredCandidates} vacancyId={vacancyNumber} />
      )}

      {/* Add Candidate Modal Dialog */}
      <Dialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: { sx: { borderRadius: 3, p: 1 } },
        }}
      >
        <form onSubmit={handleCreateSubmit}>
          <DialogTitle sx={{ fontWeight: 800, pb: 1 }}>
            {t('candidates.addCandidate')}
          </DialogTitle>
          <Typography variant="caption" sx={{ px: 3, color: '#6B7280', display: 'block', mb: 2 }}>
            Вакансия: <strong>{selectedVacancy?.title || `ID #${selectedVacancyId}`}</strong>
          </Typography>

          <DialogContent sx={{ pt: 1 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  required
                  label={t('candidates.firstName')}
                  placeholder="Иван"
                  value={formData.firstName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  required
                  label={t('candidates.lastName')}
                  placeholder="Иванов"
                  value={formData.lastName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  type="email"
                  label={t('candidates.email')}
                  placeholder="candidate@example.kz"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label={t('candidates.phone')}
                  placeholder="+7 (705) 123-45-67"
                  value={formData.phone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label={t('candidates.notes')}
                  placeholder="Опыт работы, источник отклика, навыки..."
                  value={formData.notes}
                  onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                />
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 2.5, pt: 1.5 }}>
            <Button onClick={() => setIsAddDialogOpen(false)} color="inherit" sx={{ fontWeight: 600 }}>
              {t('candidates.cancel')}
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={createMutation.isPending || !formData.firstName.trim() || !formData.lastName.trim()}
              sx={{
                bgcolor: '#168B48',
                '&:hover': { bgcolor: '#11703A' },
                textTransform: 'none',
                fontWeight: 700,
                borderRadius: 2,
                px: 3,
              }}
            >
              {createMutation.isPending ? 'Добавление...' : t('candidates.create')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Toast Notification */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3500}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setToast((prev) => ({ ...prev, open: false }))}
          severity={toast.severity}
          variant="filled"
          sx={{ width: '100%', borderRadius: 2 }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
