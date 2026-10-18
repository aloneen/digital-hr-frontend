import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import SendIcon from '@mui/icons-material/Send';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { notificationsApi } from '../../notifications/api/notificationsApi';
import type { Employee } from '../../../shared/types/employee';

interface SendMessageDialogProps {
  open: boolean;
  onClose: () => void;
  employee: Employee;
  onSuccess?: () => void;
}

export default function SendMessageDialog({
  open,
  onClose,
  employee,
  onSuccess,
}: SendMessageDialogProps) {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const sendMutation = useMutation({
    mutationFn: () =>
      notificationsApi.sendNotification({
        employeeId: employee.id,
        title: subject || 'Сообщение от HR',
        message: message,
      }),
    onSuccess: () => {
      onSuccess?.();
      handleClose();
    },
    onError: (err: Error) => {
      setError(err.message || 'Ошибка отправки сообщения');
    },
  });

  const handleClose = () => {
    setSubject('');
    setMessage('');
    setError('');
    onClose();
  };

  const handleOpenMailClient = () => {
    if (!employee.email) {
      setError('У сотрудника не указан email');
      return;
    }
    const mailto = `mailto:${encodeURIComponent(employee.email)}?subject=${encodeURIComponent(
      subject || 'Digital HR Portal',
    )}&body=${encodeURIComponent(message)}`;
    window.open(mailto, '_blank');
    handleClose();
  };

  const handleSendInternal = async () => {
    if (!message.trim()) {
      setError('Пожалуйста, введите текст сообщения');
      return;
    }
    setError('');
    await sendMutation.mutateAsync();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>
        Написать сотруднику
      </DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mb: 2.5, p: 1.5, bgcolor: 'background.default', borderRadius: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            {employee.firstName} {employee.lastName}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
            {employee.position} · {employee.email || 'Email не указан'}
          </Typography>
        </Box>

        <Stack spacing={2}>
          <TextField
            label="Тема сообщения"
            fullWidth
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Рабочий вопрос, уведомление или задача..."
          />

          <TextField
            label="Текст сообщения"
            multiline
            rows={4}
            required
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Здравствуйте! Пишу по поводу..."
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5, justifyContent: 'space-between' }}>
        <Button
          variant="outlined"
          startIcon={<EmailIcon />}
          onClick={handleOpenMailClient}
          disabled={!employee.email}
        >
          В почту (mailto)
        </Button>

        <Stack direction="row" spacing={1}>
          <Button onClick={handleClose}>
            Отмена
          </Button>
          <Button
            variant="contained"
            endIcon={<SendIcon />}
            onClick={handleSendInternal}
            disabled={sendMutation.isPending || !message.trim()}
          >
            {sendMutation.isPending ? 'Отправка...' : 'Отправить в систему'}
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
