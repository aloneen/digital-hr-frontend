import {
  Box,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { Employee } from '../../../shared/types/employee';

const statusColor: Record<string, 'success' | 'warning' | 'default'> = {
  ACTIVE: 'success',
  ON_LEAVE: 'warning',
  TERMINATED: 'default',
};

export default function EmployeesTable({ rows }: { rows: Employee[] }) {
  const { t } = useTranslation();

  return (
    <TableContainer component={Paper} sx={{ border: '1px solid rgba(15, 23, 42, 0.08)' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{t('employees.table.employee')}</TableCell>
            <TableCell>{t('employees.table.position')}</TableCell>
            <TableCell>{t('employees.table.department')}</TableCell>
            <TableCell>{t('employees.table.city')}</TableCell>
            <TableCell>{t('employees.table.status')}</TableCell>
            <TableCell>{t('employees.table.hireDate')}</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((employee) => (
            <TableRow key={employee.id} hover component={Link} to={`/employees/${employee.id}`} sx={{ textDecoration: 'none', display: 'table-row' }}>
              <TableCell>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                    {employee.firstName} {employee.lastName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {employee.email || t('employees.noEmail')}
                  </Typography>
                </Box>
              </TableCell>

              <TableCell sx={{ color: 'text.primary' }}>{employee.position}</TableCell>
              <TableCell sx={{ color: 'text.primary' }}>{employee.departmentId}</TableCell>
              <TableCell sx={{ color: 'text.primary' }}>{employee.city || '—'}</TableCell>

              <TableCell>
                <Chip
                  label={t(`employees.statuses.${employee.status.toLowerCase()}`)}
                  color={statusColor[employee.status] || 'default'}
                  size="small"
                />
              </TableCell>

              <TableCell sx={{ color: 'text.primary' }}>{employee.hireDate || '—'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
