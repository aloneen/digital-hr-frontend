import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  LinearProgress,
  Slider,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import {
  AccessTime,
  CheckCircle,
  MenuBook,
  OpenInNew,
  PlayArrow,
  School,
  TrendingUp,
} from '@mui/icons-material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { learningApi } from '../api/learningApi';
import type { CourseAssignment } from '../../../shared/types/learning';

export default function AcademyPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'my' | 'catalog'>('my');
  const [selectedAssignment, setSelectedAssignment] = useState<CourseAssignment | null>(null);
  const [progressVal, setProgressVal] = useState<number>(0);
  const [progressDialogOpen, setProgressDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Queries
  const { data: myCourses = [], isLoading: isLoadingMy } = useQuery({
    queryKey: ['learning', 'my-courses'],
    queryFn: learningApi.getMyCourses,
  });

  const { data: allCourses = [], isLoading: isLoadingCatalog } = useQuery({
    queryKey: ['learning', 'courses'],
    queryFn: learningApi.getAllCourses,
  });

  // Mutations
  const updateProgressMutation = useMutation({
    mutationFn: ({ id, progressPercent }: { id: number; progressPercent: number }) =>
      learningApi.updateProgress(id, { progressPercent }),
    onSuccess: (updated) => {
      void queryClient.invalidateQueries({ queryKey: ['learning'] });
      void queryClient.invalidateQueries({ queryKey: ['profile'] });
      void queryClient.invalidateQueries({ queryKey: ['notifications'] });
      setProgressDialogOpen(false);
      setSelectedAssignment(null);
      if (updated.progressPercent === 100) {
        setSuccessMessage(`Поздравляем! Курс «${updated.courseTitle}» успешно завершен на 100%!`);
      } else {
        setSuccessMessage(`Прогресс по курсу обновлен до ${updated.progressPercent}%`);
      }
    },
  });

  const handleOpenProgress = (assignment: CourseAssignment) => {
    setSelectedAssignment(assignment);
    setProgressVal(assignment.progressPercent);
    setProgressDialogOpen(true);
  };

  const handleSaveProgress = () => {
    if (selectedAssignment) {
      updateProgressMutation.mutate({
        id: selectedAssignment.id,
        progressPercent: progressVal,
      });
    }
  };

  const completedCount = myCourses.filter((c) => c.status === 'COMPLETED').length;
  const inProgressCount = myCourses.filter((c) => c.status !== 'COMPLETED').length;

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 1, md: 2 } }}>
      {/* Banner */}
      <Card
        sx={{
          mb: 3,
          p: 3,
          background: 'linear-gradient(135deg, #4c1d95 0%, #1e1b4b 100%)',
          color: '#fff',
          borderRadius: 3,
          boxShadow: '0 8px 24px rgba(76,29,149,0.25)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 3,
            alignItems: { xs: 'flex-start', md: 'center' },
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: 3,
                bgcolor: 'rgba(255,255,255,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(8px)',
              }}
            >
              <School sx={{ fontSize: 36, color: '#c084fc' }} />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                Jana Academy — Корпоративный LMS
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mt: 0.5 }}>
                Прокачивайте ключевые навыки, регламенты JanaPost и отслеживайте прогресс обучения в реальном времени.
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ textAlign: 'center', px: 2, py: 1, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                {inProgressCount}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                В процессе
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center', px: 2, py: 1, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#4ade80' }}>
                {completedCount}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                Завершено
              </Typography>
            </Box>
          </Box>
        </Box>
      </Card>

      {successMessage && (
        <Alert severity="success" onClose={() => setSuccessMessage(null)} sx={{ mb: 3 }}>
          {successMessage}
        </Alert>
      )}

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onChange={(_, val) => setActiveTab(val)}
        sx={{
          mb: 3,
          borderBottom: 1,
          borderColor: 'divider',
          '& .MuiTab-root': { textTransform: 'none', fontWeight: 600 },
        }}
      >
        <Tab label={`Мои курсы (${myCourses.length})`} value="my" />
        <Tab label={`Каталог Академии (${allCourses.length})`} value="catalog" />
      </Tabs>

      {/* Tab 1: My Courses */}
      {activeTab === 'my' && (
        <>
          {isLoadingMy ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress />
            </Box>
          ) : myCourses.length === 0 ? (
            <Card sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
              <MenuBook sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                Вам пока не назначены курсы
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Перейдите во вкладку «Каталог Академии», чтобы ознакомиться с доступными программами обучения.
              </Typography>
            </Card>
          ) : (
            <Grid container spacing={3}>
              {myCourses.map((assignment) => {
                const isDone = assignment.status === 'COMPLETED' || assignment.progressPercent === 100;

                return (
                  <Grid size={{ xs: 12, md: 6 }} key={assignment.id}>
                    <Card
                      sx={{
                        borderRadius: 3,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        border: isDone ? '1px solid #86efac' : '1px solid #e2e8f0',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                        transition: 'transform 0.2s',
                        '&:hover': { transform: 'translateY(-2px)' },
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                          <Chip
                            icon={isDone ? <CheckCircle /> : <TrendingUp />}
                            label={isDone ? 'Завершено' : `${assignment.progressPercent}% пройдено`}
                            color={isDone ? 'success' : 'primary'}
                            size="small"
                            sx={{ fontWeight: 600 }}
                          />
                          {assignment.durationHours && (
                            <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                              <AccessTime fontSize="small" sx={{ color: 'text.secondary', fontSize: 16 }} />
                              <Typography variant="caption" color="text.secondary">
                                {assignment.durationHours} ч.
                              </Typography>
                            </Box>
                          )}
                        </Box>

                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                          {assignment.courseTitle}
                        </Typography>

                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, minHeight: 40 }}>
                          {assignment.courseDescription || 'Базовый курс JanaPost по стандартам и процессам компании.'}
                        </Typography>

                        {/* Progress Bar */}
                        <Box sx={{ mb: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="caption" color="text.secondary">
                              Прогресс изучения
                            </Typography>
                            <Typography variant="caption" sx={{ fontWeight: 700 }}>
                              {assignment.progressPercent}%
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={assignment.progressPercent}
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              bgcolor: '#e2e8f0',
                              '& .MuiLinearProgress-bar': {
                                bgcolor: isDone ? '#16a34a' : '#7c3aed',
                              },
                            }}
                          />
                        </Box>
                      </CardContent>

                      <Divider />

                      <Box sx={{ p: 2, display: 'flex', gap: 1, justifyContent: 'space-between' }}>
                        {assignment.contentUrl ? (
                          <Button
                            size="small"
                            variant="text"
                            endIcon={<OpenInNew />}
                            href={assignment.contentUrl}
                            target="_blank"
                            sx={{ textTransform: 'none' }}
                          >
                            Материалы курса
                          </Button>
                        ) : (
                          <Box />
                        )}

                        <Button
                          size="small"
                          variant="contained"
                          startIcon={isDone ? <CheckCircle /> : <PlayArrow />}
                          onClick={() => handleOpenProgress(assignment)}
                          sx={{
                            bgcolor: isDone ? '#16a34a' : '#7c3aed',
                            '&:hover': { bgcolor: isDone ? '#15803d' : '#6d28d9' },
                            textTransform: 'none',
                            fontWeight: 600,
                            borderRadius: 1.5,
                          }}
                        >
                          {isDone ? 'Пересмотреть' : 'Обновить прогресс'}
                        </Button>
                      </Box>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </>
      )}

      {/* Tab 2: Course Catalog */}
      {activeTab === 'catalog' && (
        <>
          {isLoadingCatalog ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={3}>
              {allCourses.map((course) => (
                <Grid size={{ xs: 12, md: 4 }} key={course.id}>
                  <Card
                    sx={{
                      borderRadius: 3,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
                        <Chip label="JanaPost Academy" size="small" sx={{ bgcolor: '#f3e8ff', color: '#7e22ce', fontWeight: 600 }} />
                        <Chip
                          icon={<AccessTime sx={{ fontSize: 14 }} />}
                          label={`${course.durationHours} ч.`}
                          size="small"
                          variant="outlined"
                        />
                      </Box>

                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                        {course.title}
                      </Typography>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {course.description}
                      </Typography>
                    </CardContent>

                    <Box sx={{ p: 2, pt: 0 }}>
                      <Button
                        fullWidth
                        variant="outlined"
                        sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
                        onClick={() => {
                          setSuccessMessage(`Курс «${course.title}» доступен для изучения.`);
                        }}
                      >
                        Подробнее о курсе
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}

      {/* Progress Update Dialog */}
      <Dialog open={progressDialogOpen} onClose={() => setProgressDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Обновление прогресса</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            {selectedAssignment?.courseTitle}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Укажите фактический процент освоения материалов курса:
          </Typography>

          <Box sx={{ px: 2, mb: 2 }}>
            <Slider
              value={progressVal}
              onChange={(_, val) => setProgressVal(val as number)}
              step={5}
              marks={[
                { value: 0, label: '0%' },
                { value: 50, label: '50%' },
                { value: 100, label: '100%' },
              ]}
              min={0}
              max={100}
              valueLabelDisplay="on"
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mt: 2 }}>
            <Button size="small" variant="outlined" onClick={() => setProgressVal(50)}>
              50% (Половина)
            </Button>
            <Button
              size="small"
              variant="contained"
              color="success"
              onClick={() => setProgressVal(100)}
            >
              100% (Завершить)
            </Button>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setProgressDialogOpen(false)} color="inherit">
            Отмена
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveProgress}
            disabled={updateProgressMutation.isPending}
            sx={{ bgcolor: '#7c3aed', '&:hover': { bgcolor: '#6d28d9' }, textTransform: 'none', fontWeight: 600 }}
          >
            {updateProgressMutation.isPending ? 'Сохранение...' : 'Сохранить результат'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
