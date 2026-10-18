import {
  Alert,
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Snackbar,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  AssignmentIndOutlined,
  DescriptionOutlined,
  DragIndicatorOutlined,
  EmailOutlined,
  FiberManualRecord,
  MoreVertOutlined,
  NotesOutlined,
  PhoneOutlined,
} from '@mui/icons-material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { candidatesApi } from '../api/candidatesApi';
import type { Candidate, CandidateStage } from '../../../shared/types/candidate';

const stages: CandidateStage[] = ['NEW', 'SCREENING', 'INTERVIEW', 'OFFER', 'HIRED', 'REJECTED'];

const stageConfig: Record<
  CandidateStage,
  {
    labelKey: string;
    color: string;
    bg: string;
    border: string;
    badgeBg: string;
    badgeText: string;
    dotColor: string;
  }
> = {
  NEW: {
    labelKey: 'new',
    color: '#475569',
    bg: '#F8FAFC',
    border: '#E2E8F0',
    badgeBg: '#F1F5F9',
    badgeText: '#334155',
    dotColor: '#94A3B8',
  },
  SCREENING: {
    labelKey: 'screening',
    color: '#1D4ED8',
    bg: '#F8FAFC',
    border: '#DBEAFE',
    badgeBg: '#DBEAFE',
    badgeText: '#1E40AF',
    dotColor: '#3B82F6',
  },
  INTERVIEW: {
    labelKey: 'interview',
    color: '#B45309',
    bg: '#F8FAFC',
    border: '#FEF3C7',
    badgeBg: '#FEF3C7',
    badgeText: '#92400E',
    dotColor: '#F59E0B',
  },
  OFFER: {
    labelKey: 'offer',
    color: '#6D28D9',
    bg: '#F8FAFC',
    border: '#EDE9FE',
    badgeBg: '#EDE9FE',
    badgeText: '#5B21B6',
    dotColor: '#8B5CF6',
  },
  HIRED: {
    labelKey: 'hired',
    color: '#168B48',
    bg: '#F8FAFC',
    border: '#DCFCE7',
    badgeBg: '#E8F5EE',
    badgeText: '#168B48',
    dotColor: '#168B48',
  },
  REJECTED: {
    labelKey: 'rejected',
    color: '#BE123C',
    bg: '#F8FAFC',
    border: '#FFE4E6',
    badgeBg: '#FFE4E6',
    badgeText: '#9F1239',
    dotColor: '#F43F5E',
  },
};

const avatarColors = ['#168B48', '#2563EB', '#7C3AED', '#0891B2', '#D97706', '#DB2777'];

function getAvatarColor(id: number) {
  return avatarColors[id % avatarColors.length];
}

type CandidateBoardProps = {
  candidates: Candidate[];
  vacancyId?: number;
  onSelectCandidate?: (candidate: Candidate) => void;
  selectedCandidateId?: number | null;
};

