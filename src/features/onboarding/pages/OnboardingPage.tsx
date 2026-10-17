import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { onboardingApi } from '../api/onboardingApi';
import OnboardingChecklistCard from '../components/OnboardingChecklist';

export default function OnboardingPage() {
  const { t } = useTranslation();
  const { data: templates, isLoading: loadingTemplates } = useQuery({
    queryKey: ['onboarding-templates'],
    queryFn: onboardingApi.getTemplates,
  });

  const employeeId = 1;
  const { data: checklist, isLoading: loadingChecklist } = useQuery({
    queryKey: ['onboarding-checklist', employeeId],
    queryFn: () => onboardingApi.getEmployeeChecklist(employeeId),
  });

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        {t('onboarding.pageTitle')}
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                {t('onboarding.templates')}
              </Typography>

              {loadingTemplates ? (
                <Typography>{t('onboarding.loadingTemplates')}</Typography>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {(templates || []).map((template) => (
                    <Card key={template.id} variant="outlined">
                      <CardContent sx={{ py: 1.5 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                          {template.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {t('onboarding.itemsCount', { count: template.items.length })}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          {loadingChecklist ? (
            <Card>
              <CardContent>
                <Typography>{t('onboarding.loadingChecklist')}</Typography>
              </CardContent>
            </Card>
          ) : checklist ? (
            <OnboardingChecklistCard checklist={checklist} />
          ) : (
            <Card>
              <CardContent>
                <Typography>{t('onboarding.noChecklistAssigned')}</Typography>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
