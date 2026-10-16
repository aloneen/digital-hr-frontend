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
import { useState } from 'react';
import type { EmployeeCreateRequest, EmployeeStatus } from '../../../shared/types/employee';

const defaultValues: EmployeeCreateRequest = {
  firstName: '',
  lastName: '',
  middleName: '',
  position: '',
  departmentId: 1,
  city: '',
  status: 'ACTIVE',
  hireDate: new Date().toISOString().slice(0, 10),
  email: '',
  phone: '',
  birthDate: '',
  iin: '',
};

export default function EmployeeFormDialog({ open, onClose, onSubmit }: {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: EmployeeCreateRequest) => Promise<void>;
}) {
  const [form, setForm] = useState<EmployeeCreateRequest>(defaultValues);

  const handleChange = <K extends keyof EmployeeCreateRequest>(field: K, value: EmployeeCreateRequest[K]) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    await onSubmit({
      ...form,
      departmentId: Number(form.departmentId),
      status: form.status ?? 'ACTIVE',
    });
    setForm(defaultValues);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Add employee</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ pt: 1 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              label="First name"
              fullWidth
              value={form.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              label="Last name"
              fullWidth
              value={form.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              label="Middle name"
              fullWidth
              value={form.middleName || ''}
              onChange={(e) => handleChange('middleName', e.target.value)}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              label="Position"
              fullWidth
              value={form.position}
              onChange={(e) => handleChange('position', e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              label="Department ID"
              type="number"
              fullWidth
              value={form.departmentId}
              onChange={(e) => handleChange('departmentId', Number(e.target.value))}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              label="City"
              fullWidth
              value={form.city || ''}
              onChange={(e) => handleChange('city', e.target.value)}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              select
              label="Status"
              value={form.status || 'ACTIVE'}
              onChange={(e) => handleChange('status', e.target.value as EmployeeStatus)}
            >
              <MenuItem value="ACTIVE">ACTIVE</MenuItem>
              <MenuItem value="ON_LEAVE">ON_LEAVE</MenuItem>
              <MenuItem value="TERMINATED">TERMINATED</MenuItem>
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              label="Hire date"
              type="date"
              fullWidth
              value={form.hireDate}
              onChange={(e) => handleChange('hireDate', e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              label="Birth date"
              type="date"
              fullWidth
              value={form.birthDate || ''}
              onChange={(e) => handleChange('birthDate', e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              label="Email"
              fullWidth
              value={form.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              label="Phone"
              fullWidth
              value={form.phone || ''}
              onChange={(e) => handleChange('phone', e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              label="IIN"
              fullWidth
              value={form.iin || ''}
              onChange={(e) => handleChange('iin', e.target.value)}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
