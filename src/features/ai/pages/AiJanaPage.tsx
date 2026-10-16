import { useState } from 'react';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
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
  Verified,
} from '@mui/icons-material';
import { useMutation } from '@tanstack/react-query';
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

const promptChips = [
  'Сколько дней отпуска положено сотруднику JanaPost?',
  'Как и когда выплачивается аванс по зарплате?',
  'Как успешно пройти испытательный срок?',
  'Как оплачивается больничный лист в компании?',
  'Как получить доступ к курсам в Jana Academy?',
];

export default function AiJanaPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Здравствуйте! Я AI Jana — корпоративный HR-ассистент компании JanaPost. Я отвечаю на ваши вопросы строго по утвержденным внутренним регламентам, трудовым политикам и правилам компании со ссылками на первоисточники.',
      source: 'База знаний JanaPost v2.0',
      category: 'Онбординг & Справка',
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
          text: `Ошибка при обработке запроса: ${err.message}. Пожалуйста, попробуйте еще раз.`,
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
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                AI Jana — Корпоративный AI-Ассистент
              </Typography>
              <Chip
                icon={<AutoAwesome sx={{ fontSize: 14, color: '#fef08a !important' }} />}
                label="Без галлюцинаций"
                size="small"
                sx={{ bgcolor: 'rgba(254,240,138,0.2)', color: '#fef08a', fontWeight: 600 }}
              />
            </Box>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)', mt: 0.5 }}>
              Отвечает исключительно по базе внутренних регламентов JanaPost с точным указанием статей и пунктов.
            </Typography>
          </Box>
        </Box>
      </Card>

      {/* Suggested Quick Prompts */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'block', mb: 1 }}>
          Часто задаваемые вопросы:
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
                fontSize: '0.8rem',
                '&:hover': { bgcolor: '#f1f5f9', borderColor: '#94a3b8' },
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Chat History Container */}
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
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
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
                    {isAi ? <Psychology fontSize="small" /> : 'Вы'}
                  </Avatar>

                  <Box sx={{ maxWidth: { xs: '85%', sm: '75%' } }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: 3,
                        bgcolor: isAi ? '#f8fafc' : '#2563eb',
                        color: isAi ? '#0f172a' : '#fff',
                        border: isAi ? '1px solid #e2e8f0' : 'none',
                        boxShadow: isAi ? '0 1px 3px rgba(0,0,0,0.04)' : '0 2px 8px rgba(37,99,235,0.3)',
                      }}
                    >
                      <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
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
                                bgcolor: '#eff6ff',
                                color: '#1d4ed8',
                                fontWeight: 600,
                                fontSize: '0.75rem',
                              }}
                            />
                            {msg.category && (
                              <Chip
                                label={msg.category}
                                size="small"
                                sx={{ bgcolor: '#f1f5f9', color: '#475569', fontSize: '0.75rem' }}
                              />
                            )}
                            {msg.confidence !== undefined && (
                              <Chip
                                icon={<Verified sx={{ fontSize: 14, color: '#16a34a !important' }} />}
                                label={`${Math.round(msg.confidence * 100)}% совпадение`}
                                size="small"
                                sx={{ bgcolor: '#dcfce7', color: '#166534', fontSize: '0.75rem', fontWeight: 600 }}
                              />
                            )}
                          </Box>
                        </Box>
                      )}

                      {isAi && !msg.found && (
                        <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 0.5, color: '#b91c1c' }}>
                          <InfoOutlined fontSize="small" />
                          <Typography variant="caption">Запрос вне корпоративного регламента</Typography>
                        </Box>
                      )}
                    </Paper>

                    <Typography
                      variant="caption"
                      sx={{
                        color: 'text.secondary',
                        display: 'block',
                        mt: 0.5,
                        px: 1,
                        textAlign: isAi ? 'left' : 'right',
                      }}
                    >
                      {msg.timestamp}
                    </Typography>
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
                      AI Jana ищет ответ в утвержденных регламентах JanaPost...
                    </Typography>
                  </Box>
                </Paper>
              </Box>
            )}
          </Box>
        </CardContent>

        <Divider />

        {/* Input Bar */}
        <Box sx={{ p: 2, bgcolor: '#fff' }}>
          <Paper
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            sx={{
              p: '2px 4px',
              display: 'flex',
              alignItems: 'center',
              borderRadius: 3,
              border: '1px solid #cbd5e1',
              boxShadow: 'none',
              '&:focus-within': { borderColor: '#2563eb', boxShadow: '0 0 0 2px rgba(37,99,235,0.1)' },
            }}
          >
            <InputBase
              sx={{ ml: 2, flex: 1, fontSize: '0.95rem' }}
              placeholder="Задайте вопрос AI Jana (например: «Сколько дней отпуска положено?»)..."
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              disabled={askMutation.isPending}
            />
            <IconButton
              type="submit"
              color="primary"
              sx={{ p: '10px' }}
              disabled={!inputQuestion.trim() || askMutation.isPending}
            >
              <Send />
            </IconButton>
          </Paper>
        </Box>
      </Card>
    </Box>
  );
}
