import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Grid,
  Typography,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { Vacancy } from '../../../shared/types/vacancy';

const statusColor: Record<string, 'success' | 'warning' | 'default'> = {
  OPEN: 'success',
  ON_HOLD: 'warning',
  CLOSED: 'default',
};

export default function VacanciesList({ vacancies }: { vacancies: Vacancy[] }) {
  const { t } = useTranslation();

  return (
    <Grid container spacing={3}>
      {vacancies.map((vacancy) => (
        <Grid size={{ xs: 12, md: 6 }} key={vacancy.id}>
          <Card sx={{ height: '100%', transition: 'transform 0.2s ease, box-shadow 0.2s ease', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 18px 35px rgba(15, 23, 42, 0.08)' } }}>
            <CardActionArea component={Link} to={`/vacancies/${vacancy.id}`} sx={{ height: '100%' }}>
              <CardContent sx={{ height: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {vacancy.title}
                  </Typography>
                  <Chip label={t(`vacancies.statuses.${vacancy.status.toLowerCase()}`)} color={statusColor[vacancy.status] || 'default'} size="small" />
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {vacancy.description || t('vacancies.noDescription')}
                </Typography>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  <Chip label={`${t('vacancies.department')}: ${vacancy.departmentId}`} variant="outlined" size="small" />
                  <Chip label={`${t('vacancies.cityLabel')}: ${vacancy.city || '—'}`} variant="outlined" size="small" />
                  <Chip label={`${t('vacancies.salary')}: ${vacancy.salaryRange || '—'}`} variant="outlined" size="small" />
                </Box>

                <Typography variant="caption" color="text.secondary">
                  {t('vacancies.requirements')}: {vacancy.requirements || t('vacancies.notSpecified')}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
