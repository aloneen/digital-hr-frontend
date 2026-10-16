import { Box, Button, Card, CardContent, Grid, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useQuery } from '@tanstack/react-query';
import { departmentsApi } from '../api/departmentsApi';
import DepartmentTreeView from '../components/DepartmentTreeView';

export default function DepartmentsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['departments-tree'],
    queryFn: () => departmentsApi.getTree(),
  });

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Departments
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />}>
          Add department
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          {isLoading ? (
            <Card>
              <CardContent>
                <Typography>Loading departments...</Typography>
              </CardContent>
            </Card>
          ) : (
            <DepartmentTreeView tree={data || []} />
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
