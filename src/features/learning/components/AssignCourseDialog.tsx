import { useMemo, useState } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import {
  AccessTime,
  AssignmentInd,
  CheckCircle,
  Clear,
  Close as CloseIcon,
  InfoOutlined,
  OpenInNew,
  RadioButtonUnchecked,
  School,
  Search,
} from '@mui/icons-material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { learningApi } from '../api/learningApi';
import { employeesApi } from '../../employees/api/employeesApi';
import { departmentsApi } from '../../departments/api/departmentsApi';
import type { Course, CourseAssignment } from '../../../shared/types/learning';
import type { Employee } from '../../../shared/types/employee';

interface AssignCourseDialogProps {
  open: boolean;
  onClose: () => void;
  initialCourse?: Course | null;
  courses?: Course[];
  initialEmployeeId?: number | null;
  onSuccess?: (assignment: CourseAssignment, employeeName: string) => void;
}

interface InnerAssignFormProps {
  initialCourse?: Course | null;
  courses: Course[];
  initialEmployeeId?: number | null;
  onClose: () => void;
  onSuccess?: (assignment: CourseAssignment, employeeName: string) => void;
}

function InnerAssignForm({
  initialCourse,
  courses,
  initialEmployeeId,
  onClose,
  onSuccess,
}: InnerAssignFormProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [selectedCourse, setSelectedCourse] = useState<Course | null>(
    initialCourse ?? (courses.length > 0 ? courses[0] : null),
  );
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [employeeSearch, setEmployeeSearch] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Load all departments for readable department names
  const { data: departments } = useQuery({
    queryKey: ['departments'],
    queryFn: departmentsApi.getAll,
    staleTime: 5 * 60 * 1000,
  });

  const deptMap = useMemo(() => {
    const map = new Map<number, string>();
    const list = Array.isArray(departments) ? departments : [];
    list.forEach((d) => {
      if (d && typeof d.id === 'number') {
        map.set(d.id, d.name);
      }
    });
    return map;
  }, [departments]);

  // Load active employees
  const { data: employeesData, isLoading: isLoadingEmployees } = useQuery({
    queryKey: ['employees', 'assign-selection-list'],
    queryFn: () => employeesApi.getAll({ size: 300 }),
    staleTime: 60 * 1000,
  });

  const activeEmployees = useMemo(() => {
    let list: Employee[] = [];
    if (Array.isArray(employeesData)) {
      list = employeesData;
    } else if (employeesData && Array.isArray(employeesData.content)) {
      list = employeesData.content;
    }
    return list.filter((emp) => emp && emp.status !== 'TERMINATED');
  }, [employeesData]);

  // Preselect employee if initialEmployeeId was provided and not yet set
  const resolvedSelectedEmployee = useMemo(() => {
    if (selectedEmployee) return selectedEmployee;
    if (initialEmployeeId && activeEmployees.length > 0) {
      return activeEmployees.find((e) => e.id === initialEmployeeId) || null;
    }
    return null;
  }, [selectedEmployee, initialEmployeeId, activeEmployees]);

  const effectiveEmployee = selectedEmployee || resolvedSelectedEmployee;
  const currentCourse = selectedCourse || initialCourse || (courses.length > 0 ? courses[0] : null);

  // Filtered employees by search
  const filteredEmployees = useMemo(() => {
    const q = employeeSearch.trim().toLowerCase();
    if (!q) return activeEmployees;
    return activeEmployees.filter((opt) => {
      const fn = `${opt.firstName || ''} ${opt.lastName || ''} ${opt.middleName || ''}`.toLowerCase();
      const pos = (opt.position || '').toLowerCase();
      const em = (opt.email || '').toLowerCase();
      const city = (opt.city || '').toLowerCase();
      const dept = (deptMap.get(opt.departmentId) || '').toLowerCase();
      return fn.includes(q) || pos.includes(q) || em.includes(q) || city.includes(q) || dept.includes(q);
    });
  }, [activeEmployees, employeeSearch, deptMap]);

  const assignMutation = useMutation({
    mutationFn: async () => {
      if (!currentCourse?.id) {
        throw new Error('Course must be selected');
      }
      if (!effectiveEmployee?.id) {
        throw new Error('Employee must be selected');
      }
      return learningApi.assignCourse({
        courseId: currentCourse.id,
        employeeId: effectiveEmployee.id,
      });
    },
    onSuccess: (data) => {
      const empName = `${effectiveEmployee?.firstName || ''} ${effectiveEmployee?.lastName || ''}`.trim();
      void queryClient.invalidateQueries({ queryKey: ['learning'] });
      void queryClient.invalidateQueries({ queryKey: ['notifications'] });
      onSuccess?.(data, empName);
      onClose();
    },
    onError: (err: unknown) => {
      const axiosErr = err as { response?: { data?: { message?: string } }; message?: string };
      const msg = axiosErr.response?.data?.message || axiosErr.message || '';
      if (
        msg.toLowerCase().includes('already assigned') ||
        msg.toLowerCase().includes('уже назначен')
      ) {
        const empName = `${effectiveEmployee?.firstName || ''} ${effectiveEmployee?.lastName || ''}`.trim();
        setError(t('learning.assignErrorAlreadyAssigned', { employeeName: empName }));
      } else {
        setError(msg || t('learning.assignErrorGeneral'));
      }
    },
  });

  const handleAssign = () => {
    setError(null);
    assignMutation.mutate();
  };

  return (
    <>
      <DialogTitle
        sx={{
          p: 2.5,
          pb: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2.5,
              bgcolor: 'rgba(124, 58, 237, 0.1)',
              color: '#7c3aed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <School sx={{ fontSize: 26 }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
              {t('learning.assignDialogTitle')}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {t('learning.assignDialogSubtitle')}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: 'text.secondary' }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        {error && (
          <Alert severity="error" onClose={() => setError(null)} sx={{ borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {/* Course Card Preview or Selector */}
        {courses.length > 1 && !initialCourse ? (
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
              {t('learning.selectCourse')}
            </Typography>
            <FormControl fullWidth size="small">
              <InputLabel id="course-select-label">{t('learning.selectCourse')}</InputLabel>
              <Select
                labelId="course-select-label"
                value={currentCourse?.id ?? ''}
                label={t('learning.selectCourse')}
                onChange={(e) => {
                  const id = Number(e.target.value);
                  const found = courses.find((c) => c.id === id) || null;
                  setSelectedCourse(found);
                  setError(null);
                }}
              >
                {courses.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {c.title}
                      </Typography>
                      <Chip
                        label={`${c.durationHours} ч.`}
                        size="small"
                        sx={{ height: 20, fontSize: '0.7rem', bgcolor: '#f3e8ff', color: '#7e22ce', fontWeight: 600 }}
                      />
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        ) : currentCourse ? (
          <Box
            sx={{
              p: 2,
              borderRadius: 2.5,
              bgcolor: '#faf5ff',
              border: '1px solid #e9d5ff',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Chip
                  label="JanaPost Academy"
                  size="small"
                  sx={{ bgcolor: '#7c3aed', color: '#fff', fontWeight: 700, height: 22, fontSize: '0.72rem' }}
                />
                <Chip
                  icon={<AccessTime sx={{ fontSize: 13 }} />}
                  label={t('learning.courseDurationHours', { hours: currentCourse.durationHours })}
                  size="small"
                  variant="outlined"
                  sx={{ height: 22, fontSize: '0.72rem', borderColor: '#c084fc', color: '#6b21a8' }}
                />
              </Box>
              {currentCourse.contentUrl && (
                <Button
                  size="small"
                  variant="text"
                  endIcon={<OpenInNew sx={{ fontSize: 14 }} />}
                  href={currentCourse.contentUrl}
                  target="_blank"
                  sx={{ textTransform: 'none', fontSize: '0.75rem', p: 0, minWidth: 0, color: '#7c3aed' }}
                >
                  {t('learning.courseMaterials')}
                </Button>
              )}
            </Box>

            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1e1b4b', mb: 0.5 }}>
              {currentCourse.title}
            </Typography>

            <Typography variant="body2" sx={{ color: '#4c1d95', fontSize: '0.85rem', lineHeight: 1.4 }}>
              {currentCourse.description}
            </Typography>
          </Box>
        ) : null}

        {/* Employee Search and List */}
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              {t('learning.selectEmployee')}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Найдено: {filteredEmployees.length}
            </Typography>
          </Box>

          <TextField
            size="small"
            placeholder={t('learning.searchEmployeePlaceholder')}
            value={employeeSearch}
            onChange={(e) => setEmployeeSearch(e.target.value)}
            fullWidth
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: 'text.secondary', fontSize: 18 }} />
                  </InputAdornment>
                ),
                endAdornment: employeeSearch ? (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setEmployeeSearch('')}>
                      <Clear sx={{ fontSize: 16 }} />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              },
            }}
            sx={{ mb: 1.5 }}
          />

          {isLoadingEmployees ? (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4, gap: 1.5 }}>
              <CircularProgress size={22} sx={{ color: '#7c3aed' }} />
              <Typography variant="body2" color="text.secondary">
                Загрузка списка сотрудников...
              </Typography>
            </Box>
          ) : filteredEmployees.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center', bgcolor: '#f8fafc', borderRadius: 2, border: '1px dashed #cbd5e1' }}>
              <Typography variant="body2" color="text.secondary">
                Сотрудники по вашему запросу не найдены
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                maxHeight: 220,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                pr: 0.5,
              }}
            >
              {filteredEmployees.map((emp) => {
                const isSelected = effectiveEmployee?.id === emp.id;
                const deptName = deptMap.get(emp.departmentId);
                const initials = `${emp.firstName?.[0] || ''}${emp.lastName?.[0] || ''}`.toUpperCase();

                return (
                  <Box
                    key={emp.id}
                    onClick={() => {
                      setSelectedEmployee(emp);
                      setError(null);
                    }}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      p: 1.25,
                      borderRadius: 2,
                      cursor: 'pointer',
                      border: isSelected ? '2px solid #7c3aed' : '1px solid #e2e8f0',
                      bgcolor: isSelected ? 'rgba(124, 58, 237, 0.06)' : '#fff',
                      transition: 'all 0.15s ease-in-out',
                      '&:hover': {
                        bgcolor: isSelected ? 'rgba(124, 58, 237, 0.08)' : '#f8fafc',
                        borderColor: isSelected ? '#7c3aed' : '#cbd5e1',
                      },
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 38,
                        height: 38,
                        background: isSelected
                          ? 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)'
                          : 'linear-gradient(135deg, #168B48 0%, #1EA657 100%)',
                        color: '#fff',
                        fontSize: '0.85rem',
                        fontWeight: 800,
                      }}
                    >
                      {initials}
                    </Avatar>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: isSelected ? 800 : 700 }}>
                          {emp.firstName} {emp.lastName} {emp.middleName || ''}
                        </Typography>
                        <Chip
                          label={emp.status}
                          size="small"
                          color={emp.status === 'ACTIVE' ? 'success' : 'default'}
                          sx={{ height: 16, fontSize: '0.62rem', fontWeight: 700 }}
                        />
                      </Box>
                      <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
                        {emp.position} {deptName ? `• ${deptName}` : ''} {emp.city ? `• ${emp.city}` : ''}
                      </Typography>
                      {emp.email && (
                        <Typography variant="caption" sx={{ color: '#64748b', display: 'block', fontSize: '0.72rem' }}>
                          {emp.email}
                        </Typography>
                      )}
                    </Box>

                    {isSelected ? (
                      <CheckCircle sx={{ color: '#7c3aed', fontSize: 22 }} />
                    ) : (
                      <RadioButtonUnchecked sx={{ color: '#cbd5e1', fontSize: 22 }} />
                    )}
                  </Box>
                );
              })}
            </Box>
          )}
        </Box>

        {/* Selected Employee Confirmation Banner */}
        {effectiveEmployee && (
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              bgcolor: '#f0fdf4',
              border: '1px solid #bbf7d0',
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
            }}
          >
            <CheckCircle sx={{ color: '#16a34a', fontSize: 20 }} />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#14532d' }}>
                Выбран: {effectiveEmployee.firstName} {effectiveEmployee.lastName} ({effectiveEmployee.position})
              </Typography>
              <Typography variant="caption" sx={{ color: '#166534' }}>
                {deptMap.get(effectiveEmployee.departmentId) || effectiveEmployee.city || 'JanaPost'}
              </Typography>
            </Box>
          </Box>
        )}

        {/* Informational note */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 1.5,
            p: 1.5,
            borderRadius: 2,
            bgcolor: '#eff6ff',
            border: '1px solid #bfdbfe',
          }}
        >
          <InfoOutlined sx={{ fontSize: 20, color: '#2563eb', mt: 0.25, flexShrink: 0 }} />
          <Typography variant="caption" sx={{ color: '#1e40af', lineHeight: 1.5 }}>
            {t('learning.notifyEmployeeHint')}
          </Typography>
        </Box>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 2, px: 2.5, justifyContent: 'space-between' }}>
        <Button onClick={onClose} color="inherit" sx={{ textTransform: 'none', fontWeight: 600 }}>
          {t('learning.cancel')}
        </Button>
        <Button
          variant="contained"
          onClick={handleAssign}
          disabled={!effectiveEmployee || !currentCourse || assignMutation.isPending}
          startIcon={
            assignMutation.isPending ? (
              <CircularProgress size={16} sx={{ color: '#fff' }} />
            ) : (
              <AssignmentInd />
            )
          }
          sx={{
            bgcolor: '#7c3aed',
            '&:hover': { bgcolor: '#6d28d9' },
            textTransform: 'none',
            fontWeight: 700,
            borderRadius: 2,
            px: 2.5,
          }}
        >
          {assignMutation.isPending ? t('learning.assigning') : t('learning.confirmAssign')}
        </Button>
      </DialogActions>
    </>
  );
}

export default function AssignCourseDialog({
  open,
  onClose,
  initialCourse,
  courses = [],
  initialEmployeeId,
  onSuccess,
}: AssignCourseDialogProps) {
  if (!open) return null;

  const formKey = `${initialCourse?.id ?? 'none'}-${initialEmployeeId ?? 'none'}-${open}`;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: 3 } } }}
    >
      <InnerAssignForm
        key={formKey}
        initialCourse={initialCourse}
        courses={courses}
        initialEmployeeId={initialEmployeeId}
        onClose={onClose}
        onSuccess={onSuccess}
      />
    </Dialog>
  );
}
