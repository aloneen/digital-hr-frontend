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
import { useTranslation } from 'react-i18next';
import { requestsApi } from '../api/requestsApi';
import { useAuth } from '../../auth/context/AuthContext';
import type {
  HrRequest,
  HrRequestCreateRequest,
  RequestStatus,
  RequestType,
} from '../../../shared/types/request';

const typeLabels = {
  VACATION: { labelKey: 'requests.typeVacation', icon: <BeachAccess fontSize="small" />, color: '#0284c7' },
  ADVANCE: { labelKey: 'requests.typeAdvance', icon: <AttachMoney fontSize="small" />, color: '#059669' },
  SICK_LEAVE: { labelKey: 'requests.typeSickLeave', icon: <LocalHospital fontSize="small" />, color: '#d97706' },
  OTHER: { labelKey: 'requests.typeOther', icon: <HelpOutlined fontSize="small" />, color: '#64748b' },
};

const statusConfig: Record<RequestStatus, { labelKey: string; color: 'warning' | 'success' | 'error' | 'default' }> = {
  PENDING: { labelKey: 'requests.statusPending', color: 'warning' },
  APPROVED: { labelKey: 'requests.statusApproved', color: 'success' },
  REJECTED: { labelKey: 'requests.statusRejected', color: 'error' },
  DRAFT: { labelKey: 'requests.statusDraft', color: 'default' },
};

export default function RequestsPage() {
  const { user } = useAuth();
  const { t } = useTranslation();
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

  const [requestType, setRequestType] = useState<RequestType>('VACATION');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [comment, setComment] = useState('');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const { data: myRequests = [], isLoading: isLoadingMy } = useQuery({
    queryKey: ['requests', 'my'],
    queryFn: requestsApi.getMyRequests,
  });

  const { data: allRequests = [], isLoading: isLoadingAll } = useQuery({
    queryKey: ['requests', 'all'],
    queryFn: requestsApi.getAllRequests,
    enabled: isManagerOrHr,
  });

  const createMutation = useMutation({
    mutationFn: (payload: HrRequestCreateRequest) => requestsApi.create(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['requests'] });
      void queryClient.invalidateQueries({ queryKey: ['profile'] });
      setCreateDialogOpen(false);
      resetForm();
      setActionSuccess(t('requests.successCreated'));
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
      setActionSuccess(t('requests.successUpdated'));
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
            {t('requests.pageTitle')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('requests.pageSubtitle')}
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
          {t('requests.submitNew')}
        </Button>
      </Box>

      <Card sx={{ mb: 3, p: 2, bgcolor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 2 }}>
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
                {t('requests.integrationTitle')}
              </Typography>
              <Typography variant="caption" sx={{ color: '#15803d' }}>
                {t('requests.integrationSubtitle')}
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
        <Tab label={`${t('requests.myRequests')} (${myRequests.length})`} value="my" />
        {isManagerOrHr && (
          <Tab
            label={`${t('requests.incomingApprovals')} (${allRequests.filter((r) => r.status === 'PENDING').length})`}
            value="approvals"
          />
        )}
      </Tabs>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : currentList.length === 0 ? (
        <Card sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
          <HourglassEmpty sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            {activeTab === 'my' ? t('requests.emptyMy') : t('requests.emptyApprovals')}
          </Typography>
          {activeTab === 'my' && (
            <Button variant="outlined" sx={{ mt: 2, textTransform: 'none' }} onClick={() => setCreateDialogOpen(true)}>
              {t('requests.createFirst')}
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
                              {t(typeInfo.labelKey)}
                            </Typography>
                            <Chip label={t(statusInfo.labelKey)} color={statusInfo.color} size="small" sx={{ fontWeight: 600, height: 24 }} />
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            {t('requests.employeeLabel')} <b>{req.employeeName}</b> • {t('requests.createdLabel')} {new Date(req.createdAt).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ minWidth: 200 }}>
                        {req.startDate && (
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {t('requests.period')} {req.startDate} — {req.endDate || '...'} ({req.durationDays ?? '—'} {t('requests.daysShort')})
                          </Typography>
                        )}
                        {req.amount && (
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#059669' }}>
                            {t('requests.amount')} {req.amount.toLocaleString()} ₸
                          </Typography>
                        )}
                        {req.comment && (
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                            {t('requests.comment')} «{req.comment}»
                          </Typography>
                        )}
                      </Box>

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
                              {t('requests.approve')}
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
                              {t('requests.reject')}
                            </Button>
                          </Box>
                        ) : req.reviewedBy ? (
                          <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                              {t('requests.reviewedBy')} {req.reviewerName || t('requests.managerDefault')}
                            </Typography>
                            {req.rejectionReason && (
                              <Typography variant="caption" color="error" sx={{ display: 'block' }}>
                                {t('requests.reason')} {req.rejectionReason}
                              </Typography>
                            )}
                          </Box>
                        ) : (
                          <Chip label={t('requests.pendingReview')} size="small" variant="outlined" />
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

      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
        <Box component="form" onSubmit={handleCreateSubmit}>
          <DialogTitle sx={{ fontWeight: 700 }}>{t('requests.dialogCreateTitle')}</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
              <FormControl fullWidth>
                <InputLabel>{t('requests.requestType')}</InputLabel>
                <Select value={requestType} label={t('requests.requestType')} onChange={(e) => setRequestType(e.target.value as RequestType)}>
                  <MenuItem value="VACATION">{t('requests.typeVacation')}</MenuItem>
                  <MenuItem value="ADVANCE">{t('requests.typeAdvance')}</MenuItem>
                  <MenuItem value="SICK_LEAVE">{t('requests.typeSickLeave')}</MenuItem>
                  <MenuItem value="OTHER">{t('requests.typeOther')}</MenuItem>
                </Select>
              </FormControl>

              {(requestType === 'VACATION' || requestType === 'SICK_LEAVE') && (
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField label={t('requests.startDate')} type="date" fullWidth slotProps={{ inputLabel: { shrink: true } }} value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
                  <TextField label={t('requests.endDate')} type="date" fullWidth slotProps={{ inputLabel: { shrink: true } }} value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
                </Box>
              )}

              {requestType === 'ADVANCE' && (
                <TextField label={t('requests.advanceAmount')} type="number" fullWidth value={amount} onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))} required />
              )}

              <TextField
                label={t('requests.commentLabel')}
                multiline
                rows={3}
                fullWidth
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={t('requests.commentPlaceholder')}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setCreateDialogOpen(false)} color="inherit">
              {t('requests.cancel')}
            </Button>
            <Button type="submit" variant="contained" disabled={createMutation.isPending} sx={{ bgcolor: '#2563eb', textTransform: 'none', fontWeight: 600 }}>
              {createMutation.isPending ? t('requests.sending') : t('requests.sendRequest')}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <Dialog open={reviewDialogOpen} onClose={() => setReviewDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>{t('requests.rejectDialogTitle')}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {t('requests.rejectDialogSubtitle')}
          </Typography>
          <TextField autoFocus fullWidth multiline rows={3} label={t('requests.rejectReason')} value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} required />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setReviewDialogOpen(false)} color="inherit">
            {t('requests.cancel')}
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
            {t('requests.rejectRequest')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
