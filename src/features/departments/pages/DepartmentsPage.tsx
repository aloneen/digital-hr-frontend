import {
  Alert,
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
  Snackbar,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { departmentsApi } from '../api/departmentsApi';
import DepartmentTreeView from '../components/DepartmentTreeView';
import DepartmentFormDialog from '../components/DepartmentFormDialog';
import type {
  Department,
  DepartmentCreateRequest,
  DepartmentTree,
  DepartmentUpdateRequest,
} from '../../../shared/types/department';

export default function DepartmentsPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  // Dialog state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [parentDepartmentId, setParentDepartmentId] = useState<number | null>(null);

  // Delete confirmation
  const [deletingDepartment, setDeletingDepartment] = useState<DepartmentTree | null>(null);

  // Snackbar
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const { data, isLoading } = useQuery({
    queryKey: ['departments-tree'],
    queryFn: () => departmentsApi.getTree(),
  });

  const createMutation = useMutation({
    mutationFn: (payload: DepartmentCreateRequest) => departmentsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments-tree'] });
      queryClient.invalidateQueries({ queryKey: ['departments-list'] });
      setSnackbar({ open: true, message: 'Подразделение успешно создано', severity: 'success' });
    },
    onError: (err: Error) => {
      setSnackbar({ open: true, message: err.message || 'Ошибка создания подразделения', severity: 'error' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: DepartmentUpdateRequest }) =>
      departmentsApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments-tree'] });
      queryClient.invalidateQueries({ queryKey: ['departments-list'] });
      setSnackbar({ open: true, message: 'Подразделение успешно обновлено', severity: 'success' });
    },
    onError: (err: Error) => {
      setSnackbar({ open: true, message: err.message || 'Ошибка обновления', severity: 'error' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => departmentsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments-tree'] });
      queryClient.invalidateQueries({ queryKey: ['departments-list'] });
      setSnackbar({ open: true, message: 'Подразделение деактивировано', severity: 'success' });
    },
    onError: (err: Error) => {
      setSnackbar({ open: true, message: err.message || 'Ошибка деактивации подразделения', severity: 'error' });
    },
  });

  const handleOpenAddRoot = () => {
    setEditingDepartment(null);
    setParentDepartmentId(null);
    setIsFormOpen(true);
  };

  const handleOpenAddChild = (parentDept: DepartmentTree) => {
    setEditingDepartment(null);
    setParentDepartmentId(parentDept.id);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (dept: DepartmentTree) => {
    setEditingDepartment(dept);
    setParentDepartmentId(dept.parentId ?? null);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (payload: DepartmentCreateRequest | DepartmentUpdateRequest) => {
    if (editingDepartment) {
      await updateMutation.mutateAsync({ id: editingDepartment.id, payload });
    } else {
      await createMutation.mutateAsync(payload as DepartmentCreateRequest);
    }
  };

  const handleConfirmDelete = async () => {
    if (deletingDepartment) {
      await deleteMutation.mutateAsync(deletingDepartment.id);
      setDeletingDepartment(null);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          {t('departments.pageTitle')}
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenAddRoot}>
          {t('departments.addDepartment')}
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          {isLoading ? (
            <Card>
              <CardContent>
                <Typography>{t('departments.loading')}</Typography>
              </CardContent>
            </Card>
          ) : (
            <DepartmentTreeView
              tree={data || []}
              onAddChild={handleOpenAddChild}
              onEdit={handleOpenEdit}
              onDelete={(dept) => setDeletingDepartment(dept)}
            />
          )}
        </Grid>
      </Grid>

      {/* Department Create / Edit Dialog */}
      <DepartmentFormDialog
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingDepartment}
        defaultParentId={parentDepartmentId}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={Boolean(deletingDepartment)} onClose={() => setDeletingDepartment(null)}>
        <DialogTitle sx={{ fontWeight: 700 }}>Деактивировать подразделение?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Вы уверены, что хотите деактивировать подразделение «{deletingDepartment?.name}»? Оно будет скрыто из структуры компании.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeletingDepartment(null)}>Отмена</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Деактивировать
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
