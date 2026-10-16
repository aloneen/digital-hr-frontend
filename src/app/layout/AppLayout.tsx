import { useMemo, useState } from 'react';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Toolbar,
  Typography,
} from '@mui/material';
import {
  AccountCircle,
  Analytics,
  Assignment,
  BarChart,
  Business,
  Groups,
  Logout,
  Menu,
  Person,
  Psychology,
  School,
  Work,
} from '@mui/icons-material';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../features/auth/context/AuthContext';
import NotificationsPopover from '../../features/notifications/components/NotificationsPopover';

type MenuItem = {
  label: string;
  to: string;
  icon: React.ReactNode;
  roles?: string[];
};

const employeeMenuItems: MenuItem[] = [
  { label: 'Личный кабинет', to: '/profile', icon: <AccountCircle /> },
  { label: 'Мои заявки & Отпуска', to: '/requests', icon: <Assignment /> },
  { label: 'Jana Academy (LMS)', to: '/academy', icon: <School /> },
  { label: 'AI Jana Ассистент', to: '/ai-assistant', icon: <Psychology /> },
];

const hrMenuItems: MenuItem[] = [
  { label: 'Дашборд HR', to: '/dashboard', icon: <BarChart /> },
  { label: 'Сотрудники', to: '/employees', icon: <Groups /> },
  { label: 'Структура компании', to: '/departments', icon: <Business /> },
  { label: 'Вакансии', to: '/vacancies', icon: <Work /> },
  { label: 'Кандидаты & Найм', to: '/candidates', icon: <Person /> },
  { label: 'Онбординг', to: '/onboarding', icon: <School /> },
  { label: 'HR-Аналитика', to: '/analytics', icon: <Analytics /> },
];

const drawerWidth = 260;

export default function AppLayout() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isHrOrAdmin = useMemo(() => {
    const role = user?.role;
    return (
      role === 'HR' ||
      role === 'SUPER_ADMIN' ||
      role === 'DIRECTOR' ||
      role === 'CITY_MANAGER' ||
      role === 'FRANCHISE_OWNER'
    );
  }, [user?.role]);

  const allItems = useMemo(() => [...employeeMenuItems, ...hrMenuItems], []);

  const pageTitle = useMemo(() => {
    const current = allItems.find((item) => item.to === location.pathname);
    return current?.label ?? 'Личный кабинет';
  }, [allItems, location.pathname]);

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar sx={{ px: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 0.5 }}>
          <Avatar sx={{ width: 36, height: 36, bgcolor: '#2563eb', fontWeight: 800 }}>J</Avatar>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
              JanaPost HR
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Единая платформа
            </Typography>
          </Box>
        </Box>
      </Toolbar>

      <Divider />

      <Box sx={{ flex: 1, overflowY: 'auto', px: 1, py: 1.5 }}>
        {/* Employee Section */}
        <List
          subheader={
            <ListSubheader
              sx={{
                bgcolor: 'transparent',
                lineHeight: '28px',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'text.secondary',
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}
            >
              Сервисы сотрудника
            </ListSubheader>
          }
        >
          {employeeMenuItems.map((item) => {
            const isActive = location.pathname === item.to;

            return (
              <ListItem key={item.to} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  component={Link}
                  to={item.to}
                  selected={isActive}
                  sx={{
                    borderRadius: 2,
                    py: 1,
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(37, 99, 235, 0.08)',
                      color: 'primary.main',
                      '& .MuiListItemIcon-root': {
                        color: 'primary.main',
                      },
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography sx={{ fontSize: '0.875rem', fontWeight: isActive ? 600 : 500 }}>
                        {item.label}
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        {/* HR / Admin Section */}
        {isHrOrAdmin && (
          <>
            <Divider sx={{ my: 1.5 }} />
            <List
              subheader={
                <ListSubheader
                  sx={{
                    bgcolor: 'transparent',
                    lineHeight: '28px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'text.secondary',
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                  }}
                >
                  Управление и HR
                </ListSubheader>
              }
            >
              {hrMenuItems.map((item) => {
                const isActive = location.pathname === item.to;

                return (
                  <ListItem key={item.to} disablePadding sx={{ mb: 0.5 }}>
                    <ListItemButton
                      component={Link}
                      to={item.to}
                      selected={isActive}
                      sx={{
                        borderRadius: 2,
                        py: 1,
                        '&.Mui-selected': {
                          backgroundColor: 'rgba(37, 99, 235, 0.08)',
                          color: 'primary.main',
                          '& .MuiListItemIcon-root': {
                            color: 'primary.main',
                          },
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography sx={{ fontSize: '0.875rem', fontWeight: isActive ? 600 : 500 }}>
                            {item.label}
                          </Typography>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </>
        )}
      </Box>

      {/* Footer Profile & Logout */}
      <Box sx={{ p: 2, borderTop: '1px solid #e2e8f0', bgcolor: '#fafafa' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
          <Avatar sx={{ width: 34, height: 34, bgcolor: '#0f172a', fontSize: '0.875rem', fontWeight: 700 }}>
            {user?.email?.charAt(0).toUpperCase() ?? 'U'}
          </Avatar>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.85rem' }}
            >
              {user?.email ?? 'User'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user?.role ?? 'EMPLOYEE'}
            </Typography>
          </Box>
        </Box>

        <Button
          fullWidth
          variant="outlined"
          color="inherit"
          size="small"
          startIcon={<Logout />}
          onClick={logout}
          sx={{ textTransform: 'none', borderRadius: 2 }}
        >
          Выйти из системы
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid #e2e8f0',
          color: '#0f172a',
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton
              color="inherit"
              edge="start"
              sx={{ mr: 1, display: { sm: 'none' } }}
              onClick={() => setMobileOpen((prev) => !prev)}
            >
              <Menu />
            </IconButton>
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.15rem' }}>
              {pageTitle}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Notifications Center Bell with badge */}
            <NotificationsPopover />

            <Divider orientation="vertical" flexItem sx={{ my: 1.5, mx: 0.5 }} />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ textAlign: 'right', display: { xs: 'none', md: 'block' } }}>
                <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                  {user?.email ?? 'User'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user?.role ?? 'EMPLOYEE'}
                </Typography>
              </Box>
              <Avatar sx={{ width: 34, height: 34, bgcolor: '#2563eb', fontWeight: 600 }}>
                {user?.email?.charAt(0).toUpperCase() ?? 'U'}
              </Avatar>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>

        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: '1px solid #e2e8f0' },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 3 },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          backgroundColor: '#f8fafc',
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
