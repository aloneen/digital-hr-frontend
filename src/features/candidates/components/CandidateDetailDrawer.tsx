import React, { useEffect, useState } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Drawer,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  Close as CloseIcon,
  ContentCopyOutlined as CopyIcon,
  DescriptionOutlined as DocumentIcon,
  DownloadOutlined as DownloadIcon,
  EditOutlined as EditIcon,
  EmailOutlined as EmailIcon,
  FiberManualRecord,
  LinkOutlined as LinkIcon,
  PhoneOutlined as PhoneIcon,
  PictureAsPdfOutlined as PdfIcon,
  SaveOutlined as SaveIcon,
  UploadFileOutlined as UploadIcon,
  VisibilityOutlined as ViewIcon,
  WorkOutlineOutlined as WorkIcon,
  CheckCircleOutlined as CheckCircleIcon,
} from '@mui/icons-material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Candidate, CandidateStage } from '../../../shared/types/candidate';
import { candidatesApi } from '../api/candidatesApi';
import {
  findResumeForCandidate,
  formatFileSize,
  saveResume,
  fileToDataUrl,
  downloadResumeFile,
  type StoredResume,
} from '../utils/resumeStorage';
import ResumePreviewModal from './ResumePreviewModal';

const stages: CandidateStage[] = ['NEW', 'SCREENING', 'INTERVIEW', 'OFFER', 'HIRED', 'REJECTED'];

const stageConfig: Record<
  CandidateStage,
  {
    labelKey: string;
    labelRu: string;
    color: string;
    bg: string;
    dotColor: string;
  }
> = {
  NEW: { labelKey: 'new', labelRu: 'Новый', color: '#475569', bg: '#F1F5F9', dotColor: '#94A3B8' },
  SCREENING: { labelKey: 'screening', labelRu: 'Подбор', color: '#1D4ED8', bg: '#DBEAFE', dotColor: '#3B82F6' },
  INTERVIEW: { labelKey: 'interview', labelRu: 'Собеседование', color: '#B45309', bg: '#FEF3C7', dotColor: '#F59E0B' },
  OFFER: { labelKey: 'offer', labelRu: 'Оффер', color: '#6D28D9', bg: '#EDE9FE', dotColor: '#8B5CF6' },
  HIRED: { labelKey: 'hired', labelRu: 'Принят', color: '#168B48', bg: '#DCFCE7', dotColor: '#168B48' },
  REJECTED: { labelKey: 'rejected', labelRu: 'Отклонен', color: '#BE123C', bg: '#FFE4E6', dotColor: '#F43F5E' },
};

const avatarColors = ['#168B48', '#2563EB', '#7C3AED', '#0891B2', '#D97706', '#DB2777'];
function getAvatarColor(id: number) {
  return avatarColors[id % avatarColors.length];
}

type CandidateDetailDrawerProps = {
  candidate: Candidate | null;
  open: boolean;
  onClose: () => void;
  vacancyTitle?: string;
  onStageChange?: (candidateId: number, newStage: CandidateStage) => void;
};

