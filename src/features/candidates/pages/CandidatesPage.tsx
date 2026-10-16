import { Box, Button, Card, CardContent, Grid, MenuItem, TextField, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { candidatesApi } from '../api/candidatesApi';
import CandidateBoard from '../components/CandidateBoard';

export default function CandidatesPage() {
  const [vacancyId, setVacancyId] = useState('1');

  const vacancyNumber = useMemo(() => Number(vacancyId || 1), [vacancyId]);

  const { data, isLoading } = useQuery({
    queryKey: ['candidates', vacancyNumber],
    queryFn: () => candidatesApi.getByVacancy(vacancyNumber),
  });

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Candidates
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />}>
          Add candidate
        </Button>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                select
                label="Vacancy"
                value={vacancyId}
                onChange={(event) => setVacancyId(event.target.value)}
              >
                <MenuItem value="1">Vacancy #1</MenuItem>
                <MenuItem value="2">Vacancy #2</MenuItem>
                <MenuItem value="3">Vacancy #3</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {isLoading ? (
        <Typography>Loading candidates...</Typography>
      ) : (
        <CandidateBoard candidates={data || []} />
      )}
    </Box>
  );
}
