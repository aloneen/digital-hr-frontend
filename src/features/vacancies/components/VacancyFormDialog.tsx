import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { departmentsApi } from '../../departments/api/departmentsApi';
import type { Vacancy, VacancyCreateRequest, VacancyStatus, VacancyUpdateRequest } from '../../../shared/types/vacancy';

interface VacancyFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: VacancyCreateRequest | VacancyUpdateRequest) => Promise<void>;
  initialData?: Vacancy | null;
}

const defaultValues: VacancyCreateRequest = {
  title: '',
  departmentId: 1,
  city: 'Алматы',
  salaryRange: '',
  requirements: '',
  description: '',
};

export default function VacancyFormDialog({
  open,
  onClose,
  onSubmit,
  initialData,
}: VacancyFormDialogProps) {
  const [form, setForm] = useState<VacancyCreateRequest & { status?: VacancyStatus }>(defaultValues);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: departments } = useQuery({
    queryKey: ['departments-list'],
    queryFn: () => departmentsApi.getAll(),
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        departmentId: initialData.departmentId || 1,
        city: initialData.city || '',
        salaryRange: initialData.salaryRange || '',
        requirements: initialData.requirements || '',
        description: initialData.description || '',
        status: initialData.status || 'OPEN',
      });
    } else {
      setForm(defaultValues);
    }
  }, [initialData, open]);

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!form.title.trim()) return;
    setIsSubmitting(true);
    try {
      await onSubmit({
        ...form,
        departmentId: Number(form.departmentId),
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEdit = Boolean(initialData);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>
        {isEdit ? 'Редактировать вакансию' : 'Создать новую вакансию'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ pt: 1 }}>
          <Grid size={{ xs: 12, md: 8 }}>
            <TextField
              label="Название вакансии"
              required
              fullWidth
              value={form.title}
              onChange={(e) => handleChange('title', e.target.value)}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              label="Город / Локация"
              fullWidth
              value={form.city || ''}
              onChange={(e) => handleChange('city', e.target.value)}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              select
              label="Подразделение / Департамент"
              fullWidth
              required
              value={form.departmentId || ''}
              onChange={(e) => handleChange('departmentId', Number(e.target.value))}
            >
              {departments && departments.length > 0 ? (
                departments.map((dept) => (
                  <MenuItem key={dept.id} value={dept.id}>
                    {dept.name} ({dept.type})
                  </MenuItem>
                ))
              ) : (
                <MenuItem value={1}>Главный офис (HEAD_OFFICE)</MenuItem>
              )}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Зарплатная вилка (например, 450 000 - 650 000 ₸)"
              fullWidth
              value={form.salaryRange || ''}
              onChange={(e) => handleChange('salaryRange', e.target.value)}
            />
          </Grid>

          {isEdit && (
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                select
                label="Статус вакансии"
                fullWidth
                value={form.status || 'OPEN'}
                onChange={(e) => handleChange('status', e.target.value)}
              >
                <MenuItem value="OPEN">OPEN (Открыта)</MenuItem>
                <MenuItem value="ON_HOLD">ON_HOLD (На паузе)</MenuItem>
                <MenuItem value="CLOSED">CLOSED (Закрыта)</MenuItem>
              </TextField>
            </Grid>
          )}

          <Grid size={{ xs: 12 }}>
            <TextField
              label="Требования к кандидату"
              multiline
              rows={3}
              fullWidth
              value={form.requirements || ''}
              onChange={(e) => handleChange('requirements', e.target.value)}
              placeholder="Опыт работы от 2 лет, высшее образование, знание 1С..."
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              label="Описание обязанностей и условий"
              multiline
              rows={4}
              fullWidth
              value={form.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Мы ищем специалиста в команду..."
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose} disabled={isSubmitting}>
          Отмена
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={isSubmitting || !form.title.trim()}
        >
          {isSubmitting ? 'Сохранение...' : isEdit ? 'Сохранить изменения' : 'Создать вакансию'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