export default function CandidateDetailDrawer({
  candidate,
  open,
  onClose,
  vacancyTitle,
  onStageChange,
}: CandidateDetailDrawerProps) {
  const queryClient = useQueryClient();

  const [storedResume, setStoredResume] = useState<StoredResume | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notesText, setNotesText] = useState('');
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [resumeUrlInput, setResumeUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);

  const [toast, setToast] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Load stored resume and notes on candidate change
  useEffect(() => {
    if (candidate) {
      setNotesText(candidate.notes || '');
      setIsEditingNotes(false);
      setShowUrlInput(false);
      setResumeUrlInput(candidate.resumeUrl || '');

      findResumeForCandidate(candidate).then((res) => {
        setStoredResume(res);
      });
    } else {
      setStoredResume(null);
    }
  }, [candidate]);

  // Stage update mutation
  const stageMutation = useMutation({
    mutationFn: ({ id, stage }: { id: number; stage: CandidateStage }) =>
      candidatesApi.updateStage(id, stage),
    onSuccess: (updated) => {
      void queryClient.invalidateQueries({ queryKey: ['candidates'] });
      if (onStageChange) {
        onStageChange(updated.id, updated.stage);
      }
      setToast({
        open: true,
        message: `Статус изменен на «${stageConfig[updated.stage].labelRu}»`,
        severity: 'success',
      });
    },
    onError: () => {
      setToast({ open: true, message: 'Ошибка при смене статуса', severity: 'error' });
    },
  });

  // Notes and resume update mutation
  const updateCandidateMutation = useMutation({
    mutationFn: (payload: { notes?: string; resumeUrl?: string }) => {
      if (!candidate) throw new Error('No candidate');
      return candidatesApi.update(candidate.id, {
        firstName: candidate.firstName,
        lastName: candidate.lastName,
        email: candidate.email || undefined,
        phone: candidate.phone || undefined,
        ...payload,
      });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['candidates'] });
      setIsEditingNotes(false);
      setShowUrlInput(false);
      setToast({ open: true, message: 'Данные кандидата сохранены', severity: 'success' });
    },
    onError: () => {
      setToast({ open: true, message: 'Не удалось сохранить изменения', severity: 'error' });
    },
  });

  if (!candidate) return null;

  const currentStage = candidate.stage;
  const cfg = stageConfig[currentStage] || stageConfig.NEW;
  const initials = `${candidate.firstName?.[0] || ''}${candidate.lastName?.[0] || ''}`.toUpperCase();

  const handleStageSelect = (newStage: CandidateStage) => {
    if (newStage === currentStage) return;
    stageMutation.mutate({ id: candidate.id, stage: newStage });
  };

  const handleSaveNotes = () => {
    updateCandidateMutation.mutate({ notes: notesText });
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setToast({ open: true, message: `${label} скопирован в буфер`, severity: 'success' });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingResume(true);
      const dataUrl = await fileToDataUrl(file);

      // Save to IndexedDB
      await saveResume(`candidate_${candidate.id}`, {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type || 'application/pdf',
        dataUrl,
        candidateId: candidate.id,
      });

      // Also update candidate in API with file name
      await updateCandidateMutation.mutateAsync({
        resumeUrl: file.name,
      });

      setStoredResume({
        key: `candidate_${candidate.id}`,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type || 'application/pdf',
        dataUrl,
        candidateId: candidate.id,
        updatedAt: new Date().toISOString(),
      });

      setToast({ open: true, message: 'Резюме успешно прикреплено', severity: 'success' });
    } catch (err) {
      console.error(err);
      setToast({ open: true, message: 'Ошибка при загрузке файла резюме', severity: 'error' });
    } finally {
      setIsUploadingResume(false);
    }
  };

  const handleSaveResumeUrl = () => {
    if (!resumeUrlInput.trim()) return;
    updateCandidateMutation.mutate({ resumeUrl: resumeUrlInput.trim() });
  };

  const hasResume = Boolean(storedResume || candidate.resumeUrl);
  const isHttpUrl = candidate.resumeUrl?.startsWith('http://') || candidate.resumeUrl?.startsWith('https://');

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        slotProps={{
          backdrop: { sx: { backdropFilter: 'blur(3px)', bgcolor: 'rgba(15, 23, 42, 0.45)' } },
          paper: {
            sx: {
              width: { xs: '100vw', sm: 480, md: 520 },
              boxSizing: 'border-box',
              p: 0,
              display: 'flex',
              flexDirection: 'column',
              bgcolor: '#FAFCFA',
              boxShadow: '-8px 0 32px rgba(15, 23, 42, 0.12)',
              borderTopLeftRadius: { sm: 20 },
              borderBottomLeftRadius: { sm: 20 },
            },
          },
        }}
      >
        {/* Top Sticky Header */}
        <Box
          sx={{
            p: 2.5,
            px: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #E5E7EB',
            bgcolor: '#FFFFFF',
            position: 'sticky',
            top: 0,
            zIndex: 10,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#111827', fontSize: '1.1rem' }}>
              Карточка кандидата
            </Typography>
            <Chip
              icon={<FiberManualRecord sx={{ fontSize: '10px !important', color: `${cfg.dotColor} !important` }} />}
              label={cfg.labelRu}
              size="small"
              sx={{
                bgcolor: cfg.bg,
                color: cfg.color,
                fontWeight: 700,
                fontSize: '0.78rem',
                height: 24,
              }}
            />
          </Box>
          <IconButton onClick={onClose} size="small" sx={{ color: '#9CA3AF', '&:hover': { color: '#111827' } }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Scrollable Body */}
        <Box sx={{ flex: 1, overflowY: 'auto', p: { xs: 2.5, sm: 3 } }}>
          {/* Hero Profile Card */}
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              mb: 3,
              borderRadius: 3,
              border: '1px solid #E5E7EB',
              bgcolor: '#FFFFFF',
              boxShadow: '0 2px 10px rgba(15, 23, 42, 0.04)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Avatar
                sx={{
                  width: 56,
                  height: 56,
                  bgcolor: getAvatarColor(candidate.id),
                  fontWeight: 800,
                  fontSize: '1.3rem',
                  color: '#FFFFFF',
                  boxShadow: '0 4px 12px rgba(22, 139, 72, 0.2)',
                }}
              >
                {initials}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#111827', letterSpacing: '-0.02em' }}>
                  {candidate.firstName} {candidate.lastName}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
                  <Chip
                    icon={<WorkIcon sx={{ fontSize: '14px !important', color: '#168B48 !important' }} />}
                    label={vacancyTitle || `Вакансия #${candidate.vacancyId}`}
                    size="small"
                    sx={{
                      bgcolor: '#E8F5EE',
                      color: '#168B48',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      height: 22,
                    }}
                  />
                  <Typography variant="caption" sx={{ color: '#9CA3AF', fontWeight: 600 }}>
                    ID #{candidate.id}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Quick Contact Buttons */}
            <Stack direction="row" spacing={1.5} sx={{ mt: 2 }}>
              {candidate.phone && (
                <Button
                  component="a"
                  href={`tel:${candidate.phone}`}
                  variant="outlined"
                  size="small"
                  startIcon={<PhoneIcon sx={{ fontSize: 16 }} />}
                  sx={{
                    flex: 1,
                    textTransform: 'none',
                    fontWeight: 700,
                    borderRadius: 2,
                    borderColor: '#D1D5DB',
                    color: '#374151',
                    '&:hover': { borderColor: '#168B48', color: '#168B48', bgcolor: '#E8F5EE' },
                  }}
                >
                  Позвонить
                </Button>
              )}
              {candidate.email && (
                <Button
                  component="a"
                  href={`mailto:${candidate.email}`}
                  variant="outlined"
                  size="small"
                  startIcon={<EmailIcon sx={{ fontSize: 16 }} />}
                  sx={{
                    flex: 1,
                    textTransform: 'none',
                    fontWeight: 700,
                    borderRadius: 2,
                    borderColor: '#D1D5DB',
                    color: '#374151',
                    '&:hover': { borderColor: '#168B48', color: '#168B48', bgcolor: '#E8F5EE' },
                  }}
                >
                  Написать
                </Button>
              )}
            </Stack>
          </Paper>

          {/* Recruitment Stage Pipeline Selector */}
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              mb: 3,
              borderRadius: 3,
              border: '1px solid #E5E7EB',
              bgcolor: '#FFFFFF',
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontWeight: 800,
                color: '#6B7280',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                display: 'block',
                mb: 1.5,
              }}
            >
              Этап отбора в воронке
            </Typography>

            <Select
              fullWidth
              size="small"
              value={currentStage}
              onChange={(e) => handleStageSelect(e.target.value as CandidateStage)}
              disabled={stageMutation.isPending}
              sx={{
                borderRadius: 2,
                fontWeight: 700,
                bgcolor: cfg.bg,
                color: cfg.color,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'transparent',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: cfg.color,
                },
              }}
            >
              {stages.map((stg) => {
                const s = stageConfig[stg];
                return (
                  <MenuItem key={stg} value={stg} sx={{ py: 1, fontWeight: 600 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                      <FiberManualRecord sx={{ fontSize: 11, color: s.dotColor }} />
                      <Typography variant="body2" sx={{ fontWeight: 700, color: s.color }}>
                        {s.labelRu}
                      </Typography>
                    </Box>
                  </MenuItem>
                );
              })}
            </Select>

            {/* Quick Pipeline Progress Bar */}
            <Box sx={{ display: 'flex', gap: 0.75, mt: 2 }}>
              {stages.map((stg, index) => {
                const isPassed = stages.indexOf(currentStage) >= index;
                const isCurrent = currentStage === stg;
                return (
                  <Box
                    key={stg}
                    onClick={() => handleStageSelect(stg)}
                    sx={{
                      flex: 1,
                      height: 6,
                      borderRadius: 3,
                      bgcolor: isCurrent ? '#168B48' : isPassed ? '#86EFAC' : '#E5E7EB',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': { transform: 'scaleY(1.5)', bgcolor: '#168B48' },
                    }}
                  />
                );
              })}
            </Box>
          </Paper>

          {/* Contact Details Card */}
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              mb: 3,
              borderRadius: 3,
              border: '1px solid #E5E7EB',
              bgcolor: '#FFFFFF',
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontWeight: 800,
                color: '#6B7280',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                display: 'block',
                mb: 1.5,
              }}
            >
              Контактные данные
            </Typography>

            <Stack spacing={1.75}>
              {/* Phone */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                  <PhoneIcon sx={{ fontSize: 18, color: '#168B48' }} />
                  <Box>
                    <Typography variant="caption" sx={{ color: '#9CA3AF', display: 'block', lineHeight: 1 }}>
                      Телефон
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#111827', mt: 0.2 }}>
                      {candidate.phone || 'Не указан'}
                    </Typography>
                  </Box>
                </Box>
                {candidate.phone && (
                  <Tooltip title="Скопировать телефон">
                    <IconButton size="small" onClick={() => handleCopy(candidate.phone!, 'Телефон')}>
                      <CopyIcon sx={{ fontSize: 16, color: '#9CA3AF' }} />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>

              <Divider />

              {/* Email */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                  <EmailIcon sx={{ fontSize: 18, color: '#168B48' }} />
                  <Box>
                    <Typography variant="caption" sx={{ color: '#9CA3AF', display: 'block', lineHeight: 1 }}>
                      Email
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#111827', mt: 0.2 }}>
                      {candidate.email || 'Не указан'}
                    </Typography>
                  </Box>
                </Box>
                {candidate.email && (
                  <Tooltip title="Скопировать Email">
                    <IconButton size="small" onClick={() => handleCopy(candidate.email!, 'Email')}>
                      <CopyIcon sx={{ fontSize: 16, color: '#9CA3AF' }} />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            </Stack>
          </Paper>

          {/* RESUME SECTION */}
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              mb: 3,
              borderRadius: 3,
              border: '1px solid #E5E7EB',
              bgcolor: '#FFFFFF',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 800,
                  color: '#6B7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Резюме кандидата
              </Typography>
              {hasResume && (
                <Chip
                  size="small"
                  icon={<CheckCircleIcon sx={{ fontSize: '14px !important', color: '#168B48 !important' }} />}
                  label="Прикреплено"
                  sx={{ bgcolor: '#E8F5EE', color: '#168B48', fontWeight: 700, height: 22, fontSize: '0.72rem' }}
                />
              )}
            </Box>

            {hasResume ? (
              <Box>
                {/* Attached Resume Card */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    mb: 2,
                    bgcolor: '#F8FAFC',
                    borderRadius: 2.5,
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, overflow: 'hidden' }}>
                    <Box
                      sx={{
                        width: 42,
                        height: 42,
                        borderRadius: 2,
                        bgcolor: '#EBF6F0',
                        color: '#168B48',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {storedResume?.fileName?.endsWith('.pdf') ? (
                        <PdfIcon sx={{ fontSize: 24 }} />
                      ) : isHttpUrl ? (
                        <LinkIcon sx={{ fontSize: 24 }} />
                      ) : (
                        <DocumentIcon sx={{ fontSize: 24 }} />
                      )}
                    </Box>
                    <Box sx={{ overflow: 'hidden' }}>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 700,
                          color: '#111827',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {storedResume?.fileName || candidate.resumeUrl || 'Резюме кандидата'}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#6B7280' }}>
                        {storedResume?.fileSize
                          ? formatFileSize(storedResume.fileSize)
                          : isHttpUrl
                          ? 'Внешняя ссылка'
                          : 'Документ кандидата'}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>

                {/* Resume Action Buttons */}
                <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<ViewIcon />}
                    onClick={() => {
                      if (isHttpUrl) {
                        window.open(candidate.resumeUrl!, '_blank');
                      } else {
                        setIsPreviewOpen(true);
                      }
                    }}
                    sx={{
                      bgcolor: '#168B48',
                      '&:hover': { bgcolor: '#11703A' },
                      textTransform: 'none',
                      fontWeight: 700,
                      borderRadius: 2,
                      py: 1,
                    }}
                  >
                    Просмотреть
                  </Button>

                  {storedResume?.dataUrl && (
                    <Button
                      variant="outlined"
                      startIcon={<DownloadIcon />}
                      onClick={() => downloadResumeFile(storedResume.fileName, storedResume.dataUrl)}
                      sx={{
                        borderColor: '#168B48',
                        color: '#168B48',
                        textTransform: 'none',
                        fontWeight: 700,
                        borderRadius: 2,
                        px: 2,
                      }}
                    >
                      Скачать
                    </Button>
                  )}
                </Stack>

                {/* Replace / change file option */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    component="label"
                    size="small"
                    startIcon={<UploadIcon sx={{ fontSize: 16 }} />}
                    sx={{ textTransform: 'none', color: '#6B7280', fontSize: '0.78rem', fontWeight: 600 }}
                  >
                    Заменить файл
                    <input type="file" hidden accept=".pdf,.doc,.docx,.txt,image/*" onChange={handleFileUpload} />
                  </Button>
                </Box>
              </Box>
            ) : (
              /* No resume placeholder */
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <Box
                  sx={{
                    width: 52,
                    height: 52,
                    borderRadius: 3,
                    bgcolor: '#F3F4F6',
                    color: '#9CA3AF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 1.5,
                  }}
                >
                  <DocumentIcon sx={{ fontSize: 28 }} />
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#374151', mb: 0.5 }}>
                  Резюме пока не прикреплено
                </Typography>
                <Typography variant="caption" sx={{ color: '#9CA3AF', display: 'block', mb: 2 }}>
                  Вы можете загрузить файл резюме (PDF, DOCX, TXT) или указать ссылку
                </Typography>

                <Stack direction="row" spacing={1} useFlexGap sx={{ justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Button
                    component="label"
                    variant="contained"
                    size="small"
                    startIcon={isUploadingResume ? <CircularProgress size={16} color="inherit" /> : <UploadIcon />}
                    disabled={isUploadingResume}
                    sx={{
                      bgcolor: '#168B48',
                      '&:hover': { bgcolor: '#11703A' },
                      textTransform: 'none',
                      fontWeight: 700,
                      borderRadius: 2,
                    }}
                  >
                    {isUploadingResume ? 'Загрузка...' : 'Загрузить файл'}
                    <input type="file" hidden accept=".pdf,.doc,.docx,.txt,image/*" onChange={handleFileUpload} />
                  </Button>

                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<LinkIcon />}
                    onClick={() => setShowUrlInput(!showUrlInput)}
                    sx={{
                      borderColor: '#D1D5DB',
                      color: '#374151',
                      textTransform: 'none',
                      fontWeight: 600,
                      borderRadius: 2,
                    }}
                  >
                    Ссылка
                  </Button>
                </Stack>

                {/* Inline URL input */}
                {showUrlInput && (
                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="https://hh.kz/resume/..."
                      value={resumeUrlInput}
                      onChange={(e) => setResumeUrlInput(e.target.value)}
                    />
                    <Button
                      variant="contained"
                      size="small"
                      onClick={handleSaveResumeUrl}
                      disabled={!resumeUrlInput.trim() || updateCandidateMutation.isPending}
                      sx={{
                        bgcolor: '#168B48',
                        '&:hover': { bgcolor: '#11703A' },
                        textTransform: 'none',
                        fontWeight: 700,
                      }}
                    >
                      Сохранить
                    </Button>
                  </Box>
                )}
              </Box>
            )}
          </Paper>

          {/* Notes and Comments Section */}
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              mb: 3,
              borderRadius: 3,
              border: '1px solid #E5E7EB',
              bgcolor: '#FFFFFF',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 800,
                  color: '#6B7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Заметки и комментарии HR
              </Typography>
              {!isEditingNotes && (
                <IconButton size="small" onClick={() => setIsEditingNotes(true)} sx={{ color: '#6B7280' }}>
                  <EditIcon sx={{ fontSize: 16 }} />
                </IconButton>
              )}
            </Box>

            {isEditingNotes ? (
              <Box>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  size="small"
                  placeholder="Добавьте впечатления об интервью, навыки или ожидания кандидата..."
                  value={notesText}
                  onChange={(e) => setNotesText(e.target.value)}
                  sx={{ mb: 1.5 }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                  <Button
                    size="small"
                    onClick={() => {
                      setNotesText(candidate.notes || '');
                      setIsEditingNotes(false);
                    }}
                    sx={{ textTransform: 'none', color: '#6B7280' }}
                  >
                    Отмена
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<SaveIcon />}
                    onClick={handleSaveNotes}
                    disabled={updateCandidateMutation.isPending}
                    sx={{
                      bgcolor: '#168B48',
                      '&:hover': { bgcolor: '#11703A' },
                      textTransform: 'none',
                      fontWeight: 700,
                      borderRadius: 1.5,
                    }}
                  >
                    Сохранить
                  </Button>
                </Box>
              </Box>
            ) : (
              <Typography
                variant="body2"
                sx={{
                  color: candidate.notes ? '#374151' : '#9CA3AF',
                  fontStyle: candidate.notes ? 'normal' : 'italic',
                  lineHeight: 1.6,
                }}
              >
                {candidate.notes || 'Заметки не добавлены. Нажмите на карандаш, чтобы написать комментарий.'}
              </Typography>
            )}
          </Paper>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            p: 2,
            px: 3,
            bgcolor: '#FFFFFF',
            borderTop: '1px solid #E5E7EB',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="caption" sx={{ color: '#9CA3AF' }}>
            {candidate.createdAt
              ? `Создан ${new Date(candidate.createdAt).toLocaleDateString('ru-RU')}`
              : 'JanaPost Recruitment'}
          </Typography>
          <Button
            onClick={onClose}
            variant="outlined"
            size="small"
            sx={{
              borderColor: '#D1D5DB',
              color: '#374151',
              fontWeight: 700,
              textTransform: 'none',
              borderRadius: 2,
              px: 2.5,
            }}
          >
            Закрыть
          </Button>
        </Box>
      </Drawer>

      {/* Resume Preview Modal */}
      <ResumePreviewModal
        open={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        candidate={candidate}
        vacancyTitle={vacancyTitle}
        storedResume={storedResume}
      />

      {/* Feedback Toast */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setToast((prev) => ({ ...prev, open: false }))}
          severity={toast.severity}
          variant="filled"
          sx={{ borderRadius: 2 }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
}
