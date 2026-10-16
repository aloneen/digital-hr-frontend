import {
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';
import type { DepartmentTree } from '../../../shared/types/department';

function renderTree(nodes: DepartmentTree[], level = 0) {
  return nodes.map((node) => (
    <Box key={node.id} sx={{ ml: level * 2 }}>
      <ListItem disablePadding>
        <ListItemButton sx={{ borderRadius: 2, px: 1.5 }}>
          <ListItemText
            primary={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {node.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {node.type}
                </Typography>
              </Box>
            }
            secondary={node.city || 'No city'}
          />
        </ListItemButton>
      </ListItem>

      {node.children?.length > 0 && (
        <Box sx={{ mt: 0.5 }}>{renderTree(node.children, level + 1)}</Box>
      )}
    </Box>
  ));
}

export default function DepartmentTreeView({ tree }: { tree: DepartmentTree[] }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
          Organization tree
        </Typography>
        <List disablePadding>{renderTree(tree)}</List>
      </CardContent>
    </Card>
  );
}
