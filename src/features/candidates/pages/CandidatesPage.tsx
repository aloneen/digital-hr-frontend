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
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import {
  Add as AddIcon,
  CloudUploadOutlined as CloudUploadIcon,
  DeleteOutlined as DeleteIcon,
  LinkOutlined as LinkIcon,
  PeopleOutlined as PeopleIcon,
  PictureAsPdfOutlined as PdfIcon,
  Search as SearchIcon,
  WorkOutlined as WorkIcon,
} from '@mui/icons-material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { candidatesApi } from '../api/candidatesApi';
import { vacanciesApi } from '../../vacancies/api/vacanciesApi';
import CandidateBoard from '../components/CandidateBoard';
import CandidateDetailDrawer from '../components/CandidateDetailDrawer';
import {
  fileToDataUrl,
  formatFileSize,
  saveResume,
} from '../utils/resumeStorage';

export default function CandidatesPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [selectedVacancyId, setSelectedVacancyId] = useState<string>('1');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState<number | null>(null);

  // New Candidate Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    notes: '',
    resumeUrl: '',
  });

  const [resumeMode, setResumeMode] = useState<'file' | 'url'>('file');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isDraggingFile, setIsDraggingFile] = useState(false);

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

  // Derive currently selected candidate from candidates list
  const selectedCandidate = useMemo(() => {
    if (!selectedCandidateId) return null;
    return candidates?.find((c) => c.id === selectedCandidateId) || null;
  }, [candidates, selectedCandidateId]);

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
    mutationFn: async (payload: {
      firstName: string;
      lastName: string;
      email?: string;
      phone?: string;
      notes?: string;
      resumeUrl?: string;
      vacancyId: number;
      _fileDataUrl?: string | null;
      _fileName?: string;
      _fileSize?: number;
      _fileType?: string;
    }) => {
      const { _fileDataUrl, _fileName, _fileSize, _fileType, ...apiPayload } = payload;
      const createdCandidate = await candidatesApi.create(apiPayload);

      // If user attached a file, save it to local IndexedDB/localStorage storage
      if (_fileDataUrl && _fileName) {
        await saveResume(`candidate_${createdCandidate.id}`, {
          fileName: _fileName,
          fileSize: _fileSize || 0,
          fileType: _fileType || 'application/pdf',
          dataUrl: _fileDataUrl,
          candidateId: createdCandidate.id,
        });

        await saveResume(_fileName, {
          fileName: _fileName,
          fileSize: _fileSize || 0,
          fileType: _fileType || 'application/pdf',
          dataUrl: _fileDataUrl,
          candidateId: createdCandidate.id,
        });
      }

      return createdCandidate;
    },
    onSuccess: (res) => {
      void queryClient.invalidateQueries({ queryKey: ['candidates', vacancyNumber] });
      setIsAddDialogOpen(false);
      setFormData({ firstName: '', lastName: '', email: '', phone: '', notes: '', resumeUrl: '' });
      setResumeFile(null);
      setSelectedCandidateId(res.id); // Automatically open the side drawer with the new candidate
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

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName.trim() || !formData.lastName.trim()) return;

    let resumeUrlToSend = formData.resumeUrl.trim() || undefined;
    let fileDataUrl: string | null = null;

    if (resumeMode === 'file' && resumeFile) {
      try {
        fileDataUrl = await fileToDataUrl(resumeFile);
        resumeUrlToSend = resumeFile.name;
      } catch (err) {
        console.error('Failed to read file:', err);
      }
    }

    createMutation.mutate({
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim() || undefined,
      phone: formData.phone.trim() || undefined,
      notes: formData.notes.trim() || undefined,
      resumeUrl: resumeUrlToSend,
      vacancyId: vacancyNumber,
      _fileDataUrl: fileDataUrl,
      _fileName: resumeFile?.name,
      _fileSize: resumeFile?.size,
      _fileType: resumeFile?.type,
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
            Канбан-доска подбора персонала с поддержкой резюме и детальным просмотром
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setFormData({ firstName: '', lastName: '', email: '', phone: '', notes: '', resumeUrl: '' });
            setResumeFile(null);
            setResumeMode('file');
            setIsAddDialogOpen(true);
          }}
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
        <CandidateBoard
          candidates={filteredCandidates}
          vacancyId={vacancyNumber}
          onSelectCandidate={(c) => setSelectedCandidateId(c.id)}
          selectedCandidateId={selectedCandidateId}
        />
      )}

      {/* Candidate Right-Side Details Drawer ("маленькое окошко справа") */}
      <CandidateDetailDrawer
        candidate={selectedCandidate}
        open={Boolean(selectedCandidateId && selectedCandidate)}
        onClose={() => setSelectedCandidateId(null)}
        vacancyTitle={selectedVacancy?.title}
        onStageChange={() => {
          void queryClient.invalidateQueries({ queryKey: ['candidates', vacancyNumber] });
        }}
      />

      {/* Add Candidate Modal Dialog with Resume Upload */}
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
              {/* First Name & Last Name */}
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

              {/* Email & Phone */}
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

              {/* Notes */}
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label={t('candidates.notes')}
                  placeholder="Опыт работы, источник отклика, навыки..."
                  value={formData.notes}
                  onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                />
              </Grid>

              {/* RESUME UPLOAD SECTION */}
              <Grid size={{ xs: 12 }}>
                <Box sx={{ mt: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#374151' }}>
                      Резюме кандидата
                    </Typography>

                    {/* Mode Toggle Buttons */}
                    <Box sx={{ display: 'flex', gap: 0.75 }}>
                      <Button
                        type="button"
                        size="small"
                        onClick={() => setResumeMode('file')}
                        variant={resumeMode === 'file' ? 'contained' : 'outlined'}
                        sx={{
                          textTransform: 'none',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          py: 0.3,
                          px: 1.5,
                          borderRadius: 2,
                          bgcolor: resumeMode === 'file' ? '#168B48' : 'transparent',
                          borderColor: '#D1D5DB',
                          color: resumeMode === 'file' ? '#FFFFFF' : '#4B5563',
                          '&:hover': {
                            bgcolor: resumeMode === 'file' ? '#11703A' : '#F3F4F6',
                            borderColor: '#9CA3AF',
                          },
                        }}
                      >
                        Загрузить файл
                      </Button>
                      <Button
                        type="button"
                        size="small"
                        onClick={() => setResumeMode('url')}
                        variant={resumeMode === 'url' ? 'contained' : 'outlined'}
                        sx={{
                          textTransform: 'none',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          py: 0.3,
                          px: 1.5,
                          borderRadius: 2,
                          bgcolor: resumeMode === 'url' ? '#168B48' : 'transparent',
                          borderColor: '#D1D5DB',
                          color: resumeMode === 'url' ? '#FFFFFF' : '#4B5563',
                          '&:hover': {
                            bgcolor: resumeMode === 'url' ? '#11703A' : '#F3F4F6',
                            borderColor: '#9CA3AF',
                          },
                        }}
                      >
                        Указать ссылку
                      </Button>
                    </Box>
                  </Box>

                  {resumeMode === 'file' ? (
                    <Box>
                      {resumeFile ? (
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2,
                            borderRadius: 2.5,
                            border: '1.5px solid #168B48',
                            bgcolor: '#EBF6F0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, overflow: 'hidden' }}>
                            <PdfIcon sx={{ color: '#168B48', fontSize: 28, flexShrink: 0 }} />
                            <Box sx={{ overflow: 'hidden' }}>
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: 700,
                                  color: '#111827',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {resumeFile.name}
                              </Typography>
                              <Typography variant="caption" sx={{ color: '#6B7280' }}>
                                {formatFileSize(resumeFile.size)} · Готово к сохранению
                              </Typography>
                            </Box>
                          </Box>
                          <IconButton size="small" onClick={() => setResumeFile(null)} sx={{ color: '#6B7280' }}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Paper>
                      ) : (
                        <Box
                          component="label"
                          onDragOver={(e) => {
                            e.preventDefault();
                            setIsDraggingFile(true);
                          }}
                          onDragLeave={() => setIsDraggingFile(false)}
                          onDrop={(e) => {
                            e.preventDefault();
                            setIsDraggingFile(false);
                            if (e.dataTransfer.files?.[0]) {
                              setResumeFile(e.dataTransfer.files[0]);
                            }
                          }}
                          sx={{
                            border: isDraggingFile ? '2px dashed #168B48' : '2px dashed #D1D5DB',
                            bgcolor: isDraggingFile ? '#EBF6F0' : '#F9FAFB',
                            borderRadius: 2.5,
                            p: 2.5,
                            textAlign: 'center',
                            cursor: 'pointer',
                            display: 'block',
                            transition: 'all 0.2s',
                            '&:hover': {
                              borderColor: '#168B48',
                              bgcolor: '#F3F9F5',
                            },
                          }}
                        >
                          <input
                            type="file"
                            hidden
                            accept=".pdf,.doc,.docx,.txt,image/*"
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                setResumeFile(e.target.files[0]);
                              }
                            }}
                          />
                          <CloudUploadIcon sx={{ fontSize: 32, color: '#168B48', mb: 0.5 }} />
                          <Typography variant="body2" sx={{ fontWeight: 700, color: '#1F2937' }}>
                            Нажмите для выбора или перетащите файл резюме
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#6B7280' }}>
                            Поддерживаются PDF, DOC, DOCX, TXT (до 10 МБ)
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  ) : (
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="https://hh.kz/resume/... или ссылка на Google Диск"
                      value={formData.resumeUrl}
                      onChange={(e) => setFormData((prev) => ({ ...prev, resumeUrl: e.target.value }))}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <LinkIcon sx={{ color: '#9CA3AF', fontSize: 20 }} />
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                  )}
                </Box>
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
