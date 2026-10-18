import type { Employee } from '../../../shared/types/employee';

export function exportEmployeesToCsv(employees: Employee[], filenamePrefix = 'employees_export') {
  const headers = [
    'ID',
    'Фамилия',
    'Имя',
    'Отчество',
    'Должность',
    'ID Подразделения',
    'Город',
    'Статус',
    'Дата найма',
    'Email',
    'Телефон',
    'ИИН',
  ];

  const rows = employees.map((emp) => [
    emp.id,
    `"${(emp.lastName || '').replace(/"/g, '""')}"`,
    `"${(emp.firstName || '').replace(/"/g, '""')}"`,
    `"${(emp.middleName || '').replace(/"/g, '""')}"`,
    `"${(emp.position || '').replace(/"/g, '""')}"`,
    emp.departmentId ?? '',
    `"${(emp.city || '').replace(/"/g, '""')}"`,
    emp.status || '',
    emp.hireDate || '',
    `"${(emp.email || '').replace(/"/g, '""')}"`,
    `"${(emp.phone || '').replace(/"/g, '""')}"`,
    `"${(emp.iin || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent =
    '\uFEFF' +
    [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute(
    'download',
    `${filenamePrefix}_${new Date().toISOString().slice(0, 10)}.csv`,
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
