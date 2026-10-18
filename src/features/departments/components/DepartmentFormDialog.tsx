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
import { departmentsApi } from '../api/departmentsApi';
import type {
  Department,
  DepartmentCreateRequest,
  DepartmentType,
  DepartmentUpdateRequest,
} from '../../../shared/types/department';

const departmentTypes: DepartmentType[] = ['HEAD_OFFICE', 'BLOCK', 'CITY', 'FRANCHISE'];

interface DepartmentFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: DepartmentCreateRequest | DepartmentUpdateRequest) => Promise<void>;
  initialData?: Department | null;
  defaultParentId?: number | null;
}

const defaultValues: DepartmentCreateRequest = {
  name: '',
  type: 'BLOCK',
  parentId: null,
  city: 'Алматы',
};

export default function DepartmentFormDialog({
  open,
  onClose,
  onSubmit,
  initialData,
  defaultParentId,
}: DepartmentFormDialogProps) {
  const [form, setForm] = useState<DepartmentCreateRequest>(defaultValues);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: departments } = useQuery({
    queryKey: ['departments-list'],
    queryFn: () => departmentsApi.getAll(),
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || '',
        type: initialData.type || 'BLOCK',
        parentId: initialData.parentId ?? null,
        city: initialData.city || '',
      });
    } else {
      setForm({
        ...defaultValues,
        parentId: defaultParentId ?? null,
      });
    }
  }, [initialData, defaultParentId, open]);

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    setIsSubmitting(true);
    try {
      await onSubmit({
        ...form,
        parentId: form.parentId ? Number(form.parentId) : null,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEdit = Boolean(initialData);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>
        {isEdit ? 'Редактировать подразделение' : 'Добавить подразделение'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ pt: 1 }}>
          <Grid size={{ xs: 12 }}>
            <TextField
              label="Название подразделения"
              required
              fullWidth
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Например, Департамент клиентского сервиса..."
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              select
              label="Тип подразделения"
              required
              fullWidth
              value={form.type}
              onChange={(e) => handleChange('type', e.target.value as DepartmentType)}
            >
              {departmentTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Город"
              fullWidth
              value={form.city || ''}
              onChange={(e) => handleChange('city', e.target.value)}
              placeholder="Алматы, Астана..."
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              select
              label="Родительское подразделение"
              fullWidth
              value={form.parentId ?? ''}
              onChange={(e) => handleChange('parentId', e.target.value === '' ? null : Number(e.target.value))}
            >
              <MenuItem value="">(Корень организации / Нет родителя)</MenuItem>
              {departments
                ?.filter((d) => !initialData || d.id !== initialData.id)
                .map((dept) => (
                  <MenuItem key={dept.id} value={dept.id}>
                    {dept.name} ({dept.type})
                  </MenuItem>
                ))}
            </TextField>
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
          disabled={isSubmitting || !form.name.trim()}
        >
          {isSubmitting ? 'Сохранение...' : isEdit ? 'Сохранить изменения' : 'Создать подразделение'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
