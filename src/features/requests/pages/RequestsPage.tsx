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
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import {
  Add,
  AttachMoney,
  BeachAccess,
  CheckCircle,
  HelpOutlined,
  HourglassEmpty,
  LocalHospital,
  SyncAlt,
} from '@mui/icons-material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { requestsApi } from '../api/requestsApi';
import { useAuth } from '../../auth/context/AuthContext';
import type {
  HrRequest,
  HrRequestCreateRequest,
  RequestStatus,
  RequestType,
} from '../../../shared/types/request';

const typeLabels: Record<RequestType, { label: string; icon: React.ReactNode; color: string }> = {
  VACATION: { label: 'Оплачиваемый отпуск', icon: <BeachAccess fontSize="small" />, color: '#0284c7' },
  ADVANCE: { label: 'Аванс по зарплате', icon: <AttachMoney fontSize="small" />, color: '#059669' },
  SICK_LEAVE: { label: 'Больничный лист', icon: <LocalHospital fontSize="small" />, color: '#d97706' },
  OTHER: { label: 'Прочее обращение', icon: <HelpOutlined fontSize="small" />, color: '#64748b' },
};

const statusConfig: Record<RequestStatus, { label: string; color: 'warning' | 'success' | 'error' | 'default' }> = {
  PENDING: { label: 'На согласовании', color: 'warning' },
  APPROVED: { label: 'Согласовано', color: 'success' },
  REJECTED: { label: 'Отклонено', color: 'error' },
  DRAFT: { label: 'Черновик', color: 'default' },
};

