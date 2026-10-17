import { useState } from 'react';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  IconButton,
  InputBase,
  Paper,
  Typography,
} from '@mui/material';
import {
  AutoAwesome,
  Description,
  InfoOutlined,
  Psychology,
  Send,
} from '@mui/icons-material';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { aiApi } from '../api/aiApi';
import type { AiAnswerResponse } from '../../../shared/types/ai';

type ChatMessage = {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  source?: string;
  category?: string;
  confidence?: number;
  found?: boolean;
  timestamp: string;
};

export default function AiJanaPage() {
  const { t } = useTranslation();

  const promptChips = [
    t('ai.promptVacation'),
    t('ai.promptAdvance'),
    t('ai.promptProbation'),
    t('ai.promptSickLeave'),
    t('ai.promptAcademy'),
  ];

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: t('ai.welcomeText'),
      source: t('ai.kbSource'),
      category: t('ai.kbCategory'),
      found: true,
      confidence: 1.0,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputQuestion, setInputQuestion] = useState('');

  const askMutation = useMutation({
    mutationFn: (question: string) => aiApi.ask({ question }),
    onSuccess: (response: AiAnswerResponse) => {
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: response.answer,
          source: response.source,
          category: response.category,
          confidence: response.confidence,
          found: response.found,
          timestamp: now,
        },
      ]);
    },
    onError: (err: Error) => {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: t('ai.requestError', { error: err.message }),
          found: false,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    },
  });

  const handleSend = (textToSend?: string) => {
    const text = textToSend ?? inputQuestion.trim();
    if (!text || askMutation.isPending) return;

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        sender: 'user',
        text,
        timestamp: now,
      },
    ]);

    if (!textToSend) {
      setInputQuestion('');
    }

    askMutation.mutate(text);
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: { xs: 1, md: 2 } }}>
      {/* Banner */}
      <Card
        sx={{
          mb: 3,
          p: 3,
          background: 'linear-gradient(135deg, #0369a1 0%, #0f172a 100%)',
          color: '#fff',
          borderRadius: 3,
          boxShadow: '0 8px 24px rgba(3,105,161,0.25)',
        }}
      >
        <Box sx={{ display: 'flex', gap: 2.5, alignItems: 'center' }}>
          <Avatar
            sx={{
              width: 56,
              height: 56,
              bgcolor: '#38bdf8',
              color: '#0f172a',
              boxShadow: '0 4px 12px rgba(56,189,248,0.4)',
            }}
          >
            <Psychology sx={{ fontSize: 32 }} />
          </Avatar>
          <Box>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
              <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.03em' }}>
                {t('ai.title')}
              </Typography>
              <Chip
                icon={<AutoAwesome sx={{ fontSize: 14, color: '#fef08a !important' }} />}
                label={t('ai.noHallucinations')}
                size="small"
                sx={{ bgcolor: 'rgba(254,240,138,0.2)', color: '#fef08a', fontWeight: 600 }}
              />
            </Box>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.82)', mt: 0.5, lineHeight: 1.5 }}>
              {t('ai.subtitle')}
            </Typography>
          </Box>
        </Box>
      </Card>

      <Box sx={{ mb: 3 }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, display: 'block', mb: 1 }}>
          {t('ai.quickQuestions')}
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {promptChips.map((chipText) => (
            <Chip
              key={chipText}
              label={chipText}
              onClick={() => handleSend(chipText)}
              clickable
              variant="outlined"
              sx={{
                bgcolor: '#fff',
                borderColor: '#cbd5e1',
                borderRadius: 2,
                fontSize: '0.78rem',
                lineHeight: 1.2,
                py: 0.35,
                '&:hover': { bgcolor: '#f1f5f9', borderColor: '#94a3b8' },
              }}
            />
          ))}
        </Box>
      </Box>

      <Card
        sx={{
          borderRadius: 3,
          minHeight: 450,
          maxHeight: 600,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          border: '1px solid #e2e8f0',
        }}
      >
        <CardContent sx={{ flex: 1, overflowY: 'auto', p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.25 }}>
            {messages.map((msg) => {
              const isAi = msg.sender === 'ai';

              return (
                <Box
                  key={msg.id}
                  sx={{
                    display: 'flex',
                    flexDirection: isAi ? 'row' : 'row-reverse',
                    gap: 1.5,
                    alignItems: 'flex-start',
                  }}
                >
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      bgcolor: isAi ? '#0284c7' : '#475569',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                    }}
                  >
                    {isAi ? <Psychology fontSize="small" /> : t('ai.userShort')}
                  </Avatar>

                  <Box sx={{ maxWidth: { xs: '86%', sm: '76%' } }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: 3,
                        bgcolor: isAi ? '#f8fafc' : '#168B48',
                        color: isAi ? '#0f172a' : '#fff',
                        border: isAi ? '1px solid #e2e8f0' : 'none',
                        boxShadow: isAi ? '0 1px 3px rgba(0,0,0,0.04)' : '0 2px 8px rgba(22,139,72,0.3)',
                      }}
                    >
                      <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, wordBreak: 'break-word' }}>
                        {msg.text}
                      </Typography>

                      {isAi && msg.source && (
                        <Box sx={{ mt: 1.5, pt: 1.5, borderTop: '1px solid #e2e8f0' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0.8 }}>
                            <Chip
                              icon={<Description sx={{ fontSize: 14 }} />}
                              label={msg.source}
                              size="small"
                              sx={{
                                bgcolor: '#EBF6F0',
                                color: '#168B48',
                                fontWeight: 600,
                                fontSize: '0.75rem',
                              }}
                            />
                            {msg.category && (
                              <Chip
                                label={msg.category}
                                size="small"
                                sx={{
                                  bgcolor: '#f1f5f9',
                                  color: '#475569',
                                  fontWeight: 600,
                                  fontSize: '0.75rem',
                                }}
                              />
                            )}
                          </Box>
                        </Box>
                      )}
                    </Paper>

                    {isAi && (
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 0.75, px: 0.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                          <InfoOutlined sx={{ fontSize: 15, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">
                            {msg.found === false ? t('ai.noDataFound') : t('ai.verifiedAnswer')}
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          {msg.timestamp}
                        </Typography>
                      </Box>
                    )}

                    {!isAi && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: 'block', mt: 0.75, textAlign: 'right', px: 0.5 }}
                      >
                        {msg.timestamp}
                      </Typography>
                    )}
                  </Box>
                </Box>
              );
            })}

            {askMutation.isPending && (
              <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                <Avatar sx={{ width: 36, height: 36, bgcolor: '#0284c7' }}>
                  <Psychology fontSize="small" />
                </Avatar>
                <Paper sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 3, border: '1px solid #e2e8f0' }}>
                  <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                    <CircularProgress size={16} />
                    <Typography variant="body2" color="text.secondary">
                      {t('ai.searching')}
                    </Typography>
                  </Box>
                </Paper>
              </Box>
            )}
          </Box>
        </CardContent>

        <Box sx={{ px: 2, pb: 2 }}>
          <Paper
            elevation={0}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              border: '1px solid #dbe4f0',
              borderRadius: 3,
              px: 1.5,
              py: 0.75,
              bgcolor: '#fff',
            }}
          >
            <InputBase
              fullWidth
              value={inputQuestion}
              placeholder={t('ai.placeholder')}
              onChange={(event) => setInputQuestion(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  handleSend();
                }
              }}
              sx={{ fontSize: '0.96rem', color: 'text.primary' }}
            />
            <IconButton
              color="primary"
              onClick={() => handleSend()}
              disabled={!inputQuestion.trim() || askMutation.isPending}
              sx={{
                bgcolor: 'primary.main',
                color: '#fff',
                '&:hover': { bgcolor: 'primary.dark' },
                '&.Mui-disabled': { bgcolor: 'action.disabledBackground', color: 'action.disabled' },
              }}
            >
              {askMutation.isPending ? <CircularProgress size={18} color="inherit" /> : <Send fontSize="small" />}
            </IconButton>
          </Paper>
        </Box>
      </Card>
    </Box>
  );
}