export default function CandidateBoard({
  candidates,
  vacancyId,
  onSelectCandidate,
  selectedCandidateId,
}: CandidateBoardProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [localCandidates, setLocalCandidates] = useState<Candidate[]>(candidates);
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [dragOverStage, setDragOverStage] = useState<CandidateStage | null>(null);
  const dragMovedRef = useRef(false);

  // Quick menu state
  const [menuAnchor, setMenuAnchor] = useState<{ el: HTMLElement; candidate: Candidate } | null>(null);

  // Toast feedback
  const [toast, setToast] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    setLocalCandidates(candidates);
  }, [candidates]);

  const updateStageMutation = useMutation({
    mutationFn: ({ id, stage }: { id: number; stage: CandidateStage }) => candidatesApi.updateStage(id, stage),
    onSuccess: (updated) => {
      void queryClient.invalidateQueries({
        queryKey: vacancyId ? ['candidates', vacancyId] : ['candidates'],
      });
      setToast({
        open: true,
        message: `${updated.firstName} ${updated.lastName}: ${t('candidates.stageChanged', {
          stage: t(`candidates.stages.${stageConfig[updated.stage].labelKey}`),
        })}`,
        severity: 'success',
      });
    },
    onError: (err) => {
      // Revert optimistic update
      setLocalCandidates(candidates);
      setToast({
        open: true,
        message: 'Не удалось обновить этап кандидата',
        severity: 'error',
      });
      console.error('Failed to change stage:', err);
    },
  });

  const executeStageChange = (candidateId: number, targetStage: CandidateStage) => {
    const candidate = localCandidates.find((c) => c.id === candidateId);
    if (!candidate || candidate.stage === targetStage) return;

    // Optimistic update
    setLocalCandidates((prev) =>
      prev.map((c) => (c.id === candidateId ? { ...c, stage: targetStage } : c))
    );

    updateStageMutation.mutate({ id: candidateId, stage: targetStage });
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, candidate: Candidate) => {
    dragMovedRef.current = true;
    e.dataTransfer.setData(
      'text/plain',
      JSON.stringify({ candidateId: candidate.id, sourceStage: candidate.stage })
    );
    e.dataTransfer.effectAllowed = 'move';
    setDraggingId(candidate.id);
  };

  const handleDragEnd = () => {
    setDraggingId(null);
    setDragOverStage(null);
    setTimeout(() => {
      dragMovedRef.current = false;
    }, 120);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, stage: CandidateStage) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverStage !== stage) {
      setDragOverStage(stage);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>, stage: CandidateStage) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      if (dragOverStage === stage) {
        setDragOverStage(null);
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetStage: CandidateStage) => {
    e.preventDefault();
    setDragOverStage(null);
    setDraggingId(null);

    const raw = e.dataTransfer.getData('text/plain');
    if (!raw) return;

    try {
      const data = JSON.parse(raw);
      const candidateId = Number(data.candidateId);
      const sourceStage = data.sourceStage as CandidateStage;

      if (candidateId && sourceStage !== targetStage) {
        executeStageChange(candidateId, targetStage);
      }
    } catch (err) {
      console.error('Failed to parse dropped data:', err);
    }
  };

  return (
    <Box>
      {/* Kanban Board Horizontal Track */}
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          overflowX: 'auto',
          pb: 2,
          minHeight: '68vh',
          alignItems: 'flex-start',
        }}
      >
        {stages.map((stage) => {
          const cfg = stageConfig[stage];
          const stageCandidates = localCandidates.filter((c) => c.stage === stage);
          const isTargeted = dragOverStage === stage;

          return (
            <Box
              key={stage}
              onDragOver={(e) => handleDragOver(e, stage)}
              onDragLeave={(e) => handleDragLeave(e, stage)}
              onDrop={(e) => handleDrop(e, stage)}
              sx={{
                flex: '1 0 280px',
                maxWidth: 320,
                minWidth: 270,
                borderRadius: 3,
                bgcolor: isTargeted ? '#EBF6F0' : '#F9FAFB',
                border: isTargeted ? '2px dashed #168B48' : '1px solid #E5E7EB',
                p: 1.75,
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                minHeight: 520,
              }}
            >
              {/* Column Header */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 1.75,
                  pb: 1.25,
                  borderBottom: '1px solid #E5E7EB',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FiberManualRecord sx={{ fontSize: 12, color: cfg.dotColor }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1F2937', fontSize: '0.92rem' }}>
                    {t(`candidates.stages.${cfg.labelKey}`)}
                  </Typography>
                </Box>
                <Chip
                  label={stageCandidates.length}
                  size="small"
                  sx={{
                    bgcolor: cfg.badgeBg,
                    color: cfg.badgeText,
                    fontWeight: 700,
                    height: 22,
                    fontSize: '0.75rem',
                  }}
                />
              </Box>

              {/* Candidates Stack */}
              <Stack spacing={1.5} sx={{ flex: 1 }}>
                {stageCandidates.map((candidate) => {
                  const isDragging = draggingId === candidate.id;
                  const isSelected = selectedCandidateId === candidate.id;
                  const initials = `${candidate.firstName?.[0] || ''}${candidate.lastName?.[0] || ''}`.toUpperCase();

                  return (
                    <Card
                      key={candidate.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, candidate)}
                      onDragEnd={handleDragEnd}
                      onClick={() => {
                        if (!dragMovedRef.current && onSelectCandidate) {
                          onSelectCandidate(candidate);
                        }
                      }}
                      sx={{
                        cursor: isDragging ? 'grabbing' : 'pointer',
                        opacity: isDragging ? 0.35 : 1,
                        transform: isDragging ? 'scale(0.96)' : 'none',
                        border: isSelected ? '2px solid #168B48' : '1px solid #E5E7EB',
                        borderRadius: 2.5,
                        bgcolor: isSelected ? '#F4FBF7' : '#FFFFFF',
                        boxShadow: isSelected
                          ? '0 6px 18px rgba(22, 139, 72, 0.16)'
                          : '0 2px 6px rgba(15, 23, 42, 0.04)',
                        transition: 'transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease, border-color 0.15s ease',
                        '&:hover': {
                          boxShadow: '0 8px 18px rgba(15, 23, 42, 0.08)',
                          transform: 'translateY(-2px)',
                          borderColor: isSelected ? '#168B48' : '#168B48',
                        },
                      }}
                    >
                      <CardContent sx={{ p: '14px !important' }}>
                        {/* Top: Avatar, Name & Drag handle */}
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                            <Avatar
                              sx={{
                                width: 34,
                                height: 34,
                                bgcolor: getAvatarColor(candidate.id),
                                fontSize: '0.8rem',
                                fontWeight: 800,
                                color: '#FFFFFF',
                              }}
                            >
                              {initials}
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.2, color: '#111827' }}>
                                {candidate.firstName} {candidate.lastName}
                              </Typography>
                              <Typography variant="caption" sx={{ color: '#9CA3AF' }}>
                                ID #{candidate.id}
                              </Typography>
                            </Box>
                          </Box>

                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Tooltip title="Перетащить">
                              <DragIndicatorOutlined sx={{ color: '#CBD5E1', cursor: 'grab', fontSize: 18, mr: 0.2 }} />
                            </Tooltip>
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                setMenuAnchor({ el: e.currentTarget, candidate });
                              }}
                              sx={{ p: 0.5, color: '#9CA3AF' }}
                            >
                              <MoreVertOutlined sx={{ fontSize: 18 }} />
                            </IconButton>
                          </Box>
                        </Box>

                        {/* Contact details */}
                        <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          {candidate.email && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                              <EmailOutlined sx={{ fontSize: 14, color: '#9CA3AF' }} />
                              <Typography
                                variant="caption"
                                sx={{
                                  color: '#4B5563',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {candidate.email}
                              </Typography>
                            </Box>
                          )}

                          {candidate.phone && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                              <PhoneOutlined sx={{ fontSize: 14, color: '#9CA3AF' }} />
                              <Typography variant="caption" sx={{ color: '#4B5563' }}>
                                {candidate.phone}
                              </Typography>
                            </Box>
                          )}

                          {candidate.notes && (
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.8, mt: 0.5 }}>
                              <NotesOutlined sx={{ fontSize: 14, color: '#9CA3AF', mt: 0.2 }} />
                              <Typography
                                variant="caption"
                                sx={{
                                  color: '#6B7280',
                                  fontStyle: 'italic',
                                  lineHeight: 1.3,
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                }}
                              >
                                {candidate.notes}
                              </Typography>
                            </Box>
                          )}

                          {candidate.resumeUrl && (
                            <Box sx={{ mt: 0.75, display: 'flex', alignItems: 'center' }}>
                              <Chip
                                size="small"
                                icon={<DescriptionOutlined sx={{ fontSize: '13px !important', color: '#168B48 !important' }} />}
                                label="Резюме"
                                sx={{
                                  height: 20,
                                  fontSize: '0.68rem',
                                  fontWeight: 700,
                                  bgcolor: '#E8F5EE',
                                  color: '#168B48',
                                }}
                              />
                            </Box>
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  );
                })}

                {/* Dropzone visual placeholder when dragging over */}
                {isTargeted && (
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2.5,
                      border: '2px dashed #168B48',
                      bgcolor: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#168B48',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      minHeight: 70,
                      animation: 'pulse 1.2s infinite',
                    }}
                  >
                    {t('candidates.dropHere')}
                  </Box>
                )}

                {/* Empty State placeholder */}
                {stageCandidates.length === 0 && !isTargeted && (
                  <Box
                    sx={{
                      p: 2.5,
                      borderRadius: 2.5,
                      border: '1px dashed #D1D5DB',
                      bgcolor: '#FFFFFF',
                      textAlign: 'center',
                      color: '#9CA3AF',
                    }}
                  >
                    <Typography variant="caption" sx={{ display: 'block', fontWeight: 500 }}>
                      {t('candidates.noCandidates')}
                    </Typography>
                  </Box>
                )}
              </Stack>
            </Box>
          );
        })}
      </Box>

      {/* Quick Move Context Menu */}
      <Menu
        anchorEl={menuAnchor?.el}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
        slotProps={{
          paper: {
            sx: { borderRadius: 2, minWidth: 200, boxShadow: '0 10px 25px rgba(15,23,42,0.1)' },
          },
        }}
      >
        <MenuItem
          onClick={() => {
            if (menuAnchor && onSelectCandidate) {
              onSelectCandidate(menuAnchor.candidate);
              setMenuAnchor(null);
            }
          }}
          sx={{ py: 1, fontSize: '0.85rem', fontWeight: 700, color: '#168B48' }}
        >
          <ListItemIcon sx={{ minWidth: 26 }}>
            <AssignmentIndOutlined sx={{ fontSize: 18, color: '#168B48' }} />
          </ListItemIcon>
          <ListItemText primary="Карточка кандидата" />
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />

        <Typography variant="caption" sx={{ px: 2, py: 0.5, fontWeight: 700, color: '#9CA3AF', display: 'block' }}>
          {t('candidates.changeStage')}
        </Typography>
        {stages.map((stage) => {
          const cfg = stageConfig[stage];
          const isCurrent = menuAnchor?.candidate.stage === stage;

          return (
            <MenuItem
              key={stage}
              disabled={isCurrent}
              onClick={() => {
                if (menuAnchor) {
                  executeStageChange(menuAnchor.candidate.id, stage);
                  setMenuAnchor(null);
                }
              }}
              sx={{ py: 0.8, fontSize: '0.85rem', fontWeight: isCurrent ? 700 : 500 }}
            >
              <ListItemIcon sx={{ minWidth: 24 }}>
                <FiberManualRecord sx={{ fontSize: 10, color: cfg.dotColor }} />
              </ListItemIcon>
              <ListItemText primary={t(`candidates.stages.${cfg.labelKey}`)} />
            </MenuItem>
          );
        })}
      </Menu>

      {/* Status Feedback Snackbar */}
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
