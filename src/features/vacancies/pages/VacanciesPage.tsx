import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { vacanciesApi } from '../api/vacanciesApi';
import VacanciesList from '../components/VacanciesList';

const vacancyStatuses = ['OPEN', 'CLOSED', 'ON_HOLD'];

export default function VacanciesPage() {
  const { t } = useTranslation();
  const [status, setStatus] = useState('');
  const [city, setCity] = useState('');

  const params = useMemo(
    () => ({
      status: status || undefined,
      city: city || undefined,
      page: 0,
      size: 20,
    }),
    [city, status],
  );

  const { data, isLoading } = useQuery({
    queryKey: ['vacancies', params],
    queryFn: () => vacanciesApi.getAll(params),
  });

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          {t('vacancies.pageTitle')}
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />}>
          {t('vacancies.addVacancy')}
        </Button>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                select
                label={t('vacancies.status')}
                value={status}
                onChange={(event) => setStatus(event.target.value)}
              >
                <MenuItem value="">{t('vacancies.all')}</MenuItem>
                {vacancyStatuses.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label={t('vacancies.city')}
                value={city}
                onChange={(event) => setCity(event.target.value)}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {isLoading ? <Typography>{t('vacancies.loading')}</Typography> : <VacanciesList vacancies={data?.content || []} />}
    </Box>
  );
}
