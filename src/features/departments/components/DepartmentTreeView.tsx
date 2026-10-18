import {
  Box,
  Card,
  CardContent,
  IconButton,
  List,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { useTranslation } from 'react-i18next';
import type { DepartmentTree } from '../../../shared/types/department';

const departmentColors: Record<string, string> = {
  HEAD_OFFICE: '#168B48',
  BLOCK: '#8b5cf6',
  CITY: '#14b8a6',
  FRANCHISE: '#3b82f6',
};

interface DepartmentTreeViewProps {
  tree: DepartmentTree[];
  onAddChild?: (parentDept: DepartmentTree) => void;
  onEdit?: (dept: DepartmentTree) => void;
  onDelete?: (dept: DepartmentTree) => void;
}

function renderTree(
  nodes: DepartmentTree[],
  level = 0,
  t: (key: string) => string,
  onAddChild?: (parentDept: DepartmentTree) => void,
  onEdit?: (dept: DepartmentTree) => void,
  onDelete?: (dept: DepartmentTree) => void,
) {
  return nodes.map((node) => {
    const accent = departmentColors[node.type] || '#64748b';
    const childCount = node.children?.length ?? 0;

    return (
      <Box key={node.id} sx={{ position: 'relative' }}>
        <Box
          sx={{
            pl: level > 0 ? 2.8 : 0,
            ml: level > 0 ? 1.2 : 0,
            borderLeft: level > 0 ? '1px solid rgba(148, 163, 184, 0.28)' : 'none',
            position: 'relative',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              py: 1.2,
              px: level === 0 ? 1 : 1.5,
              borderRadius: 2,
              borderBottom: '1px solid rgba(148, 163, 184, 0.16)',
              transition: 'all 0.15s ease',
              '&:hover': {
                backgroundColor: 'rgba(15, 23, 42, 0.025)',
              },
            }}
          >
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: accent,
                boxShadow: `0 0 0 5px ${accent}18`,
                flexShrink: 0,
              }}
            />

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  letterSpacing: '-0.02em',
                  lineHeight: 1.3,
                  fontSize: { xs: '1.05rem', md: '1.15rem' },
                  color: '#111827',
                }}
              >
                {node.name}
              </Typography>

              <Box sx={{ mt: 0.35, display: 'flex', alignItems: 'center', gap: 1.6, flexWrap: 'wrap' }}>
                <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 400 }}>
                  {node.city || t('departments.noCity')}
                </Typography>
                <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                  {childCount} sub departments
                </Typography>
              </Box>
            </Box>

            <Typography
              variant="caption"
              sx={{
                color: accent,
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                px: 1,
                py: 0.4,
                borderRadius: 999,
                border: `1px solid ${accent}44`,
                backgroundColor: `${accent}12`,
                flexShrink: 0,
              }}
            >
              {node.type}
            </Typography>

            {/* Actions for this department */}
            <Stack direction="row" spacing={0.5} sx={{ ml: 1, flexShrink: 0 }}>
              {onAddChild && (
                <Tooltip title="Добавить подраздел (+)">
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => onAddChild(node)}
                    sx={{ p: 0.75 }}
                  >
                    <AddCircleOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
              {onEdit && (
                <Tooltip title="Редактировать">
                  <IconButton
                    size="small"
                    color="default"
                    onClick={() => onEdit(node)}
                    sx={{ p: 0.75 }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
              {onDelete && (
                <Tooltip title="Удалить / Деактивировать">
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => onDelete(node)}
                    sx={{ p: 0.75 }}
                  >
                    <DeleteOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </Stack>
          </Box>
        </Box>

        {node.children && node.children.length > 0 && (
          <Box sx={{ mt: 0.2, ml: level === 0 ? 1.2 : 2.4 }}>
            {renderTree(node.children, level + 1, t, onAddChild, onEdit, onDelete)}
          </Box>
        )}
      </Box>
    );
  });
}

export default function DepartmentTreeView({
  tree,
  onAddChild,
  onEdit,
  onDelete,
}: DepartmentTreeViewProps) {
  const { t } = useTranslation();

  return (
    <Card
      sx={{
        overflow: 'hidden',
        border: '1px solid rgba(148, 163, 184, 0.18)',
        background: '#fff',
        boxShadow: '0 10px 28px rgba(15, 23, 42, 0.02)',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography
          variant="h5"
          sx={{
            mb: 2.25,
            fontWeight: 600,
            letterSpacing: '-0.04em',
            color: '#111827',
          }}
        >
          {t('departments.organizationTree')}
        </Typography>

        <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {renderTree(tree, 0, t, onAddChild, onEdit, onDelete)}
        </List>
      </CardContent>
    </Card>
  );
}
