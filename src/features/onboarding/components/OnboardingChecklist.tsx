import {
  Box,
  Card,
  CardContent,
  Checkbox,
  Chip,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';
import type { OnboardingChecklist } from '../../../shared/types/onboarding';

export default function OnboardingChecklistCard({ checklist }: { checklist: OnboardingChecklist }) {
  const completed = checklist.tasks.filter((task) => task.isCompleted).length;
  const progress = Math.round((completed / Math.max(checklist.tasks.length, 1)) * 100);

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Employee onboarding
          </Typography>
          <Chip label={`${progress}%`} color="primary" variant="outlined" />
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Checklist #{checklist.id} · Employee {checklist.employeeId}
        </Typography>

        <List disablePadding>
          {checklist.tasks.map((task) => (
            <ListItem key={task.id} disableGutters sx={{ px: 0 }}>
              <ListItemButton sx={{ borderRadius: 2, px: 1 }}>
                <Checkbox checked={task.isCompleted} edge="start" tabIndex={-1} disableRipple />
                <ListItemText
                  primary={task.title}
                  secondary={task.description || 'No description'}
                  sx={{
                    '& .MuiListItemText-primary': { textDecoration: task.isCompleted ? 'line-through' : 'none' },
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
