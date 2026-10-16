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
import type { Employee } from '../../../shared/types/employee';

const statusColor: Record<string, 'success' | 'warning' | 'default'> = {
  ACTIVE: 'success',
  ON_LEAVE: 'warning',
  TERMINATED: 'default',
};

export default function EmployeesTable({ rows }: { rows: Employee[] }) {
  return (
    <TableContainer component={Paper} sx={{ border: '1px solid rgba(15, 23, 42, 0.08)' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Employee</TableCell>
            <TableCell>Position</TableCell>
            <TableCell>Department</TableCell>
            <TableCell>City</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Hire date</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((employee) => (
            <TableRow key={employee.id} hover>
              <TableCell>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    {employee.firstName} {employee.lastName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {employee.email || 'No email'}
                  </Typography>
                </Box>
              </TableCell>

              <TableCell>{employee.position}</TableCell>
              <TableCell>{employee.departmentId}</TableCell>
              <TableCell>{employee.city || '—'}</TableCell>

              <TableCell>
                <Chip label={employee.status} color={statusColor[employee.status] || 'default'} size="small" />
              </TableCell>

              <TableCell>{employee.hireDate || '—'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
