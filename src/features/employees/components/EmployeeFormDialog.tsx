import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import { VpnKeyOutlined } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { departmentsApi } from '../../departments/api/departmentsApi';
import type { Employee, EmployeeCreateRequest, EmployeeStatus, EmployeeUpdateRequest } from '../../../shared/types/employee';

const defaultValues: EmployeeCreateRequest = {
  firstName: '',
  lastName: '',
  middleName: '',
  position: '',
  departmentId: 1,
  city: 'Алматы',
  status: 'ACTIVE',
  hireDate: new Date().toISOString().slice(0, 10),
  email: '',
  phone: '',
  birthDate: '',
  iin: '',
};

interface EmployeeFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: EmployeeCreateRequest | EmployeeUpdateRequest) => Promise<void>;
  initialData?: Employee | null;
}

export default function EmployeeFormDialog({
  open,
  onClose,
  onSubmit,
  initialData,
}: EmployeeFormDialogProps) {
  const { t } = useTranslation();
  const [form, setForm] = useState<EmployeeCreateRequest>(defaultValues);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: departments } = useQuery({
    queryKey: ['departments-list'],
    queryFn: () => departmentsApi.getAll(),
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        firstName: initialData.firstName || '',
        lastName: initialData.lastName || '',
        middleName: initialData.middleName || '',
        position: initialData.position || '',
        departmentId: initialData.departmentId || 1,
        city: initialData.city || '',
        status: initialData.status || 'ACTIVE',
        hireDate: initialData.hireDate ? initialData.hireDate.slice(0, 10) : new Date().toISOString().slice(0, 10),
        email: initialData.email || '',
        phone: initialData.phone || '',
        birthDate: initialData.birthDate ? initialData.birthDate.slice(0, 10) : '',
        iin: initialData.iin || '',
      });
    } else {
      setForm(defaultValues);
    }
  }, [initialData, open]);

  const handleChange = <K extends keyof EmployeeCreateRequest>(field: K, value: EmployeeCreateRequest[K]) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!form.firstName.trim() || !form.lastName.trim() || !form.position.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        ...form,
        departmentId: Number(form.departmentId),
        status: form.status ?? 'ACTIVE',
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
        {isEdit ? 'Редактировать сотрудника' : t('employees.dialog.title')}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ pt: 1 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              label={t('employees.dialog.firstName')}
              required
              fullWidth
              value={form.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              label={t('employees.dialog.lastName')}
              required
              fullWidth
              value={form.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              label={t('employees.dialog.middleName')}
              fullWidth
              value={form.middleName || ''}
              onChange={(e) => handleChange('middleName', e.target.value)}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              label={t('employees.dialog.position')}
              required
              fullWidth
              value={form.position}
              onChange={(e) => handleChange('position', e.target.value)}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              select
              label="Подразделение"
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

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              label={t('employees.dialog.city')}
              fullWidth
              value={form.city || ''}
              onChange={(e) => handleChange('city', e.target.value)}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              select
              label={t('employees.dialog.status')}
              value={form.status || 'ACTIVE'}
              onChange={(e) => handleChange('status', e.target.value as EmployeeStatus)}
            >
              <MenuItem value="ACTIVE">ACTIVE (Активен)</MenuItem>
              <MenuItem value="ON_LEAVE">ON_LEAVE (В отпуске)</MenuItem>
              <MenuItem value="TERMINATED">TERMINATED (Уволен)</MenuItem>
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              label={t('employees.dialog.hireDate')}
              type="date"
              fullWidth
              value={form.hireDate}
              onChange={(e) => handleChange('hireDate', e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              label={t('employees.dialog.birthDate')}
              type="date"
              fullWidth
              value={form.birthDate || ''}
              onChange={(e) => handleChange('birthDate', e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              label={t('employees.dialog.email')}
              type="email"
              fullWidth
              value={form.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
              helperText={!isEdit ? t('employees.dialog.emailHelper') : undefined}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              label={t('employees.dialog.phone')}
              fullWidth
              value={form.phone || ''}
              onChange={(e) => handleChange('phone', e.target.value)}
              helperText={!isEdit ? t('employees.dialog.phoneHelper') : undefined}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              label={t('employees.dialog.iin')}
              fullWidth
              value={form.iin || ''}
              onChange={(e) => handleChange('iin', e.target.value)}
            />
          </Grid>

          {!isEdit && (
            <Grid size={{ xs: 12 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  p: 1.75,
                  borderRadius: 2,
                  bgcolor: '#F0FDF4',
                  border: '1px solid #BBF7D0',
                }}
              >
                <VpnKeyOutlined sx={{ fontSize: 22, color: '#168B48', flexShrink: 0 }} />
                <Typography variant="body2" sx={{ fontSize: '0.85rem', color: '#166534', lineHeight: 1.45 }}>
                  {t('employees.dialog.authNotice')}
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={isSubmitting}>
          {t('employees.dialog.cancel')}
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={isSubmitting || !form.firstName.trim() || !form.lastName.trim()}
        >
          {isSubmitting ? 'Сохранение...' : isEdit ? 'Сохранить изменения' : t('employees.dialog.save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
