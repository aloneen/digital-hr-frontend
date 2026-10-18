import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Paper,
  Typography,
} from '@mui/material';
import {
  Close as CloseIcon,
  DescriptionOutlined as DocumentIcon,
  DownloadOutlined as DownloadIcon,
  EmailOutlined as EmailIcon,
  OpenInNewOutlined as OpenInNewIcon,
  PhoneOutlined as PhoneIcon,
  PrintOutlined as PrintIcon,
  PictureAsPdfOutlined as PdfIcon,
  WorkOutlineOutlined as WorkIcon,
} from '@mui/icons-material';
import type { Candidate } from '../../../shared/types/candidate';
import {
  downloadResumeFile,
  formatFileSize,
  type StoredResume,
} from '../utils/resumeStorage';

type ResumePreviewModalProps = {
  open: boolean;
  onClose: () => void;
  candidate: Candidate | null;
  vacancyTitle?: string;
  storedResume?: StoredResume | null;
};

export default function ResumePreviewModal({
  open,
  onClose,
  candidate,
  vacancyTitle,
  storedResume,
}: ResumePreviewModalProps) {
  if (!candidate) return null;

  const isPdf = storedResume?.fileType?.includes('pdf') || storedResume?.fileName?.endsWith('.pdf');
  const isImage =
    storedResume?.fileType?.startsWith('image/') ||
    /\.(png|jpe?g|webp)$/i.test(storedResume?.fileName || '');
  const isHttpUrl = candidate.resumeUrl?.startsWith('http://') || candidate.resumeUrl?.startsWith('https://');

  const handleDownload = () => {
    if (storedResume?.dataUrl) {
      downloadResumeFile(storedResume.fileName, storedResume.dataUrl);
    } else {
      window.print();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            maxHeight: '92vh',
            display: 'flex',
            flexDirection: 'column',
          },
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 1.5,
          borderBottom: '1px solid #E5E7EB',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#111827' }}>
            {storedResume ? 'Просмотр резюме' : 'Данные кандидата'}
          </Typography>
          <Chip
            size="small"
            label={`${candidate.firstName} ${candidate.lastName}`}
            sx={{ bgcolor: '#E8F5EE', color: '#168B48', fontWeight: 700 }}
          />
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: '#6B7280' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ p: { xs: 2, sm: 3 }, bgcolor: '#F8FAFC', flex: 1, overflowY: 'auto' }}>
        {/* If uploaded file is PDF, show PDF viewer */}
        {storedResume?.dataUrl && isPdf ? (
          <Box sx={{ width: '100%', height: '70vh', borderRadius: 2, overflow: 'hidden' }}>
            <iframe
              src={storedResume.dataUrl}
              title={`Резюме ${candidate.firstName} ${candidate.lastName}`}
              width="100%"
              height="100%"
              style={{ border: 'none', borderRadius: '8px' }}
            />
          </Box>
        ) : storedResume?.dataUrl && isImage ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              p: 2,
              bgcolor: '#FFFFFF',
              borderRadius: 2,
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}
          >
            <img
              src={storedResume.dataUrl}
              alt="Резюме кандидата"
              style={{ maxWidth: '100%', maxHeight: '65vh', objectFit: 'contain', borderRadius: 4 }}
            />
          </Box>
        ) : isHttpUrl ? (
          <Paper
            elevation={0}
            sx={{
              p: 4,
              textAlign: 'center',
              bgcolor: '#FFFFFF',
              borderRadius: 3,
              border: '1px solid #E5E7EB',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
              Внешняя ссылка на резюме
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Кандидат предоставил ссылку на внешнее портфолио / резюме:
            </Typography>
            <Typography
              variant="body2"
              sx={{
                p: 2,
                mb: 3,
                bgcolor: '#F3F4F6',
                borderRadius: 2,
                fontFamily: 'monospace',
                wordBreak: 'break-all',
                color: '#1F2937',
              }}
            >
              {candidate.resumeUrl}
            </Typography>
            <Button
              variant="contained"
              startIcon={<OpenInNewIcon />}
              onClick={() => window.open(candidate.resumeUrl!, '_blank')}
              sx={{
                bgcolor: '#168B48',
                '&:hover': { bgcolor: '#11703A' },
                textTransform: 'none',
                fontWeight: 700,
                borderRadius: 2,
                px: 3,
              }}
            >
              Открыть в новой вкладке
            </Button>
          </Paper>
        ) : storedResume?.dataUrl ? (
          /* For other uploaded files like DOCX, DOC, TXT */
          <Paper
            elevation={0}
            sx={{
              p: 4,
              textAlign: 'center',
              bgcolor: '#FFFFFF',
              borderRadius: 3,
              border: '1px solid #E5E7EB',
            }}
          >
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: 3,
                bgcolor: '#E8F5EE',
                color: '#168B48',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
              }}
            >
              {storedResume.fileName?.endsWith('.pdf') ? (
                <PdfIcon sx={{ fontSize: 36 }} />
              ) : (
                <DocumentIcon sx={{ fontSize: 36 }} />
              )}
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#111827', mb: 0.5 }}>
              {storedResume.fileName}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {formatFileSize(storedResume.fileSize)} · Документ резюме кандидата
            </Typography>

            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={handleDownload}
              sx={{
                bgcolor: '#168B48',
                '&:hover': { bgcolor: '#11703A' },
                textTransform: 'none',
                fontWeight: 700,
                borderRadius: 2,
                px: 3,
                py: 1,
              }}
            >
              Скачать файл резюме
            </Button>
          </Paper>
        ) : (
          /* Actual Candidate Data only (No fake skills, no fake companies, no fake education) */
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, sm: 4 },
              bgcolor: '#FFFFFF',
              borderRadius: 3,
              border: '1px solid #E2E8F0',
              boxShadow: '0 4px 12px rgba(15, 23, 42, 0.05)',
            }}
          >
            {/* Header with real candidate details */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: { xs: 'flex-start', sm: 'center' },
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                pb: 3,
                borderBottom: '2px solid #168B48',
              }}
            >
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#111827', letterSpacing: '-0.02em' }}>
                  {candidate.firstName} {candidate.lastName}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.75 }}>
                  <WorkIcon sx={{ fontSize: 18, color: '#168B48' }} />
                  <Typography variant="subtitle1" sx={{ color: '#168B48', fontWeight: 700 }}>
                    {vacancyTitle || `Вакансия #${candidate.vacancyId}`}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, alignItems: { sm: 'flex-end' } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PhoneIcon sx={{ fontSize: 16, color: '#168B48' }} />
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#374151' }}>
                    {candidate.phone || 'Телефон не указан'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EmailIcon sx={{ fontSize: 16, color: '#168B48' }} />
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#374151' }}>
                    {candidate.email || 'Email не указан'}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Notes / HR comment if provided */}
            <Box sx={{ my: 3 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 800,
                  color: '#1F2937',
                  mb: 1,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  fontSize: '0.8rem',
                }}
              >
                Заметки / Информация при создании
              </Typography>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  bgcolor: '#F9FAFB',
                  border: '1px solid #E5E7EB',
                  borderRadius: 2,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: candidate.notes ? '#374151' : '#9CA3AF',
                    fontStyle: candidate.notes ? 'normal' : 'italic',
                    lineHeight: 1.6,
                  }}
                >
                  {candidate.notes || 'Заметки не были указаны при создании кандидата.'}
                </Typography>
              </Paper>
            </Box>

            <Divider sx={{ my: 2.5 }} />

            {/* Status message */}
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: '#FFFBEB',
                border: '1px solid #FDE68A',
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
              }}
            >
              <DocumentIcon sx={{ color: '#D97706' }} />
              <Typography variant="body2" sx={{ color: '#92400E' }}>
                Файл резюме не был прикреплен. Вы можете прикрепить файл в карточке кандидата справа.
              </Typography>
            </Box>
          </Paper>
        )}
      </DialogContent>

      {/* Footer Actions */}
      <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #E5E7EB', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<PrintIcon />}
            onClick={handlePrint}
            sx={{
              borderColor: '#D1D5DB',
              color: '#374151',
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: 2,
            }}
          >
            Печать
          </Button>
          {storedResume?.dataUrl && (
            <Button
              variant="outlined"
              size="small"
              startIcon={<DownloadIcon />}
              onClick={handleDownload}
              sx={{
                borderColor: '#168B48',
                color: '#168B48',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: 2,
              }}
            >
              Скачать
            </Button>
          )}
        </Box>

        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            bgcolor: '#168B48',
            '&:hover': { bgcolor: '#11703A' },
            textTransform: 'none',
            fontWeight: 700,
            borderRadius: 2,
            px: 3,
          }}
        >
          Закрыть
        </Button>
      </DialogActions>
    </Dialog>
  );
}
