import { Box, Card, CardContent, Chip, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { Candidate } from '../../../shared/types/candidate';

const stages = ['NEW', 'SCREENING', 'INTERVIEW', 'OFFER', 'HIRED', 'REJECTED'] as const;

const stageColor: Record<string, 'default' | 'primary' | 'success' | 'warning' | 'error'> = {
  NEW: 'default',
  SCREENING: 'primary',
  INTERVIEW: 'warning',
  OFFER: 'primary',
  HIRED: 'success',
  REJECTED: 'error',
};

const stageLabelMap: Record<string, string> = {
  NEW: 'new',
  SCREENING: 'screening',
  INTERVIEW: 'interview',
  OFFER: 'offer',
  HIRED: 'hired',
  REJECTED: 'rejected',
};

export default function CandidateBoard({ candidates }: { candidates: Candidate[] }) {
  const { t } = useTranslation();

  return (
    <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 1 }}>
      {stages.map((stage) => {
        const filtered = candidates.filter((candidate) => candidate.stage === stage);

        return (
          <Box key={stage} sx={{ minWidth: 260, flex: 1 }}>
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {t(`candidates.stages.${stageLabelMap[stage]}`)}
              </Typography>
              <Chip label={filtered.length} size="small" color={stageColor[stage] || 'default'} />
            </Box>

            <Stack spacing={2}>
              {filtered.length === 0 ? (
                <Card sx={{ opacity: 0.7 }}>
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      {t('candidates.noCandidates')}
                    </Typography>
                  </CardContent>
                </Card>
              ) : (
                filtered.map((candidate) => (
                  <Card key={candidate.id}>
                    <CardContent>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
                        {candidate.firstName} {candidate.lastName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {candidate.email || t('candidates.noEmail')}
                      </Typography>
                      <Box sx={{ mt: 1.5 }}>
                        <Chip label={t(`candidates.stages.${stageLabelMap[candidate.stage]}`)} size="small" color={stageColor[candidate.stage] || 'default'} />
                      </Box>
                    </CardContent>
                  </Card>
                ))
              )}
            </Stack>
          </Box>
        );
      })}
    </Box>
  );
}
