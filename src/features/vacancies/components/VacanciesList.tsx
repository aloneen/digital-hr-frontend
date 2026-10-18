import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardActions,
  Chip,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { Vacancy } from '../../../shared/types/vacancy';

const statusColor: Record<string, 'success' | 'warning' | 'default'> = {
  OPEN: 'success',
  ON_HOLD: 'warning',
  CLOSED: 'default',
};

interface VacanciesListProps {
  vacancies: Vacancy[];
  onEdit?: (vacancy: Vacancy) => void;
  onDelete?: (vacancy: Vacancy) => void;
}

export default function VacanciesList({ vacancies, onEdit, onDelete }: VacanciesListProps) {
  const { t } = useTranslation();

  return (
    <Grid container spacing={3}>
      {vacancies.map((vacancy) => (
        <Grid size={{ xs: 12, md: 6 }} key={vacancy.id}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 18px 35px rgba(15, 23, 42, 0.08)',
              },
            }}
          >
            <CardActionArea component={Link} to={`/vacancies/${vacancy.id}`} sx={{ flex: 1 }}>
              <CardContent sx={{ height: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {vacancy.title}
                  </Typography>
                  <Chip
                    label={t(`vacancies.statuses.${vacancy.status.toLowerCase()}`, vacancy.status)}
                    color={statusColor[vacancy.status] || 'default'}
                    size="small"
                  />
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

            {(onEdit || onDelete) && (
              <CardActions sx={{ px: 2, pb: 1.5, pt: 0, justifyContent: 'flex-end', gap: 0.5 }}>
                {onEdit && (
                  <Tooltip title="Редактировать">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onEdit(vacancy);
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
                {onDelete && (
                  <Tooltip title="Удалить / Закрыть">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onDelete(vacancy);
                      }}
                    >
                      <DeleteOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </CardActions>
            )}
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