export default function RequestsPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const isManagerOrHr =
    user?.role === 'HR' ||
    user?.role === 'SUPER_ADMIN' ||
    user?.role === 'DIRECTOR' ||
    user?.role === 'CITY_MANAGER' ||
    user?.role === 'FRANCHISE_OWNER';

  const [activeTab, setActiveTab] = useState<'my' | 'approvals'>('my');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<HrRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Form State
  const [requestType, setRequestType] = useState<RequestType>('VACATION');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [comment, setComment] = useState('');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Queries
  const { data: myRequests = [], isLoading: isLoadingMy } = useQuery({
    queryKey: ['requests', 'my'],
    queryFn: requestsApi.getMyRequests,
  });

  const { data: allRequests = [], isLoading: isLoadingAll } = useQuery({
    queryKey: ['requests', 'all'],
    queryFn: requestsApi.getAllRequests,
    enabled: isManagerOrHr,
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: (payload: HrRequestCreateRequest) => requestsApi.create(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['requests'] });
      void queryClient.invalidateQueries({ queryKey: ['profile'] });
      setCreateDialogOpen(false);
      resetForm();
      setActionSuccess('Заявка успешно создана и отправлена руководителю на согласование');
    },
  });

  const reviewMutation = useMutation({
    mutationFn: ({ id, status, reason }: { id: number; status: 'APPROVED' | 'REJECTED'; reason?: string }) =>
      requestsApi.review(id, { status, rejectionReason: reason }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['requests'] });
      void queryClient.invalidateQueries({ queryKey: ['notifications'] });
      setReviewDialogOpen(false);
      setSelectedRequest(null);
      setRejectionReason('');
      setActionSuccess('Статус заявки обновлен. Mock-интеграция 1С и Documentolog выполнена');
    },
  });

  const resetForm = () => {
    setRequestType('VACATION');
    setStartDate('');
    setEndDate('');
    setAmount('');
    setComment('');
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      type: requestType,
      startDate: startDate || null,
      endDate: endDate || null,
      amount: amount ? Number(amount) : null,
      comment: comment || null,
    });
  };

  const currentList = activeTab === 'my' ? myRequests : allRequests;
  const isLoading = activeTab === 'my' ? isLoadingMy : isLoadingAll;

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 1, md: 2 } }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            HR-Сервис: Заявки сотрудников
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Оформление отпусков, авансов и справок с интеграцией в 1С:ЗУП и Documentolog
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setCreateDialogOpen(true)}
          sx={{
            bgcolor: '#2563eb',
            '&:hover': { bgcolor: '#1d4ed8' },
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 2,
            px: 2.5,
          }}
        >
          Подать новую заявку
        </Button>
      </Box>

      {/* Integration Banner */}
      <Card
        sx={{
          mb: 3,
          p: 2,
          bgcolor: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            gap: 2,
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <SyncAlt sx={{ color: '#16a34a' }} />
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#166534' }}>
                Активная интеграционная шина JanaPost
              </Typography>
              <Typography variant="caption" sx={{ color: '#15803d' }}>
                Все согласованные заявки автоматически передаются в расчетный контур 1С:ЗУП и систему ЭДО Documentolog.
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip label="1С:ЗУП 8.3 Ready" size="small" sx={{ bgcolor: '#dcfce7', color: '#166534', fontWeight: 600 }} />
            <Chip label="Documentolog API" size="small" sx={{ bgcolor: '#dcfce7', color: '#166534', fontWeight: 600 }} />
          </Box>
        </Box>
      </Card>

      {actionSuccess && (
        <Alert severity="success" onClose={() => setActionSuccess(null)} sx={{ mb: 3 }}>
          {actionSuccess}
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
        <Tab label={`Мои заявки (${myRequests.length})`} value="my" />
        {isManagerOrHr && (
          <Tab
            label={`Входящие на согласование (${allRequests.filter((r) => r.status === 'PENDING').length})`}
            value="approvals"
          />
        )}
      </Tabs>

      {/* Content */}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : currentList.length === 0 ? (
        <Card sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
          <HourglassEmpty sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            {activeTab === 'my' ? 'У вас пока нет созданных заявок' : 'Нет заявок, требующих вашего согласования'}
          </Typography>
          {activeTab === 'my' && (
            <Button
              variant="outlined"
              sx={{ mt: 2, textTransform: 'none' }}
              onClick={() => setCreateDialogOpen(true)}
            >
              Создать первую заявку
            </Button>
          )}
        </Card>
      ) : (
        <Grid container spacing={2}>
          {currentList.map((req) => {
            const typeInfo = typeLabels[req.type] || typeLabels.OTHER;
            const statusInfo = statusConfig[req.status] || statusConfig.PENDING;

            return (
              <Grid size={{ xs: 12 }} key={req.id}>
                <Card
                  sx={{
                    borderRadius: 2.5,
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                    transition: 'all 0.2s',
                    '&:hover': {
                      borderColor: '#cbd5e1',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 2.5 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        justifyContent: 'space-between',
                        alignItems: { xs: 'flex-start', md: 'center' },
                        gap: 2,
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                          sx={{
                            width: 44,
                            height: 44,
                            borderRadius: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: `${typeInfo.color}15`,
                            color: typeInfo.color,
                          }}
                        >
                          {typeInfo.icon}
                        </Box>
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                              {typeInfo.label}
                            </Typography>
                            <Chip
                              label={statusInfo.label}
                              color={statusInfo.color}
                              size="small"
                              sx={{ fontWeight: 600, height: 24 }}
                            />
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            Сотрудник: <b>{req.employeeName}</b> • Создана: {new Date(req.createdAt).toLocaleDateString('ru-RU')}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Request Details */}
                      <Box sx={{ minWidth: 200 }}>
                        {req.startDate && (
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            Период: {req.startDate} — {req.endDate || '...'} ({req.durationDays ?? '—'} дн.)
                          </Typography>
                        )}
                        {req.amount && (
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#059669' }}>
                            Сумма: {req.amount.toLocaleString('ru-RU')} ₸
                          </Typography>
                        )}
                        {req.comment && (
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                            Комментарий: «{req.comment}»
                          </Typography>
                        )}
                      </Box>

                      {/* Actions / Status Review Info */}
                      <Box>
                        {req.status === 'PENDING' && isManagerOrHr && activeTab === 'approvals' ? (
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                              variant="contained"
                              color="success"
                              size="small"
                              startIcon={<CheckCircle />}
                              onClick={() => reviewMutation.mutate({ id: req.id, status: 'APPROVED' })}
                              disabled={reviewMutation.isPending}
                              sx={{ textTransform: 'none', fontWeight: 600 }}
                            >
                              Согласовать
                            </Button>
                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              onClick={() => {
                                setSelectedRequest(req);
                                setReviewDialogOpen(true);
                              }}
                              disabled={reviewMutation.isPending}
                              sx={{ textTransform: 'none', fontWeight: 600 }}
                            >
                              Отклонить
                            </Button>
                          </Box>
                        ) : req.reviewedBy ? (
                          <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                              Проверил: {req.reviewerName || 'Руководитель'}
                            </Typography>
                            {req.rejectionReason && (
                              <Typography variant="caption" color="error" sx={{ display: 'block' }}>
                                Причина: {req.rejectionReason}
                              </Typography>
                            )}
                          </Box>
                        ) : (
                          <Chip label="Ожидает рассмотрения" size="small" variant="outlined" />
                        )}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
        <Box component="form" onSubmit={handleCreateSubmit}>
          <DialogTitle sx={{ fontWeight: 700 }}>Оформление заявки в HR</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
              <FormControl fullWidth>
                <InputLabel>Тип заявки</InputLabel>
                <Select
                  value={requestType}
                  label="Тип заявки"
                  onChange={(e) => setRequestType(e.target.value as RequestType)}
                >
                  <MenuItem value="VACATION">Оплачиваемый трудовой отпуск</MenuItem>
                  <MenuItem value="ADVANCE">Аванс по заработной плате</MenuItem>
                  <MenuItem value="SICK_LEAVE">Больничный лист</MenuItem>
                  <MenuItem value="OTHER">Прочее заявление</MenuItem>
                </Select>
              </FormControl>

              {(requestType === 'VACATION' || requestType === 'SICK_LEAVE') && (
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    label="Дата начала"
                    type="date"
                    fullWidth
                    slotProps={{ inputLabel: { shrink: true } }}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                  <TextField
                    label="Дата окончания"
                    type="date"
                    fullWidth
                    slotProps={{ inputLabel: { shrink: true } }}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                </Box>
              )}

              {requestType === 'ADVANCE' && (
                <TextField
                  label="Запрашиваемая сумма аванса (в тенге ₸)"
                  type="number"
                  fullWidth
                  value={amount}
                  onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                  required
                />
              )}

              <TextField
                label="Комментарий / Обоснование"
                multiline
                rows={3}
                fullWidth
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Укажите дополнительную информацию при необходимости..."
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setCreateDialogOpen(false)} color="inherit">
              Отмена
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={createMutation.isPending}
              sx={{ bgcolor: '#2563eb', textTransform: 'none', fontWeight: 600 }}
            >
              {createMutation.isPending ? 'Отправка...' : 'Отправить заявку'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Reject Reason Dialog */}
      <Dialog open={reviewDialogOpen} onClose={() => setReviewDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Отклонение заявки</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Укажите причину отклонения для сотрудника:
          </Typography>
          <TextField
            autoFocus
            fullWidth
            multiline
            rows={3}
            label="Причина отказа"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            required
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setReviewDialogOpen(false)} color="inherit">
            Отмена
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              if (selectedRequest) {
                reviewMutation.mutate({
                  id: selectedRequest.id,
                  status: 'REJECTED',
                  reason: rejectionReason,
                });
              }
            }}
            disabled={!rejectionReason || reviewMutation.isPending}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            Отклонить заявку
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
